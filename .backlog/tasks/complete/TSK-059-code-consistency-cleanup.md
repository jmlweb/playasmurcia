---
id: TSK-059
title: Code Consistency Cleanup
status: complete
priority: P3
tags: [infra]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# Code Consistency Cleanup

## Description

As a developer, I want the codebase to follow consistent patterns so that onboarding is easier and maintenance is predictable.

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

## Context

Code quality audit (2026-03-29) found 10 minor consistency and maintainability issues. None are bugs, but they add friction and may cause confusion.

## Notes

Report: `.backlog/reports/complete/RPT-005-code-quality-audit-2026-03-29.md` (items 11–20).

Item 11 (LeafletMap default export) is addressed; see also `.backlog/reports/complete/RPT-021-tanstack-start-alignment-report.md` §1 for server-fn `inputValidator` work done the same pass.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #059)
