---
id: TSK-093
title: Listing Image Fallbacks and Explorer Count Copy
status: complete
priority: P1
tags: [styling]
created: 2026-04-02
source: manual
depends-on: []
started: 2026-04-02
completed: 2026-04-02
---

# Listing Image Fallbacks and Explorer Count Copy

## Description

As a visitor browsing beaches, I want consistent, intentional visuals when a beach has no photo, and coherent numbers on the explorer page, so the site feels trustworthy and not broken.

## Acceptance Criteria

- [x] **Shared fallback** for missing beach photos: implement a designed placeholder inside the fixed-aspect media frame (see `BeachCard` and `NearbyCarousel`), optional subtle label (e.g. “Sin foto”), no layout shift. Full directive: `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md`.
- [x] **Explorer** (`/explorar`): When search text or any facet filter changes the result set, hero copy must not contradict the toolbar count — show “N de total”, a secondary line, or equivalent. Full directive: `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md`, `.backlog/reports/complete/RPT-011-explorer-explorar-ui-review-directive.md`.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

Full-site UI review (2026-04-02). Many listing grids show flat gray media areas; explorer hero can state the full catalogue count while the toolbar shows a filtered subset.

## Source Reports

- `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md`
- `.backlog/reports/complete/RPT-011-explorer-explorar-ui-review-directive.md`
- `.backlog/reports/complete/RPT-004-beach-detail-playasslug-ui-review.md` (nearby carousel portion)
- `.backlog/reports/complete/RPT-018-municipality-detail-municipiosslug-ui-review.md` (listing cards)
- `.backlog/reports/complete/RPT-008-collection-detail-coleccionesslug-ui-review.md` (listing cards)

## Notes

## Learnings

## Progress Log

- [2026-04-02 02:00] Implemented fallback placeholders for missing photos in BeachCard and NearbyCarousel (wave icon + "Sin foto" label on gradient bg)
- [2026-04-02 02:05] Synchronized explorer hero count — shows "Mostrando N de {total}" when filters/search active
- [2026-04-02 02:06] Updated NearbyCarousel test to verify placeholder rendering instead of default image
- [2026-04-02 02:06] Task completed — all criteria met, all checks pass
- [2026-10-17] Migrated from legacy backlog/ (originally task #093)
