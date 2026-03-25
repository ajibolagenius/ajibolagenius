/** Opt in to mock personalInfo (and related) when Supabase fetch fails. Default: rely on minimal empty fallback + live data only. */
export const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_FALLBACK === 'true';
