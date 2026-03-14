import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn('[Supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
}

// Non-empty placeholders so createClient() doesn't throw; API calls will fail until env is set
export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder-anon-key');
