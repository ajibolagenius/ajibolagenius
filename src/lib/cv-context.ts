import { getCvData } from "@/lib/cv-data";
import { createClient } from "@/lib/supabase/server";
import { kindMeta } from "@/lib/project-kind";
import { getLatestGitHubActivity } from "@/lib/github-activity";

interface ContextProject {
  slug: string;
  name: string;
  description: string;
  kind: string;
  category: string;
  tags?: string[];
  problem?: string;
  solution?: string;
  live_url?: string;
  github_url?: string;
  year?: string;
}

interface ContextNote {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  tags?: string[];
  read_time?: string;
}

/**
 * Plain-text grounding context for the AI assistant, built fresh per request
 * from the same Supabase-backed data the site itself renders.
 *
 * Includes deep project case studies (problems, solutions, architecture),
 * published technical writings (notes), real-time live activity, and current
 * page context so the AI can serve as a comprehensive portfolio concierge.
 */
export async function buildAssistantContext(currentPath?: string): Promise<string> {
  const supabase = await createClient();

  const [
    { personalInfo: info, skills, experience, education, certifications, languages },
    { data: projectRows },
    { data: noteRows },
  ] = await Promise.all([
    getCvData(),
    supabase
      .from("projects")
      .select("slug, name, description, kind, category, tags, problem, solution, live_url, github_url, year")
      .order("created_at", { ascending: false }),
    supabase
      .from("blog_posts")
      .select("slug, title, category, excerpt, tags, read_time")
      .eq("published", true)
      .order("date", { ascending: false }),
  ]);

  const projects = (projectRows ?? []) as ContextProject[];
  const notes = (noteRows ?? []) as ContextNote[];
  const sections: string[] = [];

  // 1. Current Page Context (if visitor is browsing a specific route)
  if (currentPath) {
    let pageNote = `Current visitor page: ${currentPath}`;
    if (currentPath.startsWith("/projects/")) {
      const slug = currentPath.replace("/projects/", "").trim();
      const currentProj = projects.find((p) => p.slug === slug);
      if (currentProj) {
        pageNote += `\nVisitor is actively inspecting the project "${currentProj.name}". Be ready to answer deep technical, design, or architectural questions about it.`;
      }
    } else if (currentPath.startsWith("/notes/")) {
      const slug = currentPath.replace("/notes/", "").trim();
      const currentPost = notes.find((n) => n.slug === slug);
      if (currentPost) {
        pageNote += `\nVisitor is actively reading the article "${currentPost.title}". Be ready to discuss the concepts and background covered in this writing.`;
      }
    }
    sections.push(`# Visitor Context\n${pageNote}`);
  }

  // 2. About Ajibola
  if (info) {
    sections.push(
      [
        "# About Ajibola Akelebe",
        `Name: ${info.name}`,
        info.role && `Headline: ${info.role}`,
        info.location && `Location: ${info.location}`,
        info.availability && `Availability: ${info.availability}`,
        info.description && `Summary: ${info.description}`,
        info.tagline && `Tagline: ${info.tagline}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  // 3. Real-time Live Activity & Current Role
  const liveActivity = await getLatestGitHubActivity(info?.social?.github).catch(() => null);
  const activeJob =
    experience.find((e) => e.end_date.toLowerCase() === "present") ||
    experience[0];

  const liveLines: string[] = ["# Live Status (Right Now)"];
  if (activeJob) {
    liveLines.push(
      `Current Role: ${activeJob.role_title} at ${activeJob.company} (${activeJob.employment_type}, since ${activeJob.start_date})`,
    );
  }
  liveLines.push("Location: Lagos, Nigeria (West Africa Time, UTC+1)");
  if (liveActivity) {
    liveLines.push(
      `Latest Public Commit: ${liveActivity.repoShort} — "${liveActivity.message}" (${liveActivity.relativeTime})`,
    );
  }
  sections.push(liveLines.join("\n"));

  // 4. Core Skills
  if (skills.length > 0) {
    sections.push(`# Technical Skills & Specializations\n${skills.map((s) => s.name).join(", ")}`);
  }

  // 5. Work & Teaching Experience
  if (experience.length > 0) {
    sections.push(
      `# Experience & Teaching History\n${experience
        .map((e) => {
          const bullets = e.bullets?.length
            ? `\n${e.bullets.map((b) => `  - ${b}`).join("\n")}`
            : "";
          return `- ${e.company} — ${e.role_title} (${e.employment_type}, ${e.start_date} to ${e.end_date})${e.body ? `\n  ${e.body}` : ""}${bullets}`;
        })
        .join("\n")}`,
    );
  }

  // 6. Deep Project Case Studies
  if (projects.length > 0) {
    sections.push(
      `# Project Case Studies & Engineering Work\n${projects
        .map((p) => {
          const kindLabel = kindMeta(p.kind).label;
          const tagsStr = p.tags?.length ? ` [Tags: ${p.tags.join(", ")}]` : "";
          const liveUrlStr = p.live_url && p.live_url !== "#" ? ` | Live: ${p.live_url}` : "";
          const githubStr = p.github_url ? ` | GitHub: ${p.github_url}` : "";
          const metaLine = `- ${p.name} (slug: "${p.slug}") [${kindLabel}${p.year ? `, ${p.year}` : ""}]${liveUrlStr}${githubStr}${tagsStr}\n  Description: ${p.description}`;
          const problemLine = p.problem ? `\n  Problem: ${p.problem}` : "";
          const solutionLine = p.solution ? `\n  Architecture & Solution: ${p.solution}` : "";
          return `${metaLine}${problemLine}${solutionLine}`;
        })
        .join("\n\n")}`,
    );
  }

  // 7. Published Technical Writings (Notes)
  if (notes.length > 0) {
    sections.push(
      `# Published Technical Writings & Articles\n${notes
        .map((n) => {
          const tagsStr = n.tags?.length ? ` [Tags: ${n.tags.join(", ")}]` : "";
          const readTimeStr = n.read_time ? ` (${n.read_time})` : "";
          return `- ${n.title} (slug: "${n.slug}"${readTimeStr}) [${n.category}]${tagsStr}\n  Summary: ${n.excerpt}`;
        })
        .join("\n")}`,
    );
  }

  // 8. Education & Certifications
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

  // 9. Navigation Reference
  sections.push(
    `# Internal Site Navigation Links
- Homepage sections: [Featured Work](/#featured-work), [About](/#about), [Experience](/#experience), [Skills](/#skills), [Contact Form](/#connect)
- Projects: Browse all at [/projects](/projects), or individual case studies at /projects/[slug] (e.g. [/projects/zora-market](/projects/zora-market), [/projects/anc](/projects/anc), [/projects/nego-empire](/projects/nego-empire), [/projects/vibe-secure-me](/projects/vibe-secure-me))
- Technical Writing: Browse all at [/notes](/notes), or individual articles at /notes/[slug] (e.g. [/notes/nego-empire-build-story](/notes/nego-empire-build-story), [/notes/how-this-portfolio-was-built](/notes/how-this-portfolio-was-built))
- Standalone Printable CV: [/cv](/cv)
- Experimental Sandbox: [/sandbox](/sandbox)`,
  );

  return sections.join("\n\n");
}
