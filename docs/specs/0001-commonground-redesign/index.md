# 0001. Redesign the site on the CommonGround design

**Date**: 2026-11-10
**Status**: Accepted

## Summary

The whole public site moves to the CommonGround look: black pages, a huge condensed display face (BBH Bogle), a mono body face (Geist Mono), and one orange red accent. It keeps the parts of today's site that still earn their place (projects, notes, sandbox, CV, contact, admin, assistant, command palette, sound, English and Yorùbá, the installable app support) and removes the rest. This umbrella spec fixes the foundations every page depends on: the page map, the design system, the data changes, and how the redesign ships. Each page then gets its own child spec before it is built.

## Structure

| Child | What it is | Decision it supports |
|---|---|---|
| [0001-design-system.md](0001-design-system.md) | Tokens, type, shared components, motion, accessibility, OG card | How every page looks and behaves |
| [0002-data-and-routes.md](0002-data-and-routes.md) | Schema migration, admin changes, contact form, routes and redirects | What data the pages read and where they live |
| `0003-home.md` (not yet written) | Wordmark, intro, project timeline with year scrubber | Home page |
| `0004-work-index.md` (not yet written) | Work index table, kind filter | /work |
| `0005-case-study.md` (not yet written) | Metadata grid, gallery, problem/solution/outcome, visualizer, sandbox embed, prev/next | /work/[slug] |
| `0006-about.md` (not yet written) | Intro, facts grid, practice, CV as index tables, PDF link, image cloud | /about |
| `0007-notes.md` (not yet written) | Notes index and note page | /notes, /notes/[slug] |
| `0008-contact.md` (not yet written) | Contact page layout and form states | /contact |
| `0009-legal-and-404.md` (not yet written) | Privacy, Licenses, 404 | /privacy, /licenses, not found |

Each page child is written with `/architect` before `/develop` builds that page. The two foundation children are complete now.

## Requirements

**User stories**:
- As a recruiter or client, I want the site to show my work first, in a clear and striking layout, so that I can judge it in seconds.
- As the site owner, I want to keep editing projects, notes, and CV content in admin, so that the redesign doesn't cost me my CMS.
- As a returning visitor, I want old links to still work, so that shared URLs and search results don't break.

