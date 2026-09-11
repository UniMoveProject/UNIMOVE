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
    id: 'usr_rhian',
    nome: 'Rhian Almeida',
    email: 'rhian.almeida@uniceplac.edu.br',
    senha: 'UniMove123!',
    curso: 'Administração',
    periodo: '4º período',
    campus: 'Campus UNICEPLAC',
    idade: 21,
    cidade: 'Valparaíso de Goiás',
    telefone: '(61) 99876-5432',
    roles: ['motorista', 'passageiro'],
    veiculo: {
      modelo: 'Chevrolet Onix',
      cor: 'Branco',
      placa: 'ABC-1D23'
    },
    avaliacoes: 4.9,
    totalCaronas: 24,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_anaclara',
    nome: 'Ana Clara Souza',
    email: 'ana.clara@uniceplac.edu.br',
    senha: 'UniMove123!',
    curso: 'Ciência da Computação',
    periodo: '3º período',
    campus: 'Campus UNICEPLAC',
    idade: 20,
    cidade: 'Gama - DF',
    telefone: '(61) 98765-4321',
    roles: ['passageiro'],
    veiculo: null,
    avaliacoes: 4.8,
    totalCaronas: 12,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  }
];

const INITIAL_RIDES = [
  {
    id: 'ride_1',
    motoristaId: 'usr_rhian',
    motoristaNome: 'Rhian Almeida',
    motoristaFoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    motoristaCurso: 'Administração · 4º período',
    motoristaAvaliacao: 4.9,
    totalCaronas: 24,
    origem: 'Setor Bela Vista',
    pontoEncontro: 'Terminal Jardim ABC',
    destino: 'Campus UNICEPLAC',
    horarioSaida: '07:40',
    horarioChegada: '08:15',
    data: '2026-09-11',
    vagasTotais: 3,
    vagasDisponiveis: 2,
    preco: 6.00,
    veiculo: 'Chevrolet Onix',
    cor: 'Branco',
    placa: 'ABC-1D23',
    status: 'ativa',
    passageiros: ['usr_anaclara']
  },
  {
    id: 'ride_2',
    motoristaId: 'usr_lucas',
    motoristaNome: 'Lucas Pinheiro',
    motoristaFoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    motoristaCurso: 'Engenharia Civil · 6º período',
    motoristaAvaliacao: 4.8,
    totalCaronas: 18,
    origem: 'Brasília - Asa Sul',
    pontoEncontro: 'Estação Metrô 108 Sul',
    destino: 'Campus UNICEPLAC',
    horarioSaida: '07:15',
    horarioChegada: '07:55',
    data: '2026-09-11',
    vagasTotais: 4,
    vagasDisponiveis: 3,
    preco: 7.50,
    veiculo: 'Honda Civic',
    cor: 'Cinza',
    placa: 'ADD-4C10',
    status: 'ativa',
    passageiros: []
  },
  {
    id: 'ride_3',
    motoristaId: 'usr_mariana',
    motoristaNome: 'Mariana Duarte',
    motoristaFoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    motoristaCurso: 'Medicina · 2º período',
    motoristaAvaliacao: 5.0,
    totalCaronas: 35,
    origem: 'Taguatinga Sul',
    pontoEncontro: 'Pistão Sul - Posto Flamingo',
    destino: 'Campus UNICEPLAC',
    horarioSaida: '07:20',
    horarioChegada: '08:05',
    data: '2026-09-11',
    vagasTotais: 3,
    vagasDisponiveis: 1,
    preco: 6.50,
    veiculo: 'Toyota Yaris',
    cor: 'Vermelho',
    placa: 'KMN-9X88',
    status: 'ativa',
    passageiros: []
  }
];

const INITIAL_CHATS = {
  'ride_1': [
    {
      id: 'msg_1',
      senderId: 'usr_rhian',
      senderNome: 'Rhian Almeida',
      senderRole: 'Motorista',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Fala pessoal! Amanhã saio do Terminal Jardim ABC pontualmente às 07:40.',
      time: '19:40',
      timestamp: Date.now() - 3600000
    },
    {
      id: 'msg_2',
      senderId: 'usr_anaclara',
      senderNome: 'Ana Clara Souza',
      senderRole: 'Passageiro',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      text: 'Show Rhian! Estarei lá às 07:35 te esperando perto do ponto coberto.',
      time: '19:45',
      timestamp: Date.now() - 3300000
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