# Task #033: Homepage Visual Polish

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor landing on the homepage, I want a visually rich and well-structured page that guides me toward exploring beaches.

## Context

UI review (2026-03-28) found several layout and hierarchy issues on the homepage. See `docs/dev/ui-review/homepage.md` for full directive.

## Acceptance Criteria

- [ ] Fix two consecutive white sections: change region highlights section from `bg-white` to `bg-sand-50` to restore alternating background pattern
- [ ] Add section heading to region highlights (e.g., "Lo que hace unica a la Costa Calida") with the established label + h2 pattern
- [ ] Strengthen homepage municipality cards: increase padding, add visual weight (icon, prominent beach count, or left accent)
- [ ] Standardize primary CTA button color: use `bg-ocean-500` consistently for all primary buttons (currently mixed `bg-ocean-500` and `bg-ocean-600`)

## Notes

- The search bar on homepage hero is a bigger feature — consider as a separate task if desired
- See `docs/dev/ui-review/homepage.md` for detailed fix instructions
- Alternating bg pattern is defined in `docs/ui-guidelines.md` Section Rhythm
