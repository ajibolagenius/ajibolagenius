import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flask, Play, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { hasSandboxExperiment } from "@/lib/sandbox-experiments";
import type { Project } from "@/types/project";

const STATUS_LABELS: Record<string, string> = {
  "in-progress": "In Progress",
  archived: "Archived",
};

export function SandboxCard({ project }: { project: Project }) {
  const cover = project.screenshots?.[0];
  const statusLabel = STATUS_LABELS[project.status];
  const playable = hasSandboxExperiment(project.slug);

  return (
    <Link
      href={`/sandbox/${project.slug}`}
      className="group flex flex-col overflow-hidden border border-ink/10 transition hover:-translate-y-0.5 hover:border-accent/60"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-ink/5">
        {cover ? (
          <Image
            src={cover}
            alt={`${project.name} screenshot`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Flask
              weight="duotone"
              size={28}
              className="text-ink/20 transition-colors group-hover:text-accent/50"
            />
          </div>
        )}
        {playable && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-accent px-1.5 py-0.5 font-mono text-[10px] font-medium text-cream">
            <Play size={10} weight="fill" />
            Play
          </span>
        )}
        {!playable && project.featured && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-ink px-1.5 py-0.5 font-mono text-[10px] font-medium text-cream">
            <Sparkle size={10} weight="fill" />
            Fresh
          </span>
        )}
        {statusLabel && (
          <span
            className={`absolute right-2 top-2 inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] font-medium ${
              project.status === "in-progress"
                ? "bg-accent text-cream"
                : "bg-ink/10 text-ink/60 backdrop-blur"
            }`}
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-body-s font-medium">{project.name}</h3>
          <ArrowUpRight
            size={14}
            weight="bold"
            className="shrink-0 text-ink/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        </div>
        {project.category && (
          <p className="truncate font-mono text-[11px] uppercase tracking-wide text-ink/50">
            {project.category}
          </p>
        )}
      </div>
    </Link>
  );
}
