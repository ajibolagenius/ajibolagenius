import { getContributions, type ContributionDay } from "@/lib/github-contributions";

/**
 * A year of GitHub contributions, drawn in this site's palette rather than
 * GitHub's — squared cells, hairline gaps, intensity carried by accent opacity.
 * That is the same vocabulary as the rest of the site, so it reads as native
 * rather than borrowed.
 *
 * Renders nothing at all when the data is unavailable: no error, no empty grid.
 * An empty grid would imply "no activity", which is a worse lie than silence.
 *
 * ── Why SVG and not 371 divs ──────────────────────────────────────────────
 * The div version cost ~53KB of HTML, and behind a Suspense boundary React
 * streams the fallback *and* the resolved markup, so the page carried 1482
 * cells and 54 <template> blocks — a 510KB homepage. Grouping the days into
 * one <path> per intensity level collapses that to five elements and a few KB
 * of path data, and a viewBox reserves the height by aspect ratio, so the
 * placeholder needs no magic pixel value to avoid layout shift.
 *
 * The trade is per-day hover tooltips, which a <title> per cell would have
 * put the element count straight back. The caption carries the total instead.
 */

/** Cell edge and gap, in viewBox units. */
const CELL = 10;
const GAP = 3;
const PITCH = CELL + GAP;
const DAYS_PER_WEEK = 7;

/** Accent opacity ramp, indexed by GitHub's intensity level. */
const LEVEL_FILL = [
  "fill-ink/[0.07]",
  "fill-accent/25",
  "fill-accent/45",
  "fill-accent/70",
  "fill-accent",
] as const;

/** A full year of columns; also sizes the placeholder's viewBox. */
const TOTAL_WEEKS = 53;

const viewBox = (weeks: number) =>
  `0 0 ${weeks * PITCH - GAP} ${DAYS_PER_WEEK * PITCH - GAP}`;

/** One square, as a closed subpath. Integers keep the string short. */
const square = (x: number, y: number) =>
  `M${x} ${y}h${CELL}v${CELL}h-${CELL}z`;

export async function ContributionGraph({
  github,
}: {
  /** Profile URL or bare login. */
  github?: string | null;
}) {
  const calendar = await getContributions(github);
  if (!calendar) return null;

  const { weeks, total } = calendar;

  // One path per level, so the whole year is five DOM nodes.
  const paths: string[] = LEVEL_FILL.map(() => "");
  weeks.forEach((week, weekIndex) => {
    week.forEach((day: ContributionDay | null, dayIndex) => {
      if (!day) return;
      paths[day.level] += square(weekIndex * PITCH, dayIndex * PITCH);
    });
  });

  return (
    <figure className="enter flex w-full max-w-xl flex-col gap-2 print:hidden">
      <svg
        viewBox={viewBox(weeks.length)}
        width="100%"
        role="img"
        aria-label={`${total} GitHub contributions in the last year`}
        className="h-auto w-full"
      >
        {paths.map((d, level) =>
          d ? <path key={level} d={d} className={LEVEL_FILL[level]} /> : null,
        )}
      </svg>

      <figcaption className="flex items-center justify-between gap-4 font-mono text-body-xs text-ink/40">
        <span>{`${total} contributions in the last year`}</span>
        <span className="flex items-center gap-1.5">
          Less
          {LEVEL_FILL.map((_, level) => (
            <svg
              key={level}
              aria-hidden
              viewBox={`0 0 ${CELL} ${CELL}`}
              className="h-2 w-2"
            >
              <path d={square(0, 0)} className={LEVEL_FILL[level]} />
            </svg>
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Placeholder held while the graph streams in. The graph sits behind a
 * Suspense boundary so a third-party request can never delay the hero's first
 * paint — commit 71a410f was explicit LCP work and this must not undo it.
 *
 * An empty <svg> with the same viewBox reserves exactly the right height at
 * every viewport, because the aspect ratio does the work. No pixel guess, and
 * near-zero bytes — which matters doubly here, since React streams both this
 * and the resolved markup into the same response.
 */
export function ContributionGraphFallback() {
  return (
    <div
      aria-hidden
      className="enter flex w-full max-w-xl flex-col gap-2 print:hidden"
    >
      <svg viewBox={viewBox(TOTAL_WEEKS)} width="100%" className="h-auto w-full" />
      {/* Matches the figcaption's line box so the reservation is exact. */}
      <span className="font-mono text-body-xs">&nbsp;</span>
    </div>
  );
}
