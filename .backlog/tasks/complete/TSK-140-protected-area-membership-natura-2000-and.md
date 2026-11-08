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

- [x] Source and dataset version recorded
- [x] Protected-area name and code stored per beach
- [x] Shown on the beach page
- [x] Intersection reproducible with a documented script

## Notes

## Learnings

- LRN-045: CARM GeoServer WFS serves ENP, LIC-ZEC and ZEPA limits as GeoJSON
- LRN-046: Beach points sit on the waterline: intersect protected areas with a 50 m tolerance and drop sea sites
- LRN-047: NODE_ENV=production in the shell breaks pnpm test with React.act is not a function
## Progress Log

- [2026-10-28] Created
- [2026-11-04] If this adds beaches columns, migrate Turso by hand before pushing: production breaks otherwise (LRN-027).
- [2026-11-08] Started
- [2026-11-08] criterion 1 — evidence: pnpm vitest run src/lib/protected-areas.test.ts ('records the source layers, the retrieval date…') → pass; data/protected-areas.json records the CARM IDERM WFS URL, retrievedOn 2026-11-08 and per-layer version (snapshot date, feature count 29/50/26, layer abstract) (2026-11-08)
- [2026-11-08] criterion 2 — evidence: pnpm vitest run src/lib/protected-areas.test.ts → 13 passed; 68 of 193 beaches carry { code, name, designation, network } (e.g. 516 → ENP000005 + ES6200001) (2026-11-08)
- [2026-11-08] criterion 3 — evidence: pnpm vitest run src/features/beaches/protected-area-notice.test.tsx → 5 passed; ProtectedAreaNotice wired under the description in src/routes/playas/$slug.tsx; pnpm build → ok (2026-11-08)
- [2026-11-08] criterion 4 — evidence: pnpm tsx scripts/assign-protected-areas.ts → '68 of 193 beaches in a protected area', rerun gives the same file; documented in docs/development.md and docs/business-rules.md (2026-11-08)
- [2026-11-08] Completed