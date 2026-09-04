import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/types/note";

export const getNotes = cache(async (): Promise<Note[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  if (error || !data) return [];
  return data as Note[];
});

export const getFeaturedNotes = cache(
  async (limit: number = 3): Promise<Note[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("date", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as Note[];
  },
);

export const getNote = cache(async (slug: string): Promise<Note | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Note;
});

export const getNavigationNotes = cache(async (slug: string) => {
  const notes = await getNotes();
  if (!notes || notes.length === 0) return { prev: null, next: null };

  const idx = notes.findIndex((n) => n.slug === slug);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? notes[idx - 1] : null,
    next: idx < notes.length - 1 ? notes[idx + 1] : null,
  };
});

/**
 * Normalizes rich-text HTML so browsers can wrap words naturally:
 *  - Replaces non-breaking spaces (&nbsp;) with standard spaces.
 *  - Collapses empty paragraphs (<p></p>).
 */
export function formatNoteBody(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/<p>\s*<\/p>/g, "");
}

/**
 * Normalizes cover image URLs so external hosts and page links don't break Next.js image loading.
 */
export function resolveNoteCoverImage(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.includes("unsplash.com/photos/")) {
    if (trimmed.includes("Pu27coP2jPk")) {
      return "https://images.unsplash.com/photo-1774901128192-10e5b4921888?auto=format&fit=crop&q=80&w=1200";
    }
    const id = trimmed.split("/").pop()?.split("-").pop();
    if (id) {
      return `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1200`;
    }
  }

  return trimmed;
}
