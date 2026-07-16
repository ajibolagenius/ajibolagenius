import { createClient } from "@/lib/supabase/server";
import type {
  Certification,
  EducationEntry,
  ExperienceEntry,
  Language,
  PersonalInfo,
  Recommendation,
  SiteSection,
  Skill,
} from "@/types/cv";

/** Section order used when site_sections has not been configured yet. */
export const DEFAULT_SECTION_ORDER = [
  "featured-work",
  "about",
  "experience",
  "education",
  "certifications",
  "skills",
  "languages",
  "recommendations",
  "connect",
];

export async function getCvData() {
  const supabase = await createClient();

  const [
    personalInfo,
    skills,
    experience,
    education,
    certifications,
    languages,
    recommendations,
    sections,
  ] = await Promise.all([
    supabase.from("personal_info").select("*").eq("id", 1).single(),
    supabase.from("skills").select("*").order("order", { ascending: true }),
    supabase
      .from("experience_entries")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("education_entries")
      .select("*")
      .order("order", { ascending: true }),
    supabase
      .from("certifications")
      .select("*")
      .order("order", { ascending: true }),
    supabase
      .from("languages")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("recommendations")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("site_sections")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  const sectionRows = (sections.data ?? []) as SiteSection[];
  const visibleSections = sectionRows.length
    ? sectionRows.filter((s) => s.visible).map((s) => s.key)
    : DEFAULT_SECTION_ORDER;

  return {
    personalInfo: personalInfo.data as PersonalInfo | null,
    skills: (skills.data ?? []) as Skill[],
    experience: (experience.data ?? []) as ExperienceEntry[],
    education: (education.data ?? []) as EducationEntry[],
    certifications: (certifications.data ?? []) as Certification[],
    languages: (languages.data ?? []) as Language[],
    recommendations: (recommendations.data ?? []) as Recommendation[],
    /** Visible homepage section keys, in configured order. */
    visibleSections,
  };
}
