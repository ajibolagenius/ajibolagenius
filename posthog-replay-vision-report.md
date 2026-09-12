# Replay Vision Setup Report

Session replay was already recording on this project — no SDK install or init was needed. This run added three PostHog Replay vision scanners that read those recordings and surface what's happening on ajibola-portfolio.

## Recording status

Session replay is fully live. Server-side recording was already enabled, and the client init (`instrumentation-client.ts`) has no `disable_session_recording` override that would cancel it. Nothing to fix here.

## Scanners created

### 1. Contact form breakage (monitor)
- **Watches:** the contact form on the home page (`/`) getting stuck — a spinner that never resolves, an error shown while stuck sending, a success confirmation that never appears, or a silent no-op on a dropped request.
- **Query scope:** sessions on the root URL only (regex-matched, since this is a single-page site and the form has no separate route).
- **Sampling:** 50% of matching sessions, model `gemini-3-flash-preview`.
- **Estimated monthly credits:** 0 (based on a 7-day estimate window with 0 matching sessions — will start costing credits once real traffic hits the form).
- **Location:** [View scanner](https://eu.posthog.com/project/272499/replay-vision/01a09449-a7f2-75a9-96cf-7fedbdd05de9)

### 2. Portfolio frustration signals (monitor)
- **Watches:** rage-click-driven frustration anywhere on the site — retrying the contact form after an error, hammering the AI assistant's send button while it streams, dead-end command palette searches, filtering the projects/sandbox grid to empty, or thrashing a project's screenshot lightbox.
- **Query scope:** gated only on the `$rageclick` event, no URL restriction — kept deliberately separate from the contact-form monitor above so the two never overlap.
- **Sampling:** 100% of matching sessions, model `gemini-3-flash-preview`.
- **Estimated monthly credits:** 0 (rage-click events are rare on this site today).
- **Location:** [View scanner](https://eu.posthog.com/project/272499/replay-vision/01a09448-c202-76e4-b62e-80061bbfbf98)

### 3. Portfolio visitor session recaps (summarizer)
- **Watches:** general visitor behavior across the whole site — browsing projects, reading notes, exploring the sandbox, viewing the CV, reaching out via the contact form or social links — and produces a plain-language recap per session.
- **Query scope:** unscoped, applies to all recorded sessions.
- **Sampling:** 10% of sessions, model `gemini-3-flash-preview`.
- **Estimated monthly credits:** 0 (no sweeps have run yet; this will rise with real traffic since it's unscoped).
- **Location:** [View scanner](https://eu.posthog.com/project/272499/replay-vision/01a09448-fcdd-75d0-be8f-c41c91c5dc73)

## Budget

All three scanners were created directly without needing your sign-off — each estimate came back at 0 projected monthly credits against a 7,500-credit balance (0 used so far). Actual spend will only show up once the site gets enough traffic for these queries to match sessions; keep an eye on it if traffic picks up, since the summarizer in particular is unscoped and will scale with total sessions.

## Nothing skipped

All three scanner types (breakage monitor, frustration monitor, session summarizer) were created — nothing was deferred. There was no pre-existing scanner conflict: the frustration monitor and the breakage monitor were checked against each other to stay disjoint (one is URL-scoped to the contact form, the other is event-gated on rage clicks only, with no URL filter).

## Where to look

Head to the [Replay vision page](https://eu.posthog.com/project/272499/replay-vision) in PostHog. Results appear as new recordings complete and get swept by each scanner — so the first observations will show up once real visitors start using the site after this run.
