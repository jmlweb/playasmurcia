---
id: RPT-054
title: Explorer search validation accepts empty, unknown and prototype-key filter values
type: bug
severity: low
status: triaged
created: 2026-10-21
triaged: 2026-10-21
task-id: TSK-127
---

- **Found**: 2026-10-21
- **Area**: `src/lib/explorer-search.ts`, `src/features/explorer/active-filter-chips.tsx`

## Observed

`validateSearch` is the boundary for `/explorar` URL params, but it lets through values that filter results without a visible way to remove them:

1. **Empty value** — `parseNumberArray` (`src/lib/explorer-search.ts:11-22`) uses `Number(value)`; `Number('')` is `0`. `?municipality=` becomes `{ municipality: [0] }`, and the municipality filter is an index into the municipality list, so the page silently filters to Cartagena.
2. **Unknown / non-integer ids** — `?municipality=999`, `1.5`, `-3`, `1e9` all pass. `filterBeaches` returns zero results, `ActiveFilterChips` skips ids with no match (`src/features/explorer/active-filter-chips.tsx:37-39`), and with no chips the component returns `null` (`src/features/explorer/active-filter-chips.tsx:164`), so the "Limpiar todo" button is hidden too.
3. **Prototype keys** — `parseEnumArray` (`src/lib/explorer-search.ts:28-36`) checks `item in allowed`, which matches inherited keys. `?accessDifficulty=toString&occupancy=constructor` is accepted (observed `["toString"]`, `["constructor"]`), gives empty results and a chip whose label is a function (renders blank).

## Repro

```ts
validateSearch({ municipality: '' })            // { municipality: [0], ... }
validateSearch({ municipality: '999' })         // { municipality: [999], ... }
validateSearch({ accessDifficulty: 'toString' }) // { accessDifficulty: ['toString'], ... }
```

## Suggested fix

Accept only non-empty strings that parse to non-negative integers (`Number.isInteger`), and use `Object.hasOwn(allowed, item)` in `parseEnumArray`. Add unit tests for the three cases.

## Impact

A malformed or stale shared link shows an empty or wrongly filtered list with no visible filter to clear.
