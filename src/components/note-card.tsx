"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { useRouteTransition } from "@/hooks/use-route-transition";
import type { Note } from "@/types/note";
import { track } from "@/lib/analytics";

export function NoteCard({
  note,
  compact = false,
}: {
  note: Note;
  compact?: boolean;
}) {
  const navigate = useRouteTransition();
  const href = `/notes/${note.slug}`;

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }
        e.preventDefault();
        track("note_opened", {
          note_slug: note.slug,
          note_category: note.category ?? null,
          card_variant: compact ? "compact" : "standard",
        });
        navigate(href);
      }}
      style={{ viewTransitionName: `note-${note.slug}` } as CSSProperties}
      className="group relative flex flex-col justify-between border border-ink/10 bg-panel/30 p-5 transition-[border-color,background-color] duration-[var(--dur-2)] hover:border-ink/30 hover:bg-panel/60 sm:p-6"
    >
      <div className="flex flex-col gap-3">
        {/* Meta row: Category + Date + Read Time */}
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-body-xs text-ink/50">
          <div className="flex items-center gap-2">
            {note.category && (
              <span className="rounded-sm bg-accent/10 px-1.5 py-0.5 font-medium text-accent">
                {note.category}
              </span>
            )}
            {note.date && <span>{note.date}</span>}
          </div>
          {note.read_time && <span>{note.read_time}</span>}
        </div>

        {/* Title */}
        <h3 className="font-display text-body-l font-normal text-ink transition-colors duration-[var(--dur-2)] group-hover:text-accent sm:text-h3">
          {note.title}
        </h3>

        {/* Excerpt */}
        {!compact && note.excerpt && (
          <p className="line-clamp-3 text-body-s text-ink/70">
            {note.excerpt}
          </p>
        )}
      </div>

      {/* Footer row: Tags + Arrow indicator */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-ink/5 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {note.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] text-ink/40"
            >
              #{tag}
            </span>
          ))}
        </div>

        <span className="inline-flex items-center gap-1 text-body-xs font-medium text-ink/60 transition-colors group-hover:text-accent">
          Read
          <ArrowUpRight
            size={13}
            className="transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
