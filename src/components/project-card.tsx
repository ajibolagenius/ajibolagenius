"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "@phosphor-icons/react/dist/ssr";
import { useTilt } from "@/hooks/use-tilt";
import { kindMeta, projectHref, splitCategories } from "@/lib/project-kind";
import type { ProjectCardData } from "@/types/project";

const STATUS_LABELS: Record<string, string> = {
  "in-progress": "In Progress",
  archived: "Archived",
};

export function ProjectCard({
  project,
  priority = false,
  showKind = true,
}: {
  project: ProjectCardData;
  priority?: boolean;
  showKind?: boolean;
}) {
  const tilt = useTilt();
  const cover = project.screenshots?.[0];
  const statusLabel = STATUS_LABELS[project.status];
  const kind = kindMeta(project.kind);
  const categories = splitCategories(project.category);

  return (
    <Link
      href={projectHref(project)}
      {...tilt}
      // Named so the grid refilter can morph persisting cards into their new
      // positions instead of hard-cutting. Must be document-unique.
      style={{ viewTransitionName: `project-${project.slug}` } as CSSProperties}
      className="tilt tilt-sheen group relative flex flex-col overflow-hidden border border-ink/10 transition-[border-color] duration-[var(--dur-2)] hover:border-ink/30 active:scale-[0.995]"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-ink/5">
        {cover ? (
          <Image
            src={cover}
            alt={`${project.name} screenshot`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover object-top transition-transform duration-[var(--dur-3)] ease-out-quart group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-body-xs text-ink/30">
            No preview
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-ink px-2 py-1 font-mono text-body-xs font-medium text-cream">
            <Star size={12} weight="fill" />
            Featured
          </span>
        )}
        {statusLabel && (
          <span
            className={`absolute right-3 top-3 inline-flex items-center gap-1 px-2 py-1 font-mono text-body-xs font-medium ${
              project.status === "in-progress"
                ? "bg-accent text-cream"
                : "bg-ink/10 text-ink/60 backdrop-blur"
            }`}
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* Kind sits in the eyebrow, not over the cover: the image already
                carries two badges, and it would vanish on no-preview cards. */}
            <div className="flex flex-wrap items-center gap-2">
              {showKind && (
                <span
                  data-kind={project.kind}
                  className="px-2 py-0.5 font-mono text-body-xs text-ink/60 data-[kind=side]:bg-accent/10 data-[kind=side]:text-accent bg-ink/5"
                >
                  {kind.label}
                </span>
              )}
              {categories.length > 0 && (
                <p className="text-body-xs uppercase tracking-wide text-ink/60">
                  {categories.join(" · ")}
                </p>
              )}
            </div>
            <h3 className="mt-1 text-body-l font-medium">{project.name}</h3>
          </div>
          <ArrowUpRight
            size={20}
            weight="duotone"
            className="mt-1 shrink-0 text-ink/60 transition duration-[var(--dur-2)] ease-out-quart group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          />
        </div>
        <p className="line-clamp-2 text-body-s text-ink/60">
          {project.description}
        </p>
        {project.tags?.length > 0 && (
          <div className="mt-1 flex max-h-16 flex-wrap gap-2 overflow-hidden">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="h-fit bg-ink/5 px-2.5 py-1 font-mono text-body-xs text-ink/60"
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
