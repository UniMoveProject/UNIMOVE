/**
 * Storage Service
 * LocalStorage state management with mock persistence.
 * Prepared to seamlessly swap to Supabase client queries.
 */

const USERS_KEY = 'unimove_users';
const RIDES_KEY = 'unimove_rides';
const CHAT_KEY = 'unimove_chats';
const CURRENT_USER_KEY = 'unimove_current_user';

// Seed Initial Mock Data if empty
const INITIAL_USERS = [
  {
    id: 'usr_teste',
    nome: 'Teste',
    email: 'teste@uniceplac.edu.br',
    senha: '123456',
    curso: 'Engenharia de Software',
    periodo: '1º período',
    campus: 'Campus UNICEPLAC',
    idade: 20,
    cidade: 'Brasília - DF',
    telefone: '(61) 90000-0000',
    roles: ['motorista', 'passageiro'],
    veiculo: {
      modelo: 'Chevrolet Onix',
      cor: 'Preto',
      placa: 'TST-0001'
    },
    avaliacoes: 5.0,
    totalCaronas: 0,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  }
];

const INITIAL_RIDES = [
  {
    id: 'ride_1',
    motoristaId: 'usr_teste',
    motoristaNome: 'Teste',
    motoristaFoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    motoristaCurso: 'Engenharia de Software · 1º período',
    motoristaAvaliacao: 5.0,
    totalCaronas: 0,
    origem: 'Brasília - Asa Norte',
    pontoEncontro: 'Estação Metrô Asa Norte',
    destino: 'Campus UNICEPLAC',
    horarioSaida: '07:30',
    horarioChegada: '08:10',
    data: '2026-09-23',
    vagasTotais: 3,
    vagasDisponiveis: 3,
    preco: 6.00,
    veiculo: 'Chevrolet Onix',
    cor: 'Preto',
    placa: 'TST-0001',
    status: 'ativa',
    passageiros: []
  }
];

const INITIAL_CHATS = {
  'ride_1': [
    {
      id: 'msg_1',
      senderId: 'usr_teste',
      senderNome: 'Teste',
      senderRole: 'Motorista',
      senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      text: 'Oi! Saio pontualmente às 07:30 da Estação Metrô Asa Norte.',
      time: '19:00',
      timestamp: Date.now() - 3600000
    }
  ]
};

export function getStoredData(key, fallback) {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
}

export function setStoredData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initializer
export function initStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(RIDES_KEY)) {
    localStorage.setItem(RIDES_KEY, JSON.stringify(INITIAL_RIDES));
  }
  if (!localStorage.getItem(CHAT_KEY)) {
    localStorage.setItem(CHAT_KEY, JSON.stringify(INITIAL_CHATS));
  }
  if (!localStorage.getItem(CURRENT_USER_KEY)) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(INITIAL_USERS[0]));
  }
}

export { USERS_KEY, RIDES_KEY, CHAT_KEY, CURRENT_USER_KEY };