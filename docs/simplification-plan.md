# Simplification plan

Derived from the over-engineering review of the whole codebase (2026-09-19).
Scope is **complexity only** — dead code, duplication, hand-rolled platform
features. Correctness bugs, security and performance are out of scope here and
belong to a separate review pass.

Target: **~1,200 lines removed** with no user-visible change, except where a
phase is explicitly marked as a product decision.

## Ground rules

- One phase per commit. Each phase is independently revertable.
- After every phase: `pnpm lint && pnpm exec tsc --noEmit && pnpm build`.
- After phases 3 and 5: `pnpm test` (Playwright smoke + radio prebuffer specs).
- After any code change: `graphify update .` (per `AGENTS.md`).
- Do not add a dependency to remove code. Every replacement below is stdlib,
  a platform feature, or a helper this repo already exports.
- Phases 1→5 are ordered by risk, lowest first. Phase 5 is gated on answers.

---

## Phase 1 — Dead code

Zero behaviour change. Nothing below has a live caller; each was verified by
grep across `src/`, `tests/` and `scripts/`.

| # | Location | Action | Evidence |
|---|---|---|---|
| 1.1 | `src/components/cv/contribution-graph.tsx` (125) | Delete file | Zero importers. `src/components/cv/now-widget.tsx:52-60,106-145` renders the same calendar from the same `getContributions()` source. Superseded, not pending. |
| 1.2 | `src/hooks/use-in-view.ts` (39) | Delete file | Zero callers. |
| 1.3 | `src/hooks/use-prefers-reduced-motion.ts:15-17` | Delete `usePointerFine` | Zero callers. `usePrefersReducedMotion` in the same file stays. |
| 1.4 | `test_side.mjs` (9, repo root) | Delete file | One-off Supabase probe with an inlined anon key, committed to root. Not referenced by any script in `package.json`. |
| 1.5 | `scripts_upload_tech_logos.mjs` (54, repo root) | Delete file | One-off logo migration, already run, not in `package.json`. Its `loadEnv` (L5-20) also hand-rolls dotenv — `node --env-file` covers that if it is ever needed again. |
| 1.6 | `src/lib/vintage-radio.ts:32,112` | Delete `isInitialized` | Written once, never read. |
| 1.7 | `src/lib/vintage-radio.ts:20,31,209,224` + `src/hooks/use-vintage-radio.ts:24` | Delete `hasStartedOnce` | Published in `VintageRadioState` with no consumer. Remove from the interface, the class, `updateCachedState()` and the server snapshot together. |

**Net: −234 lines.**

Verify: build passes; `/` still renders the contribution grid; `/sandbox` and
`/cv` still load (they consume the radio state object whose shape changes).

---

## Phase 2 — Local duplication

Each item is contained within one file. No cross-file coupling.

### 2.1 `src/lib/og-template.tsx` (547 → ~480)

- **L516-539** — `loadImageSrc` is `loadAvatarSrc` minus the local fallback.
  Keep `loadImageSrc` as the primitive; rewrite `loadAvatarSrc` as
  `(url) => (await loadImageSrc(url)) ?? readLocalAvatar()`. **−22**
- **L183-234** — `ProjectImageFrame` and `EditorialPortrait` differ only in
  width/height, `borderRadius`, border width and shadow colour. Collapse into
  one `<Framed>` taking those as props. **−25**
- **L149-180** — `getPillColors` evaluates the same five predicates once per
  theme. Replace with a table:
  ```ts
  const PILL_RULES: [RegExp, Pill, Pill][] = [
    [/react|next|node|api|work/, DARK.emerald, LIGHT.emerald],
    // …
  ];
  ```
  and a single `.find()`. Default (orange) stays the fallback. **−20**

Verify: regenerate every OG route and eyeball. Routes:
`/opengraph-image`, `/cv/opengraph-image`, `/projects/opengraph-image`,
`/projects/[slug]/opengraph-image`, `/notes/opengraph-image`,
`/notes/[slug]/opengraph-image`, `/sandbox/opengraph-image`,
`/sandbox/[slug]/opengraph-image`, `/licenses/opengraph-image`.
Check both `isDark` branches — the pill table is the only place theme
behaviour can regress silently.

### 2.2 `src/app/api/assistant/route.ts` (368 → ~320)

- **L338-360** — the `try` and `catch` arms return the same object but for
  `projects`. Hoist `let orderedProjects = []` above the `try`, one `return`
  after it. **−12**
- **L166-185 / L317-336** — the projects `select(...)` projection and its
  camelCase mapper are written twice. Extract one
  `selectProjectCards(slugs: string[])` into `src/lib/` and call it from both
  `recommendProject` and `matchJobDescription`. **−35**
