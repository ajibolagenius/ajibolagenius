import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadAvatarSrc,
} from "@/lib/og-template";
import { LISTED_KINDS } from "@/lib/project-kind";

export const alt = "Projects — Ajibola Akelebe";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const supabase = await createClient();
  const [{ count }, { data: info }] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .in("kind", LISTED_KINDS),
    supabase.from("personal_info").select("*").eq("id", 1).single(),
  ]);
  const avatarSrc = await loadAvatarSrc(
    (info as { avatar_url?: string | null } | null)?.avatar_url,
  );

  return new ImageResponse(
    (
      <OgShell
        label={count ? `${count} Selected Projects` : "Selected Projects"}
        title="Projects"
        subtitle="Everything I've designed, built, and shipped — client work and side projects."
        avatarSrc={avatarSrc}
        tags={["Case Studies", "Production Apps", "Side Projects"]}
        footerLeft="Client work & side projects"
        siteHost={getSiteHost()}
        isDark={true}
      />
    ),
    size,
  );
}
