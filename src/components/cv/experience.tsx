import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "./section-heading";
import { CompanyIcon } from "@/components/company-icon";
import { assignCompanyIcons, type CompanyIconStyle } from "@/lib/company-icon";
import type { ExperienceEntry } from "@/types/cv";

/** Roles shown on the homepage; the rest live on /cv. */
const VISIBLE_ROLES = 3;

/** Icon column width; the timeline rule is centred under it. */
const ICON_SIZE = 32;

function JobCard({
  entry,
  iconStyle,
}: {
  entry: ExperienceEntry;
  iconStyle?: CompanyIconStyle;
}) {
  return (
    <div className="group relative flex gap-4 break-inside-avoid">
      {/* Opaque background so the rule reads as passing behind each node. */}
      <span className="relative z-10 shrink-0 bg-cream py-1">
        <CompanyIcon seed={entry.company} size={ICON_SIZE} style={iconStyle} />
      </span>

      <div className="flex flex-1 flex-col gap-1 pb-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-body-l font-medium transition-colors duration-[var(--dur-2)] group-hover:text-accent">
            {entry.role_title}
          </h3>
          <span className="font-mono text-body-xs tabular-nums text-ink/50">
            {entry.start_date} &ndash; {entry.end_date}
          </span>
        </div>

        <p className="text-body-s text-ink/60">
          {entry.company} &middot; {entry.employment_type}
        </p>

        {entry.body && (
          <p className="mt-1 text-body-s text-ink/70">{entry.body}</p>
        )}

        {entry.bullets?.length > 0 && (
          <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-body-s text-ink/70">
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Experience({ entries }: { entries: ExperienceEntry[] }) {
  if (entries.length === 0) return null;

  const iconStyles = assignCompanyIcons(entries.map((e) => e.company));
  const visible = entries.slice(0, VISIBLE_ROLES);
  const hasMore = entries.length > VISIBLE_ROLES;

  return (
    <section className="reveal flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="experience">Experience</SectionHeading>

      <div className="relative flex flex-col gap-7">
        {/* Static hairline track — always full height, so the timeline reads
            correctly even where the animated overlay never runs. */}
        <span
          aria-hidden
          className="absolute bottom-0 top-0 w-px -translate-x-1/2 bg-ink/10 print:hidden"
          style={{ left: ICON_SIZE / 2 }}
        />
        <span
          aria-hidden
          className="timeline-progress absolute bottom-0 top-0 w-px -translate-x-1/2 bg-accent/40 print:hidden"
          style={{ left: ICON_SIZE / 2 }}
        />

        {visible.map((entry) => (
          <JobCard
            key={entry.id}
            entry={entry}
            iconStyle={iconStyles.get(entry.company)}
          />
        ))}
      </div>

      {hasMore && (
        // A real navigation to /cv, which lists every role. This replaced a
        // modal that had no focus trap, no Escape handler and no focus
        // restoration — and whose contents were unreachable by Cmd+F or print.
        <Link
          href="/cv"
          className="group inline-flex w-fit items-center gap-2 bg-ink/5 px-4 py-2 text-body-s font-medium text-ink transition-colors duration-[var(--dur-2)] hover:bg-ink/10"
        >
          {/* Single interpolated child: three children would make React emit
              <!-- --> separators between the text and the count. */}
          {`View all ${entries.length} roles`}
          <ArrowRight
            weight="duotone"
            size={16}
            className="transition-transform duration-[var(--dur-2)] group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </section>
  );
}
