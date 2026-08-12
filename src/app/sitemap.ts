import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";
import { projectHref } from "@/lib/project-kind";

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
    // Indexable, linked from the footer, and previously missing here.
    { url: `${siteUrl}/licenses`, changeFrequency: "yearly", priority: 0.2 },
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
