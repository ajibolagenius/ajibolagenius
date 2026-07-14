import type { Project } from "@/types/project";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100";
const labelClass = "flex flex-col gap-1 text-sm font-medium";

export function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (formData: FormData) => void | Promise<void>;
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
          Category
          <input
            name="category"
            defaultValue={project?.category}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Label
          <input
            name="label"
            defaultValue={project?.label}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Type
          <input
            name="type"
            defaultValue={project?.type ?? "dev"}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Year
          <input
            name="year"
            defaultValue={project?.year}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Role
          <input
            name="role_title"
            defaultValue={project?.role_title}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Duration
          <input
            name="duration"
            defaultValue={project?.duration}
            className={inputClass}
          />
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
        <input
          name="tags"
          defaultValue={project?.tags?.join(", ")}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Tech stack (comma separated)
        <input
          name="tech_details"
          defaultValue={project?.tech_details?.map((t) => t.name).join(", ")}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Screenshot URLs (comma separated)
        <input
          name="screenshots"
          defaultValue={project?.screenshots?.join(", ")}
          className={inputClass}
        />
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
