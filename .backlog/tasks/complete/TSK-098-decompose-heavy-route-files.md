---
id: TSK-098
title: Decompose Heavy Route Files
status: complete
priority: P1
tags: [refactor]
created: 2026-04-04
source: manual
depends-on: [TSK-096, TSK-097]
started: 2026-04-04
completed: 2026-04-04
---

# Decompose Heavy Route Files

## Description

As a developer, I want the largest route files (`__root.tsx`, `index.tsx`, `explorar/index.tsx`) reduced to thin orchestration so that data logic lives in `lib/`, presentational chunks live in `features/` or `components/`, and routes are easy to scan.

## Acceptance Criteria

- [x] `__root.tsx`: shell layout (header, footer slot, outlet) separated from nav data fetching and mega-menu / mobile-menu UI. Nav data fetching extracted to a helper if non-trivial.
- [x] `index.tsx`: home page sections extracted into components under `features/home/` or `components/` with props driven by loader data. Route file is primarily loader + layout composition.
- [x] `explorar/index.tsx`: explorer layout decomposed similarly — filter panel, results grid, etc. as separate components if not already.
- [x] Each route file is under ~150 lines (guideline, not hard rule).
- [x] No functional or visual change — pages render identically.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

Architecture report ([.backlog/reports/complete/RPT-002-architecture-modularity-and-solid-improvement.md](../../.backlog/reports/complete/RPT-002-architecture-modularity-and-solid-improvement.md), section 2): these route files mix data orchestration, derived structures (nav aggregates), and substantial JSX. After #096 (shared nav builders) and #097 (db-data split), remaining complexity should be extracted into lib helpers and subcomponents.

## Notes

- Extract pure data builders into `src/lib/` (e.g. helpers for deriving page-specific structures from loader data).
- Extract presentational chunks into `src/features/` or `src/components/layout/` with typed props.
- Do this incrementally: one route at a time, verify after each.

## Files to Modify

- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/routes/explorar/index.tsx`
- New component files under `src/features/` or `src/components/layout/`
- New helper modules under `src/lib/` if needed

## Dependencies

- #096 (nav builders extracted first)
- #097 (db-data split reduces import noise)

## Learnings

## Progress Log

- [2026-04-04] Task created from architecture report.
- [2026-04-04 21:42] Started task
- [2026-04-04 21:50] Task completed — 9 new files extracted, all routes decomposed
- [2026-10-17] Migrated from legacy backlog/ (originally task #098)
