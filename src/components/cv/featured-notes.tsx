"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { NoteCard } from "@/components/note-card";
import { SectionHeading } from "@/components/cv/section-heading";
import { useLanguage } from "@/lib/i18n";
import type { Note } from "@/types/note";

export function FeaturedNotes({ notes }: { notes: Note[] }) {
  const { t } = useLanguage();
  if (!notes || notes.length === 0) return null;

  return (
    <section className="reveal flex flex-col gap-6 border-t border-ink/10 pt-12 pb-6 print:hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <SectionHeading id="notes">Recent Notes</SectionHeading>
          <p className="mt-1 text-body-s text-ink/60">
            Case studies and engineering reflections on building resilient software.
          </p>
        </div>
        <Link
          href="/notes"
          className="group inline-flex items-center gap-1.5 font-mono text-body-xs font-medium text-ink transition-colors hover:text-accent"
        >
          {t.actions.allNotes}
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {notes.slice(0, 2).map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </section>
  );
}
