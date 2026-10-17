---
id: TSK-065
title: Homepage Motion and Design Polish
status: complete
priority: P4
tags: [styling]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# Homepage Motion and Design Polish

## Description

As a visitor, I want subtle, polished animations on the homepage so that the site feels premium and editorial without sacrificing performance.

## Acceptance Criteria

- [x] Scroll-triggered reveals (Intersection Observer + opacity/translate) for featured beaches, municipalities, and highlights sections; honor `prefers-reduced-motion`
- [x] Refined easing: replaced `ease-out` with `cubic-bezier(0.16, 1, 0.3, 1)` on hero and reveal animations
- [x] CTA arrow icons: subtle `translateX` on hover/focus via `.arrow-nudge` class
- [x] Align hover durations/easing between municipality tiles and beach cards — both use Tailwind `transition-all` defaults
- [x] Performance: all motion uses `transform`/`opacity` only; reduced-motion fully honored

### Nice to have

- [ ] Subtle hero parallax or slow Ken Burns on desktop — deferred
- [ ] Low-opacity noise/SVG texture on hero gradient — deferred
- [ ] View Transitions API for route changes — deferred (router support pending)

## Context

Home page design and motion review (2026-03-29). The page already has strong fundamentals (hero entrance, card hovers, reduced-motion support). These improvements push toward "award-site" polish.

## Notes

Report: `.backlog/reports/complete/RPT-014-home-page-design-and-motion.md`.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #065)
