import type { NextConfig } from "next";

// Complete Content Security Policy applied to every route.
const isProd = process.env.NODE_ENV === "production";
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogAssetsHost = posthogHost?.replace(".i.", "-assets.i.");

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com ${posthogHost ?? ""} ${posthogAssetsHost ?? ""}${!isProd ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.unsplash.com https://unsplash.com",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com ${posthogHost ?? ""}`,
  "worker-src 'self' blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Only in production — this would break http://localhost in development.
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // /work and /side-projects merged into /projects. These URLs are on
  // submitted job applications, so every one of them must keep resolving.
  //
  // Config redirects (not proxy.ts) because they compile into the routing
  // manifest and are handled before any function runs — no Supabase client,
  // no cold start, and they can't be defeated by a stale route file.
  async redirects() {
    return [
      // Exact listing pages FIRST. `:path*` below matches zero segments too,
      // so it would otherwise swallow a bare /side-projects and drop the
      // ?type=side that makes the redirect land on the right filter.
      { source: "/work", destination: "/projects", statusCode: 301 },
      {
        source: "/side-projects",
        destination: "/projects?type=side",
        statusCode: 301,
      },
      // `:path*`, not `:slug`: a single-segment param would miss
      // /work/<slug>/opengraph-image (3 segments) while still catching
      // /work/opengraph-image (2), leaving already-shared social previews
      // broken. Query strings are preserved and merged automatically.
      {
        source: "/work/:path*",
        destination: "/projects/:path*",
        statusCode: 301,
      },
      {
        source: "/side-projects/:path*",
        destination: "/projects/:path*",
        statusCode: 301,
      },
      {
        source: "/blog",
        destination: "/notes",
        statusCode: 301,
      },
      {
        source: "/blog/:path*",
        destination: "/notes/:path*",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
