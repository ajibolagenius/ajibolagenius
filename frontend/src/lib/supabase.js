import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isPlaceholder = !url || !anonKey || String(url).includes('placeholder');

if (isPlaceholder) {
  console.warn('[Supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
  if (import.meta.env.DEV) {
    console.warn('[Supabase] Dev mode: using placeholder client; all API calls will fail until .env is configured.');
  }
}

/** Supabase client. Use real project URL and anon key in .env for data and auth to work. */
export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder-anon-key');
