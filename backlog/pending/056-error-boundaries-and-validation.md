# Task #056: Add Error Boundaries and Validate External Data

## Metadata
- **Status**: pending
- **Priority**: P2 - High
- **Slice**: Infra
- **Created**: 2026-03-29
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor, I want to see a helpful error message when something goes wrong, not a broken page.

## Context

Code quality audit (2026-03-29) found two related issues:

1. **No `errorComponent`** on any route — DB timeouts, Turso failures, or any loader exception shows the default TanStack Router fallback.
2. **Unvalidated external data** (`src/lib/beach-status-112.ts:164-165`) — XML values from the 112 service are cast directly to TypeScript union types without checking if the value is actually valid.

## Acceptance Criteria

- [ ] Root route (`__root.tsx`) has an `errorComponent` with a user-friendly Spanish message and retry option
- [ ] Beach detail route (`playas/$slug.tsx`) has an `errorComponent` for beach-specific errors
- [ ] `beach-status-112.ts` validates `flag` and `seaState` values against known sets before casting; unknown values fall back to safe defaults
- [ ] Error states are visually consistent with the site's design

## Notes

Report: `reports/done/code-quality-audit.md` (items 7–8).
