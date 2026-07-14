import { createClient } from "@/lib/supabase/server";
import type {
  Certification,
  EducationEntry,
  ExperienceEntry,
  Language,
  PersonalInfo,
  Recommendation,
  Skill,
} from "@/types/cv";

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
  ]);

  return {
    personalInfo: personalInfo.data as PersonalInfo | null,
    skills: (skills.data ?? []) as Skill[],
    experience: (experience.data ?? []) as ExperienceEntry[],
    education: (education.data ?? []) as EducationEntry[],
    certifications: (certifications.data ?? []) as Certification[],
    languages: (languages.data ?? []) as Language[],
    recommendations: (recommendations.data ?? []) as Recommendation[],
  };
}