- **L344-346, L356-358** — `yearsExperience` is a hardcoded
  `"3+ years professional software engineering · 5+ years design · 10+ years
  combined"`. `experienceLabel()` in `src/lib/experience-span.ts` exists
  specifically to kill this class of drift and already disagrees with it
  (earliest `start_date` on record is 2019). Derive it. If the string's extra
  framing (design years, combined years) is wanted, it belongs in the DB
  alongside the experience rows, not inline in a tool handler. **−4**

Verify: open the assistant, ask "show me a project", ask "here's a JD for a
Senior Frontend Engineer" (paste anything), confirm both cards render and the
credentials line shows a derived figure.

### 2.3 `src/components/command-palette.tsx` (1034 → ~870)

- **L344-711** — ~20 `keywords` arrays formatted one word per line. Replace
  each with `"theme mode dark light toggle colors appearance".split(" ")`.
  Purely mechanical; the scoring in `filteredResults` (L741-776) lowercases
  everything anyway. **−150**
- **L137-150** — `subscribePlatform` returns a no-op and `getIsMacSnapshot`
  never changes, so `useSyncExternalStore` is wrapping a constant to render
  `⌘K` vs `Ctrl+K` (L1028). Replace with `useState(false)` plus a one-shot
  `useEffect`. **−10**

Verify: `⌘K`, `/`, and the UI button all open the palette; type `zora`, `fela`,
`cv` and confirm the same results and ordering as before.

### 2.4 `src/components/architecture-visualizer.tsx` (711 → ~660)

- **L288-322** (Zora) and **L594-640** (AfroGraph) — three hand-unrolled tab
  `<button>`s each, over records (`ZORA_FLOWS`, `AFROGRAPH_FLOWS`) that are
  already keyed. Add a `label` to each flow entry and map
  `Object.entries(FLOWS)`. **−50**

Verify: `/projects/zora-market` and `/projects/afrograph` — all three tabs on
each switch, and "Run Query" / the simulation still steps.

### 2.5 `src/components/ai-assistant.tsx` (789 → ~755)

- **L653-692** — the job-match proof-project card is the `recommendProject`
  card (L400-452) at smaller type. Extract `<ProjectMiniCard size="sm" | "md">`
  and use it in both. **−35**

Verify: same two assistant flows as 2.2.

### 2.6 `src/lib/sound.ts` (230 → ~130)

- **L60-228** — six methods (`playTap`, `playChime`, `playDrawer`, `playMatch`,
  `playError`, `playStep`) that each build an oscillator + gain node and ramp
  it. Collapse to one private
  `beep(steps: { freq: number; to?: number; at: number; peak: number; decay: number }[])`
  plus a six-entry table. The public method names stay — ~40 call sites across
  the app depend on them. **−100**

Verify: enable sound via the toggle, then exercise tap (any filter pill),
chime (theme toggle), drawer (open palette), error (submit the contact form
offline), match (`/sandbox/color-lab`), step (Zora architecture simulation).
This is audio — a diff that compiles proves nothing. Listen to all six.

**Phase 2 net: −463 lines.**

---

## Phase 3 — Vintage radio consolidation

`src/components/vintage-radio.tsx` is 889 lines holding two components that are
the same player twice.

- **L485-542** is byte-identical to **L87-144** (verified by `diff`): the six
  handlers `handleTogglePlay`, `handleNext`, `handlePrev`, `handleToggleMute`,
  `handleVolumeChange`, `handleTurnOff`, `handleTurnOn`. Extract
  `useRadioControls()` returning all six. **−58**
