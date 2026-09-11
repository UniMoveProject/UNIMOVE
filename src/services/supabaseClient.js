/**
 * Supabase Client Configuration & Helper
 * 
 * Para ativar o Supabase neste projeto:
 * 1. Crie um arquivo .env na raiz com as chaves:
 *    VITE_SUPABASE_URL=https://seu-projeto.supabase.co
 *    VITE_SUPABASE_ANON_KEY=sua-chave-anon
 * 2. Instale o SDK: npm install @supabase/supabase-js
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://sua-url-aqui.supabase.co');

export let supabase = null;

if (isSupabaseConfigured) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('[UniMove] Supabase inicializado com sucesso.');
  } catch (e) {
    console.warn('[UniMove] Pacote @supabase/supabase-js ainda não instalado. Usando fallback de armazenamento local.');
  }
}