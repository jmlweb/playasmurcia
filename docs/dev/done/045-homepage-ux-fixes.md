# Task #045: Homepage UX and Accessibility Fixes

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a mobile visitor on the homepage, I want municipality cards to be readable, and as a visitor on any device, I want the hero text to be consistently legible.

## Context

UI review (2026-03-28) found the municipality grid is too cramped on mobile and the hero overlay opacity may not provide sufficient contrast. See `docs/dev/ui-review/processed/homepage.md`.

## Acceptance Criteria

- [ ] Municipality grid: change to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5` (single column on mobile)
- [ ] Hero gradient: increase via stop from `via-ocean-900/60` to `via-ocean-900/75` for consistent contrast
- [ ] Region highlights: remove `sm:col-span-2` from third card to prevent tablet-width stretching
- [ ] Add "Ver todas las playas" link right-aligned next to featured beaches section heading
- [ ] Remove redundant `border-t border-gray-200` from municipalities section (bg change provides separation)
- [ ] Reduce hero animation total time: shorten delays to 0/75/150/225ms or reduce duration to 400ms

## Notes

- Mix of accessibility (contrast) and layout (mobile grid) fixes
- See `docs/dev/ui-review/processed/homepage.md` for full directive
