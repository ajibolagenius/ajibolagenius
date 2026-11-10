# 0001.2 Data, admin, and routes

**Date**: 2026-11-10

## Summary

The new pages need a few facts your project rows don't hold yet: a month and year, a short sector and service, and a flexible list of case study facts. The contact form also gains an optional phone and an optional reason. This child defines the one migration that adds them, the admin changes to edit them, and the new URLs with redirects from the old ones. All database changes are additive, so the live site keeps working while the redesign is built.

## Requirements

Builds to umbrella **AC-4**, **AC-5**, **AC-6**, **AC-7**, **AC-9**.

## Decision

One additive migration (`supabase/migrations/<timestamp>_commonground_redesign.sql`), admin form fields for the new columns, one `listWork()` read helper, and Next config redirects.

Short rationale: real columns beat deriving sector and service from the comma separated `category` (which breaks when the order changes), and a month precision `date` beats `created_at` (entry time, not work time). `facts` is jsonb because each project needs different labels (an experiment has no client). Runner up for facts: fixed columns, rejected because every project would carry five mostly blank slots.

## Data model

**`public.projects`** (additions only)

| Column | Type | Null | Default | Constraint |
|---|---|---|---|---|
| `date` | `date` | not null | backfill, see below | `check (extract(day from date) = 1)` (month precision) |
| `sector` | `text` | not null | `''` | `check (char_length(sector) <= 40)` |
| `service` | `text` | not null | `''` | `check (char_length(service) <= 40)` |
| `facts` | `jsonb` | not null | `'[]'::jsonb` | `check (jsonb_typeof(facts) = 'array' and jsonb_array_length(facts) <= 8)` |

Backfill, in this order, inside the migration:
1. `add column date date` (nullable).
2. `update projects set date = make_date(year::int, 1, 1) where year ~ '^\d{4}$'`.
3. `update projects set date = date_trunc('month', coalesce(created_at, now()))::date where date is null`.
4. `alter column date set not null`, add the month check.

`facts` element shape, enforced by zod in the admin action (not in SQL): `{ label: string (1..40), value: string (1..120) }`. Order is display order.

`year` stays. Admin no longer shows a `year` input. The save action sets `year = String(date.getUTCFullYear())`, so the assistant, CV, and old code keep reading a correct year. Dropping `year` is a later cleanup, out of scope here.

**`public.contact_messages`** (additions only)

| Column | Type | Null | Constraint |
|---|---|---|---|
| `phone` | `text` | null | `check (phone is null or (char_length(phone) between 5 and 32 and phone ~ '^[0-9+()\s.-]+$'))` |
| `service` | `text` | null | `check (service is null or service in ('full-time','freelance','collaboration','mentoring','other'))` |

The existing anon insert policy and the length bounds from `20260802000000_security_hardening.sql` stay. The new checks hold for direct anon inserts too.

**Untouched**: `recommendations`, `site_sections`, and every other table. No index is added, since the projects table is tens of rows.

## Read helper

`src/lib/work.ts` exports `listWork(opts?: { kinds?: ProjectKind[] })`:
- Selects every Work kind, ordered by `date asc, name asc`. Add `WORK_KINDS: ProjectKind[] = ["client", "side", "sandbox"]` to `project-kind.ts` for this. `LISTED_KINDS` (client and side only) stays as is for the CV and the assistant. Sandbox rows without a matching `getSandboxExperiment(slug)` are excluded, as today, and assigns `number = String(index + 1).padStart(3, "0")` in that order. It then returns the rows reversed (newest first) with `number` kept.
- Each row includes `id, slug, name, kind, status, sector, service, date, screenshots, facts, duration, role_title`, plus derived `mmYY` (`MM/YY` from `date`) and `cover` (`screenshots[0] ?? null`).
- `getWorkNeighbors(slug)` returns `{ prev, next }` from the same ordered list (prev is older, next is newer, null at the ends).
- Numbering ignores the `kinds` filter (it is computed on the full Work set first), so a project's number never changes when the index is filtered.
- The Work index filter keeps the existing `?type=` param and tokens (`work` for client, `side`, `sandbox`) via `kindForParam()`.

## Value sourcing

