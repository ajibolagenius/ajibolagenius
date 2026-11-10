# 0001. Redesign the site on the CommonGround design: rationale

## Context

The portfolio (Next.js 16, React 19, Tailwind 4, Supabase, Vercel) has grown feature by feature. It now has an editorial home column, separate projects, sandbox, notes, and CV pages, a light and dark theme, a vintage radio, live GitHub activity, an AI assistant, a command palette, sound, English and Yorùbá, and a PWA. Each was reasonable alone, but together the site has no single visual idea, and every page carries two themes' worth of styling.

You want to move the whole public site onto CommonGround, a purchased studio template delivered as 32 PNG frames (desktop, tablet, mobile). It is dark only, built on a giant condensed display face, a mono body, one accent, and an index table aesthetic. It assumes a studio ("we"), packaging photography, and a three page site (Work, Studio, Contact), none of which match a solo engineer and designer's portfolio as is.

Forces:
- The data layer (Supabase tables, RLS, admin CMS, server helpers) works and holds real content, and losing it is not an option.
- The template's columns (sector, service, month dates, client and reach facts) don't exist in the data.
- The site is public and used for job applications, so it cannot look half migrated for weeks.
- One person builds and maintains it.

## Options considered

### Option 1: Restyle in place, page by page on main
Swap tokens and restyle each existing page directly on `main`.
- Pros: ships value early, with no long branch.
- Cons: the site looks inconsistent for the whole build. The old IA (projects, sandbox, cv as separate pages) survives by inertia instead of being redesigned.

### Option 2: Rebuild the public UI on a branch, reuse the data layer, single cutover (chosen)
New shell, new routes, and new components on `redesign/commonground`. Supabase, admin, and kept features are reused. The database changes are additive and applied early.
- Pros: a consistent public face at every moment. The IA gets redesigned deliberately, and the data layer risk is near zero.
- Cons: branch drift and no public feedback until cutover.

### Option 3: Parallel route group on main, then swap
Build under a hidden prefix on `main` and swap at the end.
- Pros: no long lived branch.
- Cons: two layouts, duplicate routes, and redirect juggling until the swap, plus hidden pages that could leak into the sitemap or get indexed.

### Option 4: Fresh project, port data access
Start a new Next app with the template and port over the pieces you keep.
- Pros: no legacy CSS or dead code at all.
- Cons: you'd rebuild admin, auth, PWA, assistant, and OG plumbing that already work. That is the big bang rewrite failure mode for no gain.

## Rationale

The data layer is the valuable, stable part, and the UI is the part being replaced wholesale, so the line falls between them. Option 2 reuses everything below the UI and replaces everything above it. The strangler instinct (old and new side by side) is applied where it's cheap: at the database, via additive columns that both UIs tolerate. A UI strangler (Options 1 and 3) would show visitors two designs or risk leaking hidden routes, which matters more for a portfolio used in job applications than early feedback does. Option 4 throws away working infrastructure.

Keep or drop calls follow one test: does the concept serve someone judging your work, and can it look native in a quiet, index style design? Projects, notes, sandbox, CV, contact, palette, assistant, sound, i18n, PWA, and the visualizer pass. The radio, recommendations, and live GitHub feed were dropped by you. Their tables stay, so reversal is UI work only.

Folding sandbox into Work works because experiments are already `projects` rows (`kind = sandbox`). Folding the CV into About gives the template's sparse Studio page real substance and removes a duplicate surface. Dark only follows the template exactly and removes the dual palette code across pages, OG images, and admin.

## Concept retention inventory

| Concept | Code today | Decision |
|---|---|---|
| Projects and case studies | `app/projects`, `project-card`, `projects-grid`, `project-showcase`, `screenshot-gallery` | Keep, move to `/work` |
| Sandbox | `app/sandbox`, `sandbox-*`, `lib/sandbox-experiments.ts` | Keep, inside Work |
| Notes | `app/notes`, `notes-list`, `note-card`, `lib/notes.ts` | Keep |
| CV | `app/cv`, `components/cv/experience`, `cv-download-button`, `lib/cv-data.ts` | Keep, inside About |
| Contact form | `components/cv/contact-form`, `app/actions.ts` | Keep, add phone and reason |
| Admin CMS | `app/admin`, `components/admin` | Keep, functional changes only |
| Command palette | `command-palette.tsx` | Keep |
| AI assistant | `ai-assistant.tsx`, `api/assistant` | Keep |
| Sound | `sound-toggle.tsx`, `lib/sound.ts` | Keep |
| i18n (en, yo) | `lib/i18n.ts`, `language-toggle`, `language-script` | Keep, UI chrome only |
| PWA | `app/sw.js`, `components/pwa`, `manifest.ts` | Keep |
| Architecture visualizer | `architecture-visualizer.tsx` | Keep |
| OG images | `lib/og-template.tsx`, nine routes | Keep, one dark card |
| Licenses | `app/licenses` | Keep, rewrite |
| Recommendations | `components/cv/recommendations.tsx`, admin resource | Remove UI, keep table |
| Vintage radio | `vintage-radio.tsx`, `use-vintage-radio`, `lib/vintage-radio*`, `scripts/resolve-radio-previews.mjs`, `tests/radio-prebuffer.spec.ts` | Remove |
| GitHub live activity | `api/now`, `lib/github-*`, `now-live-commit`, `hero-status-line` | Remove (assistant's use of `github-activity` goes too) |
| Site sections toggle | `site_sections` reads in `cv-data.ts`, `page.tsx`, admin resource | Remove reads, keep table |
| Theme toggle | `theme-toggle`, `theme-script`, light palette | Remove |
