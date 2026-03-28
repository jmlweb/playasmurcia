# Task #037: Explorer UX Improvements

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor using the beach explorer, I want clear feedback about active filters and polished interaction patterns.

## Context

UI review (2026-03-28) found the explorer lacks active filter indication, uses a native browser dropdown for sort, and has other UX gaps. See `docs/dev/ui-review/explorer.md` for full directive.

## Acceptance Criteria

- [ ] Add active filter chips above the beach grid showing each applied filter as a removable pill
- [ ] Replace native `<select>` sort dropdown with a custom styled dropdown matching the site's design language
- [ ] Consolidate filter panel to a single React instance (currently duplicated for mobile/desktop)
- [ ] Default first 2 filter groups (Municipality, Sea) to open on desktop
- [ ] Add sort controls to municipality detail and collection detail pages (reuse `SortSelect` component)

## Notes

- Filter chips pattern: `rounded-full bg-ocean-50 px-3 py-1 text-sm text-ocean-700` with X remove button
- Custom dropdown could use Base UI Popover (already in the project for nav)
- See `docs/dev/ui-review/explorer.md` for detailed directives
