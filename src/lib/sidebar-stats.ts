import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { experienceLabel } from "@/lib/experience-span";
import { LISTED_KINDS } from "@/lib/project-kind";

/**
 * The derived "proof" figures (years, companies, projects). Named for the
 * sidebar that first showed them; the homepage hero and work section read
 * them now.
 *
 * Each figure is derived, and one that can't be computed is null/0 so the
 * caller omits it — never a hardcoded fallback. `cache()` dedupes within a
 * request.
 */

export type SidebarStats = {
  /** e.g. "7 years experience", or null when no entry carries a parseable year. */
  yearsLabel: string | null;
  companyCount: number;
  /** Listed projects; null when the count is unavailable. */
  projectCount: number | null;
};

export const getSidebarStats = cache(async (): Promise<SidebarStats> => {
  const supabase = await createClient();

  const [{ data: entries }, { count }] = await Promise.all([
    // Only the two columns the figures are derived from.
    supabase.from("experience_entries").select("company, start_date"),
    // head: true fetches the count only — no rows cross the wire. Scoped to
    // LISTED_KINDS so this can never disagree with what /projects lists.
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .in("kind", LISTED_KINDS),
  ]);

  const rows = entries ?? [];

  return {
    yearsLabel: experienceLabel(rows),
    companyCount: new Set(rows.map((row) => row.company).filter(Boolean)).size,
    projectCount: count ?? null,
  };
});
