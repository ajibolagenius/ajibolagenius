# 0001.2 Data, admin, and routes

**Date**: 2026-11-10

## Summary

The new pages need a few facts your project rows don't hold yet: a month and year, a short sector and service, and a flexible list of case study facts. The contact form also gains an optional phone and an optional reason. This child defines the one migration that adds them, the admin changes to edit them, and the new URLs with redirects from the old ones. The migration lands on `main` first and only adds things, so the live site keeps working while the redesign is built.

## Requirements

Builds to umbrella **AC-4**, **AC-5**, **AC-6**, **AC-7**, **AC-9**.

## Decision

One additive migration (`supabase/migrations/<timestamp>_commonground_redesign.sql`), committed to `main` before UI work starts (the one exception to AC-14), admin form fields for the new columns, one `listWork()` read helper, and Next config redirects.

Short rationale: real columns beat deriving sector and service from the comma separated `category` (which breaks when the order changes), and a month precision `date` beats `created_at` (entry time, not work time). `facts` is jsonb because each project needs different labels (an experiment has no client). Landing the migration on `main` keeps production and `main`'s migration history in sync, so weekly content migrations keep pushing. Runner up for facts: fixed columns, rejected because every project would carry five mostly blank slots.

## Data model

**`public.projects`** (additions only)

| Column | Type | Null | Default | Constraint |
|---|---|---|---|---|
| `date` | `date` | not null | `date_trunc('month', now())::date` | `check (extract(day from date) = 1)` (month precision) |
| `sector` | `text` | not null | `''` | `check (char_length(sector) <= 40)` |
| `service` | `text` | not null | `''` | `check (char_length(service) <= 40)` |
| `facts` | `jsonb` | not null | `'[]'::jsonb` | `check (case when jsonb_typeof(facts) = 'array' then jsonb_array_length(facts) <= 8 else false end)` |

The `date` default exists so `main`'s current admin (`createProject` in `src/app/admin/actions.ts`) and content migrations that insert projects without `date` keep working, and so a rollback of the UI leaves inserts working.

Backfill, in this order, inside the migration:
1. `add column date date default date_trunc('month', now())::date` (nullable at first).
2. `update projects set date = make_date(substring(year from '\d{4}')::int, 1, 1) where substring(year from '\d{4}') is not null`.
3. `update projects set date = date_trunc('month', coalesce(created_at, now()))::date where date is null`.
4. `alter column date set not null`, then add the month check.

Before applying, run steps 2 and 3 as a read only `select id, slug, year, created_at, <computed date>` against production and check the output. `supabase db reset` has no production data (there is no `seed.sql`), so it can't be the test.

At cutover, rerun step 2 for rows where `extract(year from date)::text <> substring(year from '\d{4}')`, since `main`'s admin edits `year` but not `date` while the branch is open.

`facts` element shape, enforced by zod in the admin action (not in SQL): `{ label: string (1..40), value: string (1..120) }`. Order is display order.

`year` stays. The new admin no longer shows a `year` input. The save action sets `year = String(date.getUTCFullYear())`, so the assistant, CV, and old code keep reading a correct year. Dropping `year` is a later cleanup, out of scope here.

**`public.contact_messages`** (additions only)

| Column | Type | Null | Constraint |
|---|---|---|---|
| `phone` | `text` | null | `check (phone is null or (char_length(phone) between 5 and 32 and phone ~ '^[0-9+()\s.-]+$'))` |
| `reason` | `text` | null | `check (reason is null or reason in ('full-time','freelance','collaboration','mentoring','other'))` |

The existing anon insert policy and the length bounds from `20260802000000_security_hardening.sql` stay. The new checks hold for direct anon inserts too.

**Untouched**: `recommendations`, `site_sections`, and every other table. No index is added, since the projects table is tens of rows.

## Read helper

Add `WORK_KINDS: ProjectKind[] = ["client", "side", "sandbox"]` to `src/lib/project-kind.ts`. `LISTED_KINDS` (client and side only) stays as is for the CV and the assistant. "Work set" below always means rows whose `kind` is in `WORK_KINDS`, minus sandbox rows with no playable experiment.

