"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { X, UploadSimple, Spinner } from "@phosphor-icons/react/dist/ssr";
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
          {urls.map((url) => (
            <div
              key={url}
              className="group relative aspect-video overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-700"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeUrl(url)}
                aria-label="Remove screenshot"
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={12} weight="bold" />
              </button>
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
