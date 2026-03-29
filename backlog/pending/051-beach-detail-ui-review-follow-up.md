# Task #051: Beach Detail UI Review Follow-up

## Metadata

- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-29
- **Started**: -
- **Blocked by**: -

## User Story

As a mobile or desktop visitor on a beach page, I want the gallery, sidebar, and supporting sections to avoid redundant media, reduce layout shift, and surface practical information without excessive scrolling.

## Context

UI review 2026-03-29. See `reports/done/beach-detail.md` for full directives, severity, and “what works well.” Orthography is handled by task **#050** (`reports/done/cross-cutting.md`).

## Acceptance Criteria

- [ ] **Gallery**: When a hero image uses `pictures[0]`, do not repeat that asset as the first gallery tile (prefer `slice(1)` or equivalent)
- [ ] **Mobile layout**: Below `lg`, reorder so weather / practical info / contact are not stranded after the full main column (interleave or `order-*` so high-value cards appear before map where appropriate)
- [ ] **Certifications**: “Q de Calidad” mark uses a fixed flex box matching SVG icon footprint (`certifications-badge.tsx`)
- [ ] **Beach status widget**: Avoid layout jump when API returns no row (reserved height, smooth collapse, or agreed empty state)
- [ ] **Nearby beaches**: Add visual separation from map (e.g. top border + padding per directive)
- [ ] **Description**: Use `text-gray-700` for primary “Sobre esta playa” body copy
- [ ] **Refinements** (as feasible in same PR or document deferrals): remove misleading hover on non-interactive service/activity rows; optional weather grid columns; client-only map mount to drop SSR error blob; unify contact link styles; gallery aspect-ratio containers; `TagsSection` with `variant="dark"` on gradient hero-without-photo branch; localize orientation labels if raw English values appear in UI

## Notes

- Visual verification recommended for gallery + mobile order; add regression tests only where logic is extracted.
