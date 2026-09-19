import { createClient } from "@/lib/supabase/server";

/**
 * The project shape the assistant's tools hand back to the client, where
 * <ProjectMiniCard> renders it. Camel-cased because it crosses into React —
 * the snake_case column names stop at this boundary.
 */
export type ProjectCard = {
  slug: string;
  name: string;
  category: string;
  kind: string;
  description: string;
  tags: string[];
  year?: string;
  liveUrl: string | null;
  githubUrl: string | null;
};

const COLUMNS =
  "slug, name, category, kind, description, tags, year, live_url, github_url";

type Row = {
  slug: string;
  name: string;
  category: string;
  kind: string;
  description: string;
  tags?: string[] | null;
  year?: string;
  live_url?: string | null;
  github_url?: string | null;
};

function toCard(row: Row, tagLimit: number): ProjectCard {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    kind: row.kind,
    description: row.description,
    tags: (row.tags ?? []).slice(0, tagLimit),
    year: row.year,
    liveUrl: row.live_url || null,
    githubUrl: row.github_url || null,
  };
}

/** One project by slug, or null if it doesn't exist or the query fails. */
export async function getProjectCard(
  slug: string,
  tagLimit = 5,
): Promise<ProjectCard | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select(COLUMNS)
      .eq("slug", slug)
      .maybeSingle();

    return data ? toCard(data as Row, tagLimit) : null;
  } catch {
    return null;
  }
}

/**
 * Several projects by slug, returned in the order the slugs were given —
 * the model ranks them, so the DB's ordering is not the one that matters.
 * Unknown slugs are dropped. Never throws; returns [] on failure.
 */
export async function getProjectCards(
  slugs: string[],
  tagLimit = 4,
): Promise<ProjectCard[]> {
  if (slugs.length === 0) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select(COLUMNS)
      .in("slug", slugs);

    const bySlug = new Map((data ?? []).map((row) => [row.slug, row as Row]));
    return slugs
      .map((slug) => bySlug.get(slug))
      .filter((row): row is Row => row !== undefined)
      .map((row) => toCard(row, tagLimit));
  } catch {
    return [];
  }
}
