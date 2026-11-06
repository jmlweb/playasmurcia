---
id: RPT-074
title: Explorer exposes two current items in the navbar
type: bug
severity: low
status: pending
created: 2026-11-06
---

## Summary

On `/explorar`, both "Todas las playas" and the search icon carry `aria-current="page"`.

## Steps to Reproduce

1. Open `/explorar`.
2. Inspect `header.sticky [aria-current]`.

## Expected vs Actual

- Expected: one current item, "Todas las playas".
- Actual: `Todas las playas=page`, `Buscar playas=page`.

## Details

The search `Link` targets `/explorar` with `hash="buscar"` (`src/components/layout/navbar.tsx:280-281`). TanStack Router sets `aria-current="page"` after user props on any active link and ignores the hash by default, so the attribute cannot be overridden with a prop.

`activeOptions={{ includeHash: true }}` narrows this but still leaves two current items on `/explorar#buscar`. A complete fix must stop the search link matching as active. One way is to render it as a plain button or anchor that navigates through the router.

## Error Messages

None. Screen readers announce the search control as the current page.
