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
  cpf TEXT,
  idade INTEGER,
  sexo TEXT,
  telefone TEXT,
  curso TEXT DEFAULT 'Administração',
  periodo TEXT DEFAULT '1º período',
  campus TEXT DEFAULT 'Campus UNICEPLAC',
  roles TEXT[] DEFAULT ARRAY['passageiro'],
  veiculo_modelo TEXT,
  veiculo_cor TEXT,
  veiculo_placa TEXT,
  avatar_url TEXT,
  avaliacoes NUMERIC(2, 1) DEFAULT 5.0,
  total_caronas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
CREATE POLICY "Perfis visíveis para todos os estudantes autenticados"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas de Rides
CREATE POLICY "Caronas visíveis para todos"
  ON public.rides FOR SELECT
  USING (true);

CREATE POLICY "Motoristas podem criar caronas"
  ON public.rides FOR INSERT
  WITH CHECK (auth.uid() = motorista_id);

CREATE POLICY "Motoristas podem editar suas caronas"
  ON public.rides FOR UPDATE
  USING (auth.uid() = motorista_id);

CREATE POLICY "Motoristas podem excluir suas caronas"
  ON public.rides FOR DELETE
  USING (auth.uid() = motorista_id);

-- Políticas de Ride Passengers
CREATE POLICY "Passageiros podem ver suas reservas"
  ON public.ride_passengers FOR SELECT
  USING (true);

CREATE POLICY "Passageiros podem reservar vagas"
  ON public.ride_passengers FOR INSERT
  WITH CHECK (auth.uid() = passageiro_id);

-- Políticas de Messages
CREATE POLICY "Mensagens visíveis para membros da carona"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Membros autenticados podem enviar mensagens"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Habilitar Realtime para mensagens
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;