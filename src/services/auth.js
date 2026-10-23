/**
 * Authentication Service
 * Handles user login, registration, and profile management.
 * Uses Supabase Auth when configured, falls back to localStorage.
 * Includes data-at-rest encryption for sensitive personal fields (LGPD) and age validation.
 */

import { getStoredData, setStoredData, USERS_KEY, CURRENT_USER_KEY } from './storage.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import {
  encryptSensitiveProfile,
  decryptSensitiveProfile,
  hashPassword,
  verifyPassword
} from './crypto.js';

export function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  if (!user) return null;
  try { return JSON.parse(user); } catch (e) { return null; }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
}

export function getAllUsers() {
  return getStoredData(USERS_KEY, []);
}

// ── Supabase Auth ─────────────────────────────────────────────────────────────

export async function loginWithSupabase(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: 'E-mail ou senha inválidos. Tente novamente.' };

  // fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  const decryptedProfile = await decryptSensitiveProfile(profile || {});
  const user = { id: data.user.id, email: data.user.email, ...decryptedProfile };
  setCurrentUser(user);
  return { success: true, user };
}

export function isStrongPassword(password) {
  if (!password || typeof password !== 'string') return false;
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

export async function registerWithSupabase(userData) {
  const email = userData.email.trim().toLowerCase();
  const password = userData.senha;

  // Validação Estrita de Senha Forte
  if (!isStrongPassword(password)) {
    return {
      success: false,
      error: 'A senha informada não é segura. Crie uma senha forte com no mínimo 8 caracteres, contendo maiúsculas, minúsculas, números e caracteres especiais.'
    };
  }

  // Validação de maioridade para motorista (Bloquear menores de 18 anos)
  if (userData.roles && userData.roles.includes('motorista')) {
    const idadeNum = parseInt(userData.idade, 10);
    if (!idadeNum || idadeNum < 18) {
      return {
        success: false,
        error: 'Menores de 18 anos não podem se cadastrar como motorista (exigência legal de CNH).'
      };
    }
  }

  // Foto de perfil obrigatória
  if (!userData.avatar && !userData.avatar_url) {
    return {
      success: false,
      error: 'A foto de perfil é obrigatória para identificação e segurança de todos os usuários.'
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Erro no Supabase signUp:', error);
    return { success: false, error: error.message || 'Não foi possível criar a conta.' };
  }
  if (!data?.user) return { success: false, error: 'Erro ao registrar usuário.' };

  const avatarUrl = userData.avatar || userData.avatar_url;

  // Montar lista de veículos do motorista
  const veiculosCadastrados = Array.isArray(userData.veiculos) && userData.veiculos.length > 0
    ? userData.veiculos
    : (userData.veiculo_modelo ? [{
        id: 'veh_' + Date.now(),
        modelo: userData.veiculo_modelo,
        cor: userData.veiculo_cor || '',
        placa: userData.veiculo_placa || '',
        foto_url: userData.veiculo_foto_url || null
      }] : []);

  // Build profile payload with all Standard fields
  const profilePayload = {
    id: data.user.id,
    nome: userData.nome.trim(),
    email: email,
    cpf: userData.cpf || null,
    idade: parseInt(userData.idade, 10) || null,
    sexo: userData.sexo || null,
    preferencia_carona: userData.preferencia_carona || 'indiferente',
    telefone: userData.telefone || null,
    curso: userData.curso || 'Administração',
    periodo: userData.periodo || '1º período',
    campus: userData.campus || 'Campus UNICEPLAC',
    roles: userData.roles || ['passageiro'],
    avatar_url: avatarUrl,
    veiculos: veiculosCadastrados,
    avaliacoes: 5.0,
    total_caronas: 0,
  };

  // Motorista-specific fields
  if (userData.roles && userData.roles.includes('motorista')) {
    profilePayload.veiculo_modelo = userData.veiculo_modelo || (veiculosCadastrados[0]?.modelo) || null;
    profilePayload.veiculo_cor = userData.veiculo_cor || (veiculosCadastrados[0]?.cor) || null;
    profilePayload.veiculo_placa = userData.veiculo_placa || (veiculosCadastrados[0]?.placa) || null;
    profilePayload.veiculo_foto_url = userData.veiculo_foto_url || (veiculosCadastrados[0]?.foto_url) || null;
    profilePayload.cnh = userData.cnh || null;
    profilePayload.vagas_padrao = parseInt(userData.vagas_padrao, 10) || 3;
    profilePayload.preferencia_passageiros = userData.preferencia_passageiros || 'mista';
    profilePayload.tempo_espera_min = parseInt(userData.tempo_espera_min, 10) || 5;
    profilePayload.porta_malas_litros = parseInt(userData.porta_malas_litros, 10) || null;
    profilePayload.acessivel_cadeirante = Boolean(userData.acessivel_cadeirante) || false;
  }

  // Criptografar dados sensíveis antes de enviar ao banco Supabase (LGPD)
  const encryptedPayload = await encryptSensitiveProfile(profilePayload);

  const { error: profileError } = await supabase.from('profiles').upsert(encryptedPayload);
  if (profileError) {
    console.error('Erro ao salvar perfil no Supabase:', profileError.message);
    // Try update as fallback
    await supabase.from('profiles').update(encryptedPayload).eq('id', data.user.id);
  }

  const user = { id: data.user.id, email, ...profilePayload };
  setCurrentUser(user);
  return { success: true, user };
}

export async function logoutSupabase() {
  await supabase.auth.signOut();
  setCurrentUser(null);
}

export async function updateProfileSupabase(updatedData) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, error: 'Usuário não autenticado.' };

  const payload = { ...updatedData };

  // Validação de maioridade para motorista
  if (payload.roles && payload.roles.includes('motorista')) {
    const idadeNum = parseInt(payload.idade || currentUser.idade, 10);
    if (!idadeNum || idadeNum < 18) {
      return { success: false, error: 'Menores de 18 anos não podem ativar o perfil de motorista.' };
    }
  }

  // Handle legacy avatar field
  if (payload.avatar) {
    payload.avatar_url = payload.avatar;
    delete payload.avatar;
  }
  // Handle legacy nested veiculo object
  if (payload.veiculo && typeof payload.veiculo === 'object') {
    payload.veiculo_modelo = payload.veiculo_modelo || payload.veiculo.modelo;
    payload.veiculo_cor = payload.veiculo_cor || payload.veiculo.cor;
    payload.veiculo_placa = payload.veiculo_placa || payload.veiculo.placa;
    delete payload.veiculo;
  }

  // Sanitize avatar_url — never store large base64 strings
  if (payload.avatar_url && payload.avatar_url.startsWith('data:') && payload.avatar_url.length > 3000) {
    delete payload.avatar_url;
  }

  // Parse numeric/boolean fields
  if (payload.idade) payload.idade = parseInt(payload.idade, 10) || null;
  if (payload.vagas_padrao) payload.vagas_padrao = parseInt(payload.vagas_padrao, 10) || 3;
  if (payload.tempo_espera_min) payload.tempo_espera_min = parseInt(payload.tempo_espera_min, 10) || 5;
  if (payload.porta_malas_litros) payload.porta_malas_litros = parseInt(payload.porta_malas_litros, 10) || null;
  if (payload.preco_medio !== undefined) payload.preco_medio = parseFloat(payload.preco_medio) || 0.00;
  if (payload.acessivel_cadeirante !== undefined) payload.acessivel_cadeirante = Boolean(payload.acessivel_cadeirante);

  // Remove read-only fields
  delete payload.id;
  delete payload.email;
  delete payload.avaliacoes;
  delete payload.total_caronas;
  delete payload.created_at;

  // Criptografar dados sensíveis antes de salvar no Supabase
  const encryptedPayload = await encryptSensitiveProfile(payload);

  const { error } = await supabase
    .from('profiles')
    .update(encryptedPayload)
    .eq('id', currentUser.id);

  if (error) return { success: false, error: error.message };

  const merged = { ...currentUser, ...updatedData };
  setCurrentUser(merged);
  return { success: true, user: merged };
}

