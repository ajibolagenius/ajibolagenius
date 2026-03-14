import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
    console.warn(
        '[Supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. Using placeholder; API calls will fail.'
    );
}

export const supabase = createClient(url || 'https://peincqeqcufbkoccyneo.supabase.co', anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlaW5jcWVxY3VmYmtvY2N5bmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODg4NDEsImV4cCI6MjA4OTA2NDg0MX0.EnffX_X0YiGz1Y1GbgbanCXAfTC5wXGLpNvj6EFKJDI');
