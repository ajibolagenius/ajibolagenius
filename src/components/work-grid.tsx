"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/project";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category).filter(Boolean))),
    [projects],
  );
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? projects.filter((p) => p.category === active)
    : projects;

  return (
    <div>
      {categories.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive(null)}
            className={`px-3 py-1.5 font-mono text-body-xs transition-colors ${
              active === null
                ? "bg-ink text-cream"
                : "bg-ink/5 text-ink/60 hover:bg-ink/10"
            }`}
          >
            All
          </button>
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-body-m text-ink/60">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
