---
id: TSK-088
title: Sitemap Validation
status: complete
priority: P4
tags: [seo]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Sitemap Validation

## Description

As a search engine crawler, I want the sitemap to only list routes that actually exist so that indexing is accurate and complete.

## Acceptance Criteria

- [x] Audit `scripts/generate-sitemap.ts` to ensure it only lists routes from `src/routes/`
- [x] Verify removed routes (Mares, Comparar) are not in the sitemap — removed both, added missing `/explorar`
- [x] Add validation step that checks each generated URL against known routes

## Context

Gap analysis flagged that `scripts/generate-sitemap.ts` may list routes that don't exist in `src/routes/`, causing 404s in search console.

## Source Reports

- `.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md` — GAP4

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #088)
