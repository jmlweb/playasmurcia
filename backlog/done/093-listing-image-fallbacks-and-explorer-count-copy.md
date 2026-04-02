# Task #093: Listing Image Fallbacks and Explorer Count Copy

## Metadata

- **Status**: completed
- **Priority**: P1 - Active
- **Started**: 2026-04-02
- **Completed**: 2026-04-02
- **Slice**: Styling
- **Created**: 2026-04-02
- **Blocked by**: -

## User Story

As a visitor browsing beaches, I want consistent, intentional visuals when a beach has no photo, and coherent numbers on the explorer page, so the site feels trustworthy and not broken.

## Context

Full-site UI review (2026-04-02). Many listing grids show flat gray media areas; explorer hero can state the full catalogue count while the toolbar shows a filtered subset.

## Acceptance Criteria

- [x] **Shared fallback** for missing beach photos: implement a designed placeholder inside the fixed-aspect media frame (see `BeachCard` and `NearbyCarousel`), optional subtle label (e.g. “Sin foto”), no layout shift. Full directive: `reports/done/cross-cutting.md`.
- [x] **Explorer** (`/explorar`): When search text or any facet filter changes the result set, hero copy must not contradict the toolbar count — show “N de total”, a secondary line, or equivalent. Full directive: `reports/done/cross-cutting.md`, `reports/done/explorar.md`.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Source Reports

- `reports/done/cross-cutting.md`
- `reports/done/explorar.md`
- `reports/done/beach-detail.md` (nearby carousel portion)
- `reports/done/municipio-detail.md` (listing cards)
- `reports/done/collection-detail.md` (listing cards)

## Progress Log

- [2026-04-02 02:00] Implemented fallback placeholders for missing photos in BeachCard and NearbyCarousel (wave icon + "Sin foto" label on gradient bg)
- [2026-04-02 02:05] Synchronized explorer hero count — shows "Mostrando N de {total}" when filters/search active
- [2026-04-02 02:06] Updated NearbyCarousel test to verify placeholder rendering instead of default image
- [2026-04-02 02:06] Task completed — all criteria met, all checks pass
