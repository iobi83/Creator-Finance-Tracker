import { createClient } from '@supabase/supabase-js';

// Browser client (anon key)
export const browserSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

// Server/API: use user's JWT so RLS applies
export const serverSupabaseFromToken = (token) =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: 'Bearer ' + (token || '') } } }
  );
