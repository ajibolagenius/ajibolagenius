import type { NextConfig } from "next";

// Baseline security headers applied to every route.
//
// Do NOT set default-src here — it falls back for script-src/style-src and
// breaks Next.js hydration (inline scripts) plus remote assets. A full
// script-src/style-src CSP needs nonce plumbing through middleware first.
const isProd = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com",
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
    ];
  },
};

export default nextConfig;
