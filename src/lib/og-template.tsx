/**
 * Shared Open Graph image design system.
 *
 * Every route-level opengraph-image.tsx composes OgShell so all social
 * cards share one visual language: cream canvas, accent spine, geometric
 * brand shapes (from public/svg-shapes) rendered as inline SVG, and a
 * consistent header / title / footer rhythm. Satori-compatible: flex
 * layouts only, inline styles, plain <svg> elements.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const OG = {
  cream: "#fbf5ef",
  ink: "#1a0a06",
  accent: "#e64301",
  panel: "#f0e9e3",
} as const;

/** Pinwheel brand shape (public/svg-shapes/shape-1.svg). */
function ShapePinwheel({
  size,
  color,
  opacity,
  style,
}: {
  size: number;
  color: string;
  opacity: number;
  style?: Record<string, string | number>;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      style={{ position: "absolute", opacity, ...style }}
    >
      <path
        d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z"
        fill={color}
      />
    </svg>
  );
}

/** Star / cross brand shape (public/svg-shapes/shape-7.svg). */
function ShapeStar({
  size,
  color,
  opacity,
  style,
}: {
  size: number;
  color: string;
  opacity: number;
  style?: Record<string, string | number>;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      style={{ position: "absolute", opacity, ...style }}
    >
      <path
        d="M 112 32 L 54.627 32 L 128 105.373 L 201.373 32 L 144 32 L 144 0 L 256 0 L 256 112 L 224 112 L 224 54.627 L 150.627 128 L 224 201.373 L 224 144 L 256 144 L 256 256 L 144 256 L 144 224 L 201.373 224 L 128 150.627 L 54.627 224 L 112 224 L 112 256 L 0 256 L 0 144 L 32 144 L 32 201.373 L 105.373 128 L 32 54.627 L 32 112 L 0 112 L 0 0 L 112 0 Z"
        fill={color}
      />
    </svg>
  );
}

/** Dotted grid, echoing the hero illustration's stitched texture. */
function DotGrid({
  rows,
  cols,
  gap,
  color,
  opacity,
  style,
}: {
  rows: number;
  cols: number;
  gap: number;
  color: string;
  opacity: number;
  style?: Record<string, string | number>;
}) {
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={c * gap + 3}
          cy={r * gap + 3}
          r={3}
          fill={color}
        />,
      );
    }
  }
  return (
    <svg
      width={(cols - 1) * gap + 6}
      height={(rows - 1) * gap + 6}
      style={{ position: "absolute", opacity, ...style }}
    >
      {dots}
    </svg>
  );
}

export function OgShell({
  label,
  title,
  subtitle,
  avatarSrc,
  footerLeft,
  siteHost,
}: {
  /** Small uppercase kicker above the title (e.g. role, "WORK"). */
  label: string;
  title: string;
  subtitle?: string;
  /** data: URI or absolute URL; rendered as a circle in the header. */
  avatarSrc?: string;
  footerLeft: string;
  siteHost: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: OG.cream,
        padding: "64px 80px",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      {/* Accent spine */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 14,
          height: "100%",
          background: OG.accent,
          display: "flex",
        }}
      />

      {/* Decorative brand geometry */}
      <ShapePinwheel
        size={360}
        color={OG.accent}
        opacity={0.08}
        style={{ top: -90, right: -70 }}
      />
      <ShapeStar
        size={104}
        color={OG.accent}
        opacity={0.85}
        style={{ top: 92, right: 96 }}
      />
      <DotGrid
        rows={5}
        cols={11}
        gap={22}
        color={OG.ink}
        opacity={0.18}
        style={{ bottom: 118, right: 80 }}
      />
      <ShapePinwheel
        size={140}
        color={OG.ink}
        opacity={0.05}
        style={{ bottom: -40, left: 340 }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {avatarSrc && (
          <img
            src={avatarSrc}
            width={104}
            height={104}
            style={{
              borderRadius: 999,
              objectFit: "cover",
              border: `4px solid ${OG.ink}`,
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: OG.ink,
            color: OG.cream,
            padding: "10px 20px",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              background: OG.accent,
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Title block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          gap: 18,
          maxWidth: 880,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: OG.ink,
            lineHeight: 1.1,
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: 32,
              color: OG.ink,
              opacity: 0.65,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${OG.panel}`,
          paddingTop: 26,
        }}
      >
        <span style={{ fontSize: 24, color: OG.ink, opacity: 0.5 }}>
          {footerLeft}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 12,
              height: 12,
              background: OG.accent,
              borderRadius: 999,
              display: "flex",
            }}
          />
          <span style={{ fontSize: 24, fontWeight: 700, color: OG.ink }}>
            {siteHost}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Resolve the avatar for OG rendering as a data URI. Prefers the
 * admin-managed avatar_url (Supabase storage) and falls back to the
 * bundled public/avatar_3d.png.
 */
export async function loadAvatarSrc(
  remoteUrl?: string | null,
): Promise<string> {
  if (remoteUrl) {
    try {
      const res = await fetch(remoteUrl);
      if (res.ok) {
        const type = res.headers.get("content-type") ?? "image/png";
        const data = Buffer.from(await res.arrayBuffer()).toString("base64");
        return `data:${type};base64,${data}`;
      }
    } catch {
      // fall through to the bundled avatar
    }
  }
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const data = await readFile(
    join(process.cwd(), "public/avatar_3d.png"),
    "base64",
  );
  return `data:image/png;base64,${data}`;
}

export function getSiteHost(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
  try {
    return new URL(url).host;
  } catch {
    return "ajibolagenius.vercel.app";
  }
}
