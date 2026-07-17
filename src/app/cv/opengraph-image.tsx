import { ImageResponse } from "next/og";
import { getCvData } from "@/lib/cv-data";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadAvatarSrc,
} from "@/lib/og-template";

export const alt = "CV — Ajibola Akelebe";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const { personalInfo, experience } = await getCvData();
  const avatarSrc = await loadAvatarSrc(personalInfo?.avatar_url);

  const name = personalInfo?.name ?? "Ajibola Akelebe";
  const latestRole = experience?.[0];
  const subtitle = latestRole
    ? `${latestRole.role_title} · ${latestRole.company} — 5+ years experience`
    : "5+ years experience";

  return new ImageResponse(
    (
      <OgShell
        label="Curriculum Vitae"
        title={name}
        subtitle={subtitle}
        avatarSrc={avatarSrc}
        tags={["Work History", "Education", "Expertise"]}
        footerLeft={personalInfo?.availability ?? "Available for roles"}
        siteHost={getSiteHost()}
      />
    ),
    size,
  );
}
