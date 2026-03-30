# Task #090: Reposition TanStack Devtools in Development

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: Tech Debt
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a developer reviewing UI locally, I want devtools not to cover municipality cards or other primary content, so that screenshots and manual QA reflect real layout.

## Context

UI review (2026-03-30): `TanStackDevtools` in `src/routes/__root.tsx` uses `position: 'bottom-right'` and overlaps grid cards on `/municipios`.

## Acceptance Criteria

- [x] In `import.meta.env.DEV`, the floating devtools control does not overlap interactive card content on `/municipios` at 1280×800 (move corner, adjust offset, or constrain z-index/stacking context).
- [x] No change to production bundles (devtools remain dev-only).

## Source Reports

- `reports/done/ui-review-2026-03-30-cross-cutting.md` — Important (devtools overlap)
