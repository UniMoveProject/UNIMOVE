/**
 * Chat Service
 * Handles message history and sends for ride chat rooms.
 */

import { getStoredData, setStoredData, CHAT_KEY } from './storage.js';
import { getCurrentUser } from './auth.js';

export function getChatMessages(rideId) {
  const allChats = getStoredData(CHAT_KEY, {});
  return allChats[rideId] || [];
}

export function sendMessage(rideId, text) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Faça login para conversar no chat.' };

  const allChats = getStoredData(CHAT_KEY, {});
  const messages = allChats[rideId] || [];

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newMsg = {
    id: 'msg_' + Date.now(),
    senderId: user.id,
    senderNome: user.nome,
    senderRole: user.roles && user.roles.includes('motorista') ? 'Motorista' : 'Passageiro',
    senderAvatar: user.avatar,
    senderCourse: `${user.curso || 'Estudante'} · ${user.periodo || ''}`,
    senderRating: user.avaliacoes || '5.0',
    text: text.trim(),
    time: timeStr,
    timestamp: Date.now()
  };

  messages.push(newMsg);
  allChats[rideId] = messages;
  setStoredData(CHAT_KEY, allChats);

  return { success: true, message: newMsg };
}