// ── localStorage fallback ─────────────────────────────────────────────────────

export async function login(email, password) {
  if (isSupabaseConfigured) {
    return await loginWithSupabase(email, password);
  }

  // Fallback to localStorage
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();

  for (const u of users) {
    if (u.email.toLowerCase() === normalizedEmail) {
      const match = await verifyPassword(password, u.senha);
      if (match) {
        const decryptedUser = await decryptSensitiveProfile(u);
        setCurrentUser(decryptedUser);
        return { success: true, user: decryptedUser };
      }
    }
  }

  return { success: false, error: 'E-mail ou senha inválidos. Tente novamente.' };
}

export function logout() {
  if (isSupabaseConfigured) return logoutSupabase();
  setCurrentUser(null);
}

export async function registerUser(userData) {
  if (isSupabaseConfigured) return await registerWithSupabase(userData);

  // Validação Estrita de Senha Forte
  if (!isStrongPassword(userData.senha)) {
    return {
      success: false,
      error: 'A senha informada não é segura. Crie uma senha forte com no mínimo 8 caracteres, contendo maiúsculas, minúsculas, números e caracteres especiais.'
    };
  }

  // Validação de maioridade para motorista
  if (userData.roles && userData.roles.includes('motorista')) {
    const idadeNum = parseInt(userData.idade, 10);
    if (!idadeNum || idadeNum < 18) {
      return {
        success: false,
        error: 'Menores de 18 anos não podem se cadastrar como motorista (exigência legal de CNH).'
      };
    }
  }

  // Foto de perfil obrigatória
  if (!userData.avatar && !userData.avatar_url) {
    return {
      success: false,
      error: 'A foto de perfil é obrigatória para identificação e segurança de todos os usuários.'
    };
  }

  const users = getAllUsers();
  const normalizedEmail = userData.email.trim().toLowerCase();
  const exists = users.some(u => u.email.toLowerCase() === normalizedEmail);
  if (exists) return { success: false, error: 'Já existe uma conta cadastrada com este e-mail.' };

  // Criptografar senha e campos sensíveis
  const securePasswordHash = await hashPassword(userData.senha);

  // Montar lista de veículos reutilizáveis do motorista
  const veiculosCadastrados = Array.isArray(userData.veiculos) && userData.veiculos.length > 0
    ? userData.veiculos
    : (userData.veiculo_modelo ? [{
        id: 'veh_' + Date.now(),
        modelo: userData.veiculo_modelo,
        cor: userData.veiculo_cor || '',
        placa: userData.veiculo_placa || '',
        foto_url: userData.veiculo_foto_url || null
      }] : []);

  const newUser = {
    id: 'usr_' + Date.now(),
    nome: userData.nome.trim(),
    email: normalizedEmail,
    senha: securePasswordHash,
    cpf: userData.cpf,
    idade: parseInt(userData.idade, 10),
    sexo: userData.sexo,
    preferencia_carona: userData.preferencia_carona || 'indiferente',
    telefone: userData.telefone,
    curso: userData.curso || 'Administração',
    periodo: userData.periodo || '1º período',
    campus: userData.campus || 'Campus UNICEPLAC',
    roles: userData.roles || ['passageiro'],
    avatar_url: userData.avatar || userData.avatar_url,
    veiculos: veiculosCadastrados,
    avaliacoes: 5.0,
    total_caronas: 0
  };

  if (userData.roles && userData.roles.includes('motorista')) {
    newUser.veiculo_modelo = userData.veiculo_modelo || (veiculosCadastrados[0]?.modelo) || null;
    newUser.veiculo_cor = userData.veiculo_cor || (veiculosCadastrados[0]?.cor) || null;
    newUser.veiculo_placa = userData.veiculo_placa || (veiculosCadastrados[0]?.placa) || null;
    newUser.veiculo_foto_url = userData.veiculo_foto_url || (veiculosCadastrados[0]?.foto_url) || null;
    newUser.cnh = userData.cnh || null;
    newUser.vagas_padrao = parseInt(userData.vagas_padrao, 10) || 3;
    newUser.tempo_espera_min = parseInt(userData.tempo_espera_min, 10) || 5;
    newUser.porta_malas_litros = parseInt(userData.porta_malas_litros, 10) || null;
    newUser.preferencia_passageiros = userData.preferencia_passageiros || 'mista';
    newUser.acessivel_cadeirante = Boolean(userData.acessivel_cadeirante);
    newUser.veiculo = {
      modelo: newUser.veiculo_modelo || '',
      cor: newUser.veiculo_cor || '',
      placa: newUser.veiculo_placa || ''
    };
  }

  // Criptografa dados em repouso no armazenamento local
  const encryptedUser = await encryptSensitiveProfile(newUser);
  users.push(encryptedUser);
  setStoredData(USERS_KEY, users);

  // Na sessão em memória, mantemos legível
  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

export async function updateProfile(updatedData) {
  if (isSupabaseConfigured) return await updateProfileSupabase(updatedData);

  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, error: 'Usuário não autenticado.' };

  // Validação de maioridade para motorista
  if (updatedData.roles && updatedData.roles.includes('motorista')) {
    const idadeNum = parseInt(updatedData.idade || currentUser.idade, 10);
    if (!idadeNum || idadeNum < 18) {
      return { success: false, error: 'Menores de 18 anos não podem ativar o perfil de motorista.' };
    }
  }

  const users = getAllUsers();
  const index = users.findIndex(u => u.id === currentUser.id);
  const merged = { ...currentUser, ...updatedData };

  if (index !== -1) {
    const encryptedMerged = await encryptSensitiveProfile(merged);
    users[index] = encryptedMerged;
    setStoredData(USERS_KEY, users);
  }

  setCurrentUser(merged);
  return { success: true, user: merged };
}

export async function getUserById(userId) {
  if (!userId) return null;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) {
        return await decryptSensitiveProfile(data);
      }
    } catch (e) {
      console.warn('Erro ao buscar perfil por ID no Supabase:', e);
    }
  }

  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    return await decryptSensitiveProfile(user);
  }

  // Se o usuário atual for o mesmo solicitado
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    return currentUser;
  }

  return null;
}