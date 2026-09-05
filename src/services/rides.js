/**
 * Rides Service
 * Handles listing, filtering, offering, booking, editing, and deleting rides.
 */

import { getStoredData, setStoredData, RIDES_KEY } from './storage.js';
import { getCurrentUser } from './auth.js';

export function getAllRides() {
  return getStoredData(RIDES_KEY, []);
}

export function getRideById(id) {
  const rides = getAllRides();
  return rides.find(r => r.id === id) || null;
}

export function searchRides(filters = {}) {
  const rides = getAllRides();
  return rides.filter(ride => {
    if (ride.status !== 'ativa') return false;
    
    if (filters.origem && !ride.origem.toLowerCase().includes(filters.origem.toLowerCase()) && 
        !ride.pontoEncontro.toLowerCase().includes(filters.origem.toLowerCase())) {
      return false;
    }
    
    if (filters.destino && !ride.destino.toLowerCase().includes(filters.destino.toLowerCase())) {
      return false;
    }
    
    if (filters.horario && ride.horarioSaida < filters.horario) {
      return false;
    }
    
    if (filters.vagasMinimas && ride.vagasDisponiveis < parseInt(filters.vagasMinimas, 10)) {
      return false;
    }
    
    return true;
  });
}

export function offerRide(rideData) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Faça login para oferecer carona.' };

  const rides = getAllRides();
  const newRide = {
    id: 'ride_' + Date.now(),
    motoristaId: user.id,
    motoristaNome: user.nome,
    motoristaFoto: user.avatar,
    motoristaCurso: `${user.curso} · ${user.periodo}`,
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

export function updateRide(id, updatedData) {
  const rides = getAllRides();
  const index = rides.findIndex(r => r.id === id);
  if (index === -1) return { success: false, error: 'Carona não encontrada.' };

  rides[index] = { ...rides[index], ...updatedData };
  setStoredData(RIDES_KEY, rides);
  return { success: true, ride: rides[index] };
}

export function deleteRide(id) {
  const rides = getAllRides();
  const filtered = rides.filter(r => r.id !== id);
  setStoredData(RIDES_KEY, filtered);
  return { success: true };
}

export function bookRide(rideId) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Você precisa estar logado para pedir carona.' };

  const rides = getAllRides();
  const ride = rides.find(r => r.id === rideId);
  if (!ride) return { success: false, error: 'Carona não encontrada.' };

  if (ride.motoristaId === user.id) {
    return { success: false, error: 'Você não pode pedir carona na sua própria oferta!' };
  }

  if (ride.passageiros && ride.passageiros.includes(user.id)) {
    return { success: false, error: 'Você já confirmou presença nesta carona!' };
  }

  if (ride.vagasDisponiveis <= 0) {
    return { success: false, error: 'Puxa, todas as vagas desta carona já foram preenchidas.' };
  }

  ride.vagasDisponiveis -= 1;
  ride.passageiros = ride.passageiros || [];
  ride.passageiros.push(user.id);

  setStoredData(RIDES_KEY, rides);
  return { success: true, ride };
}

export function getMyRides() {
  const user = getCurrentUser();
  if (!user) return { offered: [], booked: [] };

  const rides = getAllRides();
  const offered = rides.filter(r => r.motoristaId === user.id);
  const booked = rides.filter(r => r.passageiros && r.passageiros.includes(user.id));

  return { offered, booked };
}
