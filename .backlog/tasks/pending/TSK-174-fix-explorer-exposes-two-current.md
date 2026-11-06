---
id: TSK-174
title: Fix: Explorer exposes two current items in the navbar
status: pending
priority: P4
tags: []
created: 2026-11-06
source: report/RPT-074
depends-on: []
---

# Fix: Explorer exposes two current items in the navbar

## Description

### Summary

On `/explorar`, both "Todas las playas" and the search icon carry `aria-current="page"`. Screen readers announce the search control as the current page.

### Steps to Reproduce

1. Open `/explorar`.
2. Inspect `header.sticky [aria-current]`.

Expected: one current item, "Todas las playas". Actual: `Todas las playas=page`, `Buscar playas=page`.

### Details

The search `Link` targets `/explorar` with `hash="buscar"` (`src/components/layout/navbar.tsx`). TanStack Router sets `aria-current="page"` after user props on any active link and ignores the hash by default, so the attribute cannot be overridden with a prop.

`activeOptions={{ includeHash: true }}` narrows this but still leaves two current items on `/explorar#buscar`. A complete fix must stop the search link matching as active. One way is to render it as a plain button or anchor that navigates through the router.

Source report: `.backlog/reports/complete/RPT-074-explorer-exposes-two-current-items.md`

## Acceptance Criteria

- [ ] On /explorar and /explorar#buscar, only "Todas las playas" carries aria-current
- [ ] The search control no longer matches as active
- [ ] Search still navigates to /explorar#buscar from other routes and still focuses the input, including with the phone menu open
- [ ] Regression test covers the single current item

## Notes

## Learnings

## Progress Log

- [2026-11-06] Created