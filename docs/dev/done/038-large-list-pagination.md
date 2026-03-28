# Task #038: Add Pagination for Large Beach Lists

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor viewing a municipality with many beaches, I want the page to load fast and be easy to browse without scrolling through 60+ cards.

## Context

UI review (2026-03-28) found that Cartagena renders 69 beach cards simultaneously with no pagination. This is a performance issue on mobile (massive DOM, dozens of image requests). See `docs/dev/ui-review/processed/municipality-detail.md` for full directive.

## Acceptance Criteria

- [ ] Add "Cargar mas" progressive loading to municipality detail pages with >15 beaches: show first 15 cards, then load more on button click
- [ ] Add same progressive loading to collection detail pages with >15 beaches
- [ ] Ensure URL state is preserved when loading more (scroll position, filters)
- [ ] Show total count and loaded count (e.g., "Mostrando 15 de 69 playas")

## Notes

- This is a client-side pagination — all data is already loaded, just rendering progressively
- Consider intersection observer for infinite scroll as an alternative to "Cargar mas" button
- Explorer page already handles large lists via its filter system, so it may not need this
