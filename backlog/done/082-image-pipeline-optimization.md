# Task #082: Image Pipeline Optimization

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: Performance
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor, I want images to load fast in modern formats so that pages feel snappy and data usage is minimal.

## Context

Anti-scraping/image architecture report and gap analysis identified missing AVIF support, no size variants for different contexts, and no immutable cache headers for images.

## Acceptance Criteria

- [x] Add AVIF output format to `optimize-images.ts` (20–30% better than WebP)
- [x] Generate 3 size variants: thumb (400px), medium (800px), full (1200px)
- [x] Update `ResponsiveImage` component to include AVIF `<source>` before WebP + all 3 size variants
- [x] Set `Cache-Control: public, max-age=31536000, immutable` for `/pictures/` routes
- [x] Verify CI runs `optimize:images` before build so optimized images reach deploy

## Source Reports

- `reports/done/anti-scraping-and-image-architecture.md` — IMG1–IMG5
- `reports/done/github-main-feature-gap-analysis.md` — GAP1
