/**
 * Supabase Client Wrapper
 * Exposes the initialized Supabase client and a flag indicating whether it is configured.
 * If the required environment variables are missing, the client is not instantiated.
 */

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

// Helper to lazily load the client in environments where Vite's import.meta.env may be undefined (e.g., tests)
export function getSupabase() {
  if (isSupabaseConfigured) return supabase;
  console.warn('Supabase not configured – missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  return null;
}