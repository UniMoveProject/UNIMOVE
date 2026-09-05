/**
 * Authentication Service
 * Handles user login, registration, validation and profile management.
 */

import { getStoredData, setStoredData, USERS_KEY, CURRENT_USER_KEY } from './storage.js';

export function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
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

export function login(email, password) {
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
  setCurrentUser(null);
}

export function registerUser(userData) {
  const users = getAllUsers();
  const normalizedEmail = userData.email.trim().toLowerCase();
  
  const exists = users.some(u => u.email.toLowerCase() === normalizedEmail);
  if (exists) {
    return { success: false, error: 'Já existe uma conta cadastrada com este e-mail institucional.' };
  }

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
    periodo: userData.periodo || '1º período',
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
