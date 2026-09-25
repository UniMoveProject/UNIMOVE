/**
 * Supabase Client Wrapper
 * Exposes the initialized Supabase client and a flag indicating whether it is configured.
 * If the required environment variables are missing, the client is not instantiated.
 */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://mnztqxabltxqwgnxwuvm.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uenRxeGFibHR4cXdnbnh3dXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNzEzNjUsImV4cCI6MjEwNTc0NzM2NX0.GIM9v6NMsQN5fuynbkgh_png-Unv66-3tnZiKrZYbHE';

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (isSupabaseConfigured) {
  console.log('[UniMove] Supabase conectado com sucesso:', url);
}

export const supabase = createClient(url, anonKey);

// Diagnóstico disponível no console F12 digitando: diagnoseUniMove()
if (typeof window !== 'undefined') {
  window.diagnoseUniMove = async function() {
    console.group('🔍 DIAGNÓSTICO UNIMOVE & SUPABASE');
    console.log('🌐 URL do Supabase:', url);
    console.log('🔑 Anon Key presente:', Boolean(anonKey));
    console.log('💾 Usuário Atual (localStorage):', localStorage.getItem('unimove_current_user'));

    try {
      console.log('⏳ Testando conexão com a tabela "profiles"...');
      const { data: profiles, error: pErr } = await supabase.from('profiles').select('count', { count: 'exact' });
      if (pErr) console.error('❌ Erro em "profiles":', pErr.message);
      else console.log('✅ Tabela "profiles" acessível! Total de perfis:', profiles);

      console.log('⏳ Testando conexão com a tabela "rides"...');
      const { data: rides, error: rErr } = await supabase.from('rides').select('count', { count: 'exact' });
      if (rErr) console.error('❌ Erro em "rides":', rErr.message);
      else console.log('✅ Tabela "rides" acessível! Total de caronas:', rides);

      const { data: authData } = await supabase.auth.getSession();
      console.log('🔐 Sessão Supabase Auth:', authData.session ? 'Autenticado (' + authData.session.user.email + ')' : 'Não autenticado (Anon)');
    } catch (err) {
      console.error('❌ Erro ao conectar com Supabase:', err);
    }
    console.groupEnd();
  };
}

export function getSupabase() {
  return supabase;
}