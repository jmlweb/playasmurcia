# Task #046: Explorer Page Filter Panel and UX Polish

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor using the explorer on mobile, I want the filter controls to be easy to find and use.

## Context

UI review (2026-03-28) found the mobile filter button is disconnected from the toolbar, chips lack focus states, and the clear-all button is hard to spot. See `reports/done/explorar.md`.

## Acceptance Criteria

- [ ] Move mobile filter toggle button into the toolbar row (alongside count and sort)
- [ ] Add `focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-1` to filter chips
- [ ] Add `focus-visible:` styles to "Limpiar todo" text button
- [ ] Style "Limpiar todo" with `underline underline-offset-2` for clearer affordance
- [ ] Add search icon (magnifying glass) inside the SearchBar input on the left
- [ ] Add clear "x" button inside SearchBar when text is present
- [ ] Add left-aligned result count to municipality detail sort row to balance the layout

## Notes

- See `reports/done/explorar.md` and `reports/done/municipio-detail.md` for details