| Action | Value | Source |
|---|---|---|
| Any project list | number `001` | derived by `listWork()` from date order over all listed kinds |
| Any project list | `MM/YY` | `projects.date` |
| Work index | SECTOR, SERVICE | `projects.sector`, `projects.service` |
| Work index | TYPE | `kindMeta(kind).label` (client, side, sandbox labels from `project-kind.ts`, translated in i18n) |
| Work index | count `[N]`, range `2024–2026`, UPDATED MM/YY | count of `listWork()` rows; min and max `date` year; max `date` |
| Case study | metadata grid | `status`, `duration`, `role_title`, `date`, then `facts[]` in order |
| Case study | prev/next | `getWorkNeighbors(slug)` |
| Thumbnails, OG | image | `cover` = `screenshots[0]`; null renders a black tile with the name only |
| Header | wordmark lines | `personal_info.name` split on the first space, uppercased (falls back to `AJIBOLA` / `AKELEBE` if blank) |
| Footer | year | current year at render (page revalidates every 60s, as today) |
| Contact page | email, phone, availability | `personal_info.email`, `personal_info.phone`, `personal_info.availability` |
| Contact form | stored fields | form inputs, validated by `submitContactMessage` in `src/app/actions.ts` |

## Admin changes (functional only)

- `src/app/admin/project-form.tsx`: add a month input (`<input type="month">`, stored as the first of the month) for `date`, text inputs for `sector` and `service` (required for every kind in `WORK_KINDS`), and a facts editor (rows of label and value, with add, remove, and move up/down, max 8). Remove the `year` input.
- The project save action validates with zod and derives `year` from `date`.
- Messages screen: show `phone` and `service` (label from i18n) on each message.
- Remove the `recommendations` and `site_sections` entries from `src/lib/admin-resources.ts` and the admin nav.
- Remove `ThemeToggle` from `admin-shell.tsx`, `login`, and `reset-password`. Admin inherits the dark tokens.

## Contact form

- Fields: name (required, ≤200), email (required, same regex, ≤320), phone (optional, rule as in the DB check), reason (optional `<select>`: Full time role, Freelance project, Collaboration, Mentoring or teaching, Something else → `full-time`, `freelance`, `collaboration`, `mentoring`, `other`), message (required, ≤5000).
- Keep the in process rate limiter, the PostHog events, and the flash and toast pattern. The page child (0008) owns the layout and the success and error states.

## Routes and redirects

New App Router folders: `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx` (with `opengraph-image.tsx`), `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/privacy/page.tsx`. Delete `src/app/projects/`, `src/app/sandbox/`, and `src/app/cv/` (their logic moves into the new routes). `/work/[slug]` serves every kind. Slugs are already unique across kinds (`on conflict (slug)`).

`projectHref()` returns `/work/${slug}` for every kind. In `PROJECT_KINDS`, `base` becomes `/work` for all kinds and `listHref` becomes `/work?type=<param>`.

Redirects in `next.config.ts` `redirects()`, all `statusCode: 301`. Delete the existing `/work → /projects` and `/work/:path* → /projects/:path*` entries (they would loop). Keep the existing pattern: exact listing sources come before their `:path*` source, and `:path*` is used (not `:slug`) so `.../opengraph-image` subpaths of shared links still resolve. No entry may point at another redirect's source.

| Source (in this order) | Destination |
|---|---|
| `/projects` | `/work` |
| `/projects/:path*` | `/work/:path*` |
| `/sandbox` | `/work?type=sandbox` |
| `/sandbox/:path*` | `/work/:path*` |
| `/side-projects` | `/work?type=side` |
| `/side-projects/:path*` | `/work/:path*` |
| `/cv` | `/about` |
| `/cv/:path*` | `/about/:path*` |
| `/blog`, `/blog/:path*` | `/notes`, `/notes/:path*` (unchanged) |

Update `sitemap.ts`, `robots.ts`, the command palette routes, the assistant's project links (`cv-context.ts`, `api/assistant/route.ts`), and the manifest shortcuts to the new URLs.

## Critical test scenarios

- Migration: on a copy of production data (`supabase db reset` locally), every project has a non null first of month `date`, and the old UI still builds against it. Verifies **AC-5**.
- Admin: saving a client project with an empty sector shows a field error and writes nothing. Saving with a date of 07/2026 stores `2026-07-01` and `year = '2026'`. Verifies **AC-5**.
- Numbering: filtering `/work?type=sandbox` keeps each project's number the same as unfiltered. Verifies **AC-6**.
- Contact: a direct anon insert with `service = 'spam'` fails the check constraint. A form submit with phone `abc` returns a field error. Verifies **AC-7**.
- Redirects: each source in the table returns exactly one 301 to its destination (Playwright `request.get` with `maxRedirects: 0`). Verifies **AC-4**.
