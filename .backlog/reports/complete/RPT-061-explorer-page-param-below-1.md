---
id: RPT-061
title: Explorer page param below 1 renders an empty results grid
type: bug
severity: low
status: triaged
created: 2026-11-03
triaged: 2026-11-03
task-id: TSK-145
---

## Summary

`validateSearch` in `src/lib/explorer-search.ts:66-67` accepts any positive number for `page` and floors it, so a fractional value between 0 and 1 becomes `page: 0`. The explorer then renders an empty grid while the summary still reports every matching beach.

## Location

- `src/lib/explorer-search.ts:66-67` — `typeof search.page === 'number' && search.page > 0 ? Math.floor(search.page) : undefined`; the check runs before flooring, so `0.5` passes and becomes `0`.
- `src/routes/explorar/index.tsx:100` — `const currentPage = search.page ?? 1` keeps `0` because `??` only replaces `null`/`undefined`.
- `src/routes/explorar/index.tsx:158-161` — `safePage = Math.min(0, totalPages || 1)` is `0`, and `allFiltered.slice((0 - 1) * 15, 0 * 15)` is `slice(-15, 0)`, which is always `[]`.

## Reproduction

1. TanStack Router parses search values with `JSON.parse`, so `/explorar?page=0.5` arrives as the number `0.5`.
2. A temporary Vitest probe returned `validateSearch({ page: 0.5 }).page === 0` (and `2.7` → `2`, so only values below 1 break).
3. With `currentPage = 0`, the grid slice is empty, while `ResultsSummary` gets `totalItems = allFiltered.length` and `currentPage = 0`. The page shows "N encontradas", page 0, and no beach cards.

## Expected

`validateSearch` drops `page` unless the floored value is at least 1 (or clamps it to 1), so the explorer always shows a non-empty page when there are results.

## Suggested fix

Floor first, then validate: compute `Math.floor(search.page)` and return it only when it is a finite integer `>= 1`. Add a case for `{ page: 0.5 }` to `src/lib/explorer-search.test.ts`.
