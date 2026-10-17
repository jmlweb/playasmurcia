---
id: TSK-083
title: Motion and Animation Polish
status: complete
priority: P4
tags: [styling]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Motion and Animation Polish

## Description

As a visitor, I want fluid, intentional animations across the site so that interactions feel premium without being distracting.

## Acceptance Criteria

- [ ] Add page transition animations (opacity fade 0.3–0.6s) using TanStack Router navigation events or View Transitions API
- [x] Add subtle hero parallax or slow Ken Burns effect on desktop (with `prefers-reduced-motion` guard)
- [x] Add low-opacity noise/SVG texture over hero gradient to reduce banding on OLED
- [x] Add stronger `:active` states on primary buttons for mobile tap feedback
- [x] Ensure all motion uses `transform`/`opacity` only; `will-change` used sparingly
- [x] Align hover durations/easing across all card types via shared CSS tokens

## Context

Home-design-motion review and UI audit identified opportunities for site-wide animation improvements beyond the homepage (which was addressed in #065).

## Source Reports

- `.backlog/reports/complete/RPT-014-home-page-design-and-motion.md` — M1–M6, M8–M10
- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — XC5

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #083)
