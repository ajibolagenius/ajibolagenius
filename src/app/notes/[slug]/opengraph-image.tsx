import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadImageSrc,
} from "@/lib/og-template";
import { siteUrl } from "@/lib/site-url";
import type { Note } from "@/types/note";

export const alt = "Note — Ajibola Akelebe";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const note = data as Note | null;

  if (!note) {
    return new ImageResponse(
      (
        <OgShell
          label="Note"
          title="Note Not Found"
          footerLeft="Notes & Writing"
          siteHost={getSiteHost()}
          isDark={true}
        />
      ),
      size,
    );
  }

  const rawImage = note.og_image;
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${siteUrl}${rawImage}`
    : undefined;

  const imageSrc = imageUrl ? await loadImageSrc(imageUrl) : undefined;
  const tags = note.tags?.slice(0, 3) ?? [];

  return new ImageResponse(
    (
      <OgShell
        label={note.category || "Note & Article"}
        title={note.title}
        subtitle={note.excerpt || note.meta_description}
        imageSrc={imageSrc}
        tags={tags}
        footerLeft={
          note.date && note.read_time
            ? `${note.date} • ${note.read_time}`
            : "Notes & Writing"
        }
        siteHost={getSiteHost()}
        isDark={true}
      />
    ),
    size,
  );
}
