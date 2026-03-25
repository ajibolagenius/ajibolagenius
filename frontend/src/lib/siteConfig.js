/**
 * Site URL helpers (use VITE_* env via import.meta.env in the app only).
 * Brand constants: import from siteBrand.js in Node/vite.config, or from here in app code.
 */

import { SITE_TAGLINE } from './siteBrand.js';

export * from './siteBrand.js';

/**
 * Vite env object (e.g. import.meta.env). Pass explicitly in tests.
 */
function getViteEnv(env) {
  if (env !== undefined) return env;
  if (typeof import.meta !== 'undefined' && import.meta.env) return import.meta.env;
  return {};
}

/**
 * Supabase project URL from env; empty if unset or placeholder dev value.
 */
export function getSupabaseUrl(env) {
  const e = getViteEnv(env);
  const raw = (e.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
  if (!raw || raw.includes('placeholder')) return '';
  return raw;
}

/**
 * Absolute URL to the edge function that renders PNG OG images (1200×630).
 * @returns {string | null}
 */
export function buildOgImageUrl(title, category, env) {
  const base = getSupabaseUrl(env);
  if (!base) return null;
  const url = new URL(`${base}/functions/v1/og-image`);
  url.searchParams.set('title', title || SITE_TAGLINE);
  url.searchParams.set('category', String(category || 'Thought'));
  return url.toString();
}

/**
 * Twitter @handle for sharing text (no @ prefix in env, e.g. ajibola_akelebe).
 */
export function getShareTwitterHandle(env) {
  const e = getViteEnv(env);
  const h = (e.VITE_SHARE_TWITTER_HANDLE || '').trim().replace(/^@/, '');
  return h || null;
}

/**
 * twitter:site — site’s X/Twitter username (no @), optional.
 */
export function getTwitterSiteMeta(env) {
  const e = getViteEnv(env);
  return (e.VITE_TWITTER_SITE || '').trim().replace(/^@/, '') || null;
}
