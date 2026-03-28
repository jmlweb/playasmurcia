# Task #047: Colecciones Index Visual Improvements

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor browsing collections, I want the sea collections to feel more prominent than thematic ones, and I want the page sections to read cleanly.

## Context

UI review (2026-03-28) found section headings are redundant (label + heading say the same thing), sea cards lack visual differentiation from thematic cards, and accent bars could be slightly thicker. See `docs/dev/ui-review/processed/colecciones-index.md`.

## Acceptance Criteria

- [ ] Simplify section headings: use one heading per section instead of label + h2 (e.g., "Playas por mar" and "Colecciones tematicas")
- [ ] Differentiate sea collection cards from thematic: use larger icon (h-14 w-14), or add tinted background, or add subtle wave pattern to header
- [ ] Increase accent bar height from `h-2` to `h-2.5` for slightly more visual presence
- [ ] Standardize grid gaps: `gap-5 xl:gap-6` for both seas and thematic grids
- [ ] Reduce seas section `mb-14` to `mb-10` for tighter separation

## Notes

- See `docs/dev/ui-review/processed/colecciones-index.md` for full directive
