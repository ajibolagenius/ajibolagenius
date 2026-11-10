# 0001.1 CommonGround design system

**Date**: 2026-11-10

## Summary

This is the look every page shares: pure black, white and gray text, one orange red accent, a giant condensed display face for titles, and a mono face for everything else. It lists the exact colors, type sizes, spacing, shared components, motion rules, and the OG card, so no page invents its own. The source is the CommonGround PNG frames in `~/Downloads/CommonGround` (desktop 1440, tablet 768, mobile 360).

## Requirements

Builds to umbrella **AC-1**, **AC-2**, **AC-3**, **AC-11**, **AC-12**, **AC-13**.

## Decision

Tailwind 4 `@theme` tokens in `src/app/globals.css`, fonts self hosted via `next/font/google`, shared components in `src/components/site/`, CSS for simple state changes, and Motion (`motion/react`) only for gestures and orchestrated sequences.

Short rationale: Tailwind 4 and `next/font` are already in the project, so no new styling system is needed. Motion was your pick over plain CSS for the timeline drag and inertia. It's contained to client islands so its weight lands only where it's used. Runner up: CSS only (lighter, but you'd hand roll drag inertia).

## Design source

The PNG frames in `/Users/ajibolagenius/Downloads/CommonGround/`. Copy them into the repo at `docs/specs/0001-commonground-redesign/frames/` in build step 1, so the build and review use the same files. The sheets that define components are `Navigation.png`, `Blocks & Buttons.png`, `Form.png`, `Assets.png`, and `Open Graph.png`. Pages: `Home`, `Work`, `Work (CMS)`, `Studio` (becomes About), `Contact`, `Licenses`, `Privacy Policy`, `404`, each at desktop, tablet, and mobile.

## Tokens

Colors were sampled from the frames.

| Token (CSS var) | Value | Used for | Contrast on black |
|---|---|---|---|
| `--color-bg` | `#000000` | every page, admin included | n/a |
| `--color-fg` | `#FFFFFF` | titles, row text, active nav, values | 21:1 |
| `--color-muted` | `#808080` | labels, column heads, nav at rest, footer, body intro copy | 5.3:1 (AA) |
| `--color-line` | `#333333` | form field underlines, thin rules | decorative only |
| `--color-accent` | `#FF4A26` | CTA links, timeline cursor, status dot, selected thumbnail outline, focus ring | 6.3:1 (AA) |
| `--color-invert-bg` / `--color-invert-fg` | `#FFFFFF` / `#000000` | index row hover and focus | 21:1 |

Remove every light palette variable, the `.dark` and `[data-theme]` selectors, and `theme-script.tsx`. Set `color-scheme: dark` on `:root`.

**Type**

| Token | Font | Use | Size (360 / 768 / 1440) |
|---|---|---|---|
| `--font-display` | BBH Bogle 400 | wordmark, page titles, nav, contact email and phone | see scale |
| `--font-mono` | Geist Mono 400 | everything else, uppercase | 12 / 13 / 13px, line height 1.5, letter spacing 0.02em |

Display scale (uppercase, line height 0.86, letter spacing about -0.01em):
- `display-xl`, home wordmark: 72 / 104 / 120px
- `display-lg`, page titles (WORK, ABOUT, CONTACT): 64 / 96 / 112px
- `display-md`, contact email and phone, case study year: 28 / 32 / 36px
- `display-nav`, header nav: 18 / 22 / 22px
- `display-logo`, small wordmark: 22 / 28 / 28px

Load both fonts with `next/font/google` (`BBH_Bogle`, `Geist_Mono`) in `src/app/layout.tsx`, exposed as `--font-display` and `--font-mono`. Drop `Geist` (sans) and `Habibi` unless a kept component still needs them. Check with grep in build step 3. Geist Mono is already loaded. If `BBH_Bogle` is missing from the installed Next version's font list, self host it with `next/font/local` from the Google Fonts download instead (same variable name).

**Layout**
- Side gutter 24px at every width. Max content width none (full bleed, as the frames show).
- Grid: 12 columns, 24px gap, at 1440; 6 columns at 768; 4 columns at 360. Label/value grids use 4 columns at 1440 and 768, 2 at 360.
- Vertical rhythm: section gaps 160px at 1440, 120px at 768, 96px at 360. Page title block starts 240px from the top at 1440 and 768, and right under the header at 360.
- Breakpoint for the shell: below 768px (Tailwind `md`) the nav becomes the menu button.

## Components (in `src/components/site/`)

| Component | Source frame | Behavior |
|---|---|---|
| `SiteHeader` | Navigation | Props: `variant: "home" \| "inner"`. Home shows `display-xl` wordmark; inner shows `display-logo`. Nav items are muted at rest and `fg` on hover and when current (`aria-current="page"`). |
| `MobileMenu` | Navigation | `=` button toggles a full screen black overlay with centered nav items and the utilities row; `✕` closes. Focus trap via the existing `use-focus-trap` hook, Escape closes, body scroll locked while open. |
| `SiteFooter` | Navigation (footer) | `© YEAR AJIBOLA AKELEBE` left; PRIVACY POLICY, LICENSES right; utilities row above them. Stacks at 360. |
| `UtilityButton` | new, mono text button | Uppercase mono, muted, `fg` on hover. Used for SEARCH, ASK AI, EN / YO, SOUND. |
| `PageTitle` | Work, Contact, Licenses | `display-lg` title with an optional side stack of mono meta lines (`[20]`, `NO. 01`, dates). |
| `IndexTable` | Work, Blocks & Buttons | Semantic `<table>`. Whole row is one link (`<a>` in the name cell, stretched). Hover and keyboard focus invert the row per cell, as the frame shows. Columns collapse to the stacked two line form from Blocks & Buttons below 768. |
| `LabelValue` and `LabelValueGrid` | Studio, Work (CMS) | Muted uppercase label over `fg` value. |
| `NumberedBlock` | Blocks & Buttons | `01 TITLE` with body text to the right (stacked below 768). |
| `ArrowLink` | Blocks & Buttons | Accent uppercase mono text plus the `›` chevron. Moves the chevron 2px on hover. |
| `ProjectThumb` | Blocks & Buttons, Home | Name and MM/YY over a 16:9 image, service label under. Selected or hovered state adds a 2px accent outline. |
| `PrevNext` | Blocks & Buttons | PREV / NEXT labels with names. |
| `FormField`, `SelectField`, `TextareaField` | Form | Label above, underline only, placeholder muted, filled value `fg`, focus turns the underline `fg`. Error text under the submit link. |
| `StatusDot` | Assets, Contact | 8px accent square plus label. |
| Icons | Assets | Three glyphs only (chevron right, chevron down, check) as inline SVG components in `src/components/site/icons.tsx`. Phosphor stays installed for admin and kept components; public page shell components don't import it. |

## Motion

- CSS transitions (150 to 200ms, `ease-out`) for hover, focus, row inversion, and the menu overlay fade.
- Motion (`motion/react`) for gestures and sequences: home timeline drag with inertia and scrubber sync, page title reveal, About image cloud. Import it only inside `"use client"` components that need it. Page child specs decide each use.
- Route transitions keep the existing `use-view-transition` hook.
- `prefers-reduced-motion: reduce` (via the existing `usePrefersReducedMotion`): disable transforms, drag inertia, and auto rotation. Allow opacity fades of 150ms or less only.

## Accessibility

- Focus style: 1px `--color-accent` outline with 2px offset on every interactive element. Index rows also invert on `:focus-visible`.
- Keep `skip-link.tsx`. One `h1` per page (the page title or the wordmark on home).
- Uppercase is visual only (`text-transform`). Source text keeps natural case so screen readers read words, not letters.
- Touch targets are at least 44px high in the mobile menu and footer utilities.

## OG card

One `ogCard()` in `src/lib/og-template.tsx` replaces the current light and dark variants. 1200×630, black, `display-xl` wordmark top left, the year (from the newest listed project's `date`) top right in muted mono, and up to five project thumbnails in the staggered two row layout of `Open Graph.png`, each with name, MM/YY, and service. Per route overrides: the title replaces the wordmark (for example WORK, a project name, a note title), and project routes show that project's own cover. BBH Bogle and Geist Mono font files are read for `ImageResponse` the same way the current template reads its fonts.

## Critical test scenarios

- Happy path: at 360, 768, and 1440, header, footer, and a page title match the frames, and the fonts render (no fallback flash after load). Verifies **AC-1**, **AC-2**, **AC-3**.
- Keyboard: tab through the header, an index row, and the footer utilities. The focus ring is visible, the row inverts, and the menu overlay traps focus and closes on Escape. Verifies **AC-2**, **AC-13**.
- Reduced motion: emulate `reduce` in Playwright. Nothing translates or rotates. Verifies **AC-12**.
- Bundle: `/notes` and `/contact` client chunks contain no `motion` module. Verifies **AC-12**.
