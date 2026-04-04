# Task #096: Deduplicate Nav and Statistics Builders

## Metadata

- **Status**: in_progress
- **Priority**: P1 - Active
- **Slice**: Refactor
- **Created**: 2026-04-04
- **Blocked by**: -

## User Story

As a developer, I want shared navigation and statistics logic centralized in one place so that municipality counts, characteristic aggregates, and nav structures stay consistent across routes and are easier to maintain.

## Context

Architecture report ([reports/pending/architecture-modularity-solid-improvements.md](../../reports/pending/architecture-modularity-solid-improvements.md), section 3): similar patterns for building municipality nav with beach counts and characteristic counts appear in `__root.tsx`, `index.tsx`, and potentially other routes. This creates drift risk when business rules change.

## Acceptance Criteria

- [x] A single module (e.g. `src/lib/nav-builders.ts`) exports functions like `buildMunicipalityNav(beaches, municipalities)` and `buildCharacteristicCounts(beaches)` (or equivalent).
- [x] `__root.tsx` and `index.tsx` import and use the shared builders instead of inline logic.
- [x] Any other routes with duplicated nav/stats logic also use the shared module.
- [x] No functional change — nav menus and statistics render identically before and after.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Implementation Notes

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

## Progress Log

- [2026-04-04 15:00] Started task
- [2026-04-04] Task created from architecture report.
