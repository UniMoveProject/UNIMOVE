/**
 * Rides Service
 * Handles listing, filtering, offering, booking, editing, and deleting rides.
 * Uses Supabase when configured, falls back to localStorage.
 */

import { getStoredData, setStoredData, RIDES_KEY } from './storage.js';
import { getCurrentUser } from './auth.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

// ── Supabase Rides ─────────────────────────────────────────────────────────────

export async function getAllRidesSupabase() {
  const { data, error } = await supabase
    .from('rides')
    .select(`*, profiles:motorista_id (nome, avatar, curso, periodo, avaliacoes, total_caronas)`)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map(mapRide);
}

export async function searchRidesSupabase(filters = {}) {
  let query = supabase
    .from('rides')
    .select(`*, profiles:motorista_id (nome, avatar, curso, periodo, avaliacoes, total_caronas)`)
    .eq('status', 'ativa');

  if (filters.origem) query = query.ilike('origem', `%${filters.origem}%`);
  if (filters.destino) query = query.ilike('destino', `%${filters.destino}%`);
  if (filters.horario) query = query.gte('horario_saida', filters.horario);
  if (filters.vagasMinimas) query = query.gte('vagas_disponiveis', parseInt(filters.vagasMinimas, 10));

  const { data, error } = await query.order('horario_saida', { ascending: true });
  if (error) return [];
  return data.map(mapRide);
}

export async function offerRideSupabase(rideData) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Faca login para oferecer carona.' };

  const { data, error } = await supabase.from('rides').insert({
    motorista_id: user.id,
    origem: rideData.origem.trim(),
    ponto_encontro: rideData.pontoEncontro.trim(),
    destino: rideData.destino.trim(),
    horario_saida: rideData.horarioSaida,
    horario_chegada: rideData.horarioChegada || null,
    data: rideData.data || new Date().toISOString().split('T')[0],
    vagas_totais: parseInt(rideData.vagas, 10) || 3,
    vagas_disponiveis: parseInt(rideData.vagas, 10) || 3,
    preco: parseFloat(rideData.preco) || 0.00,
    veiculo: rideData.veiculo || 'Carro',
    cor: rideData.cor || 'Branco',
    placa: rideData.placa || '',
    status: 'ativa',
  }).select().single();

  if (error) return { success: false, error: error.message };
  return { success: true, ride: mapRide(data) };
}

