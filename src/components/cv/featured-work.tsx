import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "./section-heading";
import type { Project } from "@/types/project";

const MAX_FEATURED = 3;

export function FeaturedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 border-t border-ink/10 py-10">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading id="work">Featured work</SectionHeading>
        <Link
          href="/work"
          className="group inline-flex shrink-0 items-center gap-1 text-body-s font-medium text-ink/60 transition-colors hover:text-accent"
        >
          View all work
          <ArrowUpRight
            size={16}
            weight="duotone"
            className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {projects.slice(0, MAX_FEATURED).map((project) => (
          <Link
            key={project.id}
            href={`/work/${project.slug}`}
            className="group flex flex-col overflow-hidden border border-ink/10 transition hover:border-ink/30"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
              {project.screenshots?.[0] ? (
                <Image
                  src={project.screenshots[0]}
                  alt={`${project.name} screenshot`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-body-xs text-ink/30">
                  No preview
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-body-xs uppercase tracking-wide text-ink/60">
                  {project.category}
                </p>
                <h3 className="truncate text-body-s font-medium">
                  {project.name}
                </h3>
              </div>
              <ArrowUpRight
                size={16}
                weight="duotone"
                className="shrink-0 text-ink/60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
