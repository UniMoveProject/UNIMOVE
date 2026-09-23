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
  if (error) return { success: false, error: 'E-mail ou senha invalidos. Tente novamente.' };

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
  const { data, error } = await supabase.auth.signUp({
    email: userData.email.trim().toLowerCase(),
    password: userData.senha,
  });
  if (error) return { success: false, error: 'Nao foi possivel criar a conta. Tente novamente.' };

  // upsert profile
  await supabase.from('profiles').upsert({
    id: data.user.id,
    nome: userData.nome.trim(),
    cpf: userData.cpf,
    idade: parseInt(userData.idade, 10),
    sexo: userData.sexo,
    telefone: userData.telefone,
    curso: userData.curso || 'Engenharia de Software',
    periodo: userData.periodo || '1o periodo',
    campus: userData.campus || 'Campus UNICEPLAC',
    roles: userData.roles || ['passageiro'],
    veiculo: userData.veiculo || null,
    avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    avaliacoes: 5.0,
    total_caronas: 0,
  });

  const user = { id: data.user.id, email: userData.email, nome: userData.nome.trim() };
  setCurrentUser(user);
  return { success: true, user };
}

export async function logoutSupabase() {
  await supabase.auth.signOut();
  setCurrentUser(null);
}

export async function updateProfileSupabase(updatedData) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, error: 'Usuario nao autenticado.' };

  const { error } = await supabase
    .from('profiles')
    .update(updatedData)
    .eq('id', currentUser.id);

  if (error) return { success: false, error: error.message };

  const merged = { ...currentUser, ...updatedData };
  setCurrentUser(merged);
  return { success: true, user: merged };
}

// ── localStorage fallback ─────────────────────────────────────────────────────

export async function login(email, password) {
  if (isSupabaseConfigured) {
    // Use Supabase authentication
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
  return { success: false, error: 'E-mail ou senha invalidos. Tente novamente.' };
}

export function logout() {
  if (isSupabaseConfigured) return logoutSupabase();
  setCurrentUser(null);
}

export function registerUser(userData) {
  if (isSupabaseConfigured) return registerWithSupabase(userData);

  const users = getAllUsers();
  const normalizedEmail = userData.email.trim().toLowerCase();
  const exists = users.some(u => u.email.toLowerCase() === normalizedEmail);
  if (exists) return { success: false, error: 'Ja existe uma conta cadastrada com este e-mail institucional.' };

  const newUser = {
    id: 'usr_' + Date.now(),
    nome: userData.nome.trim(),
    email: normalizedEmail,
    senha: userData.senha,
    cpf: userData.cpf,
    idade: parseInt(userData.idade, 10),
    sexo: userData.sexo,
    telefone: userData.telefone,
    curso: userData.curso || 'Engenharia de Software',
    periodo: userData.periodo || '1o periodo',
    campus: userData.campus || 'Campus UNICEPLAC',
    roles: userData.roles || ['passageiro'],
    veiculo: userData.veiculo || null,
    avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    avaliacoes: 5.0,
    totalCaronas: 0
  };

  users.push(newUser);
  setStoredData(USERS_KEY, users);
  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

export function updateProfile(updatedData) {
  if (isSupabaseConfigured) return updateProfileSupabase(updatedData);

  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, error: 'Usuario nao autenticado.' };

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