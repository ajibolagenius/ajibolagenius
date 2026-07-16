import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCvData } from "@/lib/cv-data";

export const alt = "CV — Ajibola Akelebe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#fbf5ef";
const INK = "#1a0a06";
const ACCENT = "#e64301";
const PANEL = "#f0e9e3";

export default async function Image() {
  const [{ personalInfo, experience }, avatarData] = await Promise.all([
    getCvData(),
    readFile(join(process.cwd(), "public/avatar_3d.png"), "base64"),
  ]);

  const name = personalInfo?.name ?? "Ajibola Akelebe";
  const role = personalInfo?.role ?? "FULL-STACK · DESIGN · EDUCATOR";
  const location = personalInfo?.location;
  const availability = personalInfo?.availability;
  const yearsLabel = "5+ years experience";
  const latestRole = experience?.[0];
  const avatarSrc = `data:image/png;base64,${avatarData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: CREAM,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 14,
            height: "100%",
            background: ACCENT,
            display: "flex",
          }}
        />

        {/* Left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 420,
            height: "100%",
            padding: "72px 56px",
            background: PANEL,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <img
              src={avatarSrc}
              width={104}
              height={104}
              style={{ borderRadius: 999, objectFit: "cover" }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: INK,
                  lineHeight: 1.15,
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: ACCENT,
                  textTransform: "uppercase",
                  lineHeight: 1.4,
                }}
              >
                {role}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {location && (
              <span style={{ fontSize: 22, color: INK, opacity: 0.6 }}>
                {location}
              </span>
            )}
            {availability && (
              <span style={{ fontSize: 22, color: INK, opacity: 0.6 }}>
                {availability}
              </span>
            )}
          </div>
        </div>

        {/* Right column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "72px 64px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 3,
                color: ACCENT,
                textTransform: "uppercase",
              }}
            >
              Curriculum Vitae
            </span>
            <span style={{ fontSize: 32, color: INK, opacity: 0.7 }}>
              {yearsLabel}
            </span>
          </div>

          {latestRole && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                borderTop: `2px solid ${PANEL}`,
                paddingTop: 28,
              }}
            >
              <span style={{ fontSize: 20, color: INK, opacity: 0.5 }}>
                Currently
              </span>
              <span style={{ fontSize: 30, fontWeight: 700, color: INK }}>
                {latestRole.role_title}
              </span>
              <span style={{ fontSize: 24, color: INK, opacity: 0.6 }}>
                {latestRole.company}
              </span>
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
