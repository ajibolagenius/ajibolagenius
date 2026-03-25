/**
 * Static site branding — safe to import from vite.config.js (no import.meta).
 * Env-dependent helpers live in siteConfig.js.
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
