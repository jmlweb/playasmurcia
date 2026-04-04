# Task #099: Beach Card Overlay Legibility and Featured Image Curation

## Metadata

- **Status**: done
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-04-04
- **Blocked by**: -

## User Story

As a visitor browsing listings, I want beach card tags and occupancy badges to stay readable on any photo, and the homepage featured strip to favour beaches with real imagery so the site feels curated and trustworthy.

## Context

Full UI review (Playwright desktop + mobile, 2026-04-04). See full directives:

- `reports/done/ui-review-2026-04-04-cross-cutting.md`
- `reports/done/ui-review-2026-04-04-homepage.md`
- `reports/done/ui-review-2026-04-04-explorar.md`
- `reports/done/ui-review-2026-04-04-coleccion-detail.md`

## Acceptance Criteria

- [x] **`BeachCard` overlays** (`src/features/beaches/beach-card.tsx`): Tag pills meet WCAG 2.1 AA contrast for normal text on typical beach photography (adjust size, background opacity, and/or bottom scrim per directive). Occupancy and weather chips remain visually primary over tag row.
- [x] **Empty placeholder** (same component): Refined treatment so dense grids do not read as “broken”; no regression in aspect ratio or link behavior.
- [x] **Homepage featured beaches** (`src/lib/db-data/beach-queries.ts`): Prefer beaches with at least one `pictures` entry when building the featured list (fallback rules documented in code comment if fewer than N qualify).
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.
- [ ] If visual change is substantial, capture before/after via `pnpm tsx scripts/screenshot.ts` for `/` and one listing page.

## Files to Modify

- `src/features/beaches/beach-card.tsx`
- `src/routes/index.tsx` (featured selection logic)
- Component tests under `src/features/beaches/` if behavior changes

## Dependencies

- None

## Progress Log

- [2026-04-04] Task created from UI review.
- [2026-04-04] Completed: tag pills upgraded to bg-white/95 + text-sm + text-gray-900 for WCAG AA, bottom scrim strengthened, placeholder simplified, featured selection fallback added.
