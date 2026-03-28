# Task #041: Fix focus-visible Consistency Across All Pages

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a keyboard user, I want focus rings to appear only when I'm using the keyboard, not when I click with a mouse.

## Context

UI review (2026-03-28) found multiple elements using `focus:` instead of `focus-visible:` for ring styles, contrary to the project guidelines. See `docs/dev/ui-review/cross-cutting.md` (CC-2).

## Acceptance Criteria

- [ ] Replace all `focus:ring` with `focus-visible:ring` across all components
- [ ] Replace all `focus:outline-none` with `focus-visible:outline-none` where paired with ring styles
- [ ] Verify homepage hero buttons (primary + secondary) use `focus-visible:`
- [ ] Verify navbar mobile menu button uses `focus-visible:`
- [ ] Verify explorer filter chips have visible focus states (`focus-visible:ring-2 focus-visible:ring-ocean-500`)
- [ ] Verify "Limpiar todo" button in explorer chips row has focus-visible styles
- [ ] Run through all interactive elements with keyboard navigation to confirm

## Notes

- This is largely a search-and-replace task but needs manual verification
- See `docs/dev/ui-review/homepage.md` and `docs/dev/ui-review/explorar.md` for specific instances
