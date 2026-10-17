---
id: TSK-097
title: Split db-data.ts into Cohesive Modules
status: complete
priority: P1
tags: [refactor]
created: 2026-04-04
source: manual
depends-on: []
completed: 2026-04-04
---

# Split db-data.ts into Cohesive Modules

## Description

As a developer, I want `db-data.ts` broken into focused modules (mapping, queries, scoring, occupancy) so that each file has a single responsibility, is easier to navigate, and can be tested independently.

## Acceptance Criteria

- [ ] `src/lib/db-data/beach-mapper.ts` — `mapBeachFromDB` and related mapping-only code.
- [ ] `src/lib/db-data/beach-queries.ts` — exported async getters (`getAllBeaches`, `getBeachBySlug`, `getFeaturedBeaches`, etc.).
- [ ] `src/lib/db-data/beach-scoring.ts` — `computeRecommendationScore` and scoring helpers (if substantial enough to warrant separation).
- [ ] `src/lib/db-data/occupancy.ts` — `adjustOccupancy` and seasonal rules (if substantial enough to warrant separation).
- [ ] All imports across the codebase updated to the new paths — no barrel re-export file.
- [ ] Existing tests in `db-data.test.ts` pass (split or reorganized as needed).
- [ ] No functional change — all queries, mappings, and scores produce identical results.
- [ ] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

Architecture report ([.backlog/reports/complete/RPT-002-architecture-modularity-and-solid-improvement.md](../../.backlog/reports/complete/RPT-002-architecture-modularity-and-solid-improvement.md), section 1): `src/lib/db-data.ts` (~500 lines) combines DB mapping, query functions, recommendation scoring, occupancy adjustment, and related helpers. Splitting improves single responsibility and interface segregation.

## Notes

- Do NOT create a barrel `index.ts` that re-exports everything — update imports directly.
- Evaluate scoring and occupancy size before creating separate files; if either is < 30 lines, keep it in the mapper or queries module.
- Run tests after each file extraction, not just at the end.

## Files to Modify

- `src/lib/db-data.ts` (split into directory)
- `src/lib/db-data/beach-mapper.ts` (new)
- `src/lib/db-data/beach-queries.ts` (new)
- `src/lib/db-data/beach-scoring.ts` (new, conditional)
- `src/lib/db-data/occupancy.ts` (new, conditional)
- All files importing from `db-data` (update paths)
- `src/lib/db-data.test.ts` (reorganize)

## Dependencies

- None (but easier after #096 reduces import surface in routes)

## Learnings

## Progress Log

- [2026-04-04 20:10] Started task
- [2026-04-04] Task created from architecture report.
- [2026-04-04 21:40] Task completed — all criteria verified
- [2026-10-17] Migrated from legacy backlog/ (originally task #097)
