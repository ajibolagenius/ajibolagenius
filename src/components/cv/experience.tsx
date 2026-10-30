"use client";

import Link from "next/link";
import { HomeSection } from "@/components/cv/home-section";
import { careerStart, parseCvDate } from "@/lib/experience-span";
import { useLanguage } from "@/lib/i18n";
import type { ExperienceEntry } from "@/types/cv";

/** Roles shown on the homepage; the full history lives on /cv. */
const VISIBLE_ROLES = 6;

/**
 * One line per role — start year, title, company — that opens to a short
 * description. Bullets stay on /cv: the homepage is the summary, not the
 * record. Native <details>, so it works without JS and with find-in-page.
 */
export function Experience({ entries }: { entries: ExperienceEntry[] }) {
  const { t } = useLanguage();
  if (entries.length === 0) return null;

  const since = careerStart(entries)?.year;

  return (
    <HomeSection
      id="experience"
      label={t.labels.experience}
      sub={since ? t.labels.since.replace("{year}", String(since)) : undefined}
    >
      <div className="border-t border-ink/10">
        {entries.slice(0, VISIBLE_ROLES).map((entry) => (
          // Hover tints the row, nudges the role 2px and turns the year and
          // "+" accent; an open row keeps the tint so it reads as selected.
          <details
            key={entry.id}
            className="group border-b border-ink/10 transition-colors duration-[var(--dur-2)] open:bg-ink/[0.04]"
          >
            <summary className="group/row grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-5 gap-y-0.5 px-3 py-4 transition-colors duration-[var(--dur-2)] hover:bg-ink/[0.04] sm:grid-cols-[4rem_minmax(0,1fr)_auto] [&::-webkit-details-marker]:hidden">
              <span className="col-span-full font-mono text-body-xs tabular-nums text-ink/50 transition-colors duration-[var(--dur-2)] group-hover/row:text-accent sm:col-span-1">
                {parseCvDate(entry.start_date)?.year ?? entry.start_date}
              </span>
              <span className="font-medium transition-transform duration-[var(--dur-2)] ease-out-quart group-hover/row:translate-x-0.5">
                {entry.role_title}{" "}
                <span className="font-normal text-ink/55">· {entry.company}</span>
              </span>
              <span
                aria-hidden
                className="font-mono text-ink/50 transition duration-[var(--dur-3)] ease-out-quart group-hover/row:text-accent group-open:rotate-45 group-open:text-accent"
              >
                +
              </span>
            </summary>
            <div className="flex max-w-[62ch] flex-col gap-2 px-3 pb-5 text-body-s text-ink/65 sm:ml-[5.25rem]">
              {entry.body && <p>{entry.body}</p>}
              {entry.company_url && (
                <a
                  href={entry.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit font-mono text-body-xs text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-accent"
                >
                  {entry.company} ↗
                </a>
              )}
            </div>
          </details>
        ))}
      </div>

      <Link
        href="/cv"
        className="mt-10 inline-block text-body-s underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {t.experience.fullHistory} →
      </Link>
    </HomeSection>
  );
}
