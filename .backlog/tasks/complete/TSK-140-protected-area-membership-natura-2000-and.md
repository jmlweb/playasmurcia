---
id: TSK-140
title: Protected-area membership (Natura 2000 and regional parks)
status: complete
priority: P3
tags: [data, external-source, geo]
created: 2026-10-28
source: manual
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Protected-area membership (Natura 2000 and regional parks)

## Description

Intersect beach coordinates with the MITECO Natura 2000 layer and the CARM protected spaces (for example Calblanque, Cabo Cope-Puntas de Calnegre, Salinas de San Pedro, Islas del Mar Menor).

## Acceptance Criteria

- [x] Source and dataset version recorded — evidence: data/protected-areas.json: EEA Natura 2000 end-2024 release (CC BY 4.0) and CARM SIG_LUP_SITES_CARM:ENP WFS; fetchedOn 2026-11-08 (2026-11-08)
- [x] Protected-area name and code stored per beach — evidence: natura2000 [{code,name,type}] and regional [{code,name,figure,norm}] per beach; 158 beaches (2026-11-08)
- [x] Shown on the beach page — evidence: ProtectedAreasNotice on the beach page, land sites separated from the sea in front (Playwright on /playas/playa-de-calblanque) (2026-11-08)
- [x] Intersection reproducible with a documented script — evidence: scripts/fetch-protected-areas.ts (200 m buffer, UTM conversion for the CARM layer), documented in docs/development.md (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created
- [2026-11-04] If this adds beaches columns, migrate Turso by hand before pushing: production breaks otherwise (LRN-027).
- [2026-11-08] Started
- [2026-11-08] MITECO services were down on 2026-11-08; EEA used instead. Baño de las Mujeres (632) lies 2.7 km outside the Calnegre park polygon: coordinate or boundary issue, left as is.
- [2026-11-08] Completed