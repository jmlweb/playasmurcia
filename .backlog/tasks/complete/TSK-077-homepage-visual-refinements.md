---
id: TSK-077
title: Homepage Visual Refinements
status: complete
priority: P3
tags: [styling]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Homepage Visual Refinements

## Description

As a visitor landing on the homepage, I want generous spacing, stronger visual hierarchy, and polished details so that the site feels like a premium travel guide.

## Acceptance Criteria

- [x] Increase section padding: `py-16 sm:py-20` → `py-20 sm:py-28 lg:py-36`
- [x] Fix hero gradient overlay: `from-ocean-900/70 via-ocean-900/75 to-ocean-900/90` → `from-transparent via-ocean-900/20 to-ocean-900/80`
- [x] Increase featured beaches grid gap from `gap-x-4 gap-y-6` to `gap-6 xl:gap-8`
- [x] Redesign municipality section: reduce to 2–3 columns, add background image per municipality
- [x] Redesign "Region highlights" as full-bleed editorial strip or remove — fix third card `sm:col-span-2` stretching at 768px
- [x] Vary section header pattern (not every section same uppercase label + bold heading)
- [x] Increase secondary CTA border from `border-white/20` to `border-white/30`
- [x] Add "Ver todas las playas" link next to featured beaches heading
- [x] Fix hero buttons from `focus:` to `focus-visible:`
- [x] Add ring transition to municipality cards to avoid snap effect
- [x] Remove redundant `border-t border-gray-200` from municipalities section
- [x] Reduce hero animation delays (600ms+300ms too slow — target 400ms total)

## Context

UI audit (2026-03-29) and homepage report identified spacing, gradient, and section layout refinements needed for a more editorial feel.

## Source Reports

- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — I1–I4, R1, R2
- `.backlog/reports/complete/RPT-016-homepage-ui-review-directive.md` — HP2–HP9
- `.backlog/reports/complete/RPT-015-homepage-design-directive-ui-review.md` — HM1, HM2

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #077)
