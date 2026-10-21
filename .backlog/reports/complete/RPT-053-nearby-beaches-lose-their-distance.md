---
id: RPT-053
title: Nearby beaches lose their distance order
type: bug
severity: medium
status: triaged
created: 2026-10-21
triaged: 2026-10-21
task-id: TSK-126
---

- **Found**: 2026-10-21, against a fresh `local.db` seeded from `data/*.json`
- **Area**: `src/lib/db-data/beach-queries.ts`, `src/routes/playas/$slug.tsx`

## Observed

`getNearbyBeaches` (`src/lib/db-data/beach-queries.ts:213-228`) loads the beaches with `inArray(schema.beaches.code, codes)`. SQL returns them in table order, not in the order of `beach.nearby`. The stored `nearby` arrays are sorted by distance, and neither the route (`src/routes/playas/$slug.tsx:73-85`) nor `NearbyCarousel` re-sorts. The WebMCP tool (`src/features/webmcp/webmcp-server.ts:67`) has the same problem.

Result for every beach with 2+ neighbours: 191 of 193 beaches get their nearby list reordered.

```
575 stored [658, 582, 510, 553, 580] (0.09, 2.20, 2.35, 2.42, 2.77 km)
    returned [510, 553, 580, 582, 658]   -> the beach 90 m away is shown last
601 stored [603, 554, 553, 510, 606] (1.05, 1.73, 2.65, 2.89, 2.98 km)
    returned [510, 553, 554, 603, 606]
```

## Repro

Script that loads `getAllBeaches()` and compares `getNearbyBeaches(b.nearby).map(x => x.code)` with `b.nearby` for each beach (run with `DATABASE_URL=file:./local.db pnpm tsx <script>`): prints `beaches with reordered nearby: 191 / 193`.

## Suggested fix

In `getNearbyBeaches`, sort the rows by `codes.indexOf(row.code)` before mapping. Add a unit test that the output follows the input order.

## Impact

The "Playas cercanas" carousel shows neighbours in arbitrary order, often putting the closest beach last.
