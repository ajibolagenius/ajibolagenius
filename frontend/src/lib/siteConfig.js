/**
 * Site branding and URL helpers. No runtime API calls.
 * Set VITE_SITE_URL, VITE_SUPABASE_URL, VITE_TWITTER_SITE, VITE_SHARE_TWITTER_HANDLE in env.
 */

export const SITE_NAME = 'Ajibola Akelebe';
export const SITE_TAGLINE = 'Design & Engineering';
export const DEFAULT_PAGE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const DEFAULT_META_DESCRIPTION =
  'Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn.';
/** Path to static fallback OG image (absolute URL built with VITE_SITE_URL in HTML build + pageMeta). */
export const DEFAULT_OG_IMAGE_PATH = '/og-image.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

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
