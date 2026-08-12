"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ProjectCard } from "@/components/project-card";
import { FilterPills, type FilterOption } from "@/components/filter-pills";
import { FilterSelect } from "@/components/filter-select";
import { useViewTransition } from "@/hooks/use-view-transition";
import {
  PROJECT_KINDS,
  kindForParam,
  splitCategories,
} from "@/lib/project-kind";
import type { ProjectCardData } from "@/types/project";

const ALL = "all";

// Above this, snapshotting every card for the refilter transition stops being
// worth it and we fall back to a plain re-render.
const VIEW_TRANSITION_CARD_CAP = 24;

const TYPE_OPTIONS: FilterOption[] = [
  { value: ALL, label: "All" },
  { value: PROJECT_KINDS.client.param, label: "Client work" },
  { value: PROJECT_KINDS.side.param, label: "Side projects", tone: "accent" },
];

function useFilterState() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const type = searchParams.get("type") ?? ALL;
  const category = searchParams.get("category") ?? ALL;

  // Native history API rather than router.replace: Next patches pushState /
  // replaceState to dispatch ACTION_RESTORE, so useSearchParams updates with
  // no RSC refetch and no scroll change. router.replace would round-trip the
  // server for a route whose output doesn't depend on the query at all.
  const setParams = useCallback(
    (next: Record<string, string | null>, mode: "push" | "replace") => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === ALL) params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      window.history[mode === "push" ? "pushState" : "replaceState"](
        null,
        "",
        url,
      );
    },
    [pathname, searchParams],
  );

  return { type, category, setParams };
}

export function ProjectsGrid({
  projects,
  pinnedCard,
}: {
  projects: ProjectCardData[];
  pinnedCard?: ReactNode;
}) {
  const { type, category, setParams } = useFilterState();
  const transition = useViewTransition(
    "filter",
    projects.length <= VIEW_TRANSITION_CARD_CAP,
  );

  const activeKind = kindForParam(type === ALL ? null : type);

  // Narrow by type first, so the category facets below can be derived from
  // the type-filtered set and never offer a zero-result option.
  const byType = useMemo(
    () =>
      activeKind ? projects.filter((p) => p.kind === activeKind) : projects,
    [projects, activeKind],
  );

  const categoryOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map<string, number>();
    for (const project of byType) {
      for (const c of splitCategories(project.category)) {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    }
    const sorted = [...counts.entries()].sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return [
      { value: ALL, label: "All" },
      ...sorted.map(([value, count]) => ({ value, label: value, count })),
    ];
  }, [byType]);

  const filtered = useMemo(
    () =>
      category === ALL
        ? byType
        : byType.filter((p) => splitCategories(p.category).includes(category)),
    [byType, category],
  );

  const showPinned = type === ALL && category === ALL && Boolean(pinnedCard);

  const onType = (next: string) =>
    // Clearing category in the same click prevents stranding the UI on a
    // category that doesn't exist in the new type slice — an empty grid with
    // an active pill, the classic two-facet bug.
    transition(() => setParams({ type: next, category: null }, "push"));

  const onCategory = (next: string) =>
    transition(() => setParams({ category: next }, "replace"));

  const activeCategoryLabel =
    categoryOptions.find((o) => o.value === category)?.label ?? category;

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <FilterPills
          label="Filter by project type"
          options={TYPE_OPTIONS}
          value={type}
          onChange={onType}
        />

        {/* Only worth showing with 2+ real categories — filtering by the only
            category that exists would just re-render the same grid. */}
        {categoryOptions.length > 2 && (
          <FilterSelect
            className="sm:ml-auto"
            label="Filter by category"
            options={categoryOptions}
            value={category}
            onChange={onCategory}
          />
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Showing {filtered.length} of {projects.length} projects
      </p>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {showPinned && pinnedCard}
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} priority={i === 0} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-ink/15 px-6 py-12 text-center">
          <p className="font-mono text-body-xs uppercase tracking-[0.25em] text-ink/35">
            No matches
          </p>
          <p className="mt-3 text-body-m text-ink/60">
            Nothing filed under &ldquo;{activeCategoryLabel}&rdquo; here yet.
          </p>
          <button
            type="button"
            onClick={() =>
              transition(() =>
                setParams({ type: null, category: null }, "push"),
              )
            }
            className="group mt-4 inline-flex items-center gap-1.5 text-body-s font-medium text-accent"
          >
            Show all projects
            <ArrowUpRight
              weight="bold"
              size={14}
              className="transition-transform duration-[var(--dur-2)] ease-out-quart group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Suspense shell. Reserves the filter row's height so the grid doesn't jump
 * when the boundary resolves — no cards, because duplicating the whole grid
 * into the fallback doubles the page HTML and the resolved grid is streamed
 * into the same response anyway.
 */
export function ProjectsGridFallback() {
  return (
    <div>
      <div className="mt-6 h-[34px]" aria-hidden />
    </div>
  );
}
