---
id: TSK-095
title: Layout and Assets UI Review Follow-up
status: complete
priority: P1
tags: [styling]
created: 2026-04-02
source: manual
depends-on: []
started: 2026-04-02
completed: 2026-04-02
---

# Layout and Assets UI Review Follow-up

## Description

As a user scanning index pages, I want even card rhythm, trustworthy imagery, and unambiguous non-interactive badges so the guide feels editorial and professional.

## Acceptance Criteria

- [x] **Homepage** (`/`): Resolve featured grid at `2xl` (cap columns or adjust card padding) per `.backlog/reports/complete/RPT-016-homepage-ui-review-directive.md`.
- [x] **Municipios index** (`/municipios`): Align municipality card CTAs / reduce uneven whitespace (e.g. `mt-auto` on footer row) per `.backlog/reports/complete/RPT-019-municipios-index-municipios-ui-review.md`.
- [x] **Municipio detail** (`/municipios/$slug`): Remove or typographically differentiate duplicate “N playas” lines if redundant per `.backlog/reports/complete/RPT-018-municipality-detail-municipiosslug-ui-review.md`.
- [x] **Collection detail** (`/colecciones/$slug`): Clarify hero beach-count pill — non-interactive styling vs real control; correct semantics/focus per `.backlog/reports/complete/RPT-008-collection-detail-coleccionesslug-ui-review.md`.
- [x] **Colecciones index** (`/colecciones`): Replace any hero/card imagery showing third-party watermarks; follow `docs/photo-sourcing-guide.md` per `.backlog/reports/complete/RPT-007-colecciones-index-colecciones-ui-review.md`.
- [x] **Footer** (`site-footer.tsx`): Verify legal attribution line contrast on `bg-ocean-900`; bump to `text-ocean-200` (or equivalent) if below AA per `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md`.
- [x] Optional refinements: homepage hero line breaks / overline token consistency; explorer toolbar vertical alignment; thematic token documentation note in guidelines if patterns are finalized.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

UI review (2026-04-02): homepage wide grid density, municipios card footer alignment, duplicate count on municipality detail, collection hero count pill affordance, potential third-party watermarks on collection imagery, footer legal line contrast, minor refinements.

## Source Reports

- `.backlog/reports/complete/RPT-016-homepage-ui-review-directive.md`
- `.backlog/reports/complete/RPT-019-municipios-index-municipios-ui-review.md`
- `.backlog/reports/complete/RPT-018-municipality-detail-municipiosslug-ui-review.md`
- `.backlog/reports/complete/RPT-008-collection-detail-coleccionesslug-ui-review.md`
- `.backlog/reports/complete/RPT-007-colecciones-index-colecciones-ui-review.md`
- `.backlog/reports/complete/RPT-011-explorer-explorar-ui-review-directive.md`
- `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md`

## Notes

## Learnings

## Progress Log

- [2026-04-02 02:15] Homepage featured grid: capped at 3 cols (removed 2xl:grid-cols-4)
- [2026-04-02 02:15] Municipios index: verified footer CTA already aligned with mt-auto
- [2026-04-02 02:15] Municipio detail: removed redundant beach count line from toolbar
- [2026-04-02 02:15] Collection detail: added role="text" to beach count pill (non-interactive)
- [2026-04-02 02:15] Colecciones index: verified no watermarks (gradient backgrounds + internal Wikimedia assets)
- [2026-04-02 02:15] Footer legal attribution: bumped from text-ocean-400/500 to text-ocean-200 (WCAG AA)
- [2026-04-02 02:15] All checks pass: pnpm build ✓, pnpm test (142) ✓, pnpm check ✓
- [2026-04-02 02:15] Task completed
- [2026-10-17] Migrated from legacy backlog/ (originally task #095)
