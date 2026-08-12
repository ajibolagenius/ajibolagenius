/**
 * The canonical absolute origin for this deployment.
 *
 * This fallback chain was copy-pasted in ~10 places (both detail pages, both
 * slug OG routes, sitemap.ts, layout.tsx, …). New code should import this;
 * the remaining copies can be collapsed onto it opportunistically.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
