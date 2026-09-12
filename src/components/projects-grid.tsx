"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUpRight, GridFour, Layout } from "@phosphor-icons/react/dist/ssr";
import { ProjectCard } from "@/components/project-card";
import { FilterPills, type FilterOption } from "@/components/filter-pills";
import { FilterSelect } from "@/components/filter-select";
import { useViewTransition } from "@/hooks/use-view-transition";
import { useInfiniteReveal } from "@/hooks/use-infinite-reveal";
import {
  PROJECT_KINDS,
  kindForParam,
  splitCategories,
} from "@/lib/project-kind";
import type { ProjectCardData } from "@/types/project";
import { track } from "@/lib/analytics";

const ALL = "all";

type LayoutMode = "bento" | "grid";

function subscribeLayout(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getLayoutSnapshot(): LayoutMode {
  try {
    const saved = localStorage.getItem("projects-layout");
    if (saved === "grid" || saved === "bento") return saved;
  } catch {
    // Storage access may fail in restricted sandboxes
  }
  return "bento";
}

function getLayoutServerSnapshot(): LayoutMode {
  return "bento";
}

// Above this many *rendered* cards, snapshotting every one for the refilter
// transition stops being worth it and we fall back to a plain re-render.
const VIEW_TRANSITION_CARD_CAP = 24;

// Cards revealed on load and per scroll page. Twelve fills six rows of the
// two-column grid — comfortably past the fold on a laptop, so the first
// sentinel hit is a real scroll rather than an immediate second page.
const PAGE_SIZE = 12;

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
  const layout = useSyncExternalStore(
    subscribeLayout,
    getLayoutSnapshot,
    getLayoutServerSnapshot,
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

  const {
    visible,
    hasMore,
    sentinelRef,
    revealMore,
  } = useInfiniteReveal<HTMLButtonElement>({
    total: filtered.length,
    step: PAGE_SIZE,
    resetKey: `${type}:${category}`,
  });

  const shown = useMemo(() => filtered.slice(0, visible), [filtered, visible]);

  // Gated on what is on screen, not on the size of the whole set: a user who
  // has scrolled deep into the list has hundreds of cards mounted, and that is
  // exactly when snapshotting them all is too expensive.
  const transition = useViewTransition(
    "filter",
    visible <= VIEW_TRANSITION_CARD_CAP,
  );

  const showPinned = type === ALL && category === ALL && Boolean(pinnedCard);

  // An empty grid after a filter is the frustration signal the replay scanner
  // is looking for; without this it has no event to hang off.
  useEffect(() => {
    if (filtered.length === 0 && projects.length > 0) {
      track("project_filter_returned_empty", { type, category });
    }
  }, [filtered.length, projects.length, type, category]);

  const onType = (next: string) =>
    // Clearing category in the same click prevents stranding the UI on a
    // category that doesn't exist in the new type slice — an empty grid with
    // an active pill, the classic two-facet bug.
    transition(() => {
      track("project_filter_applied", { facet: "type", value: next });
      setParams({ type: next, category: null }, "push");
    });

  const onCategory = (next: string) =>
    transition(() => {
      track("project_filter_applied", { facet: "category", value: next });
      setParams({ category: next }, "replace");
    });

  const setLayoutMode = (next: LayoutMode) => {
    if (next === layout) return;
    track("project_layout_changed", { layout: next });
    transition(() => {
      try {
        localStorage.setItem("projects-layout", next);
        window.dispatchEvent(new Event("storage"));
      } catch {
        // Ignore storage write failure
      }
    });
  };

  const activeCategoryLabel =
    categoryOptions.find((o) => o.value === category)?.label ?? category;

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <FilterPills
          label="Filter by project type"
          options={TYPE_OPTIONS}
          value={type}
          onChange={onType}
        />

        <div className="flex items-center gap-2 sm:ml-auto">
          {/* Only worth showing with 2+ real categories — filtering by the only
              category that exists would just re-render the same grid. */}
          {categoryOptions.length > 2 && (
            <FilterSelect
              label="Filter by category"
              options={categoryOptions}
              value={category}
              onChange={onCategory}
            />
          )}

          <div
            className="flex items-center border border-ink/15 p-0.5"
            role="group"
            aria-label="Grid layout style"
          >
            <button
              type="button"
              onClick={() => setLayoutMode("bento")}
              className={`p-1.5 transition-colors duration-[var(--dur-2)] ${
                layout === "bento"
                  ? "bg-ink text-cream"
                  : "text-ink/60 hover:text-ink hover:bg-ink/5"
              }`}
              title="Bento layout (asymmetric editorial)"
              aria-label="Bento layout"
              aria-pressed={layout === "bento"}
            >
              <Layout
                size={15}
                weight={layout === "bento" ? "fill" : "regular"}
              />
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("grid")}
              className={`p-1.5 transition-colors duration-[var(--dur-2)] ${
                layout === "grid"
                  ? "bg-ink text-cream"
                  : "text-ink/60 hover:text-ink hover:bg-ink/5"
              }`}
              title="Grid layout (uniform cards)"
              aria-label="Grid layout"
              aria-pressed={layout === "grid"}
            >
              <GridFour
                size={15}
                weight={layout === "grid" ? "fill" : "regular"}
              />
            </button>
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Showing {shown.length} of {filtered.length} projects
        {filtered.length === projects.length
          ? ""
          : ` matching the current filters, out of ${projects.length}`}
      </p>

      {filtered.length > 0 ? (
        <>
          <div
            className={`mt-8 grid gap-4 sm:grid-cols-2 ${
              layout === "grid" ? "xl:grid-cols-3" : ""
            }`}
          >
            {showPinned && pinnedCard}
            {shown.map((project, i) => {
              const isWide =
                layout === "bento" &&
                (showPinned ? i % 3 === 1 : i % 3 === 0);

              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  priority={i === 0}
                  variant={isWide ? "wide" : "standard"}
                />
              );
            })}
          </div>

          {/* Both the observer target and the manual fallback: if
              IntersectionObserver never fires — an unsupported browser, a
              zero-height container — this is still a real button. */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                ref={sentinelRef}
                type="button"
                onClick={revealMore}
                className="group inline-flex items-center gap-1.5 border border-ink/15 px-4 py-2 text-body-s font-medium text-ink/70 transition-colors duration-[var(--dur-2)] hover:border-accent/50 hover:text-accent"
              >
                Load more
                <span className="font-mono text-body-xs text-ink/40 group-hover:text-accent/70">
                  {filtered.length - shown.length}
                </span>
              </button>
            </div>
          )}
        </>
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
