"use client";

import { useMemo, useState } from "react";
import { SandboxCard } from "@/components/sandbox-card";
import { FilterPills, type FilterOption } from "@/components/filter-pills";
import { useViewTransition } from "@/hooks/use-view-transition";
import { hasSandboxExperiment } from "@/lib/sandbox-experiments";
import { splitCategories } from "@/lib/project-kind";
import type { Project } from "@/types/project";

const ALL = "all";
const PLAYABLE = "playable";

export function SandboxGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>(ALL);
  const transition = useViewTransition("filter");

  const hasPlayable = useMemo(
    () => projects.some((p) => hasSandboxExperiment(p.slug)),
    [projects],
  );

  const options = useMemo<FilterOption[]>(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const c of splitCategories(project.category)) {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    }
    return [
      { value: ALL, label: "All" },
      // The indicator block itself turns accent when it slides here.
      ...(hasPlayable
        ? [
            {
              value: PLAYABLE,
              label: "Playable",
              tone: "accent" as const,
              count: projects.filter((p) => hasSandboxExperiment(p.slug)).length,
            },
          ]
        : []),
      ...[...counts.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([value, count]) => ({ value, label: value, count })),
    ];
  }, [projects, hasPlayable]);

  const filtered = useMemo(() => {
    if (active === ALL) return projects;
    if (active === PLAYABLE) {
      return projects.filter((p) => hasSandboxExperiment(p.slug));
    }
    return projects.filter((p) => splitCategories(p.category).includes(active));
  }, [active, projects]);

  return (
    <div>
      {options.length > 1 && (
        <FilterPills
          className="mt-6"
          label="Filter experiments"
          options={options}
          value={active}
          onChange={(next) => transition(() => setActive(next))}
        />
      )}

      <p className="sr-only" role="status" aria-live="polite">
        Showing {filtered.length} of {projects.length} experiments
      </p>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((project) => (
            <SandboxCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="ants mt-8 border border-dashed border-ink/15 px-6 py-12 text-center">
          <p className="font-mono text-body-xs uppercase tracking-[0.25em] text-ink/35">
            Empty bench
          </p>
          <p className="mt-3 text-body-m text-ink/60">
            Nothing in this filter yet.
          </p>
          <button
            type="button"
            onClick={() => transition(() => setActive(ALL))}
            className="mt-4 text-body-s font-medium text-accent"
          >
            Show everything
          </button>
        </div>
      )}
    </div>
  );
}
