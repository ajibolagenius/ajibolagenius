/**
 * The canonical absolute origin for this deployment, and the only copy of this
 * fallback chain — it used to be duplicated in ~10 places (both detail pages,
 * both slug OG routes, sitemap.ts, robots.ts, layout.tsx, og-template.ts).
 *
 * Import it rather than re-deriving: canonical URLs, sitemap entries, OG image
 * URLs and `metadataBase` all have to agree, and a second copy is how they stop
 * agreeing.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
