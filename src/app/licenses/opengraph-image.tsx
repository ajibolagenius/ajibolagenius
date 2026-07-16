import { ImageResponse } from "next/og";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadAvatarSrc,
} from "@/lib/og-template";

export const alt = "Licenses — Ajibola Akelebe";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const avatarSrc = await loadAvatarSrc();

  return new ImageResponse(
    (
      <OgShell
        label="Attribution"
        title="Licenses"
        subtitle="Attribution and licensing for images, icons, and illustrations used on this site."
        avatarSrc={avatarSrc}
        footerLeft="Credits & open-source licenses"
        siteHost={getSiteHost()}
      />
    ),
    size,
  );
}
