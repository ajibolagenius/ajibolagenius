import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import {
  OG_SIZE,
  OgShell,
  getSiteHost,
  loadImageSrc,
} from "@/lib/og-template";
import type { Project } from "@/types/project";

export const alt = "Project Case Study — Ajibola Akelebe";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    // Slug is globally unique, so no kind filter is needed.
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const p = project as Project | null;

  if (!p) {
    return new ImageResponse(
      (
        <OgShell
          label="Project"
          title="Project Not Found"
          footerLeft="Case Study"
          siteHost={getSiteHost()}
          isDark={true}
        />
      ),
      size,
    );
  }

  // Load the first screenshot as base64 for reliable Satori rendering
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

  const rawImage = p.screenshots?.[0];
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${siteUrl}${rawImage}`
    : undefined;

  const imageSrc = imageUrl ? await loadImageSrc(imageUrl) : undefined;
  const tags = p.tech_details?.slice(0, 3).map((t) => t.name) ?? [];

  return new ImageResponse(
    (
      <OgShell
        label={p.category || "Case Study"}
        title={p.name}
        subtitle={p.description}
        imageSrc={imageSrc}
        tags={tags}
        footerLeft={`${p.role_title || "Developer"} · ${p.year || "Project"}`}
        siteHost={getSiteHost()}
        isDark={true}
      />
    ),
    size,
  );
}
