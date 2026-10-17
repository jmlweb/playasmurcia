---
id: TSK-051
title: Beach Detail UI Review Follow-up
status: complete
priority: P3
tags: [styling]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# Beach Detail UI Review Follow-up

## Description

As a mobile or desktop visitor on a beach page, I want the gallery, sidebar, and supporting sections to avoid redundant media, reduce layout shift, and surface practical information without excessive scrolling.

## Acceptance Criteria

- [x] **Gallery**: When a hero image uses `pictures[0]`, do not repeat that asset as the first gallery tile (prefer `slice(1)` or equivalent)
- [x] **Mobile layout**: Below `lg`, reorder so weather / practical info / contact are not stranded after the full main column (interleave or `order-*` so high-value cards appear before map where appropriate)
- [x] **Certifications**: “Q de Calidad” mark uses a fixed flex box matching SVG icon footprint (`certifications-badge.tsx`)
- [x] **Beach status widget**: Avoid layout jump when API returns no row (reserved height, smooth collapse, or agreed empty state)
- [x] **Nearby beaches**: Add visual separation from map (e.g. top border + padding per directive)
- [x] **Description**: Use `text-gray-700` for primary “Sobre esta playa” body copy
- [x] **Refinements** (as feasible in same PR or document deferrals): remove misleading hover on non-interactive service/activity rows; optional weather grid columns; client-only map mount to drop SSR error blob; unify contact link styles; gallery aspect-ratio containers; `TagsSection` with `variant="dark"` on gradient hero-without-photo branch; localize orientation labels if raw English values appear in UI

## Context

UI review 2026-03-29. See `.backlog/reports/complete/RPT-004-beach-detail-playasslug-ui-review.md` for full directives, severity, and “what works well.” Orthography is handled by task **#050** (`.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md`).

## Notes

- Visual verification recommended for gallery + mobile order; add regression tests only where logic is extracted.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #051)
