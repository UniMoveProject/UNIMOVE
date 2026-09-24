-- ==========================================================================
-- UNIMOVE - ESQUEMA DE BANCO DE DADOS (SUPABASE POSTGRESQL)
-- Execute este script no SQL Editor do seu painel do Supabase.
-- ==========================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE PERFIS DE ESTUDANTES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,

  -- Dados pessoais (Standard)
  cpf TEXT,
  idade INTEGER,
  sexo TEXT CHECK (sexo IN ('masculino', 'feminino', 'outro', 'prefiro_nao_dizer')),
  preferencia_carona TEXT DEFAULT 'indiferente' CHECK (preferencia_carona IN ('homem', 'mulher', 'indiferente')),
  telefone TEXT,
  avatar_url TEXT,

  -- Dados acadêmicos
  curso TEXT DEFAULT 'Administração',
  periodo TEXT DEFAULT '1º período',
  campus TEXT DEFAULT 'Campus UNICEPLAC',

  -- Funções de mobilidade
  roles TEXT[] DEFAULT ARRAY['passageiro'],

  -- Dados do veículo (Motorista)
  veiculo_modelo TEXT,
  veiculo_cor TEXT,
  veiculo_placa TEXT,
  veiculo_foto_url TEXT,

  -- Documentação motorista
  cnh TEXT,

  -- Preferências e capacidade (Motorista)
  vagas_padrao INTEGER DEFAULT 3,
  preferencia_passageiros TEXT DEFAULT 'mista' CHECK (preferencia_passageiros IN ('homem', 'mulher', 'mista')),
  tempo_espera_min INTEGER DEFAULT 5,

  -- Acessibilidade e espaço (Motorista)
  porta_malas_litros INTEGER,
  acessivel_cadeirante BOOLEAN DEFAULT false,

  -- Preço médio (Motorista)
  preco_medio NUMERIC(6, 2) DEFAULT 0.00,

  -- Avaliação e estatísticas
  avaliacoes NUMERIC(2, 1) DEFAULT 5.0,
  total_caronas INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================================
-- MIGRATION: Adicionar colunas novas em tabelas existentes (sem apagar dados)
-- ==========================================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferencia_carona TEXT DEFAULT 'indiferente' CHECK (preferencia_carona IN ('homem', 'mulher', 'indiferente'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS veiculo_foto_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cnh TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vagas_padrao INTEGER DEFAULT 3;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferencia_passageiros TEXT DEFAULT 'mista' CHECK (preferencia_passageiros IN ('homem', 'mulher', 'mista'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tempo_espera_min INTEGER DEFAULT 5;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS porta_malas_litros INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS acessivel_cadeirante BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preco_medio NUMERIC(6, 2) DEFAULT 0.00;
ALTER TABLE public.profiles ALTER COLUMN sexo TYPE TEXT;

-- 3. TABELA DE CARONAS
CREATE TABLE IF NOT EXISTS public.rides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  motorista_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  origem TEXT NOT NULL,
  ponto_encontro TEXT,
  destino TEXT DEFAULT 'Campus UNICEPLAC' NOT NULL,
  data DATE DEFAULT CURRENT_DATE NOT NULL,
  horario_saida TIME NOT NULL,
  horario_chegada TIME,
  vagas_totais INTEGER DEFAULT 3 NOT NULL,
  vagas_disponiveis INTEGER DEFAULT 3 NOT NULL,
  preco NUMERIC(6, 2) DEFAULT 0.00 NOT NULL,
  veiculo TEXT,
  cor TEXT,
  placa TEXT,
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE PASSAGEIROS DA CARONA
CREATE TABLE IF NOT EXISTS public.ride_passengers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE NOT NULL,
  passageiro_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'confirmado' CHECK (status IN ('confirmado', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(ride_id, passageiro_id)
);

-- 5. TABELA DE MENSAGENS DO CHAT
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Perfis visíveis para todos'
  ) THEN
    CREATE POLICY "Perfis visíveis para todos"
      ON public.profiles FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Usuários podem atualizar seu próprio perfil'
  ) THEN
    CREATE POLICY "Usuários podem atualizar seu próprio perfil"
      ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Permitir inserção de perfil no cadastro'
  ) THEN
    CREATE POLICY "Permitir inserção de perfil no cadastro"
      ON public.profiles FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Políticas de Rides
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='rides' AND policyname='Caronas visíveis para todos'
  ) THEN
    CREATE POLICY "Caronas visíveis para todos"
      ON public.rides FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='rides' AND policyname='Motoristas podem criar caronas'
  ) THEN
    CREATE POLICY "Motoristas podem criar caronas"
      ON public.rides FOR INSERT WITH CHECK (auth.uid() = motorista_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='rides' AND policyname='Motoristas podem editar suas caronas'
  ) THEN
    CREATE POLICY "Motoristas podem editar suas caronas"
      ON public.rides FOR UPDATE USING (auth.uid() = motorista_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='rides' AND policyname='Motoristas podem excluir suas caronas'
  ) THEN
    CREATE POLICY "Motoristas podem excluir suas caronas"
      ON public.rides FOR DELETE USING (auth.uid() = motorista_id);
  END IF;
END $$;

-- Políticas de Ride Passengers
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='ride_passengers' AND policyname='Passageiros podem ver suas reservas'
  ) THEN
    CREATE POLICY "Passageiros podem ver suas reservas"
      ON public.ride_passengers FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='ride_passengers' AND policyname='Passageiros podem reservar vagas'
  ) THEN
    CREATE POLICY "Passageiros podem reservar vagas"
      ON public.ride_passengers FOR INSERT WITH CHECK (auth.uid() = passageiro_id);
  END IF;
END $$;

-- Políticas de Messages
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='messages' AND policyname='Mensagens visíveis para membros da carona'
  ) THEN
    CREATE POLICY "Mensagens visíveis para membros da carona"
      ON public.messages FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='messages' AND policyname='Membros autenticados podem enviar mensagens'
  ) THEN
    CREATE POLICY "Membros autenticados podem enviar mensagens"
      ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
  END IF;
END $$;

-- ==========================================================================
-- TRIGGER: CRIAR PERFIL AUTOMÁTICO APÓS CADASTRO
-- ==========================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, curso, campus)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nome', 'Estudante Uniceplac'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'curso', 'Administração'),
    COALESCE(new.raw_user_meta_data->>'campus', 'Campus UNICEPLAC')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Habilitar Realtime para mensagens
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;