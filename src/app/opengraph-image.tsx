import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCvData } from "@/lib/cv-data";

export const alt = "Ajibola — Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#fbf5ef";
const INK = "#1a0a06";
const ACCENT = "#e64301";
const PANEL = "#f0e9e3";

export default async function Image() {
  const [{ personalInfo }, avatarData] = await Promise.all([
    getCvData(),
    readFile(join(process.cwd(), "public/avatar.png"), "base64"),
  ]);

  const name = personalInfo?.name ?? "Ajibola Akelebe";
  const role = personalInfo?.role ?? "FULL-STACK · DESIGN · EDUCATOR";
  const tagline = personalInfo?.tagline ?? "Design & Engineering.";
  const taglineSuffix = personalInfo?.tagline_suffix ?? "No Boundaries.";
  const avatarSrc = `data:image/png;base64,${avatarData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: CREAM,
          padding: 80,
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

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <img
            src={avatarSrc}
            width={112}
            height={112}
            style={{ borderRadius: 999, objectFit: "cover" }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 3,
                color: ACCENT,
                textTransform: "uppercase",
              }}
            >
              {role}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 700, color: INK }}>
            {name}
          </span>
          <span style={{ fontSize: 34, color: INK, opacity: 0.65 }}>
            {tagline} {taglineSuffix}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${PANEL}`,
            paddingTop: 28,
          }}
        >
          <span style={{ fontSize: 24, color: INK, opacity: 0.5 }}>
            Software Engineer Portfolio & Case Studies
          </span>
          <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>
            ajibolagenius.vercel.app
          </span>
        </div>
      </div>
    ),
    size,
  );
}
