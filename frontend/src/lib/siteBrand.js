/**
 * Static site branding — safe to import from vite.config.js (no import.meta).
 * Env-dependent helpers live in siteConfig.js.
 */

export const SITE_NAME = 'Ajibola Akelebe';
export const SITE_TAGLINE = 'Design & Engineering';
export const DEFAULT_PAGE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const DEFAULT_META_DESCRIPTION =
  'Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn.';
/** Default OG/Twitter image: `frontend/public/og-image.png` (static pages + fallback when dynamic OG/hero is missing). */
export const DEFAULT_OG_IMAGE_PATH = '/og-image.png';
/** Pixel size of `public/og-image.png` — keep in sync if you replace the file. */
export const STATIC_DEFAULT_OG_IMAGE_WIDTH = 4112;
export const STATIC_DEFAULT_OG_IMAGE_HEIGHT = 2580;
/** Supabase `og-image` edge function output (PNG). */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
