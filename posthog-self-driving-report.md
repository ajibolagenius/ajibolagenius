# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this web portfolio. Session Replay and Error Tracking were already enabled; Support was enabled in this setup. Health, Error Tracking, and Support signal sources are enabled, and the scout coordinator should begin picking up the fresh configuration within about 30 minutes.

Findings will appear in the [Self-driving inbox](https://eu.posthog.com/project/272499/inbox).

## AI data processing

Approved. The organization-level AI data-processing gate was confirmed by the setup workflow before configuration began.

## GitHub

GitHub is connected through the existing PostHog GitHub App. No GitHub Issues responder was enabled because no connected tool was selected in this run.

## Products enabled

| Product | Result | Notes |
| --- | --- | --- |
| Session Replay | Already enabled | The web client initialization has no disabling override; input masking remains configured. |
| Error Tracking | Already enabled | The web client has exception capture enabled. |
| Support / Conversations | Enabled | Connect an inbound email, inbox, or Slack channel before tickets can arrive. |

## Signal sources

| Signal source | Action | Reference |
| --- | --- | --- |
| `health_checks` / `health_issue` | Enabled | `01a0945c-5791-7048-9b0f-6880e271f555` |
| `error_tracking` / `issue_created` | Enabled | `01a0945c-58dd-767d-b1ba-aec4f940c29d` |
| `error_tracking` / `issue_reopened` | Enabled | `01a0945c-5999-78af-8ea2-814a897dcef2` |
| `error_tracking` / `issue_spiking` | Enabled | `01a0945c-58df-753a-860f-edc85f19cec8` |
| `conversations` / `ticket` | Enabled | `01a0945c-58d3-7d6d-9f32-41947fe3f3ee` |
| `signals_scout` / `cross_source_issue` | Kept on by default | No opt-out row existed, so no row was created. |
| Session replay native source | Deliberately skipped | Replay Vision scanners are the single route for session-replay findings. |

## Connected tools

No connected tools were selected from the interactive picker, so no warehouse-backed responders were enabled. GitHub remains connected but was not authorized as an Issues source.

## Scout troop

**Active: 8 scouts**. Each runs daily by default and emits to the inbox.

| Active scout | What it covers |
| --- | --- |
| `signals-scout-general` | Cross-product patterns and surfaces without a dedicated specialist. |
| `signals-scout-product-analytics` | Engagement funnels, retention, lifecycle, and navigation. |
| `signals-scout-web-analytics` | Traffic, attribution, landing-page health, and 404 changes. |
| `signals-scout-web-vitals` | Page-level Core Web Vitals regressions. |
| `signals-scout-replay-vision` | Scanner throughput, quota health, and themes across Replay Vision observations. |
| `signals-scout-health-checks` | Actionable PostHog setup-health findings. |
| `signals-scout-ai-concierge-reliability` | AI concierge completion and failure-rate regressions. |
| `signals-scout-contact-delivery-health` | Contact delivery failures relative to successful messages. |

**Disabled: 21 scouts**, because their product surfaces are not evidenced as active or are already covered by a dedicated route:

| Disabled scout(s) | Reason |
| --- | --- |
| `signals-scout-error-tracking` | Covered by the enabled native Error Tracking responder. |
| `signals-scout-session-replay` | Covered by the Replay Vision monitors below. |
| `signals-scout-ai-observability`, `signals-scout-apm`, `signals-scout-logs` | No confirmed active AI-observability, tracing, or logs surface. |
| `signals-scout-anomaly-detection`, `signals-scout-insight-alerts`, `signals-scout-observability-gaps` | No evidenced saved-monitoring surface; the focused active scouts provide better initial coverage. |
| `signals-scout-conversations` | No inbound Support channel is connected yet. |
| `signals-scout-csp-violations` | CSP reporting is not configured as a PostHog signal surface. |
| `signals-scout-customer-analytics`, `signals-scout-revenue-analytics` | This is not an evidenced B2B-account or revenue-analytics product. |
| `signals-scout-data-pipelines`, `signals-scout-data-warehouse` | No active pipeline or warehouse source was selected. |
| `signals-scout-experiments`, `signals-scout-feature-flags`, `signals-scout-surveys` | No active experiments, flags, or surveys were found. |
| `signals-scout-inbox-validation` | No shipped Self-driving fixes exist yet to validate. |
| `signals-scout-mcp-tool-calls`, `signals-scout-skills-store`, `signals-scout-tasks` | These do not monitor this portfolio’s visitor-facing experience. |

### Run budget

- **Maximum:** 100 runs/day
- **Used today at setup:** 0
- **Remaining:** 100
- **Coordinator limit:** 3 runs/tick
- **Announcement:** Scouts are in early access. Each project gets up to 100 scout runs a day. Contact `team-self-driving@posthog.com` if you need more.

## Custom scouts

Two custom scouts were proposed and approved, then created with daily enabled, emitting configurations.

| Scout | Coverage and discriminator | Why it is separate |
| --- | --- | --- |
| `signals-scout-ai-concierge-reliability` | Detects sustained declines in completed AI-concierge answers or increases in failed requests, normalized by request volume and requiring broad session reach. | The general and web scouts do not specifically assess the concierge request-to-response outcome. |
| `signals-scout-contact-delivery-health` | Detects sustained, multi-session increases in contact-delivery failures relative to successful messages. | The contact form’s success/failure outcome is a distinct business delivery surface, not a generic traffic or replay concern. |

The scouts explicitly avoid retrieving or retaining visitor prompt text, contact messages, names, and email addresses. If either becomes noisy, set its scout configuration’s `emit` flag to `false` in PostHog to leave it running as a dry run.

Surfaces considered but not added as custom scouts: payment/revenue, surveys, account analytics, data pipelines, and external support/issue systems lacked evidence of active use; errors and replay are already routed through their native responder and Replay Vision monitors.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes what it finds to the inbox. These scanners are the only part of this setup that spends Replay Vision quota. Their findings arrive at half weight and require independent corroboration before they are promoted into an inbox report.

| Scanner | Status | Scope | Sampling | Estimate |
| --- | --- | --- | --- | --- |
| [Portfolio contact journey breakage](https://eu.posthog.com/project/272499/replay-vision/01a09467-8ab7-790d-8c35-23b6e6eefd62) | Created | Root/homepage sessions, the location of the primary contact journey and its immediate portfolio interactions. Watches visible form, concierge, section, and project-card breakage. | 50% | 0 observations / 0 monthly credits at current traffic estimate |
| [Portfolio interaction frustration](https://eu.posthog.com/project/272499/replay-vision/01a09467-89eb-72d4-8509-64b2741db51b) | Created | Sessions containing `$rageclick` only, with no URL filter. Watches visible struggle in the contact form, AI concierge, command palette, filters, and screenshot gallery. | 100% | 0 observations / 0 monthly credits at current traffic estimate |

The monitors use different query axes (homepage URL vs. rage-click event) to minimize overlap. Existing non-signal-emitting scanners were left unchanged, including the existing contact and frustration monitors, scorer, and session summarizer. Replay recordings already exist, so the new monitors are armed immediately.

## Follow-ups

- [ ] Connect an inbound Support / Conversations channel (email, inbox, or Slack) so the enabled ticket responder can receive support tickets.
- [ ] Review early Replay Vision observations and rate useful or unhelpful results in each scanner; ratings become recommendations you can review.
- [ ] Enable a connected-tool responder later only if you want Self-driving to read its open records and automatically open draft PRs for records it judges fixable.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Daily scout runs draw from the project’s 100-run early-access budget; findings are clustered into reports in the [Self-driving inbox](https://eu.posthog.com/project/272499/inbox), where immediately actionable items can begin coding tasks.

## Files changed

- Created `posthog-self-driving-report.md`.
- No application source files were modified.
