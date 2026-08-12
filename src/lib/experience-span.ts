/**
 * Career span derived from experience entries, replacing the "5+ years
 * experience" string that was hardcoded in both `cv/page.tsx` and
 * `cv/sidebar.tsx`. That number had drifted badly — the earliest `start_date`
 * on record is 2019, so it was understating by two years and would have kept
 * getting worse every January.
 *
 * `experience_entries.start_date` / `end_date` are free text (`text not null`,
 * with `end_date` defaulting to the literal `'Present'`), so everything here
 * parses defensively and returns `null` rather than guessing. Callers must
 * treat `null` as "omit the stat" — never as a reason to fall back to a
 * hardcoded figure, which is the bug this module exists to remove.
 */

const MONTH_PREFIXES = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export type ParsedCvDate = {
  year: number;
  /** 0-indexed, or null when the source string carried no month. */
  month: number | null;
};

/**
 * Pulls a year (and a month, when one is spelled out) from a free-text date.
 *
 * Handles the shapes this column actually holds today ("2019") plus the ones
 * it plausibly grows into ("Jan 2020", "January 2020", "2020-01-15"). Returns
 * null for anything yearless, which includes the common "Present".
 */
export function parseCvDate(value?: string | null): ParsedCvDate | null {
  if (!value) return null;

  const yearMatch = value.match(/\b(?:19|20)\d{2}\b/);
  if (!yearMatch) return null;

  const lower = value.toLowerCase();
  const monthIndex = MONTH_PREFIXES.findIndex((prefix) =>
    lower.includes(prefix),
  );

  return {
    year: Number(yearMatch[0]),
    month: monthIndex === -1 ? null : monthIndex,
  };
}

type DatedEntry = { start_date?: string | null };

/** Earliest parseable start date across all entries, or null if none parse. */
export function careerStart(entries: DatedEntry[]): ParsedCvDate | null {
  let earliest: ParsedCvDate | null = null;

  for (const entry of entries) {
    const parsed = parseCvDate(entry.start_date);
    if (!parsed) continue;

    if (
      !earliest ||
      parsed.year < earliest.year ||
      (parsed.year === earliest.year &&
        (parsed.month ?? 0) < (earliest.month ?? 0))
    ) {
      earliest = parsed;
    }
  }

  return earliest;
}

/**
 * Whole years between the earliest start date and `now`, or null if no entry
 * carries a parseable year.
 *
 * A yearless entry ("2019") is read as January, which is simply what a bare
 * year means on a CV. The result is floored so the number can never round up
 * into a claim the data doesn't support.
 */
export function yearsOfExperience(
  entries: DatedEntry[],
  now: Date = new Date(),
): number | null {
  const start = careerStart(entries);
  if (!start) return null;

  const months =
    (now.getFullYear() - start.year) * 12 + (now.getMonth() - (start.month ?? 0));

  // Guard against a future-dated entry producing a negative or zero span.
  if (months < 12) return null;

  return Math.floor(months / 12);
}

/**
 * Ready-to-render label, or null when the span can't be derived. Kept here so
 * the phrasing stays identical everywhere it appears.
 */
export function experienceLabel(
  entries: DatedEntry[],
  now: Date = new Date(),
): string | null {
  const years = yearsOfExperience(entries, now);
  return years === null ? null : `${years} years experience`;
}
