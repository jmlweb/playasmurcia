# Task #031: Standardize Breadcrumbs and Hero Sections

## Metadata
- **Status**: completed
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: 2026-03-28
- **Completed**: 2026-03-28
- **Blocked by**: -

## User Story

As a visitor, I want consistent navigation cues and page headers so the site feels cohesive as I navigate between pages.

## Context

UI review (2026-03-28) found breadcrumbs and hero heights vary arbitrarily across pages. See `docs/dev/ui-review/cross-cutting.md`, `docs/dev/ui-review/municipality-detail.md`, and `docs/dev/ui-review/explorer.md` for full directives.

## Acceptance Criteria

- [x] Add breadcrumbs to Explorer page ("Inicio / Explorar playas")
- [x] Move municipality detail breadcrumb from inside the dark hero to below the hero in the content area (matching other pages)
- [x] Use consistent breadcrumb styling everywhere: `text-sm text-gray-500`, links with `hover:text-ocean-600`, `mb-8` spacing
- [x] Standardize inner page hero heights: use a consistent padding tier (e.g., `py-14 sm:py-18 lg:py-20`) for all inner pages. Municipality detail currently uses `py-12 sm:py-16` while others use `py-20 sm:py-24 lg:py-28`
- [x] Apply gradient background (`bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700`) to Explorer hero (currently uses flat `bg-ocean-900`)
- [x] Beach detail breadcrumb should include municipality level: "Inicio / {municipality} / {beach name}"

## Notes

- Homepage hero keeps its own taller height — it's the immersive entry point
- Consider extracting a shared `PageHero` component to enforce consistency
- See `docs/dev/ui-review/cross-cutting.md` for the recommended two-tier hero system
