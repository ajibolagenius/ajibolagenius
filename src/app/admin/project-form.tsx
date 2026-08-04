"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { Project } from "@/types/project";
import type { ProjectFieldOptions } from "@/lib/project-options";
import { TagInput } from "@/components/admin/tag-input";
import { ScreenshotsInput } from "@/components/admin/screenshots-input";

type Draft = Record<string, string>;

let draftCacheKey: string | undefined;
let draftCacheRaw: string | null | undefined;
let draftCacheValue: Draft | null = null;

function getDraftSnapshot(draftKey: string | undefined, project?: Project) {
  if (!draftKey || project) return null;
  try {
    const raw = window.localStorage.getItem(draftKey);
    if (draftCacheKey === draftKey && draftCacheRaw === raw) {
      return draftCacheValue;
    }
    draftCacheKey = draftKey;
    draftCacheRaw = raw;
    draftCacheValue = raw ? (JSON.parse(raw) as Draft) : null;
    return draftCacheValue;
  } catch {
    draftCacheKey = draftKey;
    draftCacheRaw = undefined;
    draftCacheValue = null;
    return null;
  }
}

function subscribeDraft() {
  return () => {};
}

function draftField(draft: Draft | undefined, name: string, fallback?: string) {
  return draft?.[name] ?? fallback;
}

