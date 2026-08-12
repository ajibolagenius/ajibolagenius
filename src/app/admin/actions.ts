"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assertOwner } from "@/lib/auth-guard";
import type { ProjectInput } from "@/types/project";
import type { SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";

const MAX_SCREENSHOT_WIDTH = 1920;
const SCREENSHOT_QUALITY = 80;

function parseListField(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function projectInputFromForm(formData: FormData): ProjectInput {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    label: String(formData.get("label") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    kind: String(formData.get("kind") ?? "client").trim(),
    status: String(formData.get("status") ?? "live").trim(),
    tags: parseListField(formData.get("tags")),
    type: String(formData.get("type") ?? "dev").trim(),
    featured: formData.get("featured") === "on",
    live_url: String(formData.get("live_url") ?? "#").trim(),
    github_url: String(formData.get("github_url") ?? "#").trim(),
    problem: String(formData.get("problem") ?? "").trim(),
    solution: String(formData.get("solution") ?? "").trim(),
    role_title: String(formData.get("role_title") ?? "").trim(),
    duration: String(formData.get("duration") ?? "").trim(),
    year: String(formData.get("year") ?? "").trim(),
    tech_details: parseListField(formData.get("tech_details")).map((name) => ({
      name,
    })),
    screenshots: parseListField(formData.get("screenshots")),
    showcase_type: String(formData.get("showcase_type") ?? "").trim() || null,
  };
}

/**
 * Purge every surface that renders project data.
 *
 * `/` and `/cv` were previously never revalidated on a project mutation, so
 * publishing a featured project didn't reach the homepage reel (and un-
 * featuring one left it visible) until the 60s window lapsed.
 *
 * Pass every slug the project has been known by — on a slug change or a
 * delete, the OLD detail path also has to be purged or it keeps serving from
 * cache.
 */
function revalidateProjectSurfaces(...slugs: (string | null | undefined)[]) {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/cv");
  revalidatePath("/projects");
  revalidatePath("/sandbox");
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/projects/${slug}`);
    revalidatePath(`/sandbox/${slug}`);
  }
}

export async function createProject(formData: FormData) {
  const supabase = await assertOwner();
  const input = projectInputFromForm(formData);

  const { error } = await supabase.from("projects").insert(input);
  if (error) throw new Error(error.message);

  revalidateProjectSurfaces(input.slug);
  redirect("/admin");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await assertOwner();
  const input = projectInputFromForm(formData);

  // Read the current slug first so a rename purges the path it used to live at.
  const { data: existing } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("projects").update(input).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateProjectSurfaces(input.slug, existing?.slug);
  redirect("/admin");
}

export async function uploadProjectScreenshot(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file provided" };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are supported" };
  }

  let supabase: SupabaseClient;
  try {
    supabase = await assertOwner();
  } catch {
    return { error: "Unauthorized" };
  }
  const path = `${crypto.randomUUID()}.webp`;

  let optimized: Buffer;
  try {
    const inputBuffer = Buffer.from(await file.arrayBuffer());
    optimized = await sharp(inputBuffer)
      .rotate()
      .resize({ width: MAX_SCREENSHOT_WIDTH, withoutEnlargement: true })
      .webp({ quality: SCREENSHOT_QUALITY })
      .toBuffer();
  } catch {
    return { error: "Failed to process image" };
  }

  const { error } = await supabase.storage
    .from("project-screenshots")
    .upload(path, optimized, { contentType: "image/webp" });

  if (error) return { error: error.message };

  const { data } = supabase.storage
    .from("project-screenshots")
    .getPublicUrl(path);

  return { url: data.publicUrl };
}

export async function toggleFeatured(id: string, featured: boolean) {
  const supabase = await assertOwner();
  const { error } = await supabase
    .from("projects")
    .update({ featured })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidateProjectSurfaces();
}

export async function deleteProject(id: string) {
  const supabase = await assertOwner();

  // Fetch the slug before the row is gone, or its detail path keeps serving
  // a deleted project from the cache.
  const { data: existing } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateProjectSurfaces(existing?.slug);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
