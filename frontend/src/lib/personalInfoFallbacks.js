import { minimalPersonalInfoFallback } from '../data/personalInfoFallback';

/** Fallback object passed to useRealtimeQuery when Supabase is down or misconfigured. */
export function getPersonalInfoQueryFallback() {
  return minimalPersonalInfoFallback;
}
