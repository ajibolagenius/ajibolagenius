"use client";

import Link from "next/link";
import { HomeSection } from "@/components/cv/home-section";
import { useLanguage } from "@/lib/i18n";
import type { Note } from "@/types/note";

// `date` is a calendar date ("2026-05-20"); formatting in UTC keeps it from
// sliding to the previous day west of Greenwich.
const monthYear = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : monthYear.format(parsed);
}

export function FeaturedNotes({ notes }: { notes: Note[] }) {
  const { t } = useLanguage();
  if (!notes || notes.length === 0) return null;

  return (
    <HomeSection id="notes" label={t.labels.writing} sub={t.labels.writingSub}>
      <div className="border-t border-ink/10">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notes/${note.slug}`}
            className="group grid gap-x-6 gap-y-1 border-b border-ink/10 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
          >
            <span className="font-display text-[1.3125rem] leading-snug transition-colors duration-[var(--dur-2)] group-hover:text-accent">
              {note.title}
            </span>
            <span className="font-mono text-body-xs text-ink/50">
              {[formatDate(note.date), note.read_time].filter(Boolean).join(" · ")}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/notes"
        className="mt-10 inline-block text-body-s underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {t.actions.allNotes} →
      </Link>
    </HomeSection>
  );
}
