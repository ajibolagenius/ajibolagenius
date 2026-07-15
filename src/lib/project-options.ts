import { createClient } from "@/lib/supabase/server";

const DEFAULT_TYPES = ["dev", "design", "mobile", "writing"];

function splitValues(values: (string | null | undefined)[]): string[] {
  return Array.from(
    new Set(
      values
        .flatMap((v) => (v ? v.split(",").map((s) => s.trim()) : []))
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

export async function getProjectFieldOptions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("category, label, type, role_title, duration, year");

  const rows = data ?? [];

  return {
    categories: splitValues(rows.map((r) => r.category)),
    labels: splitValues(rows.map((r) => r.label)),
    types: Array.from(
      new Set([...DEFAULT_TYPES, ...splitValues(rows.map((r) => r.type))]),
    ).sort((a, b) => a.localeCompare(b)),
    roles: splitValues(rows.map((r) => r.role_title)),
    durations: splitValues(rows.map((r) => r.duration)),
    years: splitValues(rows.map((r) => r.year)).sort().reverse(),
  };
}

export type ProjectFieldOptions = Awaited<
  ReturnType<typeof getProjectFieldOptions>
>;
