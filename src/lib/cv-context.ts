import { getCvData } from "@/lib/cv-data";
import { createClient } from "@/lib/supabase/server";
import { kindMeta } from "@/lib/project-kind";

type ContextProject = {
  name: string;
  description: string;
  live_url: string;
  year: string;
  kind: string;
};

/**
 * Plain-text grounding context for the AI assistant, built fresh per request
 * from the same Supabase-backed data the site itself renders. Kept as flat
 * `# Heading` sections rather than JSON: the data set is small (a handful of
 * rows per table) and prose headings are cheaper for the model to parse than
 * a schema it has to be told about.
 *
 * Deliberately omits `personalInfo.email` / `.phone` — visitors asking for
 * contact details should be pointed at the on-site contact form, not have
 * that PII forwarded to a third-party model provider.
 */
export async function buildAssistantContext(): Promise<string> {
  const supabase = await createClient();

  const [
    { personalInfo: info, skills, experience, education, certifications, languages },
    { data: projectRows },
  ] = await Promise.all([
    getCvData(),
    supabase
      .from("projects")
      .select("name, description, live_url, year, kind")
      .order("created_at", { ascending: false }),
  ]);

  const projects = (projectRows ?? []) as ContextProject[];
  const sections: string[] = [];

  if (info) {
    sections.push(
      [
        "# About",
        `Name: ${info.name}`,
        info.role && `Role: ${info.role}`,
        info.location && `Location: ${info.location}`,
        info.availability && `Availability: ${info.availability}`,
        info.description && `Summary: ${info.description}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  if (skills.length > 0) {
    sections.push(`# Skills\n${skills.map((s) => s.name).join(", ")}`);
  }

  if (experience.length > 0) {
    sections.push(
      `# Experience\n${experience
        .map((e) => {
          const bullets = e.bullets?.length
            ? `\n${e.bullets.map((b) => `  - ${b}`).join("\n")}`
            : "";
          return `- ${e.company} — ${e.role_title} (${e.employment_type}, ${e.start_date} to ${e.end_date})${e.body ? `\n  ${e.body}` : ""}${bullets}`;
        })
        .join("\n")}`,
    );
  }

  if (projects.length > 0) {
    sections.push(
      `# Projects\n${projects
        .map((p) => {
          const url = p.live_url && p.live_url !== "#" ? ` (${p.live_url})` : "";
          return `- ${p.name} [${kindMeta(p.kind).label}${p.year ? `, ${p.year}` : ""}]${url}: ${p.description}`;
        })
        .join("\n")}`,
    );
  }

  if (education.length > 0) {
    sections.push(
      `# Education\n${education
        .map((e) => `- ${e.degree}, ${e.school} (${e.year})${e.description ? ` — ${e.description}` : ""}`)
        .join("\n")}`,
    );
  }

  if (certifications.length > 0) {
    sections.push(
      `# Certifications\n${certifications
        .map((c) => `- ${c.title}${c.issuer ? ` — ${c.issuer}` : ""}`)
        .join("\n")}`,
    );
  }

  if (languages.length > 0) {
    sections.push(
      `# Languages\n${languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}`,
    );
  }

  return sections.join("\n\n");
}