function draftList(draft: Draft | undefined, name: string, fallback?: string[]) {
  if (!draft || draft[name] === undefined) return fallback;
  return draft[name]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100";
const labelClass = "flex flex-col gap-1 text-sm font-medium";

function Datalist({ id, options }: { id: string; options: string[] }) {
  if (options.length === 0) return null;
  return (
    <datalist id={id}>
      {options.map((o) => (
        <option key={o} value={o} />
      ))}
    </datalist>
  );
}

export function ProjectForm({
  project,
  action,
  options,
  draftKey,
}: {
  project?: Project;
  action: (formData: FormData) => void | Promise<void>;
  options: ProjectFieldOptions;
  draftKey?: string;
}) {
  const draft =
    useSyncExternalStore(
      subscribeDraft,
      () => getDraftSnapshot(draftKey, project),
      () => null,
    ) ?? undefined;
  const resolvedKind =
    draftField(draft, "kind", project?.kind ?? "client") ?? "client";
  const draftToken = draft ? "draft" : "empty";
  const [kind, setKind] = useState(resolvedKind);
  const [kindToken, setKindToken] = useState(draftToken);
  if (kindToken !== draftToken) {
    setKindToken(draftToken);
    setKind(resolvedKind);
  }
  const formRef = useRef<HTMLFormElement>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isSandbox = kind === "sandbox";

  const handleFormChange = () => {
    if (!draftKey || project || !formRef.current) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      const data = Object.fromEntries(
        new FormData(formRef.current!).entries(),
      ) as Draft;
      window.localStorage.setItem(draftKey, JSON.stringify(data));
    }, 400);
  };

  const handleSubmit = () => {
    if (draftKey) window.localStorage.removeItem(draftKey);
  };

  return (
    <form
      key={draft ? "draft" : "empty"}
      ref={formRef}
      action={action}
      onChange={handleFormChange}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Name
          <input
            name="name"
            required
            defaultValue={draftField(draft, "name", project?.name)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Slug
          <input
            name="slug"
            required
            defaultValue={draftField(draft, "slug", project?.slug)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Kind
          <select
            name="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className={inputClass}
          >
            <option value="client">Client work</option>
            <option value="side">Side project</option>
            <option value="sandbox">Sandbox</option>
          </select>
        </label>
        <label className={labelClass}>
          Status
          <select
            name="status"
            defaultValue={draftField(draft, "status", project?.status ?? "live")}
            className={inputClass}
          >
            <option value="live">Live</option>
            <option value="in-progress">In progress</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        {isSandbox ? (
          <p className="col-span-2 text-xs text-neutral-500">
            Sandbox toys are code-registered by slug (see{" "}
            <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">
              sandbox-experiments.ts
            </code>
            ). Showcase Type is unused here.
            <input type="hidden" name="showcase_type" value="" />
          </p>
        ) : (
          <label className={labelClass}>
            Showcase Type
            <select
              name="showcase_type"
              defaultValue={draftField(draft, "showcase_type", project?.showcase_type ?? "")}
              className={inputClass}
            >
              <option value="">None (No Showcase)</option>
              <option value="audio">Audio Briefing Player (Narvo)</option>
              <option value="api">API Console Playground (Narvo Platform)</option>
              <option value="duel">Sphinx ML Duel Simulator (Heka)</option>
              <option value="mood">Anonymous Mood Sandbox (Rant)</option>
              <option value="bookmark">Bookmark Manager Simulator (mark_me)</option>
            </select>
          </label>
        )}
        <label className={labelClass}>
          Label
          <input
            name="label"
            defaultValue={draftField(draft, "label", project?.label)}
            list="label-options"
            className={inputClass}
          />
          <Datalist id="label-options" options={options.labels} />
        </label>
        <label className={labelClass}>
          Type
          <input
            name="type"
            defaultValue={draftField(draft, "type", project?.type ?? "dev")}
            list="type-options"
            className={inputClass}
          />
          <Datalist id="type-options" options={options.types} />
        </label>
        <label className={labelClass}>
          Year
          <input
            name="year"
            defaultValue={draftField(draft, "year", project?.year)}
            list="year-options"
            className={inputClass}
          />
          <Datalist id="year-options" options={options.years} />
        </label>
        <label className={labelClass}>
          Role
          <input
            name="role_title"
            defaultValue={draftField(draft, "role_title", project?.role_title)}
            list="role-options"
            className={inputClass}
          />
          <Datalist id="role-options" options={options.roles} />
        </label>
        <label className={labelClass}>
          Duration
          <input
            name="duration"
            defaultValue={draftField(draft, "duration", project?.duration)}
            list="duration-options"
            className={inputClass}
          />
          <Datalist id="duration-options" options={options.durations} />
        </label>
        <label className={labelClass}>
          Live URL
          <input
            name="live_url"
            defaultValue={draftField(draft, "live_url", project?.live_url ?? "#")}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          GitHub URL
          <input
            name="github_url"
            defaultValue={draftField(draft, "github_url", project?.github_url ?? "#")}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Category (comma separated)
        <TagInput
          name="category"
          defaultValue={
            draftList(
              draft,
              "category",
              project?.category
                ? project.category.split(",").map((s) => s.trim()).filter(Boolean)
                : [],
            )
          }
          placeholder="e.g. E-commerce, Marketplace"
          suggestions={options.categories}
        />
      </label>

      <label className={labelClass}>
        Description
        <textarea
          name="description"
          rows={2}
          defaultValue={draftField(draft, "description", project?.description)}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Problem
        <textarea
          name="problem"
          rows={3}
          defaultValue={draftField(draft, "problem", project?.problem)}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Solution
        <textarea
          name="solution"
          rows={3}
          defaultValue={draftField(draft, "solution", project?.solution)}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Tags (comma separated)
        <TagInput
          name="tags"
          defaultValue={draftList(draft, "tags", project?.tags)}
          placeholder="e.g. Next.js, Supabase"
        />
      </label>

      <label className={labelClass}>
        Tech stack (comma separated)
        <TagInput
          name="tech_details"
          defaultValue={draftList(
            draft,
            "tech_details",
            project?.tech_details?.map((t) => t.name),
          )}
          placeholder="e.g. React, Node.js"
        />
      </label>

      <label className={labelClass}>
        Screenshots
        <ScreenshotsInput
          name="screenshots"
          defaultValue={draftList(draft, "screenshots", project?.screenshots)}
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={
            draft ? draft.featured === "on" : project?.featured
          }
        />
        Featured
      </label>

      {draft && (
        <p className="text-xs text-neutral-500">
          Restored from your last unsaved draft.
        </p>
      )}

      <button
        type="submit"
        className="mt-2 self-start rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
      >
        {project ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}
