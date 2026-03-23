# Task #012: Homepage Beach Explorer with Search and Filters

## Metadata
- **Status**: in-progress
- **Priority**: P1 - Now
- **Slice**: Frontend
- **Created**: 2026-03-22
- **Started**: 2026-03-22
- **Blocked by**: -

## User Story

As a visitor, I want to browse and filter all beaches from the homepage so that I can quickly find beaches that match my preferences.

## Acceptance Criteria

- [ ] Search bar with text search by beach name
- [ ] Filter panel: municipality (9), sea (2), services, activities, tags
- [ ] Beach card grid showing: photo, name, municipality, main tags, occupancy level
- [ ] Sorting options: name (A-Z), municipality, length, occupancy
- [ ] URL-based filter state (shareable filtered views)
- [ ] Results count displayed
- [ ] Empty state when no beaches match filters
- [ ] Responsive: filters as sidebar on desktop, bottom sheet or modal on mobile
- [ ] Performant with 194 beaches (client-side filtering acceptable)

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

(No progress yet)

## Learnings

(None yet)