- **L146-464** (`SidebarVintageRadio`) and **L580-889** (`VintageRadio`) render
  the same three states — off / minimized / expanded — with the same controls
  and the same `aria-label`s modulo wording (verified: 6 labels identical, the
  rest differ only in phrasing like "Minimize player" vs "Minimize radio
  player"). Collapse to one component with
  `variant: "sidebar" | "floating"`, where the variant selects the wrapper
  classes (`fixed bottom-4 left-4 z-40 …` vs `w-full border …`) and the label
  wording. **−200**

Order: do the hook extraction first, commit, then the JSX merge. The hook is
mechanical; the JSX merge is where a class string can go missing.

Keep as-is:
- `routeHasSidebar()` (L26-32) and the `lg:hidden` visibility class — that is
  the real difference between the two mount points and it stays.
- The `Shift+M` listener and `startAutoplay`/`cancelAutoplay` effects
  (L544-573), which only the floating variant runs. Gate them on `variant`.

**Phase 3 net: −258 lines.**

Verify: `pnpm test` (`tests/radio-prebuffer.spec.ts` covers the prebuffer path).
Then manually, on desktop and at mobile width:
`/` (sidebar variant), `/cv` and `/sandbox` (floating variant, no sidebar),
`/projects` (floating variant hidden on desktop, shown on mobile) — and confirm
`/admin` still renders no radio at all.

---

## Phase 4 — Cross-file duplication

### 4.1 Comma-splitting, five copies

`src/lib/project-kind.ts:72` already exports `splitCategories` doing
`split(",").map(trim).filter(Boolean)`. Import it at:

- `src/components/admin/tag-input.tsx:6-11` (`parseTags`)
- `src/lib/project-options.ts:9` (`splitValues` — keep the dedupe/sort around it)
- `src/app/admin/project-form.tsx:53` and `:312`
- `src/components/admin/screenshots-input.tsx:32`

Leave alone: `src/app/actions.ts:52` and `src/app/api/assistant/route.ts:74` —
those are `x-forwarded-for` header parsing, a different operation that happens
to share a delimiter.

**−20**

### 4.2 `scripts/resolve-radio-previews.mjs:26-37`

`readCuration` runs three separate regex sweeps and zips them by array index —
fragile, and it silently misaligns if a curated track ever omits a field.
`readCurationFields` two lines below (L36-38) is already the general form.
Rebuild `readCuration` from three calls to it, keeping the existing `assert`
length checks, which are what makes the index-zip safe. **−8**

### 4.3 `instrumentation-client.ts:6-18`

Two nested dev-only `throw`s with near-identical copy. One check on
`if (!posthogKey || !posthogHost)`, naming whichever is missing. **−10**

**Phase 4 net: −38 lines.**

---

## Phase 5 — Gated on a decision

These two are not mechanical. Do not start either until the questions below
are answered.

### 5.1 Service worker / PWA — **decided: keep, fix separately**

Not deleting. The PWA stays and gets a real offline story instead, tracked in
[`docs/pwa-offline-story.md`](./pwa-offline-story.md). The analysis below is
retained because it is the brief for that task.



`src/app/sw.js/route.ts` (72) + `src/components/pwa/service-worker-registration.tsx`
(110) + `src/components/pwa/update-modal.tsx` (~38) ≈ **220 lines**.

The worker's `fetch` handler (`route.ts:38-61`) early-returns on everything
except `/_next/static/` — which Vercel already serves with
`Cache-Control: immutable, max-age=31536000`, so the browser HTTP cache
already does this. There is no offline fallback route and no page/data caching,
so the app has **no offline capability today** despite the machinery. What the
~220 lines actually buy is the update-prompt modal.

If the decision is to delete: remove all three files plus the
`<ServiceWorkerRegistration />` mount in `src/app/layout.tsx`, and keep
`src/app/manifest.ts` — installability comes from the manifest, not the worker.
Ship a `self.registration.unregister()` stub at `/sw.js` for one deploy so
already-installed workers on returning visitors tear themselves down, then
delete the route.

If the decision is to keep: it should earn its place — add an offline fallback
page and cache the document shell. That is *adding* code and is out of scope
for this plan; file it separately.

**−220 if deleted.**

### 5.2 `showcase_type` — **checked: column was empty; backfill written**

Queried via the Supabase CLI against the linked project. Of 24 projects,
**only `mark_me` had `showcase_type` set** (to `bookmark`, a value the slug map
does not even contain). Every one of the 7 showcases on the site today is
being resolved by the hardcoded fallback.

`supabase/migrations/20260919000000_backfill_showcase_type.sql` fills the nine
affected rows and is idempotent — it only touches rows where the column is
still null, so it cannot stomp a value set later through the admin UI.
(`zora` from the slug map has no row; the real slugs are `zora-market` and
`zora-market-mobile`.)

**Blocked on applying it.** `supabase migration up --linked` is a production
write and was refused by the sandbox. Once it is applied, delete
`getShowcaseTypeBySlug` and simplify line 1141 to `project.showcase_type`.



`src/components/project-showcase.tsx:40-49` — `getShowcaseTypeBySlug` is a
hardcoded slug→type map covering 7 slugs. `project-showcase.tsx:1141` reads
`project.showcase_type || getShowcaseTypeBySlug(project.slug)`, and
`showcase_type` is a real column already edited in the admin form
(`src/app/admin/project-form.tsx:222`). Two sources of truth, and the hardcoded
one wins whenever the column is empty.

Sequence, in this order:
1. Query the `projects` table for `slug, showcase_type` across those 7 slugs
   (`narvo_news`, `narvo_intelligence`, `narvo_platform`, `hekaiq`, `gorant`,
   `fidia`, `zora-market`, `zora-market-mobile`, `zora`, `afrograph`).
2. Backfill any that are null, via the admin UI or a one-off SQL update.
3. Only then delete L40-49 and simplify L1141 to `project.showcase_type`.

Deleting the function before the backfill silently removes the showcase from
those project pages. **−10 after backfill.**

**Phase 5 net: −230, conditional.**

---

## Tally

Baseline: 20,619 lines across `.ts`/`.tsx`/`.js`/`.jsx` (excluding
`node_modules`, `.next`, `graphify-out`).

| Phase | Theme | Planned | Actual | Status |
|---|---|---|---|---|
| 1 | Dead code | −234 | **−239** | done (`ad7af71`) |
| 2 | Local duplication | −463 | **−181** | done (`b517f84`) |
| 3 | Vintage radio | −258 | **−153** | done (`4450140`, `6e0e3c6`) |
| 4 | Cross-file duplication | −38 | **−49** | done (`4ae0fe3`) |
| 5.1 | Service worker | −220 | **0** | kept by decision — see `pwa-offline-story.md` |
| 5.2 | `showcase_type` | −10 | — | migration written, blocked on applying it |
| | **Total so far** | | **−522** | 20,619 → 20,097 |

Lint went from 32 problems (9 errors) to 23 (7 errors); nothing new was
introduced. `next build`, `tsc --noEmit`, all 11 Playwright specs and
`resolve-radio-previews.mjs --check` pass at every commit.

### Where the estimate was wrong

Three items came in far under, and the reasons are worth keeping:

- **2.5 `<ProjectMiniCard>` — rejected, reverted.** The two assistant project
  cards share a structure but differ in nearly every class string. The
  parametrised version came out at 805 lines against 789 — *longer* than the
  duplication, and a pile of ternaries to read at 3am. Two flat cards win.
- **2.3 `isMac` — partly wrong.** The `useSyncExternalStore` was not
  over-engineering; `react-hooks/set-state-in-effect` rejects the obvious
  `useState` + `useEffect` replacement, which is *why* it was written that
  way. A lazy `useState` initialiser does work (the palette renders null
  until opened, so there is no hydration surface) and that is what shipped.
- **3 step 2 — done after normalising.** 54% of the two radio variants' lines
  were identical, but the divergence was fine-grained rather than structural,
  so the merge was only viable once the drift was normalised away. With the
  owner's go-ahead on that, the expanded deck collapsed to one component with
  four real props (−128). The off and minimised states stayed separate: those
  are two genuine designs, not one design drifted.

The general lesson: structural similarity is not the same as
parametrisability. Count the *divergence points*, not the shared shape,
before extracting a component.

---

## Explicitly not cut

Recording these so they do not get re-litigated:

- **`src/lib/toast.ts`** (203) — reimplements a slice of `sonner`, but adding a
  dependency to delete code is the wrong trade. The pause/resume clock
  arithmetic (L163-186) is load-bearing for accessibility: a toast must not
  vanish under someone reading it.
- **`src/lib/i18n.ts`** (253) — two hand-maintained bundles, but the Yoruba
  translations are content, not scaffolding.
- **`src/lib/experience-span.ts`, `src/lib/project-kind.ts`,
  `src/lib/site-url.ts`, `src/lib/sidebar-stats.ts`** — single-source-of-truth
  modules that each removed a real duplication. They are the pattern the rest
  of this plan is moving toward.
- **`src/lib/github-contributions.ts`** (243) — the defensive HTML-fragment
  parser looks heavy, but it is the no-token path and every branch fails
  closed. Leave it.
- **`tests/smoke.spec.ts`, `tests/radio-prebuffer.spec.ts`,
  `scripts/resolve-radio-previews.mjs --check`** — the self-checks. Never cut.

---

## Resolved questions

All three were answered on 2026-09-19.

1. **Service worker** — keep the PWA; a real offline story is filed as
   [`docs/pwa-offline-story.md`](./pwa-offline-story.md). No lines cut here.
2. **`showcase_type`** — column was empty on every relevant row; backfill
   migration written. Still needs applying (see 5.2).
3. **Vintage radio markup** — normalise, then merge. Done. For the record,
   the drift that was normalised away:

   | | sidebar | floating |
   |---|---|---|
   | minimise button | `text-ink/40` | `text-ink/50` |
   | close icon | `size={11}` | `size={12}` |
   | transport buttons | `bg-ink/[0.02]` | `bg-ink/[0.03]` |
   | cassette panel | `bg-panel/50` | `bg-panel/60` |
   | cassette label | `HIGH BIAS C-90` / `SIDE A` | `HIGH BIAS · C-90` / `STEREO` |
   | track subtitle | `text-ink/65` | `text-ink/70` |

   Genuinely intentional: the wrapper positioning, `CaretUp` vs `CaretDown`
   (they collapse in opposite directions), the header label, and the cultural
   note which only the sidebar has room for.

   Each was normalised to whichever value was already used more widely in the
   file. Genuinely intentional and now props: wrapper positioning, header
   label, collapse direction, and the cultural note.

## Still open

4. **`posthog-replay-vision-report.md` and `posthog-self-driving-report.md`**
   (repo root, ~12KB, tracked) — generated tool output. Keep as documentation,
   move under `docs/`, or delete? Not counted in the tally either way.
