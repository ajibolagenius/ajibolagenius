import type { Project } from "@/types/project";
import type { ProjectFieldOptions } from "@/lib/project-options";
import { TagInput } from "@/components/admin/tag-input";
import { ScreenshotsInput } from "@/components/admin/screenshots-input";

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
}: {
  project?: Project;
  action: (formData: FormData) => void | Promise<void>;
  options: ProjectFieldOptions;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Name
          <input
            name="name"
            required
            defaultValue={project?.name}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Slug
          <input
            name="slug"
            required
            defaultValue={project?.slug}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Label
          <input
            name="label"
            defaultValue={project?.label}
            list="label-options"
            className={inputClass}
          />
          <Datalist id="label-options" options={options.labels} />
        </label>
        <label className={labelClass}>
          Type
          <input
            name="type"
            defaultValue={project?.type ?? "dev"}
            list="type-options"
            className={inputClass}
          />
          <Datalist id="type-options" options={options.types} />
        </label>
        <label className={labelClass}>
          Year
          <input
            name="year"
            defaultValue={project?.year}
            list="year-options"
            className={inputClass}
          />
          <Datalist id="year-options" options={options.years} />
        </label>
        <label className={labelClass}>
          Role
          <input
            name="role_title"
            defaultValue={project?.role_title}
            list="role-options"
            className={inputClass}
          />
          <Datalist id="role-options" options={options.roles} />
        </label>
        <label className={labelClass}>
          Duration
          <input
            name="duration"
            defaultValue={project?.duration}
            list="duration-options"
            className={inputClass}
          />
          <Datalist id="duration-options" options={options.durations} />
        </label>
        <label className={labelClass}>
          Live URL
          <input
            name="live_url"
            defaultValue={project?.live_url ?? "#"}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          GitHub URL
          <input
            name="github_url"
            defaultValue={project?.github_url ?? "#"}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Category (comma separated)
        <TagInput
          name="category"
          defaultValue={project?.category ? project.category.split(",").map((s) => s.trim()).filter(Boolean) : []}
          placeholder="e.g. E-commerce, Marketplace"
          suggestions={options.categories}
        />
      </label>

      <label className={labelClass}>
        Description
        <textarea
          name="description"
          rows={2}
          defaultValue={project?.description}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Problem
        <textarea
          name="problem"
          rows={3}
          defaultValue={project?.problem}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Solution
        <textarea
          name="solution"
          rows={3}
          defaultValue={project?.solution}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Tags (comma separated)
        <TagInput
          name="tags"
          defaultValue={project?.tags}
          placeholder="e.g. Next.js, Supabase"
        />
      </label>

      <label className={labelClass}>
        Tech stack (comma separated)
        <TagInput
          name="tech_details"
          defaultValue={project?.tech_details?.map((t) => t.name)}
          placeholder="e.g. React, Node.js"
        />
      </label>

      <label className={labelClass}>
        Screenshots
        <ScreenshotsInput name="screenshots" defaultValue={project?.screenshots} />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured}
        />
        Featured
      </label>

      <button
        type="submit"
        className="mt-2 self-start rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
      >
        {project ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}
