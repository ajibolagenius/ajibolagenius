"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr";
import { NoteCard } from "@/components/note-card";
import type { Note } from "@/types/note";

export function NotesList({ initialNotes }: { initialNotes: Note[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialNotes.forEach((n) => {
      if (n.category) cats.add(n.category);
    });
    return Array.from(cats);
  }, [initialNotes]);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialNotes.filter((note) => {
      const matchesCat =
        selectedCategory === "all" ||
        note.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCat) return false;
      if (!q) return true;

      const titleMatch = note.title.toLowerCase().includes(q);
      const excerptMatch = note.excerpt?.toLowerCase().includes(q);
      const tagMatch = note.tags?.some((t) => t.toLowerCase().includes(q));

      return titleMatch || excerptMatch || tagMatch;
    });
  }, [initialNotes, query, selectedCategory]);

  return (
    <div className="flex flex-col gap-6">
      {/* Controls: Search and category filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-sm px-2.5 py-1 font-mono text-body-xs transition-colors ${
              selectedCategory === "all"
                ? "bg-accent text-cream font-medium"
                : "border border-ink/10 text-ink/60 hover:border-ink/30 hover:text-ink"
            }`}
          >
            All ({initialNotes.length})
          </button>
          {categories.map((cat) => {
            const count = initialNotes.filter(
              (n) => n.category.toLowerCase() === cat.toLowerCase(),
            ).length;
            const isSelected =
              selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-sm px-2.5 py-1 font-mono text-body-xs transition-colors ${
                  isSelected
                    ? "bg-accent text-cream font-medium"
                    : "border border-ink/10 text-ink/60 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <MagnifyingGlass
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-ink/40"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes & tags…"
            className="w-full rounded-sm border border-ink/15 bg-panel/40 py-1.5 pr-8 pl-9 font-mono text-body-xs outline-none transition-colors focus:border-accent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-ink/40 hover:text-ink"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Results grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 py-16 text-center">
          <p className="text-body-m font-medium text-ink">No notes found</p>
          <p className="mt-1 text-body-s text-ink/50">
            Try adjusting your search query or category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setQuery("");
            }}
            className="mt-4 border border-ink/20 px-3 py-1.5 font-mono text-body-xs text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