`src/lib/work.ts` exports `listWork(opts?: { kinds?: ProjectKind[] })`:
- Loads the full Work set. **New behavior:** a `sandbox` row is included only when `hasSandboxExperiment(slug)` is true. Today every sandbox row is listed and a non playable one renders an empty page. Now it is left out of Work, and `/work/[slug]` returns 404 for it.
- Assigns `number` over the full Work set ordered `date asc, name asc` (`String(index + 1).padStart(3, "0")`), before any filter.
- Returns rows ordered `date desc, name asc`, filtered to `opts.kinds` if given, each with its `number` kept.
- Each row includes `id, slug, name, kind, status, sector, service, date, screenshots, facts, duration, role_title`, plus derived `mmYY` (`MM/YY` from `date`) and `cover` (`screenshots[0] ?? null`).
- `getWorkNeighbors(slug)` returns `{ prev, next }` from the full Work set in `date asc, name asc` order (prev is older, next is newer, null at the ends).
- `getWorkStats()` returns `{ count, firstYear, lastYear, updated }` from the full Work set, never the filtered set.

The Work index filter keeps the existing `?type=` param and tokens (`work` for client, `side`, `sandbox`) via `kindForParam()`.

## Value sourcing

| Action | Value | Source |
|---|---|---|
| Any project list | number `001` | `listWork()`, over the full Work set, `date asc, name asc` |
| Any project list | `MM/YY` | `projects.date` |
| Work index | SECTOR, SERVICE | `projects.sector`, `projects.service` |
| Work index | TYPE | `kindMeta(kind).label`, translated in i18n |
| Work index | count `[N]`, range `firstYear–lastYear`, UPDATED MM/YY | `getWorkStats()` (full set, ignores the filter) |
| Case study | metadata grid | `status`, `duration`, `role_title`, `date`, then `facts[]` in order |
| Case study | prev/next | `getWorkNeighbors(slug)` |
| Thumbnails | image | `cover` = `screenshots[0]`; null renders a black tile with the name only |
| OG card | five thumbnails | the five newest Work set rows with a non null `cover` |
| OG card | year top right | `getWorkStats().lastYear` |
| Header, footer, OG | wordmark | one constant `WORDMARK = ["AJIBOLA", "AKELEBE"]` in `src/lib/site.ts` (footer joins it with a space) |
| Footer | year | current year at render (pages revalidate every 60s, as today) |
| Contact page | email, phone, availability | `personal_info.email`, `personal_info.phone`, `personal_info.availability` |
| Contact form | stored fields | form inputs, validated by `submitContactMessage` in `src/app/actions.ts` |

## Admin changes (functional only)

