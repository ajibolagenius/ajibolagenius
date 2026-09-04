import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadAvatarSrc,
} from "@/lib/og-template";

export const alt = "Notes & Writing — Ajibola Akelebe";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const supabase = await createClient();
  const [{ count }, { data: info }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("personal_info").select("*").eq("id", 1).single(),
  ]);
  const avatarSrc = await loadAvatarSrc(
    (info as { avatar_url?: string | null } | null)?.avatar_url,
  );

  return new ImageResponse(
    (
      <OgShell
        label={count ? `${count} Published Notes` : "Notes & Articles"}
        title="Notes & Writing"
        subtitle="Technical case studies, reflections on craft, and engineering notes on building software."
        avatarSrc={avatarSrc}
        tags={["Engineering", "Architecture", "Case Studies"]}
        footerLeft="Essays & technical case studies"
        siteHost={getSiteHost()}
        isDark={true}
      />
    ),
    size,
  );
}
