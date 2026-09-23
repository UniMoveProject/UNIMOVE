/**
 * Chat Service
 * Handles message history for ride chat rooms.
 * Uses Supabase when configured, otherwise falls back to localStorage.
 */

import { getStoredData, setStoredData, CHAT_KEY } from './storage.js';
import { getCurrentUser } from './auth.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

// ── Supabase Chat ─────────────────────────────────────────────────────────────

export async function getChatMessagesSupabase(rideId) {
  const { data, error } = await supabase
    .from('messages')
    .select(`*, profiles:sender_id (nome, avatar, curso, periodo, avaliacoes, total_caronas)`)
    .eq('ride_id', rideId)
    .order('created_at', { ascending: true });
  if (error) return [];
  return data.map(mapMessage);
}

export async function sendMessageSupabase(rideId, text) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Faca login para conversar no chat.' };

  const { data, error } = await supabase.from('messages').insert({
    ride_id: rideId,
    sender_id: user.id,
    text: text.trim(),
  }).select().single();

  if (error) return { success: false, error: error.message };
  return { success: true, message: mapMessage(data) };
}

function mapMessage(m) {
  if (!m) return null;
  const p = m.profiles || {};
  const now = new Date(m.created_at);
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return {
    id: m.id,
    senderId: m.sender_id,
    senderNome: p.nome || 'Usuário',
    senderRole: p.roles?.includes('motorista') ? 'Motorista' : 'Passageiro',
    senderAvatar: p.avatar || '',
    senderCourse: `${p.curso || ''} - ${p.periodo || ''}`,
    senderRating: p.avaliacoes || 5.0,
    text: m.text,
    time: timeStr,
    timestamp: Date.parse(m.created_at),
  };
}

// ── localStorage fallback ─────────────────────────────────────────────────────

export function getChatMessages(rideId) {
  if (isSupabaseConfigured) return getChatMessagesSupabase(rideId);
  const allChats = getStoredData(CHAT_KEY, {});
  return allChats[rideId] || [];
}

export function sendMessage(rideId, text) {
  if (isSupabaseConfigured) return sendMessageSupabase(rideId, text);

  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Faca login para conversar no chat.' };

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
    senderCourse: `${user.curso || ''} - ${user.periodo || ''}`,
    senderRating: user.avaliacoes || 5.0,
    text: text.trim(),
    time: timeStr,
    timestamp: Date.now()
  };

  messages.push(newMsg);
  allChats[rideId] = messages;
  setStoredData(CHAT_KEY, allSuppliers);
  return { success: true, message: newMsg };
}