# Task #024: Dropdown Navigation with Municipalities and Characteristics

## Metadata
- **Status**: done
- **Priority**: P2 - Next
- **Slice**: Frontend
- **Created**: 2026-03-27
- **Started**: 2026-03-27
- **Completed**: 2026-03-27
- **Blocked by**: -

## User Story

As a visitor, I want a dropdown navigation menu that lets me jump directly to any municipality or beach characteristic from any page, so that I can navigate the site efficiently without extra clicks.

## Context

v3 comparison report (`docs/v3-comparison-report.md`, point 2) identified that the production site offers a dropdown menu with municipalities (9 items + beach counts) and characteristics (5 items + counts), allowing 1-click access from anywhere. The v3 flat navbar requires navigating to each section first.

## Acceptance Criteria

- [x] Desktop: dropdown/mega-menu triggered on hover or click over a nav item
- [x] Municipalities section: 9 municipalities with beach count badges
- [x] Characteristics section: key filters (Accesible, Bandera azul, Nudista, etc.) with counts
- [x] Each item links directly to the filtered view or municipality page
- [x] Mobile: expandable panel within hamburger menu with same content
- [x] Smooth open/close animations
- [x] Accessible: keyboard navigable, proper aria attributes
- [x] Existing nav items (Colecciones, Mares, Comparar) remain accessible
- [x] Build passes, no visual regressions

## Notes

- Counts can be fetched from the database or precomputed at build time
- Consider grouping municipalities geographically or alphabetically
- The dropdown should not obstruct page content excessively
