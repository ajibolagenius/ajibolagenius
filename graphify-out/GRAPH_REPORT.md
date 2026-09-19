# Graph Report - ajibola-portfolio  (2026-09-19)

## Corpus Check
- 212 files · ~197,735 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 962 nodes · 2067 edges · 54 communities (34 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e38d255d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- admin/actions.ts
- og-template.tsx
- projects/[slug]/page.tsx
- toast.ts
- now-widget.tsx
- top-nav.tsx
- useLanguage
- Simplification plan
- devDependencies
- dependencies
- Next.js - Docs
- app/page.tsx
- compilerOptions
- VintageRadioManager
- Best practices when using `identify`
- featured-work.tsx
- project-showcase.tsx
- track
- use-vintage-radio.ts
- projects-grid.tsx
- app/layout.tsx
- analytics.ts
- SoundManager
- resolve-radio-previews.mjs
- command-palette.tsx
- experience.tsx
- Replay Vision - Docs
- Replay Vision - Docs
- Instructions
- vintage-radio.tsx
- Replay vision scanner mechanics
- middleware.ts
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
3. `track()` - 35 edges
4. `getCvData` - 34 edges
5. `VintageRadioManager` - 27 edges
6. `getSiteHost()` - 19 edges
7. `useRouteTransition()` - 18 edges
8. `splitList()` - 18 edges
9. `usePrefersReducedMotion()` - 17 edges
10. `sound` - 16 edges

## Surprising Connections (you probably didn't know these)
- `NewProjectPage()` --calls--> `getProjectFieldOptions()`  [EXTRACTED]
  src/app/admin/(dashboard)/projects/new/page.tsx → src/lib/project-options.ts
- `LicensesPage()` --calls--> `getCvData`  [EXTRACTED]
  src/app/licenses/page.tsx → src/lib/cv-data.ts
- `NotFound()` --calls--> `getCvData`  [EXTRACTED]
  src/app/not-found.tsx → src/lib/cv-data.ts
- `SandboxPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/sandbox/page.tsx → src/lib/supabase/server.ts
- `ExpandedDeck()` --calls--> `track()`  [EXTRACTED]
  src/components/vintage-radio.tsx → src/lib/analytics.ts

## Import Cycles
- None detected.

## Communities (54 total, 13 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.06
Nodes (56): hits, isRateLimited(), submitContactMessage(), AdminDashboardLayout(), EditProjectPage(), buildInstructions(), dynamic, hits (+48 more)

### Community 1 - "admin/actions.ts"
Cohesion: 0.07
Nodes (49): createProject(), deleteProject(), parseListField(), projectInputFromForm(), revalidateProjectSurfaces(), toggleFeatured(), updateProject(), uploadProjectScreenshot() (+41 more)

### Community 2 - "og-template.tsx"
Cohesion: 0.06
Nodes (46): alt, contentType, size, alt, contentType, Image(), size, alt (+38 more)

### Community 3 - "projects/[slug]/page.tsx"
Cohesion: 0.07
Nodes (45): generateMetadata(), getNavigationProjects, getProject, ProjectDetailPage(), revalidate, STATUS_LABELS, metadata, revalidate (+37 more)

### Community 4 - "toast.ts"
Cohesion: 0.07
Nodes (39): signOut(), AdminLoginPage(), handleForgotPassword(), handleSubmit(), ResetPasswordPage(), handleSubmit(), AdminShell(), posthogConfigured (+31 more)

### Community 5 - "now-widget.tsx"
Cohesion: 0.10
Nodes (31): dynamic, GET(), runtime, Hero(), NowLiveCommit(), checkLatest(), NowLiveCommitProps, LEVEL_FILL (+23 more)

### Community 6 - "top-nav.tsx"
Cohesion: 0.10
Nodes (27): metadata, NotesPage(), revalidate, generateMetadata(), NoteDetailPage(), revalidate, getIsMacServerSnapshot(), getIsMacSnapshot() (+19 more)

### Community 7 - "useLanguage"
Cohesion: 0.12
Nodes (22): ErrorPage(), LICENSES, LicensesPage(), metadata, NotFound(), BackToTop(), EdgeMarquee(), ShareButtons() (+14 more)

### Community 8 - "Simplification plan"
Cohesion: 0.06
Nodes (32): 1. An offline fallback document, 2. Decide whether real pages are worth caching, 3. Then reconsider the `/_next/static/` branch, Give the PWA a real offline story, Not in scope, Related, The problem, Verification (+24 more)

### Community 9 - "devDependencies"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss (+25 more)

### Community 10 - "dependencies"
Cohesion: 0.06
Nodes (33): ai, @ai-sdk/react, clsx, next, dependencies, ai, @ai-sdk/react, clsx (+25 more)

### Community 11 - "Next.js - Docs"
Cohesion: 0.06
Nodes (30): Accessing PostHog, App router, Beta: integration via LLM, Bun, Bun, Client-side setup, Configuring a reverse proxy to PostHog, Further reading (+22 more)

### Community 12 - "app/page.tsx"
Cohesion: 0.15
Nodes (19): generateMetadata(), revalidate, twitterHandle(), About(), Certifications(), Connect(), Education(), FeaturedNotes() (+11 more)

### Community 13 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 15 - "Best practices when using `identify`"
Cohesion: 0.08
Nodes (25): 1\. Call `identify` as soon as you're able to, 2\. Use unique strings for distinct IDs, 3\. Reset after logout, 4\. Person profiles and properties, 5\. Use deep links between platforms, Android, Android, Android (+17 more)

### Community 16 - "featured-work.tsx"
Cohesion: 0.13
Nodes (19): buildMarqueeBase(), FeaturedCard(), FeaturedWork(), MarqueeTrack(), MobileCarousel(), LanguageToggle(), createGeometry(), GeometryShape (+11 more)

### Community 17 - "project-showcase.tsx"
Cohesion: 0.10
Nodes (16): AFROGRAPH_FLOWS, AfroGraphArchitectureShowcase(), AfroGraphFlowKey, ArchitectureNode, ZORA_FLOWS, ZORA_NODES, ZoraArchitectureShowcase(), ZoraFlowKey (+8 more)

### Community 18 - "track"
Cohesion: 0.17
Nodes (16): AiAssistant(), handleStarterClick(), handleSubmit(), JobMatchOutput, LiveStatusOutput, RecommendNoteOutput, RecommendProjectOutput, renderMarkdownText() (+8 more)

### Community 19 - "use-vintage-radio.ts"
Cohesion: 0.17
Nodes (15): getVintageRadioServerSnapshot(), getVintageRadioSnapshot(), SERVER_SNAPSHOT, subscribeVintageRadio(), useVintageRadio(), RADIO_PREVIEWS, RadioPreview, STORAGE_KEYS (+7 more)

### Community 20 - "projects-grid.tsx"
Cohesion: 0.19
Nodes (14): FilterOption, FilterPills(), FilterSelect(), getLayoutServerSnapshot(), getLayoutSnapshot(), LayoutMode, ProjectsGrid(), ProjectsGridFallback() (+6 more)

### Community 21 - "app/layout.tsx"
Cohesion: 0.16
Nodes (9): geistMono, geistSans, habibi, metadata, viewport, LanguageScript(), ServiceWorkerRegistration(), UpdateModal() (+1 more)

### Community 22 - "analytics.ts"
Cohesion: 0.27
Nodes (10): GlobalError(), AnalyticsListeners(), currentLocale(), currentTheme(), readableKind(), analyticsIds(), enabled, registerProps() (+2 more)

### Community 24 - "resolve-radio-previews.mjs"
Cohesion: 0.24
Nodes (9): check(), dry, OUT, readCuration(), readCurationFields(), resolved, SRC, TRACKS_DIR (+1 more)

### Community 25 - "command-palette.tsx"
Cohesion: 0.25
Nodes (10): CommandPalette(), getThemeServerSnapshot(), getThemeSnapshot(), loadPaletteData(), NoteData, PaletteData, PaletteGroup, PaletteItem (+2 more)

### Community 26 - "experience.tsx"
Cohesion: 0.36
Nodes (7): CompanyIcon(), Experience(), assignCompanyIcons(), COLORS, CompanyIconStyle, hashString(), pickCompanyIcon()

### Community 27 - "Replay Vision - Docs"
Cohesion: 0.22
Nodes (8): Further reading, How it works, Replay Vision - Docs, Replay Vision - Docs, Still have questions?, Was this page useful?, What you can do with it, Where to go next

### Community 28 - "Replay Vision - Docs"
Cohesion: 0.22
Nodes (8): Further reading, How it works, Replay Vision - Docs, Replay Vision - Docs, Still have questions?, Was this page useful?, What you can do with it, Where to go next

### Community 29 - "Instructions"
Cohesion: 0.22
Nodes (8): Abort cases, Instructions, Set up PostHog Replay vision, STEP 1: Read the project and the repo, STEP 2: Make sure session replay records, STEP 3: Load the scanner mechanics and size before you ship, STEP 4: Create the scanners, STEP 5: Report and hand off

### Community 30 - "vintage-radio.tsx"
Cohesion: 0.31
Nodes (6): ExpandedDeck(), RadioControls, routeHasSidebar(), SidebarVintageRadio(), useRadioControls(), VintageRadio()

### Community 31 - "Replay vision scanner mechanics"
Cohesion: 0.29
Nodes (6): Endpoint availability, Filling a scanner brief, Load the authoritative mechanics first, Re-runs and collisions, Replay vision scanner mechanics, The two monitors' queries stay disjoint

### Community 32 - "middleware.ts"
Cohesion: 0.43
Nodes (4): OWNER_EMAIL, updateSession(), config, proxy()

### Community 33 - "Session Replay installation - Docs"
Cohesion: 0.40
Nodes (4): Session Replay installation - Docs, Session Replay installation - Docs, Still have questions?, Was this page useful?

### Community 34 - "next.config.ts"
Cohesion: 0.40
Nodes (4): contentSecurityPolicy, nextConfig, posthogAssetsHost, securityHeaders

### Community 35 - "sw.js/route.ts"
Cohesion: 0.67
Nodes (3): dynamic, GET(), getBuildVersion()

## Knowledge Gaps
- **322 isolated node(s):** `eslintConfig`, `posthogAssetsHost`, `contentSecurityPolicy`, `securityHeaders`, `nextConfig` (+317 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 377 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `admin/actions.ts`, `og-template.tsx`, `projects/[slug]/page.tsx`, `toast.ts`, `top-nav.tsx`, `app/page.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `track()` connect `track` to `createClient`, `projects/[slug]/page.tsx`, `top-nav.tsx`, `useLanguage`, `projects-grid.tsx`, `app/layout.tsx`, `analytics.ts`, `resolve-radio-previews.mjs`, `command-palette.tsx`, `vintage-radio.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `VintageRadioManager` connect `VintageRadioManager` to `use-vintage-radio.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useLanguage()` (e.g. with `getLanguageServerSnapshot()` and `getLanguageSnapshot()`) actually correct?**
  _`useLanguage()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `posthogAssetsHost`, `contentSecurityPolicy` to the rest of the system?**
  _322 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.06198198198198198 - nodes in this community are weakly interconnected._
- **Should `admin/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07472613458528951 - nodes in this community are weakly interconnected._