export async function updateRideSupabase(id, updatedData) {
  const { error } = await supabase.from('rides').update({
    origem: updatedData.origem,
    ponto_encontro: updatedData.pontoEncontro,
    destino: updatedData.destino,
    horario_saida: updatedData.horarioSaida,
    horario_chegada: updatedData.horarioChegada,
    data: updatedData.data,
    vagas_totais: updatedData.vagasTotais,
    preco: updatedData.preco,
    veiculo: updatedData.veiculo,
    cor: updatedData.cor,
    placa: updatedData.placa,
    status: updatedData.status,
  }).eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteRideSupabase(id) {
  const { error } = await supabase.from('rides').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function bookRideSupabase(rideId) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Voce precisa estar logado para pedir carona.' };

  // Check if already booked
  const { data: existing } = await supabase
    .from('ride_passengers')
    .select('id')
    .eq('ride_id', rideId)
    .eq('passenger_id', user.id)
    .single();

  if (existing) return { success: false, error: 'Voce ja confirmou presenca nesta carona!' };

  const { error } = await supabase
    .from('ride_passengers')
    .insert({ ride_id: rideId, passenger_id: user.id });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getMyRidesSupabase() {
  const user = getCurrentUser();
  if (!user) return { offered: [], booked: [] };

  const [{ data: offered }, { data: bookedPassengers }] = await Promise.all([
    supabase.from('rides').select(`*, profiles:motorista_id (nome, avatar, curso, periodo, avaliacoes, total_caronas)`).eq('motorista_id', user.id).order('created_at', { ascending: false }),
    supabase.from('ride_passengers').select(`rides (*, profiles:motorista_id (nome, avatar, curso, periodo, avaliacoes, total_caronas))`).eq('passenger_id', user.id),
  ]);

  return {
    offered: (offered || []).map(mapRide),
    booked: (bookedPassengers || []).map(p => mapRide(p.rides)).filter(Boolean),
  };
}

function mapRide(r) {
  if (!r) return null;
  const p = r.profiles || {};
  return {
    id: r.id,
    motoristaId: r.motorista_id,
    motoristaNome: p.nome || 'Motorista',
    motoristaFoto: p.avatar || '',
    motoristaCurso: `${p.curso || 'Estudante'} - ${p.periodo || ''}`,
    motoristaAvaliacao: p.avaliacoes || 5.0,
    totalCaronas: p.total_caronas || 0,
    origem: r.origem,
    pontoEncontro: r.ponto_encontro,
    destino: r.destino,
    horarioSaida: r.horario_saida,
    horarioChegada: r.horario_chegada,
    data: r.data,
    vagasTotais: r.vagas_totais,
    vagasDisponiveis: r.vagas_disponiveis,
    preco: r.preco,
    veiculo: r.veiculo,
    cor: r.cor,
    placa: r.placa,
    status: r.status,
    passageiros: [],
  };
}

// ── localStorage fallback ─────────────────────────────────────────────────────

export function getAllRidesLocal() {
  return getStoredData(RIDES_KEY, []);
}

export function getRideById(id) {
  const rides = getAllRidesLocal();
  return rides.find(r => r.id === id) || null;
}

export async function getAllRides() {
  if (isSupabaseConfigured) return getAllRidesSupabase();
  return getAllRidesLocal();
}

export async function searchRides(filters = {}) {
  if (isSupabaseConfigured) return searchRidesSupabase(filters);

  const rides = getAllRidesLocal();
  return rides.filter(ride => {
    if (ride.status !== 'ativa') return false;
    if (filters.origem && !ride.origem.toLowerCase().includes(filters.origem.toLowerCase()) &&
        !ride.pontoEncontro.toLowerCase().includes(filters.origem.toLowerCase())) return false;
    if (filters.destino && !ride.destino.toLowerCase().includes(filters.destino.toLowerCase())) return false;
    if (filters.horario && ride.horarioSaida < filters.horario) return false;
    if (filters.vagasMinimas && ride.vagasDisponiveis < parseInt(filters.vagasMinimas, 10)) return false;
    return true;
  });
}

export async function offerRide(rideData) {
  if (isSupabaseConfigured) return offerRideSupabase(rideData);

  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Faca login para oferecer carona.' };

  const rides = getAllRidesLocal();
  const newRide = {
    id: 'ride_' + Date.now(),
    motoristaId: user.id,
    motoristaNome: user.nome,
    motoristaFoto: user.avatar,
    motoristaCurso: `${user.curso} - ${user.periodo}`,
    motoristaAvaliacao: user.avaliacoes || 5.0,
    totalCaronas: user.totalCaronas || 1,
    origem: rideData.origem.trim(),
    pontoEncontro: rideData.pontoEncontro.trim(),
    destino: rideData.destino.trim(),
    horarioSaida: rideData.horarioSaida,
    horarioChegada: rideData.horarioChegada || '',
    data: rideData.data || new Date().toISOString().split('T')[0],
    vagasTotais: parseInt(rideData.vagas, 10) || 3,
    vagasDisponiveis: parseInt(rideData.vagas, 10) || 3,
    preco: parseFloat(rideData.preco) || 0.00,
    veiculo: rideData.veiculo || (user.veiculo ? user.veiculo.modelo : 'Carro'),
    cor: rideData.cor || (user.veiculo ? user.veiculo.cor : 'Branco'),
    placa: rideData.placa || (user.veiculo ? user.veiculo.placa : 'ABC-1234'),
    status: 'ativa',
    passageiros: []
  };

  rides.unshift(newRide);
  setStoredData(RIDES_KEY, rides);
  return { success: true, ride: newRide };
}

export async function updateRide(id, updatedData) {
  if (isSupabaseConfigured) return updateRideSupabase(id, updatedData);

  const rides = getAllRidesLocal();
  const index = rides.findIndex(r => r.id === id);
  if (index === -1) return { success: false, error: 'Carona nao encontrada.' };

  rides[index] = { ...rides[index], ...updatedData };
  setStoredData(RIDES_KEY, rides);
  return { success: true, ride: rides[index] };
}

export async function deleteRide(id) {
  if (isSupabaseConfigured) return deleteRideSupabase(id);

  const rides = getAllRidesLocal();
  const filtered = rides.filter(r => r.id !== id);
  setStoredData(RIDES_KEY, filtered);
  return { success: true };
}

export async function bookRide(rideId) {
  if (isSupabaseConfigured) return bookRideSupabase(rideId);

  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Voce precisa estar logado para pedir carona.' };

  const rides = getAllRidesLocal();
  const ride = rides.find(r => r.id === rideId);
  if (!ride) return { success: false, error: 'Carona nao encontrada.' };
  if (ride.motoristaId === user.id) return { success: false, error: 'Voce nao pode pedir carona na sua propria oferta!' };
  if (ride.passageiros && ride.passageiros.includes(user.id)) return { success: false, error: 'Voce ja confirmou presenca nesta carona!' };
  if (ride.vagasDisponiveis <= 0) return { success: false, error: 'Todas as vagas desta carona ja foram preenchidas.' };

  ride.vagasDisponiveis -= 1;
  ride.passageiros = ride.passageiros || [];
  ride.passageiros.push(user.id);

  setStoredData(RIDES_KEY, rides);
  return { success: true, ride };
}

export async function getMyRides() {
  if (isSupabaseConfigured) return getMyRidesSupabase();

  const user = getCurrentUser();
  if (!user) return { offered: [], booked: [] };

  const rides = getAllRidesLocal();
  return {
    offered: rides.filter(r => r.motoristaId === user.id),
    booked: rides.filter(r => r.passageiros && r.passageiros.includes(user.id)),
  };
}