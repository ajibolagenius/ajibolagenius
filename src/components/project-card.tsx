import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex flex-col gap-3  border border-ink/10 p-5 transition hover:border-ink/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-body-xs uppercase tracking-wide text-ink/40">
            {project.category}
          </p>
          <h3 className="text-body-l font-medium">{project.name}</h3>
        </div>
        <ArrowUpRight
          size={20}
          weight="duotone"
          className="mt-1 shrink-0 text-ink/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
        />
      </div>
      <p className="text-body-s text-ink/60">{project.description}</p>
      {project.tags?.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className=" bg-ink/5 px-2.5 py-1 text-body-xs text-ink/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
