import { ImageResponse } from "next/og";
import { getCvData } from "@/lib/cv-data";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadAvatarSrc,
} from "@/lib/og-template";

export const alt = "Ajibola Akelebe — Portfolio";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const { personalInfo } = await getCvData();
  const avatarSrc = await loadAvatarSrc(personalInfo?.avatar_url);

  const name = personalInfo?.name ?? "Ajibola Akelebe";
  const role = personalInfo?.role ?? "Full-Stack · Design · Educator";
  const tagline = personalInfo?.tagline ?? "Design & Engineering.";
  const taglineSuffix = personalInfo?.tagline_suffix ?? "No Boundaries.";

  return new ImageResponse(
    (
      <OgShell
        label={role}
        title={name}
        subtitle={`${tagline} ${taglineSuffix}`}
        avatarSrc={avatarSrc}
        footerLeft="Software Engineer Portfolio & Case Studies"
        siteHost={getSiteHost()}
      />
    ),
    size,
  );
}
