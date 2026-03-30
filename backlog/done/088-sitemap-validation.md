# Task #088: Sitemap Validation

## Metadata

- **Status**: done
- **Completed**: 2026-03-30
- **Priority**: P4 - Later
- **Slice**: SEO
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a search engine crawler, I want the sitemap to only list routes that actually exist so that indexing is accurate and complete.

## Context

Gap analysis flagged that `scripts/generate-sitemap.ts` may list routes that don't exist in `src/routes/`, causing 404s in search console.

## Acceptance Criteria

- [x] Audit `scripts/generate-sitemap.ts` to ensure it only lists routes from `src/routes/`
- [x] Verify removed routes (Mares, Comparar) are not in the sitemap — removed both, added missing `/explorar`
- [x] Add validation step that checks each generated URL against known routes

## Source Reports

- `reports/done/github-main-feature-gap-analysis.md` — GAP4
