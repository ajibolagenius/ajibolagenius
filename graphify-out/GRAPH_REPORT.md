# Graph Report - ajibola-portfolio  (2026-09-19)

## Corpus Check
- 210 files · ~196,819 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 948 nodes · 2054 edges · 57 communities (37 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4ae0fe3e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useLanguage
- admin/actions.ts
- toast.ts
- projects/[slug]/page.tsx
- og-template.tsx
- now-widget.tsx
- devDependencies
- dependencies
- Next.js - Docs
- compilerOptions
- VintageRadioManager
- Best practices when using `identify`
- assistant/route.ts
- vintage-radio.tsx
- project-showcase.tsx
- Simplification plan
- project-kind.ts
- createClient
- getCvData
- track
- projects-grid.tsx
- sandbox-experiments.ts
- getSiteHost
- app/layout.tsx
- project.ts
- project-form.tsx
- SoundManager
- analytics.ts
- resolve-radio-previews.mjs
- command-palette.tsx
- sound.ts
- Replay Vision - Docs
- Replay Vision - Docs
- Instructions
- Replay vision scanner mechanics
- use-prefers-reduced-motion.ts
- Session Replay installation - Docs
- next.config.ts
- sw.js/route.ts
- Hello, Universe. I'm Ajibola.
- admin/layout.tsx
- replay-vision-scanner-broken-experiences/references/COMMANDMENTS.md
- replay-vision-scanner-broken-experiences/SKILL.md
- replay-vision-scanner-user-frustration/references/COMMANDMENTS.md
- replay-vision-scanner-user-frustration/SKILL.md
- replay-vision-scanners-core/references/COMMANDMENTS.md
- replay-vision-setup/references/COMMANDMENTS.md
- eslint.config.mjs
- postcss.config.mjs
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 69 edges
2. `useLanguage()` - 48 edges
3. `track()` - 36 edges
4. `getCvData` - 34 edges
5. `VintageRadioManager` - 27 edges
6. `getSiteHost()` - 19 edges
7. `useRouteTransition()` - 18 edges
8. `splitList()` - 18 edges
9. `usePrefersReducedMotion()` - 17 edges
10. `sound` - 16 edges

## Surprising Connections (you probably didn't know these)
- `LicensesPage()` --calls--> `getCvData`  [EXTRACTED]
  src/app/licenses/page.tsx → src/lib/cv-data.ts
- `SandboxPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/sandbox/page.tsx → src/lib/supabase/server.ts
- `submitContactMessage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/actions.ts → src/lib/supabase/server.ts
- `handleForgotPassword()` --calls--> `createClient()`  [EXTRACTED]
  src/app/admin/(auth)/login/page.tsx → src/lib/supabase/client.ts
- `handleSubmit()` --calls--> `createClient()`  [EXTRACTED]
  src/app/admin/(auth)/reset-password/page.tsx → src/lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (57 total, 13 thin omitted)

### Community 0 - "useLanguage"
Cohesion: 0.05
Nodes (64): ErrorPage(), LICENSES, LicensesPage(), metadata, generateMetadata(), revalidate, twitterHandle(), metadata (+56 more)

### Community 1 - "admin/actions.ts"
Cohesion: 0.09
Nodes (41): createProject(), deleteProject(), parseListField(), projectInputFromForm(), revalidateProjectSurfaces(), toggleFeatured(), updateProject(), createResourceRow() (+33 more)

### Community 2 - "toast.ts"
Cohesion: 0.06
Nodes (40): signOut(), AdminLoginPage(), handleForgotPassword(), handleSubmit(), ResetPasswordPage(), handleSubmit(), AdminShell(), posthogConfigured (+32 more)

### Community 3 - "projects/[slug]/page.tsx"
Cohesion: 0.08
Nodes (35): metadata, NotesPage(), revalidate, alt, contentType, size, generateMetadata(), NoteDetailPage() (+27 more)

### Community 4 - "og-template.tsx"
Cohesion: 0.08
Nodes (28): alt, contentType, Image(), size, alt, contentType, Image(), size (+20 more)

### Community 5 - "now-widget.tsx"
Cohesion: 0.10
Nodes (31): dynamic, GET(), runtime, Hero(), NowLiveCommit(), checkLatest(), NowLiveCommitProps, LEVEL_FILL (+23 more)

### Community 6 - "devDependencies"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss (+25 more)

### Community 7 - "dependencies"
Cohesion: 0.06
Nodes (33): ai, @ai-sdk/react, clsx, next, dependencies, ai, @ai-sdk/react, clsx (+25 more)

### Community 8 - "Next.js - Docs"
Cohesion: 0.06
Nodes (30): Accessing PostHog, App router, Beta: integration via LLM, Bun, Bun, Client-side setup, Configuring a reverse proxy to PostHog, Further reading (+22 more)

### Community 9 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 11 - "Best practices when using `identify`"
Cohesion: 0.08
Nodes (25): 1\. Call `identify` as soon as you're able to, 2\. Use unique strings for distinct IDs, 3\. Reset after logout, 4\. Person profiles and properties, 5\. Use deep links between platforms, Android, Android, Android (+17 more)

### Community 12 - "assistant/route.ts"
Cohesion: 0.15
Nodes (20): hits, isRateLimited(), submitContactMessage(), buildInstructions(), dynamic, hits, isRateLimited(), POST() (+12 more)

### Community 13 - "vintage-radio.tsx"
Cohesion: 0.14
Nodes (19): routeHasSidebar(), SidebarVintageRadio(), useRadioControls(), VintageRadio(), getVintageRadioServerSnapshot(), getVintageRadioSnapshot(), SERVER_SNAPSHOT, subscribeVintageRadio() (+11 more)

### Community 14 - "project-showcase.tsx"
Cohesion: 0.10
Nodes (16): AFROGRAPH_FLOWS, AfroGraphArchitectureShowcase(), AfroGraphFlowKey, ArchitectureNode, ZORA_FLOWS, ZORA_NODES, ZoraArchitectureShowcase(), ZoraFlowKey (+8 more)

### Community 15 - "Simplification plan"
Cohesion: 0.09
Nodes (21): 2.1 `src/lib/og-template.tsx` (547 → ~480), 2.2 `src/app/api/assistant/route.ts` (368 → ~320), 2.3 `src/components/command-palette.tsx` (1034 → ~870), 2.4 `src/components/architecture-visualizer.tsx` (711 → ~660), 2.5 `src/components/ai-assistant.tsx` (789 → ~755), 2.6 `src/lib/sound.ts` (230 → ~130), 4.1 Comma-splitting, five copies, 4.2 `scripts/resolve-radio-previews.mjs:26-37` (+13 more)

### Community 16 - "project-kind.ts"
Cohesion: 0.20
Nodes (16): buildMarqueeBase(), FeaturedCard(), FeaturedWork(), MarqueeTrack(), MobileCarousel(), PinnedPromoCard(), ProjectCard(), STATUS_LABELS (+8 more)

### Community 17 - "createClient"
Cohesion: 0.19
Nodes (13): AdminDashboardLayout(), EditProjectPage(), NewProjectPage(), GET(), revalidate, GET(), HomePage(), sitemap() (+5 more)

### Community 18 - "getCvData"
Cohesion: 0.15
Nodes (18): alt, contentType, Image(), size, ContactIcon, ContactItem, CvPage(), CvProject (+10 more)

### Community 19 - "track"
Cohesion: 0.16
Nodes (16): AiAssistant(), handleStarterClick(), handleSubmit(), JobMatchOutput, LiveStatusOutput, RecommendNoteOutput, RecommendProjectOutput, renderMarkdownText() (+8 more)

### Community 20 - "projects-grid.tsx"
Cohesion: 0.19
Nodes (14): FilterOption, FilterPills(), FilterSelect(), getLayoutServerSnapshot(), getLayoutSnapshot(), LayoutMode, ProjectsGrid(), subscribeLayout() (+6 more)

### Community 21 - "sandbox-experiments.ts"
Cohesion: 0.16
Nodes (14): ColorLabExperiment(), contrastRatio(), grade(), hexToRgb(), PRESETS, relativeLuminance(), createGeometry(), GeometryShape (+6 more)

### Community 22 - "getSiteHost"
Cohesion: 0.19
Nodes (12): Image(), alt, contentType, Image(), size, alt, contentType, Image() (+4 more)

### Community 23 - "app/layout.tsx"
Cohesion: 0.16
Nodes (9): geistMono, geistSans, habibi, metadata, viewport, LanguageScript(), ServiceWorkerRegistration(), UpdateModal() (+1 more)

### Community 24 - "project.ts"
Cohesion: 0.23
Nodes (11): metadata, revalidate, SandboxPage(), SandboxCard(), STATUS_LABELS, SandboxGrid(), useTilt(), hasSandboxExperiment() (+3 more)

### Community 25 - "project-form.tsx"
Cohesion: 0.26
Nodes (11): uploadProjectScreenshot(), Draft, draftField(), draftList(), getDraftSnapshot(), ProjectForm(), subscribeDraft(), ScreenshotsInput() (+3 more)

### Community 27 - "analytics.ts"
Cohesion: 0.30
Nodes (9): GlobalError(), AnalyticsListeners(), currentLocale(), currentTheme(), readableKind(), enabled, registerProps(), syncOwnerFlag() (+1 more)

### Community 28 - "resolve-radio-previews.mjs"
Cohesion: 0.24
Nodes (9): check(), dry, OUT, readCuration(), readCurationFields(), resolved, SRC, TRACKS_DIR (+1 more)

### Community 29 - "command-palette.tsx"
Cohesion: 0.25
Nodes (10): CommandPalette(), getThemeServerSnapshot(), getThemeSnapshot(), loadPaletteData(), NoteData, PaletteData, PaletteGroup, PaletteItem (+2 more)

### Community 30 - "sound.ts"
Cohesion: 0.33
Nodes (6): getSoundServerSnapshot(), getSoundSnapshot(), SoundToggle(), subscribeSound(), Note, sound

### Community 31 - "Replay Vision - Docs"
Cohesion: 0.22
Nodes (8): Further reading, How it works, Replay Vision - Docs, Replay Vision - Docs, Still have questions?, Was this page useful?, What you can do with it, Where to go next

### Community 32 - "Replay Vision - Docs"
Cohesion: 0.22
Nodes (8): Further reading, How it works, Replay Vision - Docs, Replay Vision - Docs, Still have questions?, Was this page useful?, What you can do with it, Where to go next

### Community 33 - "Instructions"
Cohesion: 0.22
Nodes (8): Abort cases, Instructions, Set up PostHog Replay vision, STEP 1: Read the project and the repo, STEP 2: Make sure session replay records, STEP 3: Load the scanner mechanics and size before you ship, STEP 4: Create the scanners, STEP 5: Report and hand off

### Community 34 - "Replay vision scanner mechanics"
Cohesion: 0.29
Nodes (6): Endpoint availability, Filling a scanner brief, Load the authoritative mechanics first, Re-runs and collisions, Replay vision scanner mechanics, The two monitors' queries stay disjoint

### Community 35 - "use-prefers-reduced-motion.ts"
Cohesion: 0.43
Nodes (5): cache, Entry, entryFor(), getServerSnapshot(), useMediaQuery()

### Community 36 - "Session Replay installation - Docs"
Cohesion: 0.40
Nodes (4): Session Replay installation - Docs, Session Replay installation - Docs, Still have questions?, Was this page useful?

### Community 37 - "next.config.ts"
Cohesion: 0.40
Nodes (4): contentSecurityPolicy, nextConfig, posthogAssetsHost, securityHeaders

### Community 38 - "sw.js/route.ts"
Cohesion: 0.67
Nodes (3): dynamic, GET(), getBuildVersion()

## Knowledge Gaps
- **313 isolated node(s):** `eslintConfig`, `posthogAssetsHost`, `contentSecurityPolicy`, `securityHeaders`, `nextConfig` (+308 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 369 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `useLanguage`, `admin/actions.ts`, `toast.ts`, `projects/[slug]/page.tsx`, `og-template.tsx`, `assistant/route.ts`, `getCvData`, `getSiteHost`, `project.ts`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `track()` connect `track` to `projects/[slug]/page.tsx`, `assistant/route.ts`, `vintage-radio.tsx`, `project-kind.ts`, `projects-grid.tsx`, `app/layout.tsx`, `project.ts`, `analytics.ts`, `resolve-radio-previews.mjs`, `command-palette.tsx`, `sound.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `VintageRadioManager` connect `VintageRadioManager` to `vintage-radio.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useLanguage()` (e.g. with `getLanguageServerSnapshot()` and `getLanguageSnapshot()`) actually correct?**
  _`useLanguage()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `posthogAssetsHost`, `contentSecurityPolicy` to the rest of the system?**
  _313 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useLanguage` be split into smaller, more focused modules?**
  _Cohesion score 0.05025773195876289 - nodes in this community are weakly interconnected._
- **Should `admin/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08619777895293496 - nodes in this community are weakly interconnected._