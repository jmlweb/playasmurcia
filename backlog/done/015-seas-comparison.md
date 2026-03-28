# Task #015: Mediterranean vs Mar Menor Comparison Page

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Frontend
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor unfamiliar with Murcia's coast, I want to understand the differences between the Mediterranean Sea and Mar Menor so that I can choose which area suits me best.

## Acceptance Criteria

- [ ] Page at `/mares` comparing both seas side by side
- [ ] Stats per sea: number of beaches, average length, common services
- [ ] Jellyfish risk indicator using `jellyfishRisk` field
- [ ] Highlighted beaches for each sea (e.g. blue flag beaches, most popular)
- [ ] Brief description of each sea's character (water temperature, depth, waves)
- [ ] Links to browse beaches filtered by sea
- [ ] SEO: title, meta description optimized for "mar menor vs mediterráneo"
- [ ] Responsive layout (side by side on desktop, stacked on mobile)

## Implementation Notes

- Only 2 seas — simple comparison layout
- Mar Menor is unique (Europe's largest saltwater lagoon) — worth highlighting
- Aggregate stats computed from beach data grouped by `seaId`
- Descriptions can be AI-generated or hardcoded (only 2 entries)
- Link to homepage with sea filter pre-selected

## Files to Modify

- `src/routes/mares/index.tsx` (new)
- `src/lib/db-data.ts` (add `getBeachesBySea()` or aggregate query)
- `scripts/generate-sitemap.ts` (add `/mares` URL)

## Dependencies

- None (but benefits from beach card component from #012)

## Progress Log

(No progress yet)

## Learnings

(None yet)
