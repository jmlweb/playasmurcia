# Task #012: Homepage Beach Explorer with Search and Filters

## Metadata
- **Status**: completed
- **Priority**: P1 - Now
- **Slice**: Frontend
- **Created**: 2026-03-22
- **Started**: 2026-03-22
- **Completed**: 2026-03-23
- **Blocked by**: -

## User Story

As a visitor, I want to browse and filter all beaches from the homepage so that I can quickly find beaches that match my preferences.

## Acceptance Criteria

- [x] Search bar with text search by beach name
- [x] Filter panel: municipality (9), sea (2), services, activities, tags
- [x] Beach card grid showing: photo, name, municipality, main tags, occupancy level
- [x] Sorting options: name (A-Z), municipality, length, occupancy
- [x] URL-based filter state (shareable filtered views)
- [x] Results count displayed
- [x] Empty state when no beaches match filters
- [x] Responsive: filters as sidebar on desktop, bottom sheet or modal on mobile
- [x] Performant with 194 beaches (client-side filtering acceptable)

## Implementation Notes

- Replace current minimal hero with full explorer
- Keep hero section but add search/filter below
- Load all beaches on homepage (194 is small enough for client-side)
- Use URL search params for filter state
- Consider debounced text search
- Beach cards should link to `/playas/:slug`
- Photos from `pictures[0]` with fallback placeholder

## Files to Modify

- `src/routes/index.tsx` (major rewrite)
- `src/lib/db-data.ts` (add `getAllBeaches()` loader for homepage)
- `src/components/` (new: beach-card, filter-panel, search-bar)

## Dependencies

- None

## Progress Log

- [2026-03-22] Implementation started
- [2026-03-23] Task completed

## Learnings

(None yet)