**Acceptance criteria** (foundation scope; page children add their own):
- **AC-1**: Every public page renders on the `#000000` background with BBH Bogle for display text and Geist Mono for everything else. No light theme exists, and there is no theme toggle anywhere (public pages and admin).
- **AC-2**: The header shows the wordmark AJIBOLA over AKELEBE (large on home, small on every other page) and the nav WORK, NOTES, ABOUT, CONTACT. The current section is marked. Below 768px the nav collapses into a menu button (`=`, then `✕`) that opens a full screen overlay, traps focus, and closes on Escape or after a link is chosen.
- **AC-3**: The footer shows `© <current year> AJIBOLA AKELEBE` on the left and PRIVACY POLICY and LICENSES on the right, plus a utilities row: `⌘K SEARCH` (`CTRL K SEARCH` off Mac), `ASK AI`, `EN / YO`, `SOUND ON|OFF`. Each works by mouse, keyboard, and touch. The same utilities appear inside the mobile menu overlay.
- **AC-4**: These routes exist: `/`, `/work`, `/work/[slug]`, `/notes`, `/notes/[slug]`, `/about`, `/contact`, `/privacy`, `/licenses`, plus the not found page. Old URLs return a single 301 straight to the final URL (no chains), as listed in [0002](0002-data-and-routes.md#routes-and-redirects).
- **AC-5**: `projects` has `date`, `sector`, `service`, and `facts`. Every existing row is backfilled, and admin can edit all four. Saving a client, side, or sandbox project with an empty `sector` or `service` is rejected with a field error.
- **AC-6**: Project numbers (`001`, `002`, ...) come from date order (oldest is `001`, ties broken by name), and are the same on every page that shows them.
- **AC-7**: The contact form collects name, email, optional phone, optional reason, and message, and stores them. Bad input is rejected both by the server action and by database check constraints. The form shows the success panel and the inline error line from the Form sheet.
- **AC-8**: `/privacy` states what is collected (contact form fields, PostHog and Vercel analytics), why, that messages are kept until deleted in admin, and how to ask for deletion by email.
- **AC-9**: The vintage radio, the Recommendations UI, live GitHub activity (`/api/now` and its components), the site sections admin screen, and the theme toggle are gone, along with their imports, scripts, tests, assets, and config (full list in build step 6). No module under `src/` is left without an importer (except route files and Next conventions). `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build` pass. The `recommendations` and `site_sections` tables stay untouched.
- **AC-10**: Kept features work in the new look. The command palette opens on `⌘K`, `/`, and the footer button. The AI assistant opens from the footer. Sound plays and toggles. Every new UI string has `en` and `yo` entries. The service worker still registers and the update modal still appears on a new deploy. The architecture visualizer shows on the Zora and AfroGraph case studies, and sandbox experiments run on their case study page.
- **AC-11**: Every OG image route renders the shared CommonGround style card (wordmark plus up to five project thumbnails with name and MM/YY, as in the Open Graph frame), adapted per route.
- **AC-12**: Under `prefers-reduced-motion: reduce`, nothing moves except opacity fades of 150ms or less. Motion (the animation library) loads only in the client components that use it, never on a route that doesn't.
- **AC-13**: All text tokens meet WCAG AA contrast on black. Every interactive element shows a visible focus style. The skip link still works.
- **AC-14**: All UI work happens on the `redesign/commonground` branch with Vercel preview deploys. `main` gets exactly one redesign commit before cutover: the additive migration from [0002](0002-data-and-routes.md) plus switching `main`'s `/work` redirects to temporary. The updated Playwright smoke suite passes on the preview before merge.

## Decision

**Chosen option**: Option 2: Rebuild the public UI on a redesign branch, reuse the data layer, single cutover.

Replace the public UI and shell completely, keep Supabase, the server data helpers, admin, and the kept features (restyled), and ship everything in one merge once all public pages are done.

**Implementation skills**: `emil-design-eng` (`~/.claude/skills/emil-design-eng/`, UI polish and motion decisions) · `supabase` (`~/.claude/skills/supabase/`, the migration and RLS work) · `playwright-cli` (`~/.claude/skills/playwright-cli/`, the smoke suite and preview checks) · `motion-design`, `accessible-animation`, `tailwindcss` (`~/.claude/skills/`, already installed at user level) · `framer-motion-gestures`, `framer-motion-layout`, `framer-motion-react`, `framer-motion-scroll`, `framer-motion-variants` (`c-jeril/framer-motion-skills`, `.agents/skills/`, linked in `.claude/skills/`). These skills show `framer-motion` imports; this project imports the same API from `motion/react`, and the import path in this spec wins.

### Concept map (what stays, where it goes)

| Today | New home | Notes |
|---|---|---|
| Home editorial column | `/` timeline (child 0003) | Hero, featured work, experience, recommendations, connect, and notes blocks retire |
| `/projects`, `/projects/[slug]` | `/work`, `/work/[slug]` | Client, side, and sandbox projects share one index and one detail route |
| `/sandbox`, `/sandbox/[slug]` | `/work` (kind filter), `/work/[slug]` | Experiments render on their case study page via `getSandboxExperiment` |
| `/cv` | `/about` | CV becomes index tables on About; PDF download kept |
| `/notes`, `/notes/[slug]` | same URLs | Restyled |
| Contact block on home | `/contact` | Form gains phone and reason |
| `/licenses` | same URL | Rewritten for your real assets |
| (none) | `/privacy` | New, required by the form and analytics |
| Command palette, AI assistant, sound, i18n | Footer utilities row and mobile menu | Restyled; palette shortcuts unchanged |
| PWA (service worker for static assets, update modal) | same | Restyled; no offline page exists or is added |
| Architecture visualizer | Case study | Restyled to the token set |
| OG images (all routes) | Shared CommonGround card | Single dark variant |
| Admin CMS | same | Functional changes only; inherits dark tokens |
| Vintage radio, Recommendations UI, GitHub live activity, site sections toggle, theme toggle | removed | Tables kept |

### Cross child contract

- Every page uses the shell (`SiteHeader`, `SiteFooter`, `MobileMenu`) and the tokens from [0001](0001-design-system.md). No page defines its own colors or fonts.
- Every project list or detail reads projects through `src/lib/work.ts` (`listWork()`, `getWorkNeighbors()`, `getWorkStats()`). Numbers are assigned over the full Work set (`WORK_KINDS`, playable sandbox only) in `date asc, name asc` order, and lists display `date desc, name asc`, so numbering (AC-6), prev/next, and header stats are computed in one place.
- The wordmark comes from one constant, `WORDMARK` in `src/lib/site.ts`, used by the header, footer, and OG card.
- Every link to a project uses `projectHref()` from `src/lib/project-kind.ts`, which returns `/work/<slug>` for every kind.
- New UI strings go into `TRANSLATIONS` in `src/lib/i18n.ts` with both `en` and `yo` keys in the same commit.

## Build plan

Build approach: none is recorded, so this assumes **Tracer Bullet**. A thin slice runs end to end first: tokens, shell, one data backed page, and the cutover path, all proven on a preview. Then the slice thickens page by page. Steps 1 to 6 are the foundation and are buildable now. Steps 7 onward each wait for their page child spec.

1. On `main`: preview the backfill read only against production, then commit and push the additive migration from [0002](0002-data-and-routes.md) and switch the two `/work` redirects to `statusCode: 307`. Satisfies **AC-5**, **AC-7**, **AC-4**.
2. Create `redesign/commonground` from that commit, confirm Vercel builds previews for it, set up the preview protection bypass secret for Playwright, copy the PNG frames into `docs/specs/0001-commonground-redesign/frames/`, and run `pnpm add motion`. On the branch, add the admin changes from 0002 (form fields, zod, `fieldErrors`, `year` derived on save, new revalidation paths) and the contact action changes. Satisfies **AC-14**, **AC-12**, **AC-5**, **AC-7**.
3. Install the design system from [0001](0001-design-system.md): fonts via `next/font/google`, tokens in `globals.css`, the manifest and viewport colors, and delete the light palette, theme script, and theme toggle (public and admin). Satisfies **AC-1**, **AC-13**.
4. Build the shell: `SiteHeader` (both wordmark sizes), `MobileMenu`, `SiteFooter` with the utilities row wired to the existing palette, assistant, language, and sound. Satisfies **AC-2**, **AC-3**, **AC-10**.
5. Tracer slice: add `listWork()`, switch `projectHref()` to `/work`, move the routes, and ship a plain unstyled `/work` index table reading real rows (numbers, MM/YY, sector, service). Add every redirect from 0002 (including the `?from=projects` loop breaker) and remove the old `/work` redirects. Update `tests/smoke.spec.ts` for the new routes and redirects, and run it on the preview. Satisfies **AC-4**, **AC-6**, **AC-14**.
6. Removals:
   - Vintage radio: `vintage-radio.tsx`, `use-vintage-radio.ts`, `lib/vintage-radio*.ts`, `scripts/resolve-radio-previews.mjs`, the `radio:*` package scripts, `tests/radio-prebuffer.spec.ts`, `public/audio/`, and the radio only `media-src https://audio-ssl.itunes.apple.com` in the CSP in `next.config.ts`.
   - Recommendations: `components/cv/recommendations.tsx` and its admin resource.
   - GitHub activity: `api/now`, `lib/github-activity.ts`, `lib/github-contributions.ts`, `now-live-commit.tsx`, `hero-status-line.tsx`, and their uses in the assistant and `cv-context.ts`.
   - `site_sections`: its admin resource and its reads in `cv-data.ts` and `page.tsx`. Also `lib/sidebar-stats.ts`.
   - Old shell and home components replaced by the new ones (`top-nav.tsx`, `sandbox-nav.tsx`, `components/cv/hero*.tsx`, `featured-work.tsx`, `connect.tsx`, `owe.tsx`, and similar), dead i18n keys, and the empty `src/app/ide/`.
   - Rule: before cutover, delete every module under `src/` that no longer has an importer. This covers leftovers such as `live-clock`, `pinned-promo-card`, `sandbox-promo-card`, `use-tilt`, and `filter-pills` if no new page uses them. Verify with grep, not by eye.
   Satisfies **AC-9**.
7. Shared OG template restyle per [0001](0001-design-system.md#og-card), applied to every `opengraph-image.tsx`. Satisfies **AC-11**.
8. Page children in this order, each after its child spec exists: 0004 Work index (thickens the tracer), 0005 case study, 0003 home, 0006 about, 0008 contact, 0007 notes, 0009 legal and 404. Satisfies **AC-7**, **AC-8**, **AC-10** and each child's own criteria.
9. Cutover: rerun the `date` backfill for rows whose `year` changed on `main` (see 0002), run the full smoke suite (including the trailing slash and `/work?from=projects` cases) on the final preview, review the copy yourself, then merge to `main`. Satisfies **AC-14**, **AC-4**, **AC-6**.

## Migration plan

**Strategy**: Rebuild on a branch, then one cutover. Database changes are additive only and land on `main` first.
**Phases**:
1. Step 1 commits the migration in [0002](0002-data-and-routes.md) to `main` and applies it to production. It only adds columns (with defaults, so `main`'s admin and content inserts keep working) and constraints that existing rows already satisfy. In the same commit, `main`'s `/work` redirects become temporary so no more browsers cache them.
2. UI work lands on `redesign/commonground` and is reviewed on previews.
3. Merge to `main` at cutover. The new redirects ship in that same deploy.
**Rollback**: Revert the merge commit. The added columns have defaults and are harmless to the old UI, and nothing is dropped, so no data rollback is needed.
**Risks**:
- The branch drifts from `main` while content migrations keep landing there. Rebase the branch weekly.
- Browsers that cached the old permanent `/work → /projects` redirect. The `?from=projects` hop in 0002 breaks that loop.
- `year` and `date` drift while `main`'s old admin edits only `year`. The cutover backfill rerun fixes it.
- Redirect mistakes cost search ranking. The smoke suite's redirect checks catch them before merge.

## Consequences

**Positive**:
- One coherent visual system replaces the accumulated one. The OG, theme, and section toggle code paths shrink to a single variant.
- Projects gain structured fields (date, sector, service, facts) that the index, timeline, OG card, and assistant can all use.
- About absorbs the CV, so the record lives in one place.

**Negative / tradeoffs**:
- A long lived branch means merge drift and nothing visible until cutover. You trade early feedback for a consistent public face.
- Dropping light mode removes a choice some visitors used.
- Motion adds a client dependency (kept off routes that don't use it).
- The template's photographic look depends on strong imagery. App screenshots in big frames will look thinner than packaging photography unless covers are chosen with care.
- Removing the radio discards recent refactor work (c87aeeb).

**Neutral**:
- Every existing project needs a real month, sector, service, and facts entered in admin before cutover. The backfill only sets placeholders.
- `recommendations` and `site_sections` stay as unused tables.

## Follow-up

- [ ] Write the page child specs 0003 to 0009 with `/architect` before building each page.
- [ ] Enter a real month, sector, service, and facts for every client, side, and sandbox project in admin (the backfill sets January and empty strings).
- [ ] Confirm the CommonGround template license allows rebuilding its design in your own code. The template's Licenses page covers its images, icons, and fonts, not the layout itself.
- [ ] Choose cover images per project with the template's 16:9 crop in mind (the home timeline and OG thumbnails crop `screenshots[0]`).
- [ ] No `AGENTS.md` exists, but `docs/simplification-plan.md` refers to one. Run `/audit` or `/sync` to create it and record the stack, the Tracer Bullet default, and the installed skills (including the five `framer-motion-*` project skills, which belong at root since motion touches every page).
- [ ] Connect the Next.js dev MCP server before building: `claude mcp add next-devtools -- npx -y next-devtools-mcp@latest` (needs Node 20.19 or newer and `pnpm dev` running). It gives the agent live route, error, and build info.
- [ ] Optional skills not installed: `vercel-react-best-practices` (`vercel-labs/agent-skills`) for React and Next performance rules, and Motion's official AI Kit (`npx motion-ai`, needs a paid Motion+ plan).
- [ ] `docs/simplification-plan.md` refers to radio and recommendations code this spec deletes. Mark those items obsolete after step 6.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
