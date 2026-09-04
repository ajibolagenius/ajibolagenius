import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCvData } from "@/lib/cv-data";

export const revalidate = 300;

export async function GET() {
  const supabase = await createClient();

  const [{ data: projects }, { data: notes }, { personalInfo }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id, slug, name, category, kind, tags, year, description")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("blog_posts")
        .select("id, slug, title, category, date, read_time, excerpt, tags")
        .eq("published", true)
        .order("date", { ascending: false }),
      getCvData(),
    ]);

  return NextResponse.json(
    {
      projects: projects ?? [],
      notes: notes ?? [],
      email: personalInfo?.email ?? null,
      social: personalInfo?.social ?? {},
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
