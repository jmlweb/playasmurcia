# Task #083: Motion and Animation Polish

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P4 - Later
- **Slice**: Styling
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor, I want fluid, intentional animations across the site so that interactions feel premium without being distracting.

## Context

Home-design-motion review and UI audit identified opportunities for site-wide animation improvements beyond the homepage (which was addressed in #065).

## Acceptance Criteria

- [ ] Add page transition animations (opacity fade 0.3–0.6s) using TanStack Router navigation events or View Transitions API
- [x] Add subtle hero parallax or slow Ken Burns effect on desktop (with `prefers-reduced-motion` guard)
- [x] Add low-opacity noise/SVG texture over hero gradient to reduce banding on OLED
- [x] Add stronger `:active` states on primary buttons for mobile tap feedback
- [x] Ensure all motion uses `transform`/`opacity` only; `will-change` used sparingly
- [x] Align hover durations/easing across all card types via shared CSS tokens

## Source Reports

- `reports/done/home-design-motion-review.md` — M1–M6, M8–M10
- `reports/done/ui-audit-2026-03-29.md` — XC5
