"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import {
  X,
  UploadSimple,
  Spinner,
  ArrowLeft,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { uploadProjectScreenshot } from "@/app/admin/actions";

export function ScreenshotsInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addUrls = (raw: string) => {
    const parsed = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parsed.length === 0) return;
    setUrls((prev) => Array.from(new Set([...prev, ...parsed])));
  };

  const handleUrlChange = (value: string) => {
    if (value.includes(",")) {
      addUrls(value);
      setDraft("");
      return;
    }
    setDraft(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addUrls(draft);
      setDraft("");
    }
  };

  const removeUrl = (url: string) => {
    setUrls((prev) => prev.filter((u) => u !== url));
  };

  const moveUrl = (index: number, direction: -1 | 1) => {
    setUrls((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndex === null || dragIndex === index) return;
    setUrls((prev) => {
      if (dragIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadProjectScreenshot(formData);
        if ("error" in result) {
          setError(result.error);
          continue;
        }
        uploaded.push(result.url);
      }
      if (uploaded.length > 0) {
        setUrls((prev) => Array.from(new Set([...prev, ...uploaded])));
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={urls.join(", ")} />

      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {urls.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDragEnd={handleDragEnd}
              className={`group relative aspect-video cursor-grab overflow-hidden rounded-md border border-neutral-300 active:cursor-grabbing dark:border-neutral-700 ${
                dragIndex === index ? "opacity-50" : ""
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeUrl(url)}
                aria-label="Remove screenshot"
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={12} weight="bold" />
              </button>
              <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => moveUrl(index, -1)}
                  disabled={index === 0}
                  aria-label="Move screenshot earlier"
                  className="rounded-full bg-black/60 p-1 text-white disabled:opacity-40"
                >
                  <ArrowLeft size={12} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => moveUrl(index, 1)}
                  disabled={index === urls.length - 1}
                  aria-label="Move screenshot later"
                  className="rounded-full bg-black/60 p-1 text-white disabled:opacity-40"
                >
                  <ArrowRight size={12} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => handleUrlChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (draft) {
              addUrls(draft);
              setDraft("");
            }
          }}
          placeholder="Paste screenshot URL(s), comma separated"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {uploading ? (
            <Spinner size={14} weight="bold" className="animate-spin" />
          ) : (
            <UploadSimple size={14} weight="bold" />
          )}
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
