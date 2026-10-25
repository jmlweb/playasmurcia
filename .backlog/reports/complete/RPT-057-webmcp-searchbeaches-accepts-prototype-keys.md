---
id: RPT-057
title: WebMCP search_beaches accepts prototype keys as accessDifficulty and occupancy
type: bug
severity: low
status: triaged
created: 2026-10-25
triaged: 2026-10-25
task-id: TSK-130
---

## Description

`asEnum` (`src/features/webmcp/tool-input.ts:51-58`) validates with `value in allowed`, which also accepts inherited keys of `Object.prototype`. `parseSearchInput` (`:87-88`) uses it for `accessDifficulty` and `occupancy`, so agent input such as `"toString"` or `"constructor"` passes as a valid enum value. An unknown value like `"bogus"` is dropped (filter ignored), but a prototype key is kept: `buildSearchParams` turns it into `accessDifficulty: ['toString']`, `filterBeaches` returns zero beaches, the result reports nothing as `unresolved`, and the tool navigates `/explorar` to an empty list.

## Reproduction

```
$ pnpm tsx probe.ts   # parseSearchInput({ accessDifficulty: 'toString', occupancy: 'constructor' })
{"accessDifficulty":"toString","occupancy":"constructor","limit":10}
```

## Notes

Sibling of TSK-127, which fixes the same `in` pattern in `src/lib/explorer-search.ts` (`parseEnumArray`); that fix does not touch this file. An own-property check (`Object.hasOwn`) fixes it.
