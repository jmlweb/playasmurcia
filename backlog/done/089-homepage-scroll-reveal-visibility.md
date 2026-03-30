# Task #089: Homepage Scroll-Reveal Must Not Hide Primary Content

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor (including users on large screens, slow devices, or with automation), I want featured beaches, municipalities, and highlights to be visible without having to guess that content exists below an empty band, so that the homepage never looks broken on first paint.

## Context

Full-site UI review (2026-03-30) found `.reveal` uses `opacity: 0` until `IntersectionObserver` adds `.revealed`. Sections below the fold can remain invisible when the observer never fires as expected (e.g. full-page capture, layout quirks). This is separate from decorative motion polish (#083, #077).

## Acceptance Criteria

- [x] Primary homepage sections (“Selección destacada”, “Municipios costeros”, “Lo que hace única a nuestra costa”) are visible at `opacity: 1` on first meaningful paint for typical desktop (1280×800) and mobile (375×812) without requiring user scroll, verified with `scripts/screenshot.ts` full-page or equivalent.
- [x] No reliance on `opacity: 0` for SEO-critical body content; reduced-motion path remains correct (`src/styles.css` already forces `.reveal` visible under `prefers-reduced-motion: reduce` — align any JS with that guarantee).
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Source Reports

- `reports/done/ui-review-2026-03-30-cross-cutting.md` — Critical
- `reports/done/ui-review-2026-03-30-homepage.md` — Critical
