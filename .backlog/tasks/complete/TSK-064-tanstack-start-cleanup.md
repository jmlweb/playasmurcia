---
id: TSK-064
title: TanStack Start Technical Cleanup
status: complete
priority: P3
tags: [infra]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# TanStack Start Technical Cleanup

## Description

As a developer, I want the project to follow TanStack Start best practices so that the codebase stays clean and avoids unnecessary dependencies.

## Acceptance Criteria

- [x] Test replacing one dynamic `import('@/lib/db-data')` in a server function with a static top-level import — **result: leaks db-data into client bundle (138 KB), dynamic imports are correct and must stay**
- [x] Remove `"nitro": "latest"` from `package.json` dependencies — removed, build passes (resolved transitively via `@tanstack/react-start`)
- [x] Consider adding `src/start.ts` for global middleware — not needed now, deferred

## Context

TanStack Start alignment audit (2026-03-29). Item 1 (`.inputValidator()`) was already resolved. Remaining items are low priority but easy wins.

## Notes

Report: `.backlog/reports/complete/RPT-021-tanstack-start-alignment-report.md` (items 2-4).

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #064)
