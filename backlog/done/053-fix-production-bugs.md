# Task #053: Fix Production Bugs (Cache, Slug Duplication, Debounce)

## Metadata
- **Status**: pending
- **Priority**: P1 - Active
- **Slice**: Infra
- **Created**: 2026-03-29
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor, I want weather data to display correctly on all beaches and search to work reliably so that I get accurate information.

## Context

Code quality audit (2026-03-29) identified 3 production bugs:

1. **Batch weather cache collision** — `src/lib/open-meteo.ts:187-189` uses the literal string `'batch'` as cache key. Home caches ~12 featured beaches; Explorer then receives those 12 stale results for all 194 beaches.
2. **Duplicated slug functions** — `beachToSlug`/`municipalityToSlug` exist identically in `src/lib/db-data.ts:263-269` and `src/lib/slugs.ts:3-17`. Different routes import from different files. If one copy changes, URL matching breaks silently.
3. **Debounce timer leak** — `src/components/search-bar.tsx:15-26` never clears the debounce timer on unmount, firing `onChange` against a stale parent.

## Acceptance Criteria

- [ ] Remove the batch-level cache in `open-meteo.ts` (individual forecasts already have 2h TTL) or key on a stable hash of beach codes
- [ ] Remove `beachToSlug`/`municipalityToSlug` from `db-data.ts`; all callers import from `@/lib/slugs`
- [ ] Add cleanup `useEffect` in `search-bar.tsx` that clears `debounceRef.current` on unmount
- [ ] Existing tests pass; no regressions

## Notes

Report: `reports/done/code-quality-audit.md` (items 1–3).
