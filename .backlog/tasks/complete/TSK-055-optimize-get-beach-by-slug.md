---
id: TSK-055
title: Optimize `getBeachBySlug` to Direct DB Query
status: complete
priority: P2
tags: [data]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# Optimize `getBeachBySlug` to Direct DB Query

## Description

As a visitor, I want beach detail pages to load quickly so that I don't wait for unnecessary data processing.

## Acceptance Criteria

- [ ] Beach detail page fetches only the requested beach from the DB (not all 194)
- [ ] Slug generation logic remains consistent with `@/lib/slugs`
- [ ] Beach detail pages still render correctly
- [ ] Performance improvement measurable on cold starts

## Context

Code quality audit (2026-03-29) found that `getBeachBySlug` (`src/lib/db-data.ts:254-258`) loads ALL beaches from the database, maps every one to the domain type, then does a linear scan to find one by slug. This runs on every beach detail page request.

Options:
1. Add a `slug` column to the `beaches` table (generated from name at migration time) and query directly
2. Filter by normalized name with `LIKE` in the DB query
3. At minimum, cache the slug→beach mapping

## Notes

Report: `.backlog/reports/complete/RPT-005-code-quality-audit-2026-03-29.md` (item 4). Same applies to `getBeachesByMunicipality` and `getBeachesByCollection` if they follow the same pattern.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #055)
