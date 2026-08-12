import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { projectHref } from "@/lib/project-kind";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, created_at, kind");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    // Never list a redirecting URL here — /work and /side-projects 301 now.
    { url: `${siteUrl}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/sandbox`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/cv`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).map(
    (project) => ({
      url: `${siteUrl}${projectHref(project)}`,
      lastModified: project.created_at ?? undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...projectRoutes];
}
