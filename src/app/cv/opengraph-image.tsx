import { ImageResponse } from "next/og";
import { getCvData } from "@/lib/cv-data";
import { experienceLabel } from "@/lib/experience-span";
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

  // Derived, like the figure on the page itself. This card was the last place
  // still claiming a hardcoded "5+ years", two years behind the data — and the
  // most public one, since it is what a shared link renders.
  const yearsLabel = experienceLabel(experience);

  const subtitle = [
    latestRole && `${latestRole.role_title} · ${latestRole.company}`,
    yearsLabel,
  ]
    .filter(Boolean)
    .join(" — ");

  return new ImageResponse(
    (
      <OgShell
        label="Curriculum Vitae"
        title={name}
        subtitle={subtitle || "Work history and experience"}
        avatarSrc={avatarSrc}
        // Mirrors the sections the document actually carries — Selected
        // Projects and Certifications were added and never reflected here.
        tags={["Work History", "Projects", "Education", "Certifications"]}
        footerLeft={personalInfo?.availability ?? "Available for roles"}
        siteHost={getSiteHost()}
      />
    ),
    size,
  );
}
