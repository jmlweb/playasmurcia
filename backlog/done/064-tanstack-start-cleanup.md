# Task #064: TanStack Start Technical Cleanup

## Metadata

- **Status**: done
- **Priority**: P3
- **Slice**: Infra
- **Created**: 2026-03-29
- **Completed**: 2026-03-29
- **Blocked by**: -

## User Story

As a developer, I want the project to follow TanStack Start best practices so that the codebase stays clean and avoids unnecessary dependencies.

## Context

TanStack Start alignment audit (2026-03-29). Item 1 (`.inputValidator()`) was already resolved. Remaining items are low priority but easy wins.

## Acceptance Criteria

- [x] Test replacing one dynamic `import('@/lib/db-data')` in a server function with a static top-level import — **result: leaks db-data into client bundle (138 KB), dynamic imports are correct and must stay**
- [x] Remove `"nitro": "latest"` from `package.json` dependencies — removed, build passes (resolved transitively via `@tanstack/react-start`)
- [x] Consider adding `src/start.ts` for global middleware — not needed now, deferred

## Notes

Report: `reports/done/tanstack-start-alignment.md` (items 2-4).
