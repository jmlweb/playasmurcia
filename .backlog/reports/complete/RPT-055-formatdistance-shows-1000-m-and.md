---
id: RPT-055
title: formatDistance shows 1000 m and 10,0 km at unit boundaries
type: bug
severity: low
status: triaged
created: 2026-10-23
triaged: 2026-10-23
task-id: TSK-128
---

## Summary

`formatDistance` (`src/lib/geo.ts:21-24`) picks the unit and the number format from the raw `km` value before rounding. Distances that round up across a boundary come out as "1000 m" instead of "1,0 km", and as "10,0 km" instead of "10 km".

The string is shown on beach cards in the explorer when sorting by proximity: `src/features/beaches/beach-card.tsx:160` (`· a ${formatDistance(distanceKm)}`), fed from `src/routes/explorar/index.tsx:318`.

## Reproduction

```bash
pnpm -s tsx -e 'import {formatDistance} from "./src/lib/geo.ts"; for (const k of [0.94,0.95,0.97,0.999,1.0,9.96,9.99,10]) console.log(k, formatDistance(k))'
```

Observed output:

```
0.94 900 m
0.95 1000 m
0.97 1000 m
0.999 1000 m
1 1,0 km
9.96 10,0 km
9.99 10,0 km
10 10 km
```

## Expected

Values in [0.95, 1) should render like `formatDistance(1)` ("1,0 km"), and values in [9.95, 10) like `formatDistance(10)` ("10 km").

## Root cause

`km < 1` and `km < 10` are evaluated on the unrounded value, while `Math.round(km * 10) * 100` and `km.toFixed(1)` round afterwards.

## Test gap

`src/lib/geo.test.ts:23-31` covers 0.04, 0.46, 3.26 and 12.4 only; no case sits near the 1 km or 10 km boundary.
