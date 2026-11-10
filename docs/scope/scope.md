# Scope: ajibola portfolio

**Workflow:** Beta (assumed default, no tier was on record; change it with `/scope`)
**Approach:** Tracer Bullet (assumed default, see spec 0001)

## At a glance

| Feature | Status | Spec |
|---|---|---|
| CommonGround redesign | in-progress | [0001](../specs/0001-commonground-redesign/index.md) |

## CommonGround redesign · in-progress

Move the whole public site onto the CommonGround design (dark, BBH Bogle and Geist Mono, one accent), keeping projects, notes, sandbox, CV, contact, admin, and the kept extras, and removing the rest.

Done when: every public page in the new design is live on `main` after one cutover, old URLs redirect cleanly, and the removed features are gone.

Spec: [0001](../specs/0001-commonground-redesign/index.md)

- [x] Design it (spec)
- [ ] Build it: /develop commonground redesign
  - [x] Foundation on `main`: additive migration and temporary `/work` redirects (AC-4, AC-5, AC-7)
  - [ ] Branch, design system, shell, admin and contact changes (AC-1, AC-2, AC-3, AC-5, AC-7, AC-10, AC-12, AC-13)
  - [ ] Tracer slice: `/work` on real data, routes, redirects, smoke suite on preview (AC-4, AC-6, AC-14)
  - [ ] Removals and the shared OG card (AC-9, AC-11)
  - [ ] Pages, each after its child spec (0003 to 0009), then cutover (AC-7, AC-8, AC-10, AC-14)
- [ ] Verify it: /check verify commonground redesign
- [ ] Test it: /test commonground redesign

## Deferred

- Drop `projects.year` once nothing reads it (from spec 0001).
