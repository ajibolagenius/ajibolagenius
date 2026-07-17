/**
 * Shared Open Graph image design system.
 *
 * Implements a hybrid design system combining:
 * 1. Technical Grid Background: A detailed blueprint grid & CAD coordinate system (Plasticity style)
 * 2. Split-Screen Layout: Left pane for content, Right pane for visual preview (Frida Wiig style)
 * 3. Vibrant Category Pill Tags: Color-coded tags (Valentin style)
 * 4. Flexible Theme System: Automatic support for light/dark themes
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const OG = {
  cream: "#fbf5ef",
  ink: "#1a0a06",
  accent: "#e64301",
  panel: "#f0e9e3",
} as const;

export const OG_DARK = {
  cream: "#120e0c",
  ink: "#f5ede6",
  accent: "#ff6a3d",
  panel: "#221c18",
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

/** Technical Blueprint Grid (Plasticity style) */
function BlueprintGrid({ color = "#1a0a06", opacity = 0.05 }) {
  const lines = [];
  
  // Horizontal lines every 45px
  for (let y = 45; y < 630; y += 45) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={1200}
        y2={y}
        stroke={color}
        strokeWidth={1}
        opacity={y === 315 ? opacity * 2.5 : opacity}
      />
    );
  }
  
  // Vertical lines every 45px
  for (let x = 45; x < 1200; x += 45) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={630}
        stroke={color}
        strokeWidth={1}
        opacity={x === 585 ? opacity * 2.5 : opacity}
      />
    );
  }

  return (
    <svg
      width={1200}
      height={630}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1200,
        height: 630,
      }}
    >
      {lines}
      {/* Center axis crosshairs */}
      <circle cx={585} cy={315} r={8} fill="none" stroke={color} strokeWidth={1.5} opacity={opacity * 3.5} />
      <circle cx={585} cy={315} r={50} fill="none" stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={opacity * 2} />
      <path d="M 555 315 L 615 315 M 585 285 L 585 345" stroke={color} strokeWidth={1} opacity={opacity * 4} />
      
      {/* Corner drafting crop marks */}
      <path d="M 30 30 L 60 30 M 30 30 L 30 60" stroke={color} strokeWidth={1.5} opacity={opacity * 5} />
      <path d="M 1170 30 L 1140 30 M 1170 30 L 1170 60" stroke={color} strokeWidth={1.5} opacity={opacity * 5} />
      <path d="M 30 600 L 60 600 M 30 600 L 30 570" stroke={color} strokeWidth={1.5} opacity={opacity * 5} />
      <path d="M 1170 600 L 1140 600 M 1170 600 L 1170 570" stroke={color} strokeWidth={1.5} opacity={opacity * 5} />
    </svg>
  );
}

/** Color-coded category tags (Valentin style) */
function getPillColors(tag: string, isDark: boolean) {
  const t = tag.toLowerCase();
  if (isDark) {
    if (t.includes("react") || t.includes("next") || t.includes("node") || t.includes("api") || t.includes("work")) {
      return { bg: "#065f46", text: "#a7f3d0", border: "#047857" }; // Emerald
    }
    if (t.includes("typescript") || t.includes("js") || t.includes("front") || t.includes("web") || t.includes("source")) {
      return { bg: "#1e3a8a", text: "#93c5fd", border: "#1d4ed8" }; // Blue
    }
    if (t.includes("design") || t.includes("ux") || t.includes("ui") || t.includes("css") || t.includes("experi") || t.includes("art")) {
      return { bg: "#831843", text: "#fbcfe8", border: "#be185d" }; // Pink
    }
    if (t.includes("db") || t.includes("postgres") || t.includes("supabase") || t.includes("server") || t.includes("cv") || t.includes("resume")) {
      return { bg: "#4c1d95", text: "#ddd6fe", border: "#6d28d9" }; // Purple
    }
    return { bg: "#7c2d12", text: "#ffedd5", border: "#ea580c" }; // Orange
  } else {
    if (t.includes("react") || t.includes("next") || t.includes("node") || t.includes("api") || t.includes("work")) {
      return { bg: "#e6f4ea", text: "#137333", border: "#b8e1c4" };
    }
    if (t.includes("typescript") || t.includes("js") || t.includes("front") || t.includes("web") || t.includes("source")) {
      return { bg: "#e8f0fe", text: "#1a73e8", border: "#b4d2fc" };
    }
    if (t.includes("design") || t.includes("ux") || t.includes("ui") || t.includes("css") || t.includes("experi") || t.includes("art")) {
      return { bg: "#fce8f3", text: "#c2185b", border: "#fbc3db" };
    }
    if (t.includes("db") || t.includes("postgres") || t.includes("supabase") || t.includes("server") || t.includes("cv") || t.includes("resume")) {
      return { bg: "#f3e8fd", text: "#7b1fa2", border: "#e1bee7" };
    }
    return { bg: "#fdeee7", text: "#e64301", border: "#f9cab6" };
  }
}

