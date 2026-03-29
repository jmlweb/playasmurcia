# Task #065: Homepage Motion and Design Polish

## Metadata

- **Status**: done
- **Priority**: P4 - Later
- **Slice**: Styling
- **Created**: 2026-03-29
- **Completed**: 2026-03-29
- **Blocked by**: -

## User Story

As a visitor, I want subtle, polished animations on the homepage so that the site feels premium and editorial without sacrificing performance.

## Context

Home page design and motion review (2026-03-29). The page already has strong fundamentals (hero entrance, card hovers, reduced-motion support). These improvements push toward "award-site" polish.

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

## Notes

Report: `reports/done/home-design-motion-review.md`.
