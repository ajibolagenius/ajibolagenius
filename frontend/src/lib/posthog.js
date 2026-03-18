/**
 * PostHog init from env. Single source of truth: VITE_POSTHOG_KEY and VITE_POSTHOG_HOST in .env.
 * Only initializes in production to avoid ERR_BLOCKED_BY_CLIENT console noise when ad blockers
 * block requests in dev. In production, blocked requests are expected if the user has an ad blocker.
 */
import posthog from 'posthog-js';

const key = import.meta.env.VITE_POSTHOG_KEY;
const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
const isDev = import.meta.env.DEV;

if (!isDev && key && typeof key === 'string' && key.startsWith('phc_')) {
  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    session_recording: {
      recordCrossOriginIframes: true,
      capturePerformance: false,
    },
  });
  if (typeof window !== 'undefined') window.posthog = posthog;
}

export default posthog;
