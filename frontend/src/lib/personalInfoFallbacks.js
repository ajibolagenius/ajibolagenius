import { personalInfo as mockPersonalInfo } from '../data/mock';
import { minimalPersonalInfoFallback } from '../data/personalInfoFallback';
import { USE_MOCK_FALLBACK } from './envFlags';

/** Fallback object passed to useRealtimeQuery when Supabase is down or misconfigured. */
export function getPersonalInfoQueryFallback() {
  return USE_MOCK_FALLBACK ? mockPersonalInfo : minimalPersonalInfoFallback;
}
