"use client";

import { useMemo, useState } from "react";
import { SandboxCard } from "@/components/sandbox-card";
import { hasSandboxExperiment } from "@/lib/sandbox-experiments";
import type { Project } from "@/types/project";

type Filter = "all" | "playable" | string;

export function SandboxGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category).filter(Boolean))),
    [projects],
  );
  const hasPlayable = useMemo(
    () => projects.some((p) => hasSandboxExperiment(p.slug)),
    [projects],
  );
  const [active, setActive] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    if (active === "playable") {
      return projects.filter((p) => hasSandboxExperiment(p.slug));
    }
    return projects.filter((p) => p.category === active);
  }, [active, projects]);

  const showFilters = categories.length > 1 || hasPlayable;

  return (
    <div>
      {showFilters && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`px-3 py-1.5 font-mono text-body-xs transition-colors ${
              active === "all"
                ? "bg-ink text-cream"
                : "bg-ink/5 text-ink/60 hover:bg-ink/10"
            }`}
          >
            All
          </button>
          {hasPlayable && (
            <button
              type="button"
              onClick={() => setActive("playable")}
              className={`px-3 py-1.5 font-mono text-body-xs transition-colors ${
                active === "playable"
                  ? "bg-accent text-cream"
                  : "bg-ink/5 text-ink/60 hover:bg-ink/10"
              }`}
            >
              Playable
            </button>
          )}
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={`px-3 py-1.5 font-mono text-body-xs transition-colors ${
                active === category
                  ? "bg-ink text-cream"
                  : "bg-ink/5 text-ink/60 hover:bg-ink/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((project) => (
          <SandboxCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-body-m text-ink/60">
          Nothing in this filter yet.
        </p>
      )}
    </div>
  );
}
