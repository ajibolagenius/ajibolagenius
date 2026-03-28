# Design System v2 — Afro × high-fidelity work surface

Version 2 extends **v1** (`src/index.css` — Afrofuturism × dark cosmic) with a dedicated **work / portfolio** language: visible grid, pixel display type, and a single **spectrum** accent in OKLCH. It is intentionally scoped so the rest of the site can keep sungold-first accents until migrated.

## Principles

1. **Continuity** — Same surfaces (`--void`, `--surface`, `--elevated`), borders, and body type (`DM Sans`) as v1.
2. **Spectrum accent** — One purple–indigo anchor for interactive emphasis on work views: `oklch(0.5 0.2737 280.59)`.
3. **High-fidelity structure** — Dense cards, metric grid, technical borders; inspired by grid-native portfolio references, interpreted through an Afro-diasporic lens (warm copy, bold display, no generic “crypto landing” clichés).
4. **Data honesty** — Cards expose only fields that already exist on `projects` (year, type, duration, tag count, etc.). No fabricated KPIs.

## CSS tokens (global)

Defined on `:root` in `src/index.css`:

| Token | Value | Role |
|--------|--------|------|
| `--accent-spectrum` | `oklch(0.5 0.2737 280.59)` | Primary v2 accent |
| `--accent-spectrum-on` | `oklch(0.98 0.02 280)` | Text/icons on solid accent |
| `--font-work-pixel` | Silkscreen (loaded in `index.html`) | Hero / index numerals |

## Scoped scope: `.work-ui-scope`

Wrap any subtree that should resolve `var(--work-accent)` and grid helpers:

| Token | Meaning |
|--------|---------|
| `--work-accent` | Alias → `--accent-spectrum` |
| `--work-accent-on` | High-contrast text on accent fills |
| `--work-accent-muted` | `color-mix` wash for hovers |
| `--work-accent-border` | Borders / focus that track accent |
| `--work-grid-line` | Grid line colour tuned to accent |

**Utility:** `.work-v2-hero-grid` — layered 32px grid overlay on a section (used on `/work` hero).

**Utility:** `.font-work-pixel` — Silkscreen, bold, slight tracking.

## Typography

- **Pixel / display:** Silkscreen — large titles such as `Selected_Work`, index counts, fallbacks when a project has no screenshot.
- **UI chrome:** Space Mono (labels, filters, buttons).
- **Titles / body:** Syne + DM Sans (unchanged from v1).

Underscores in display strings (e.g. `Selected_Work`) nod to terminal / grid aesthetics without breaking readability.

## Components

| Piece | Behaviour |
|--------|-----------|
| `WorkProjectCard` | Category row + hero / initials + title + description + 2×2 metrics (Year, Focus, Span, Tags). Links to `/work/:slug`. |
| `FilterButtons` | `variant="workV2"` → solid accent active state (requires `.work-ui-scope`). |
| `SortSelect` | `variant="workV2"` → accent focus / hover borders. |
| `ListPagination` | `variant="workV2"` → accent current page. |
| `SectionKicker` | `accent="spectrum"` → uses `--work-accent` (needs ancestor scope). |

## Routes & data

- **Unchanged:** `/work`, `/work/:slug`, Supabase `projects` shape, filters (`all` / `dev` / `design`), sort options, pagination size.
- **Additive (client-only):** Search on `/work` filters the current list by name, description, category, label, and tags.

## Light mode

`.work-ui-scope` adjusts `--work-grid-line` under `html.light` for subtler lines on pale surfaces. Accent contrast is validated against `--elevated` / `--surface` fills.

## Migration checklist (future)

- [ ] Optionally align `WorkDetailPage` chrome to v2 accent for parity.
- [ ] Consider extracting shared “metric cell” primitive if reused outside projects.
- [ ] Document any new `projects` columns if real KPIs are added later (replacing derived metrics).

## References in repo

- Tokens & utilities: `frontend/src/index.css`
- Work page: `frontend/src/pages/WorkPage.jsx`
- Home projects strip: `frontend/src/components/portfolio/Projects.jsx`
- Card: `frontend/src/components/portfolio/WorkProjectCard.jsx`
