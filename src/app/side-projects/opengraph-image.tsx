import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadAvatarSrc,
} from "@/lib/og-template";

export const alt = "Side Projects — Ajibola Akelebe";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const supabase = await createClient();
  const [{ count }, { data: info }] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("kind", "side"),
    supabase.from("personal_info").select("*").eq("id", 1).single(),
  ]);
  const avatarSrc = await loadAvatarSrc(
    (info as { avatar_url?: string | null } | null)?.avatar_url,
  );

  return new ImageResponse(
    (
      <OgShell
        label={count ? `${count} Side Projects` : "Side Projects"}
        title="Side Projects"
        subtitle="Personal experiments and works in progress — things I build outside of client work."
        avatarSrc={avatarSrc}
        footerLeft="Experiments & open source"
        siteHost={getSiteHost()}
      />
    ),
    size,
  );
}
