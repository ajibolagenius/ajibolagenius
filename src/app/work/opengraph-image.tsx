import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadAvatarSrc,
} from "@/lib/og-template";

export const alt = "Work — Ajibola Akelebe";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const supabase = await createClient();
  const [{ count }, { data: info }] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("kind", "client"),
    supabase.from("personal_info").select("*").eq("id", 1).single(),
  ]);
  const avatarSrc = await loadAvatarSrc(
    (info as { avatar_url?: string | null } | null)?.avatar_url,
  );

  return new ImageResponse(
    (
      <OgShell
        label={count ? `${count} Selected Projects` : "Selected Projects"}
        title="Work"
        subtitle="A collection of projects I've designed, built, and shipped."
        avatarSrc={avatarSrc}
        tags={["Case Studies", "Production Apps", "Web Design"]}
        footerLeft="Commercial & client work"
        siteHost={getSiteHost()}
        isDark={true}
      />
    ),
    size,
  );
}
