---
target: Portfolio direction for senior engineering hiring
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-10-30T12-06-09Z
slug: src-app-page-tsx
---
Method: dual-agent (A: /root/design_review; B: /root/evidence_review). References inspected centrally in a real browser; reviewers assessed the current portfolio independently.

Target: src/app/page.tsx, rendered at http://localhost:3000/. Audience: employers hiring a senior engineer or technical lead. Review date: 30 October 2026.

## Recommended direction

Warm editorial portfolio, with substantial engineering case studies. Preserve cream, dark brown ink, orange, serif display type, technical annotation, Yorùbá and the Nigerian cultural voice. Recompose the page around ownership, judgment, delivery and leadership. The current visual identity is already distinctive; its professional argument needs more specificity.

Victor Sanusi (https://victor.sanusi.dev/) offers a direct professional introduction, named current/previous work and a restrained visual project gallery. Abdullahi Odesanmi (https://www.abdspace.xyz/) offers confident serif typography, a personal motif, plain descriptions of useful side projects and writing. Goran Tomičić (https://goran-tomicic.xyz/) offers calm composition and a senior narrative built around judgment, scope and ownership. His design-system case study (https://goran-tomicic.xyz/work/design-system) explains decisions and what changed. Borrow these principles; keep Ajibola's own identity.

Other viable directions: a compact engineering notebook with smaller visuals and deeper technical writing; or a more expressive interactive gallery. The first suits a writing-led positioning, the second puts more weight on creative frontend craft. For the stated senior/lead audience, warm editorial with engineering depth is the strongest fit.

## Design specificity and overall impression

An authored creative engineer's personal home, currently arranged as an interactive CV/archive. Warm palette, typography, language and cassette player belong together. The role taxonomy and generic slogan do not yet tell an employer what hard problems Ajibola can own. The biggest opportunity is prioritization, rather than another visual theme.

## What's working

- The cream/brown/orange identity has warmth and recognizability. Keep it.
- Screenshots, project pages, engineering notes, current product work and teaching provide substantial evidence to curate.
- Direct CV and contact access, reduced-motion paths and the existing three-role experience limit are useful foundations.

## Priority issues

1. P1: The first screen emphasizes role labels and activity rather than engineering ownership. Make name/role/proposition clear; move selected work earlier. Use verified scope, decisions and results instead of relying on contribution/company/project counts. Commands: clarify, distill, layout.
2. P1: Seven featured projects move automatically and present screenshot/category/title rather than personal contribution. Replace with two or three stationary, substantial cases. Let visitors choose when to advance. Commands: distill, layout, clarify.
3. P1: Optional utilities compete with the reading path. Radio attempts playback after unrelated interactions; require an explicit Play action. Reduce the persistent radio/Ask AI/utility footprint. Keep the cultural artifact in a secondary place. Commands: quieter, distill, harden.
4. P2: Mobile stacks the long profile block before a separate hero and contribution widget. About repeats the profile paragraph; skills repeat across multiple sections. Put name, proposition, work path and first evidence much earlier. Move exhaustive credentials to /cv. Commands: adapt, distill, layout.
5. P2: Craft details need attention: accessible names for social icons, persistent contact labels, larger mobile hit areas, functional metadata sizing, untruncated important titles and shorter desktop text measure. Commands: audit, harden, polish.

## Drop, move and enhance

| Current element | Recommendation |
| --- | --- |
| Fixed 320px profile rail | Remove its persistent full-height role; use a compact introduction and optional local contents in case studies. |
| FULL-STACK · DESIGN · EDUCATOR | Keep as a small descriptor; make a concrete professional proposition the main headline. |
| Design & Engineering. No Boundaries. | Replace with a sentence describing what Ajibola builds and takes responsibility for. |
| Contribution graph / live commit | Move to About or a small Now section. Activity supports the story but should not lead the hiring argument. |
| Moving featured-work reel | Replace with two or three static cases with a larger artifact, role, problem and evidence of impact. |
| Edge marquee | Drop the repeating biography; retain a restrained typographic detail if desired. |
| Ask AI | Remove the persistent launcher or make it optional within About/contact. Essential facts must remain readable directly. |
| Radio | Retain as explicitly opt-in personality, with a compact non-overlapping placement. |
| Full education/certificates/languages | Keep in /cv; include on homepage only when directly relevant to positioning. |
| Skills chips + repeated logos | Replace with a compact capability statement and project-linked evidence. Remove duplicate Supabase entry. |
| Multiple utility controls | Prioritize navigation, CV and contact; group secondary preferences. Preserve access to Yorùbá. |
| Generic 3D avatar | Consider a deliberate portrait or palette-aligned illustration; choose authenticity over decorative novelty. |

## Proposed composition

Compact header (name/mark, Work, About, Notes, CV, contact) → direct professional introduction → two or three selected case studies → evidence of engineering judgment and leadership → compact relevant experience → two strong notes → short personal close/contact. Full archive remains accessible through Work, and full credentials through CV.

Visual treatment: a generous single content canvas, asymmetric introduction, larger product imagery, warm serif statements, readable sans-serif prose, small monospaced technical notes, fine rules and restrained orange. Alternate large project imagery with short evidence blocks rather than enclosing everything in cards. Use animation to support interaction and transitions; keep evaluative content stationary. Mobile has the same content priorities rather than the desktop rail stacked above them.

Draft positioning for discussion, not an approved factual claim: “I build thoughtful interfaces and the systems behind them.” Supporting text can connect full-stack product delivery, design judgment and teaching to the intended role. Use the strongest truthful version rather than changing job titles to imply unsupported seniority.

## Case studies

Choose projects by strength of evidence, not recency. A sensible shortlist to assess is Zora's web/mobile product work, a current production engineering case that can be shared, and a technically distinctive independent project. Avoid using two slots for the same product unless they demonstrate materially different responsibilities.

For each case: problem and constraints → exact personal role and team context → important decision and alternative considered → implementation evidence → verified result and learning. Make shipped/ongoing/prototype status explicit. Existing architecture visualizations are useful; bring their implications forward. Metrics are helpful when substantiated; qualitative results and operational evidence are valid. Teaching belongs as evidence of communication, mentoring, review and creating repeatable systems; course-provider logos alone do less for this audience.

## Heuristic assessment

Design assessment, not a comprehensive accessibility or functional certification.

| # | Heuristic | Score | Key issue |
| --- | --- | --- | --- |
| 1 | System status | 3 | Clear states and feedback; current activity overemphasized. |
| 2 | Real-world match | 2 | Capabilities/duties dominate the senior hiring argument. |
| 3 | User control | 2 | Automatically moving work and interaction-triggered audio. |
| 4 | Consistency | 3 | Coherent identity; dashboard-like widget and avatar differ. |
| 5 | Error prevention | 3 | Basic form constraints; placeholder-only labels. |
| 6 | Recognition | 2 | Unnamed icon links; cards omit role/outcome. |
| 7 | Efficiency | n/a | Product accelerators not essential for this portfolio. |
| 8 | Minimalism | 2 | Utilities and repeated CV material compete with work. |
| 9 | Error recovery | 3 | Source shows recovery and retained form input; not submitted live. |
| 10 | Help/docs | n/a | Documentation not required for the hiring journey. |
| Total | | 20/32, Acceptable | Foundation is sound; evidence hierarchy needs work. |

## Cognitive load, emotional journey and personas

Four checklist failures: single focus, chunking, minimal choices and progressive disclosure. Main choices include five navigation destinations, seven featured projects, multiple utilities and repeated skills. Grouping and visual coherence are strengths. Arrival feels warm and deliberate, but the evaluative middle loses conviction because evidence is scattered and the long CV sequence delays the close.

First-time recruiter: can locate name/CV but must infer senior scope. Skeptical hiring manager: counts and responsibilities do not answer what changed because of Ajibola's judgment. Distracted mobile visitor: the stacked introduction delays projects and persistent bottom controls compete for space.

## Detector and browser synthesis

The static scan of the selected TSX files returned zero findings. The rendered browser scan recorded 59 occurrences across 52 groups and 10 rules; 48 occurrences remained after excluding hidden markup. Relevant signals are small functional text, truncated card text, long experience lines and moving content. Font popularity, cassette nesting, card heading spacing and an inferred gradient-text flag were not treated as confirmed design defects. Static and rendered scopes differ, so their counts are not comparable quality scores.

Both assessments agree that senior evidence is delayed and optional widgets compete. B's resized mobile capture shows an expanded radio obstruction; A's fresh mobile reload shows the compact player. Synthesis: player size depends on state, and compact radio/Ask AI can still compete at the bottom. Do not describe the expanded state as a universal fresh-mobile default.

## Follow-up choices

Which tonal exploration should lead: warm editorial (recommended), compact technical notebook, or expressive interactive gallery? Which personal signature should receive the strongest emphasis: language/typography, a portrait/illustration, or the optional cassette? These choices do not block the recommendations above.

## Run notes

Target slug src-app-page-tsx; ignore list absent. A and B remained independent until A completed. A inspected desktop and fresh mobile; central review inspected all three supplied references plus Goran's design-system case. Static detector succeeded; rendered overlay succeeded via bundled inline script after localhost script URL was blocked by CSP. No persistent user-visible overlay remains. Temporary overlay server stopped, review browser sessions closed, pre-existing app server left running. No contact message submitted or app source modified. Review evidence lives in /tmp; temporary report body is deleted after archive write. First scored run; no trend yet.