/** Framed project image (clean bordered card layout) */
function ProjectImageFrame({ imageSrc, themeColor }: { imageSrc: string; themeColor: typeof OG | typeof OG_DARK }) {
  return (
    <div
      style={{
        display: "flex",
        width: "440px",
        height: "320px",
        borderRadius: "14px",
        border: `3px solid ${themeColor.ink}`,
        boxShadow: `12px 12px 0px ${themeColor.ink}`,
        overflow: "hidden",
        background: themeColor.panel,
      }}
    >
      <img
        src={imageSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

/** High contrast human portrait avatar (Frida Wiig style) */
function EditorialPortrait({ imageSrc, themeColor }: { imageSrc: string; themeColor: typeof OG | typeof OG_DARK }) {
  return (
    <div
      style={{
        display: "flex",
        width: "360px",
        height: "360px",
        borderRadius: "24px",
        border: `4px solid ${themeColor.ink}`,
        boxShadow: `12px 12px 0px ${themeColor.accent}`,
        overflow: "hidden",
        background: themeColor.panel,
      }}
    >
      <img
        src={imageSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

export function OgShell({
  label,
  title,
  subtitle,
  avatarSrc,
  imageSrc,
  tags = [],
  footerLeft,
  siteHost,
  isDark = false,
}: {
  label: string;
  title: string;
  subtitle?: string;
  avatarSrc?: string;
  imageSrc?: string;
  tags?: string[];
  footerLeft: string;
  siteHost: string;
  isDark?: boolean;
}) {
  const themeColor = isDark ? OG_DARK : OG;

  // Calculate dynamic title size so long text doesn't overflow the canvas
  const titleLength = title.length;
  const titleFontSize = titleLength > 20 ? 44 : titleLength > 12 ? 52 : 64;

  // Decide if we should render a split screen or fallback
  const hasRightVisual = imageSrc || avatarSrc;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        background: themeColor.cream,
        padding: "60px 70px",
        position: "relative",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Blueprint Grid Background */}
      <BlueprintGrid color={themeColor.ink} opacity={isDark ? 0.05 : 0.06} />

      {/* Decorative vertical brand spine */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 14,
          height: "100%",
          background: themeColor.accent,
          display: "flex",
        }}
      />

      {/* Content Container (Left Column) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          marginRight: hasRightVisual ? "40px" : "0px",
        }}
      >
        {/* Top Kicker Label */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: themeColor.ink,
              color: themeColor.cream,
              padding: "8px 16px",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                background: themeColor.accent,
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontSize: titleFontSize,
              fontWeight: 800,
              color: themeColor.ink,
              lineHeight: 1.15,
            }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: 24,
                color: themeColor.ink,
                opacity: 0.75,
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </span>
          )}

          {/* Tags Pills Row (Valentin Style) */}
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
              {tags.map((tag) => {
                const colors = getPillColors(tag, isDark);
                return (
                  <div
                    key={tag}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: colors.bg,
                      color: colors.text,
                      border: `1.5px solid ${colors.border}`,
                      borderRadius: "6px",
                      padding: "4px 12px",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${themeColor.panel}`,
            paddingTop: 20,
            marginTop: "auto",
          }}
        >
          <span style={{ fontSize: 20, color: themeColor.ink, opacity: 0.6 }}>
            {footerLeft}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                background: themeColor.accent,
                borderRadius: 999,
                display: "flex",
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 750, color: themeColor.ink }}>
              {siteHost}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Component Container (Right Column) */}
      {hasRightVisual && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageSrc ? (
            <ProjectImageFrame imageSrc={imageSrc} themeColor={themeColor} />
          ) : avatarSrc ? (
            <EditorialPortrait imageSrc={avatarSrc} themeColor={themeColor} />
          ) : null}
        </div>
      )}

      {/* Classic decorative background shapes (only render when no custom right visual is shown) */}
      {!hasRightVisual && (
        <>
          <ShapePinwheel
            size={320}
            color={themeColor.accent}
            opacity={isDark ? 0.04 : 0.06}
            style={{ top: -70, right: -50 }}
          />
          <ShapeStar
            size={90}
            color={themeColor.accent}
            opacity={0.8}
            style={{ top: 80, right: 80 }}
          />
          <ShapePinwheel
            size={120}
            color={themeColor.ink}
            opacity={0.03}
            style={{ bottom: -30, left: 320 }}
          />
        </>
      )}
    </div>
  );
}

/**
 * Resolve remote URL or public asset into a base64 data URI for edge rendering compatibility.
 */
export async function loadAvatarSrc(
  remoteUrl?: string | null,
): Promise<string> {
  if (remoteUrl) {
    try {
      const res = await fetch(remoteUrl);
      if (res.ok) {
        const type = res.headers.get("content-type") ?? "image/png";
        const arrayBuffer = await res.arrayBuffer();
        let buffer: any = Buffer.from(new Uint8Array(arrayBuffer));
        
        let targetType = type;
        if (type.includes("webp") || remoteUrl.toLowerCase().endsWith(".webp")) {
          const sharp = (await import("sharp")).default;
          buffer = await sharp(buffer).png().toBuffer();
          targetType = "image/png";
        }
        
        const data = buffer.toString("base64");
        return `data:${targetType};base64,${data}`;
      }
    } catch {
      // fallback
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

/**
 * Helper to load generic image file/URL into a Base64 string for edge/Satori.
 */
export async function loadImageSrc(url?: string | null): Promise<string | undefined> {
  if (!url) return undefined;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const type = res.headers.get("content-type") ?? "image/png";
      const arrayBuffer = await res.arrayBuffer();
      let buffer: any = Buffer.from(new Uint8Array(arrayBuffer));
      
      let targetType = type;
      if (type.includes("webp") || url.toLowerCase().endsWith(".webp")) {
        const sharp = (await import("sharp")).default;
        buffer = await sharp(buffer).png().toBuffer();
        targetType = "image/png";
      }
      
      const data = buffer.toString("base64");
      return `data:${targetType};base64,${data}`;
    }
  } catch {
    // fallback
  }
  return undefined;
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
