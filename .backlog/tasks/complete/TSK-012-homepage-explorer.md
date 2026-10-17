---
id: TSK-012
title: Homepage Beach Explorer with Search and Filters
status: complete
priority: P1
tags: [frontend]
created: 2026-03-22
source: manual
depends-on: []
started: 2026-03-22
completed: 2026-03-23
---

# Homepage Beach Explorer with Search and Filters

## Description

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

## Notes

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

## Learnings

(None yet)

## Progress Log

- [2026-03-22] Implementation started
- [2026-03-23] Task completed
- [2026-10-17] Migrated from legacy backlog/ (originally task #012)
