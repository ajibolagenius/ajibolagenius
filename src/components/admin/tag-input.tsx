"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function TagInput({
  name,
  defaultValue,
  placeholder,
  suggestions,
}: {
  name: string;
  defaultValue?: string[];
  placeholder?: string;
  suggestions?: string[];
}) {
  const [tags, setTags] = useState<string[]>(defaultValue ?? []);
  const [draft, setDraft] = useState("");
  const listId = useId();

  const addFromDraft = (raw: string) => {
    const parsed = parseTags(raw);
    if (parsed.length === 0) return;
    setTags((prev) => Array.from(new Set([...prev, ...parsed])));
  };

  const handleChange = (value: string) => {
    if (value.includes(",")) {
      addFromDraft(value);
      setDraft("");
      return;
    }
    setDraft(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFromDraft(draft);
      setDraft("");
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <input type="hidden" name={name} value={tags.join(", ")} />
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-neutral-300 px-2 py-1.5 focus-within:border-neutral-900 dark:border-neutral-700 dark:focus-within:border-neutral-100">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium dark:bg-neutral-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <X size={10} weight="bold" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (draft) {
              addFromDraft(draft);
              setDraft("");
            }
          }}
          placeholder={tags.length === 0 ? placeholder : undefined}
          list={suggestions ? listId : undefined}
          className="min-w-[8ch] flex-1 bg-transparent py-0.5 text-sm outline-none"
        />
      </div>
      {suggestions && suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions
            .filter((s) => !tags.includes(s))
            .map((s) => (
              <option key={s} value={s} />
            ))}
        </datalist>
      )}
    </div>
  );
}
