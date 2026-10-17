---
id: TSK-096
title: Deduplicate Nav and Statistics Builders
status: complete
priority: P1
tags: [refactor]
created: 2026-04-04
source: manual
depends-on: []
completed: 2026-04-04
---

# Deduplicate Nav and Statistics Builders

## Description

As a developer, I want shared navigation and statistics logic centralized in one place so that municipality counts, characteristic aggregates, and nav structures stay consistent across routes and are easier to maintain.

## Acceptance Criteria

- [x] A single module (e.g. `src/lib/nav-builders.ts`) exports functions like `buildMunicipalityNav(beaches, municipalities)` and `buildCharacteristicCounts(beaches)` (or equivalent).
- [x] `__root.tsx` and `index.tsx` import and use the shared builders instead of inline logic.
- [x] Any other routes with duplicated nav/stats logic also use the shared module.
- [x] No functional change — nav menus and statistics render identically before and after.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

Architecture report ([.backlog/reports/complete/RPT-002-architecture-modularity-and-solid-improvement.md](../../.backlog/reports/complete/RPT-002-architecture-modularity-and-solid-improvement.md), section 3): similar patterns for building municipality nav with beach counts and characteristic counts appear in `__root.tsx`, `index.tsx`, and potentially other routes. This creates drift risk when business rules change.

## Notes

- Audit all routes for duplicated municipality/characteristic aggregation patterns before extracting.
- Keep return types explicit so consuming components get autocomplete.
- Add a unit test for the shared builder functions if not already covered by route-level tests.

## Files to Modify

- `src/lib/nav-builders.ts` (new)
- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- Other routes as needed

## Dependencies

- None

## Learnings

## Progress Log

- [2026-04-04 15:00] Started task
- [2026-04-04] Task created from architecture report.
- [2026-10-17] Migrated from legacy backlog/ (originally task #096)