- `src/lib/action-result.ts`: add `fieldErrors?: Record<string, string>` to `ActionResult`. `src/app/admin/project-form.tsx` renders each message under its field in muted accent text and moves focus to the first field with an error.
- `project-form.tsx`: add a month input (`<input type="month">`, stored as the first of the month) for `date`, text inputs for `sector` and `service` (required for every kind in `WORK_KINDS`), and a facts editor (rows of label and value, with add, remove, and move up/down, max 8). Remove the `year` input.
- The project create and update actions validate with zod (`zod` is already a dependency), return `fieldErrors` on failure, and derive `year` from `date`.
- `revalidateProjectSurfaces` in `src/app/admin/actions.ts` (and the matching code in `manage/[resource]/actions.ts`): replace the `/projects`, `/sandbox`, and `/cv` paths with `/`, `/work`, `/work/[slug]` (as `"page"`), `/about`, and every OG route in [0001](0001-design-system.md#og-card). Every save purges all of them, since one `date` change renumbers every project.
- Messages screen: show `phone` and `reason` (label from i18n) on each message.
- Remove the `recommendations` and `site_sections` entries from `src/lib/admin-resources.ts` and the admin nav.
- Remove `ThemeToggle` from `admin-shell.tsx`, `login`, and `reset-password`. Admin inherits the dark tokens.

## Contact form

- Fields: name (required, ≤200), email (required, same regex, ≤320), phone (optional, rule as in the DB check), reason (optional `<select>`: Full time role, Freelance project, Collaboration, Mentoring or teaching, Something else → `full-time`, `freelance`, `collaboration`, `mentoring`, `other`), message (required, ≤5000).
- `submitContactMessage` trims every field and turns an empty `phone` or `reason` into `null` before validating and inserting. An unknown `reason` value is a field error.
- Keep the in process rate limiter, the PostHog events, and the flash and toast pattern. The page child (0008) owns the layout and the success and error states.

## Routes and redirects

New App Router folders: `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/privacy/page.tsx`, each with its own `opengraph-image.tsx` (full list in [0001](0001-design-system.md#og-card)). Delete `src/app/projects/`, `src/app/sandbox/`, `src/app/cv/`, and the empty `src/app/ide/` (their logic moves into the new routes). `/work/[slug]` serves every Work kind. Slugs are already unique across kinds (`on conflict (slug)`).

`projectHref()` returns `/work/${slug}` for every kind. In `PROJECT_KINDS`, `base` becomes `/work` for all kinds and `listHref` becomes `/work?type=<param>`.

**Cached redirect loop.** `main` has served `/work → /projects` and `/work/:path* → /projects/:path*` as permanent redirects, and browsers cache those by exact URL. If the new `/projects` redirect pointed at plain `/work`, a past visitor would loop. So:
1. Now, on `main` (part of the early migration commit): change those two `/work` redirects to `statusCode: 307` (temporary), so no new visitor caches them.
2. In the redesign: `/projects` and `/projects/:path*` redirect to `/work?from=projects` and `/work/:path*?from=projects`. Those URLs were never cached as redirects, so a cached `/work` hop ends after one extra request. Pages under `/work` set `alternates.canonical` without the query, so search engines index the clean URL.

Redirects in `next.config.ts` `redirects()`, all `statusCode: 301` (except step 1 above). Keep the existing pattern: exact sources (with and without a trailing slash, since `skipTrailingSlashRedirect` is on) come before their `:path*` source, and `:path*` is used (not `:slug`) so `.../opengraph-image` subpaths of shared links still resolve. No entry may point at another redirect's source.

| Source (in this order) | Destination |
|---|---|
| `/projects`, `/projects/` | `/work?from=projects` |
| `/projects/:path*` | `/work/:path*?from=projects` |
| `/sandbox`, `/sandbox/` | `/work?type=sandbox` |
| `/sandbox/:path*` | `/work/:path*` |
| `/side-projects`, `/side-projects/` | `/work?type=side` |
| `/side-projects/:path*` | `/work/:path*` |
| `/cv`, `/cv/` | `/about` |
| `/cv/:path*` | `/about/:path*` |
| `/blog`, `/blog/:path*` | `/notes`, `/notes/:path*` (unchanged) |

Update every hardcoded old URL to the new one:
- `src/app/sitemap.ts`, `src/app/robots.ts`, and the command palette routes in `src/components/command-palette.tsx`.
- `src/app/api/assistant/route.ts`: the system prompt's `/#featured-work`, `/#experience`, `/#connect`, and `/cv` links become `/work`, `/about`, `/contact`, and `/about`.
- `src/lib/cv-context.ts`: `startsWith("/projects/")` becomes `startsWith("/work/")`.
- `src/app/manifest.ts`: `background_color` and `theme_color` (currently `#fbf5ef` and `#e64301`) become `#000000` and `#FF4A26`, and the `themeColor` in `src/app/layout.tsx` viewport becomes `#000000`.

## Critical test scenarios

- Migration: the read only preview against production shows a non null first of month `date` for every project, with no row taking the `created_at` fallback unless its `year` has no four digit run. After applying, `main`'s admin still creates a project without sending `date`. Verifies **AC-5**.
- Admin: saving a client project with an empty sector shows a field error under Sector and writes nothing. Saving with a date of 07/2026 stores `2026-07-01` and `year = '2026'`. Verifies **AC-5**.
- Numbering: filtering `/work?type=sandbox` keeps each project's number the same as unfiltered, and the header count stays the full total. A non playable sandbox slug returns 404. Verifies **AC-6**.
- Contact: submitting with phone and reason left blank succeeds and stores nulls. A direct anon insert with `reason = 'spam'` fails the check constraint. Phone `abc` returns a field error. Verifies **AC-7**.
- Redirects: each source in the table, with and without a trailing slash, returns exactly one redirect to its destination (Playwright `request.get` with `maxRedirects: 0`, sending the `x-vercel-protection-bypass` header with the preview bypass secret). A request to `/work?from=projects` returns 200. Verifies **AC-4**.
