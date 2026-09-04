import { GitCommit, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import {
  getContributions,
  type ContributionDay,
} from "@/lib/github-contributions";
import { getLatestGitHubActivity } from "@/lib/github-activity";
import { LiveClock } from "@/components/live-clock";

/** Cell edge and gap, in viewBox units. */
const CELL = 10;
const GAP = 3;
const PITCH = CELL + GAP;
const DAYS_PER_WEEK = 7;

/** Accent opacity ramp, matching portfolio palette tokens. */
const LEVEL_FILL = [
  "fill-ink/[0.07]",
  "fill-accent/25",
  "fill-accent/45",
  "fill-accent/70",
  "fill-accent",
] as const;

/** A full year of columns; sizes viewBox. */
const TOTAL_WEEKS = 53;

const viewBox = (weeks: number) =>
  `0 0 ${weeks * PITCH - GAP} ${DAYS_PER_WEEK * PITCH - GAP}`;

/** One square, as a closed subpath. */
const square = (x: number, y: number) =>
  `M${x} ${y}h${CELL}v${CELL}h-${CELL}z`;

export interface NowWidgetProps {
  github?: string | null;
  currentRole?: string | null;
  currentCompany?: string | null;
  availability?: string | null;
}

export async function NowWidget({
  github,
  currentRole = "Software Developer Instructor",
  currentCompany = "Lagos Data School",
  availability,
}: NowWidgetProps) {
  const [calendar, activity] = await Promise.all([
    getContributions(github),
    getLatestGitHubActivity(github),
  ]);

  const weeks = calendar?.weeks ?? [];
  const total = calendar?.total ?? 0;

  // Build grouped SVG paths per intensity level to minimize DOM nodes
  const paths: string[] = LEVEL_FILL.map(() => "");
  weeks.forEach((week, weekIndex) => {
    week.forEach((day: ContributionDay | null, dayIndex) => {
      if (!day) return;
      paths[day.level] += square(weekIndex * PITCH, dayIndex * PITCH);
    });
  });

  return (
    <figure className="enter flex w-full max-w-xl flex-col rounded-xl border border-ink/10 bg-panel/50 p-4 shadow-xs backdrop-blur-xs transition-colors hover:border-ink/20 sm:p-5 print:hidden">
      {/* Top status bar: Live indicator + Role + Location & local time */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-ink/8 pb-3">
        <div className="flex items-center gap-2">
          <span
            className="relative flex h-2 w-2 items-center justify-center"
            aria-hidden
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/75 opacity-75 dark:bg-emerald-400/75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          </span>

          <span className="font-mono text-body-xs font-medium uppercase tracking-wider text-ink/70">
            Now
          </span>
          <span className="text-ink/30" aria-hidden>
            •
          </span>

          <a
            href="#experience"
            className="group inline-flex items-center gap-1 text-body-xs font-medium text-ink transition-colors hover:text-accent"
          >
            <span>{currentRole}</span>
            <span className="font-normal text-ink/40">at</span>
            <span className="underline decoration-ink/20 underline-offset-2 transition-colors group-hover:decoration-accent">
              {currentCompany}
            </span>
          </a>
        </div>

        <div className="flex items-center gap-2 font-mono text-body-xs text-ink/50">
          <span>Lagos</span>
          <span className="text-ink/30" aria-hidden>
            •
          </span>
          <LiveClock />
        </div>
      </div>

      {/* Middle: Contribution Graph */}
      {weeks.length > 0 && (
        <div className="my-1.5 w-full">
          <svg
            viewBox={viewBox(weeks.length)}
            width="100%"
            role="img"
            aria-label={`${total} GitHub contributions in the last year`}
            className="h-auto w-full"
          >
            {paths.map((d, level) =>
              d ? (
                <path key={level} d={d} className={LEVEL_FILL[level]} />
              ) : null,
            )}
          </svg>
        </div>
      )}

      {/* Bottom: Latest Commit & Contributions legend */}
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-ink/8 pt-3 font-mono text-body-xs text-ink/60">
        {activity ? (
          <div className="flex min-w-0 max-w-[260px] sm:max-w-[320px] items-center gap-1.5 truncate">
            <GitCommit
              size={14}
              weight="bold"
              className="shrink-0 text-accent"
              aria-hidden
            />
            <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-w-0 items-center gap-1 truncate text-ink/70 transition-colors hover:text-accent"
              title={`${activity.repo}: ${activity.message}`}
            >
              <span className="font-medium text-ink group-hover:text-accent">
                {activity.repoShort}
              </span>
              <span className="text-ink/40">:</span>
              <span className="truncate">{activity.message}</span>
              <ArrowUpRight
                size={11}
                className="shrink-0 text-ink/40 opacity-70 group-hover:text-accent"
              />
            </a>
            <span className="shrink-0 text-[10px] text-ink/40">
              ({activity.relativeTime})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-ink/50">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/60" />
            <span className="truncate">
              {availability || "Available for select advisory & builds"}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 text-ink/60">
          {calendar ? (
            <>
              <span>{`${total} contributions`}</span>
              <span
                className="hidden sm:inline-flex items-center gap-1 text-[10px] text-ink/40"
                aria-hidden
              >
                Less
                {LEVEL_FILL.map((_, level) => (
                  <svg
                    key={level}
                    viewBox={`0 0 ${CELL} ${CELL}`}
                    className="h-2 w-2"
                  >
                    <path d={square(0, 0)} className={LEVEL_FILL[level]} />
                  </svg>
                ))}
                More
              </span>
            </>
          ) : (
            <span>{availability || "Available for advisory"}</span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

export function NowWidgetFallback() {
  return (
    <div
      aria-hidden
      className="enter flex w-full max-w-xl flex-col rounded-xl border border-ink/10 bg-panel/50 p-4 shadow-xs backdrop-blur-xs sm:p-5 print:hidden"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-ink/8 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="h-3 w-8 rounded bg-ink/10" />
          <span className="text-ink/30">•</span>
          <span className="h-3 w-40 rounded bg-ink/10" />
        </div>
        <div className="h-3 w-20 rounded bg-ink/10" />
      </div>

      <div className="my-1.5 w-full">
        <svg
          viewBox={viewBox(TOTAL_WEEKS)}
          width="100%"
          className="h-auto w-full"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink/8 pt-3 font-mono text-body-xs">
        <div className="h-3 w-40 rounded bg-ink/10" />
        <div className="h-3 w-24 rounded bg-ink/10" />
      </div>
    </div>
  );
}
