---
id: RPT-070
title: COPLA flag lookup still misses four beaches whose feed entry uses a different name
type: bug
severity: medium
status: triaged
created: 2026-11-06
triaged: 2026-11-06
task-id: TSK-170
---

## Description

`findCoplaEntry` (`src/lib/beach-status-112.ts:139-160`) matches a site beach to a 112 COPLA feed entry only by name: the direct substring rule (`namesMatch`, `:81-85`) or bare-name equality (`bareBeachName` / `segmentNamesMatch`, `:92-107`). Four site beaches have a feed entry within 0.3 km, but the names never meet, so `getBeachStatus` and `getBatchBeachFlags` return nothing. A closure or red flag on these beaches is not shown in season.

TSK-129 (RPT-056) fixed the segment-suffix cases. RPT-056 listed 581 Playa de El Rihuete as a miss, but TSK-129's criteria did not cover it, and it still misses.

| Site beach | Feed entry | Distance | Why the name rules miss |
| --- | --- | --- | --- |
| 581 Playa de El Rihuete (Playa del Rigüete), Mazarrón | `PUERTO - RIHUETE`, `SILLAS DE RIHUETE` | 0.16 km, 0.10 km | Bare name `el rihuete` ≠ `puerto  rihuete` / `sillas de rihuete` |
| 663 Cala de Calnegre, Lorca | `PLAYA DE CALNEGRE` | 0.12 km | `LEADING_PLAYA` strips "playa de" from the feed name but nothing strips "cala de" from the site name |
| 592 Playa Calnegre, Cartagena | `MONTE BLANCO - CALNEGRE` | 0.30 km | Hyphenated compound name |
| 580 Playa de La Chapineta, Cartagena | `LA AZOHIA (CHAPINETA)` | 0.27 km | Parenthesized text is dropped on purpose (LRN-025), so no name rule can match it |

## Reproduction

Live feed `https://www.112rmurcia.es/copla/copla.xml` fetched 2026-11-06 (102 entries). `findCoplaEntry` was copied with `export` added and run under `pnpm tsx` over `data/beaches.json`. The four beaches above return `undefined`. Every other match stays inside its own municipality.

Distances come from the feed's `<coordx>`/`<coordy>`, read as ETRS89 / UTM zone 30N and converted to lat/lng. They are compared with `coordinates` in `data/beaches.json` using haversine:

```
581 El Rihuete       | PUERTO - RIHUETE        | 37.56908,-1.25525 | 0.16 km
581 El Rihuete       | SILLAS DE RIHUETE       | 37.57087,-1.25333 | 0.10 km
663 Cala de Calnegre | PLAYA DE CALNEGRE       | 37.50742,-1.41518 | 0.12 km
592 Playa Calnegre   | MONTE BLANCO - CALNEGRE | 37.66430,-0.72353 | 0.30 km
580 Chapineta        | LA AZOHIA (CHAPINETA)   | 37.55949,-1.16932 | 0.27 km
```

Control: on the same snapshot, 694 Playa Puntas de Calnegre still resolves to `PUNTAS DE CALNEGRE`.

## Notes

Widening the name rules again risks the false positives LRN-025 warns about. Two safer options:

- Use the feed coordinates as a fallback when no name rule matches: nearest entry in the same municipality, within a small radius.
- Keep an explicit map from site beach code to feed `playa` for the leftovers.

When a beach has several entries (Rihuete), keep the most-severe rule.
