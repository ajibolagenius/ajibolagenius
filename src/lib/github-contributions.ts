/**
 * GitHub contribution calendar, for the homepage hero.
 *
 * Two sources, in preference order:
 *
 *  1. The GraphQL API, when `GITHUB_TOKEN` is set. Documented and stable.
 *     Public contribution counts need no elevated scopes — any valid token
 *     works, including a fine-grained one with read-only public access.
 *  2. `github.com/users/<login>/contributions`, the fragment GitHub's own
 *     profile page fetches. No token, but undocumented: it can change shape
 *     without notice, which is precisely why every parse step below is
 *     defensive and the whole thing fails closed.
 *
 * EVERY failure path returns null, and the caller renders nothing. A portfolio
 * hero must never show a broken widget, an error, or an empty grid implying no
 * activity — absent is strictly better than wrong here.
 */

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  count: number;
  level: ContributionLevel;
};

export type ContributionCalendar = {
  /** Week columns, oldest first. Each is padded to exactly 7 days. */
  weeks: (ContributionDay | null)[][];
  total: number;
};

/** Upstream is a third party on the render path; don't let it hang the page. */
const TIMEOUT_MS = 6000;

/** Contribution data changes at most a few times a day. */
const REVALIDATE_SECONDS = 3600;

/** Extracts a login from a profile URL, or passes a bare login through. */
export function githubUsername(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return null;

  const fromUrl = trimmed.match(/github\.com\/([^/?#]+)/i);
  const login = fromUrl ? fromUrl[1] : trimmed;

  // GitHub logins are alphanumeric with single hyphens; anything else means we
  // parsed something that wasn't a profile URL.
  return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(login) ? login : null;
}

function clampLevel(value: number): ContributionLevel {
  if (!Number.isFinite(value) || value < 0) return 0;
  return (value > 4 ? 4 : Math.floor(value)) as ContributionLevel;
}

/**
 * Pads each week to 7 slots so the rendered columns stay aligned to weekdays.
 * A calendar that starts or ends mid-week yields short first/last weeks; the
 * missing days belong at the start of the first week and the end of the last.
 */
function padWeeks(weeks: ContributionDay[][]): (ContributionDay | null)[][] {
  return weeks.map((week, index) => {
    if (week.length >= 7) return week.slice(0, 7);
    const missing = 7 - week.length;
    const blanks = Array<ContributionDay | null>(missing).fill(null);
    return index === 0 ? [...blanks, ...week] : [...week, ...blanks];
  });
}

const GRAPHQL_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }
`;

const GRAPHQL_LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchViaGraphql(
  login: string,
  token: string,
): Promise<ContributionCalendar | null> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "row-port-portfolio",
    },
    body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { login } }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) return null;

  const payload = await response.json();
  const calendar =
    payload?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar || !Array.isArray(calendar.weeks)) return null;

  const weeks: ContributionDay[][] = calendar.weeks
    .map((week: { contributionDays?: unknown[] }) =>
      (Array.isArray(week?.contributionDays) ? week.contributionDays : [])
        .map((day) => {
          const d = day as {
            date?: string;
            contributionCount?: number;
            contributionLevel?: string;
          };
          if (!d?.date) return null;
          return {
            date: d.date,
            count: Number(d.contributionCount) || 0,
            level: GRAPHQL_LEVELS[d.contributionLevel ?? "NONE"] ?? 0,
          };
        })
        .filter((day): day is ContributionDay => day !== null),
    )
    .filter((week: ContributionDay[]) => week.length > 0);

  if (weeks.length === 0) return null;

  return {
    weeks: padWeeks(weeks),
    total: Number(calendar.totalContributions) || 0,
  };
}

const TD_TAG = /<td\b[^>]*>/g;
const TOOL_TIP =
  /<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;

function attribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match ? match[1] : null;
}

async function fetchViaPublicFragment(
  login: string,
): Promise<ContributionCalendar | null> {
  const response = await fetch(
    `https://github.com/users/${encodeURIComponent(login)}/contributions`,
    {
      headers: {
        // Without a browser-ish UA GitHub may serve a different response.
        "User-Agent":
          "Mozilla/5.0 (compatible; row-port-portfolio/1.0; +https://github.com)",
        "X-Requested-With": "XMLHttpRequest",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );

  if (!response.ok) return null;
  const html = await response.text();

  // Counts live in sibling <tool-tip> elements keyed by each cell's id, not on
  // the cell itself — the level attribute alone is only a quartile bucket.
  const counts = new Map<string, number>();
  for (const [, id, text] of html.matchAll(TOOL_TIP)) {
    const match = text.match(/([\d,]+)\s+contribution/i);
    counts.set(id, match ? Number(match[1].replace(/,/g, "")) : 0);
  }

  // The cell id encodes position as `contribution-day-component-{row}-{week}`,
  // which is the only reliable way to reconstruct GitHub's own column layout
  // including partial first and last weeks.
  const byWeek = new Map<number, ContributionDay[]>();
  let total = 0;

  for (const [tag] of html.matchAll(TD_TAG)) {
    const date = attribute(tag, "data-date");
    const level = attribute(tag, "data-level");
    const id = attribute(tag, "id");
    if (!date || level === null || !id) continue;

    const position = id.match(/-(\d+)-(\d+)$/);
    if (!position) continue;

    const count = counts.get(id) ?? 0;
    total += count;

    const week = Number(position[2]);
    const day: ContributionDay = {
      date,
      count,
      level: clampLevel(Number(level)),
    };
    const existing = byWeek.get(week);
    if (existing) existing.push(day);
    else byWeek.set(week, [day]);
  }

  if (byWeek.size === 0) return null;

  const weeks = [...byWeek.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, days]) => days.sort((a, b) => a.date.localeCompare(b.date)));

  return { weeks: padWeeks(weeks), total };
}

/**
 * Returns the last year of contributions, or null if unavailable for any
 * reason. Never throws — callers render nothing on null.
 */
export async function getContributions(
  usernameOrUrl?: string | null,
): Promise<ContributionCalendar | null> {
  const login = githubUsername(usernameOrUrl);
  if (!login) return null;

  const token = process.env.GITHUB_TOKEN;

  try {
    const calendar = token
      ? await fetchViaGraphql(login, token)
      : await fetchViaPublicFragment(login);
    return calendar;
  } catch {
    // Network error, timeout, malformed payload — all the same to the caller.
    return null;
  }
}
