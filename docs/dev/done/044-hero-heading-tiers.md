# Task #044: Standardize Hero Heading Size Tiers

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor navigating between pages, I want a consistent visual hierarchy where index pages feel "bigger" than detail pages.

## Context

UI review (2026-03-28) found hero h1 sizes are inconsistently applied. The collection detail uses `text-4xl sm:text-5xl` (index tier) instead of `text-3xl sm:text-4xl` (detail tier). See `docs/dev/ui-review/processed/cross-cutting.md` (CC-4) and `docs/dev/ui-review/processed/coleccion-detail.md`.

## Acceptance Criteria

- [ ] Collection detail h1: change from `text-4xl sm:text-5xl` to `text-3xl font-extrabold tracking-tight text-white sm:text-4xl`
- [ ] Verify all index pages use `text-4xl sm:text-5xl` (municipios index, colecciones index)
- [ ] Verify all detail/tool pages use `text-3xl sm:text-4xl` (municipio detail, explorer)
- [ ] Simplify collection detail hero: merge beach count badge into subtitle text, remove separate `<p>` badge element

## Notes

- Quick fix, ~15 minutes
- See `docs/dev/ui-review/processed/coleccion-detail.md` for full directive
