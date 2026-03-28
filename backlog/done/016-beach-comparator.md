# Task #016: Beach Comparator Tool

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Frontend
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor deciding between beaches, I want to compare 2-3 beaches side by side so that I can see which one best fits my needs.

## Acceptance Criteria

- [ ] Page at `/comparar` with beach selector (search/autocomplete)
- [ ] Compare 2-3 beaches side by side in a table/grid
- [ ] Attributes compared: services, activities, certifications, occupancy, length, soil type, waves, orientation, best season
- [ ] Visual indicators (checkmarks/crosses) for boolean attributes
- [ ] URL-based state (shareable comparison links via beach codes in query params)
- [ ] "Add to compare" button on beach detail pages and beach cards
- [ ] Responsive: horizontal scroll table on mobile or stacked cards
- [ ] Empty state with instructions when no beaches selected

## Implementation Notes

- Beach selection via URL params: `/comparar?playas=codigo1,codigo2,codigo3`
- Max 3 beaches to keep layout manageable
- Fetch selected beaches by code
- Comparison table should highlight differences (e.g. bold the "winner" per row)
- Consider localStorage to persist comparison selection across navigation

## Files to Modify

- `src/routes/comparar/index.tsx` (new)
- `src/lib/db-data.ts` (add `getBeachesByCodes(codes: string[])`)
- `src/routes/playas/$slug.tsx` (add "Compare" button)
- `scripts/generate-sitemap.ts` (add `/comparar` URL)

## Dependencies

- #011 (compare button on detail page)

## Progress Log

(No progress yet)

## Learnings

(None yet)
