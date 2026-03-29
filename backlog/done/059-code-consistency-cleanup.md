# Task #059: Code Consistency Cleanup

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Infra
- **Created**: 2026-03-29
- **Started**: -
- **Blocked by**: -

## User Story

As a developer, I want the codebase to follow consistent patterns so that onboarding is easier and maintenance is predictable.

## Context

Code quality audit (2026-03-29) found 10 minor consistency and maintainability issues. None are bugs, but they add friction and may cause confusion.

## Acceptance Criteria

- [x] `leaflet-map.tsx` uses named export; `location-map.tsx` wraps the lazy import with `.then(m => ({default: m.LeafletMap}))` (done 2026-03-29, with TS/lint hardening)
- [ ] Remove `'use client'` directive from `sort-select.tsx` (Next.js, not TanStack Start)
- [ ] Extract shared `OccupancyConfig` from `beach-card.tsx` and `practical-info-card.tsx` into a common location
- [ ] Extract `usePagination` hook from the 3 routes that duplicate pagination logic
- [ ] Extract `parseNumberArray` helper for the repeated array coercion in `explorar/index.tsx` `validateSearch`
- [ ] Replace non-null assertion in `colecciones/$slug.tsx:98` with `Map` lookup
- [ ] Fix truthy env check in `responsive-image.tsx:33` to use `=== 'true'`
- [ ] Move duplicated chevron SVGs from 4+ files into `icons.tsx`
- [ ] Use `item.href ?? item.label` as key in `breadcrumb.tsx` instead of index

## Notes

Report: `reports/done/code-quality-audit.md` (items 11–20).

Item 11 (LeafletMap default export) is addressed; see also `reports/pending/tanstack-start-alignment.md` §1 for server-fn `inputValidator` work done the same pass.
