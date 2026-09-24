/**
 * Authentication Service
 * Handles user login, registration, and profile management.
 * Uses Supabase Auth when configured, falls back to localStorage.
 */

import { getStoredData, setStoredData, USERS_KEY, CURRENT_USER_KEY } from './storage.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

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

  const user = { id: data.user.id, email: data.user.email, ...profile };
  setCurrentUser(user);
  return { success: true, user };
}

export async function registerWithSupabase(userData) {
  const email = userData.email.trim().toLowerCase();
  const password = userData.senha;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Erro no Supabase signUp:', error);
    return { success: false, error: error.message || 'Não foi possível criar a conta.' };
  }
  if (!data?.user) return { success: false, error: 'Erro ao registrar usuário.' };

  let avatarUrl = userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  if (avatarUrl.startsWith('data:') && avatarUrl.length > 3000) {
    avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  }

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
    avaliacoes: 5.0,
    total_caronas: 0,
  };

  // Motorista-specific fields
  if (userData.roles && userData.roles.includes('motorista')) {
    profilePayload.veiculo_modelo = userData.veiculo_modelo || null;
    profilePayload.veiculo_cor = userData.veiculo_cor || null;
    profilePayload.veiculo_placa = userData.veiculo_placa || null;
    profilePayload.veiculo_foto_url = userData.veiculo_foto_url || null;
    profilePayload.cnh = userData.cnh || null;
    profilePayload.vagas_padrao = parseInt(userData.vagas_padrao, 10) || 3;
    profilePayload.preferencia_passageiros = userData.preferencia_passageiros || 'mista';
    profilePayload.tempo_espera_min = parseInt(userData.tempo_espera_min, 10) || 5;
    profilePayload.porta_malas_litros = parseInt(userData.porta_malas_litros, 10) || null;
    profilePayload.acessivel_cadeirante = Boolean(userData.acessivel_cadeirante) || false;
    profilePayload.preco_medio = parseFloat(userData.preco_medio) || 0.00;
  }

  // Legacy veiculo object support
  if (userData.veiculo && typeof userData.veiculo === 'object') {
    profilePayload.veiculo_modelo = profilePayload.veiculo_modelo || userData.veiculo.modelo || null;
    profilePayload.veiculo_cor = profilePayload.veiculo_cor || userData.veiculo.cor || null;
    profilePayload.veiculo_placa = profilePayload.veiculo_placa || userData.veiculo.placa || null;
  }

  const { error: profileError } = await supabase.from('profiles').upsert(profilePayload);
  if (profileError) {
    console.error('Erro ao salvar perfil no Supabase:', profileError.message);
    // Try update as fallback
    await supabase.from('profiles').update(profilePayload).eq('id', data.user.id);
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

  const { error } = await supabase
    .from('profiles')
    .update(payload)
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
  const found = users.find(u => u.email.toLowerCase() === normalizedEmail && u.senha === password);
  if (found) {
    setCurrentUser(found);
    return { success: true, user: found };
  }
  return { success: false, error: 'E-mail ou senha inválidos. Tente novamente.' };
}

export function logout() {
  if (isSupabaseConfigured) return logoutSupabase();
  setCurrentUser(null);
}

export async function registerUser(userData) {
  if (isSupabaseConfigured) return await registerWithSupabase(userData);

  const users = getAllUsers();
  const normalizedEmail = userData.email.trim().toLowerCase();
  const exists = users.some(u => u.email.toLowerCase() === normalizedEmail);
  if (exists) return { success: false, error: 'Já existe uma conta cadastrada com este e-mail.' };

  const newUser = {
    id: 'usr_' + Date.now(),
    nome: userData.nome.trim(),
    email: normalizedEmail,
    senha: userData.senha,
    cpf: userData.cpf,
    idade: parseInt(userData.idade, 10),
    sexo: userData.sexo,
    preferencia_carona: userData.preferencia_carona || 'indiferente',
    telefone: userData.telefone,
    curso: userData.curso || 'Administração',
    periodo: userData.periodo || '1º período',
    campus: userData.campus || 'Campus UNICEPLAC',
    roles: userData.roles || ['passageiro'],
    avatar_url: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    avaliacoes: 5.0,
    total_caronas: 0
  };

  users.push(newUser);
  setStoredData(USERS_KEY, users);
  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

export async function updateProfile(updatedData) {
  if (isSupabaseConfigured) return await updateProfileSupabase(updatedData);

  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, error: 'Usuário não autenticado.' };

  const users = getAllUsers();
  const index = users.findIndex(u => u.id === currentUser.id);
  const merged = { ...currentUser, ...updatedData };
  if (index !== -1) {
    users[index] = merged;
    setStoredData(USERS_KEY, users);
  }
  setCurrentUser(merged);
  return { success: true, user: merged };
}