import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.screenshots?.[0];

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex flex-col overflow-hidden border border-ink/10 transition hover:border-ink/30"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
        {cover ? (
          <Image
            src={cover}
            alt={`${project.name} screenshot`}
            fill
            unoptimized
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-body-xs text-ink/30">
            No preview
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-ink px-2 py-1 text-body-xs font-medium text-cream">
            <Star size={12} weight="fill" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
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
      </div>
    </Link>
  );
}
