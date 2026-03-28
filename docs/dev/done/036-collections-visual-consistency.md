# Task #036: Collections Page Visual Consistency

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor browsing collections, I want visually distinct cards that help me quickly identify each collection's theme.

## Context

UI review (2026-03-28) found thematic collection cards lack visual differentiation, section headings are undersized, and empty states are inconsistent. See `docs/dev/ui-review/processed/colecciones-index.md` and `docs/dev/ui-review/processed/collection-detail.md` for full directives.

## Acceptance Criteria

- [ ] Add icons to thematic collection cards (icon + colored container matching each theme) to match the sea collection card pattern
- [ ] Unify sea and thematic card internal layouts (both should have icon + title row, description, footer)
- [ ] Increase section headings "Por mar" / "Por tematica" using the established label + h2 pattern
- [ ] Replace generic "Coleccion" hero label on collection detail with something more descriptive or remove it
- [ ] Give beach count in collection detail hero more visual prominence (badge or larger text)
- [ ] Upgrade collection detail empty state to match explorer/municipality pattern (icon + heading + dashed border)

## Notes

- Icons for thematic collections could be emoji or SVG — match the sea card treatment
- See `docs/dev/ui-review/processed/colecciones-index.md` for specific icon/color suggestions
