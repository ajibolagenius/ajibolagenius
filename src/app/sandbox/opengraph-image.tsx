import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadAvatarSrc,
} from "@/lib/og-template";

export const alt = "Sandbox — Ajibola Akelebe";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const supabase = await createClient();
  const [{ count }, { data: info }] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("kind", "sandbox"),
    supabase.from("personal_info").select("*").eq("id", 1).single(),
  ]);
  const avatarSrc = await loadAvatarSrc(
    (info as { avatar_url?: string | null } | null)?.avatar_url,
  );

  return new ImageResponse(
    (
      <OgShell
        label={count ? `${count} Sandbox Builds` : "Sandbox"}
        title="Sandbox"
        subtitle="Mini projects and quick tests — small builds where I try out ideas."
        avatarSrc={avatarSrc}
        tags={["Mini Builds", "Quick Tests", "Experiments"]}
        footerLeft="Mini projects & tests"
        siteHost={getSiteHost()}
        isDark={true}
      />
    ),
    size,
  );
}
