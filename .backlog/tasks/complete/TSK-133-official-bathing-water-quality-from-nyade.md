---
id: TSK-133
title: Official bathing-water quality from NÁYADE / EEA
status: complete
priority: P2
tags: [data, external-source]
created: 2026-10-28
source: manual
depends-on: []
started: 2026-10-31
completed: 2026-10-31
---

# Official bathing-water quality from NÁYADE / EEA

## Description

Replace the editorial `waterQuality` field (currently 169 excellent / 23 good / 1 sufficient, not sourced) with the official bathing-water classification from the Ministerio de Sanidad NÁYADE system or the EEA bathing water dataset. Match sampling points to beaches by coordinates and store the classification season year so the value is citable and refreshable.

## Acceptance Criteria

- [x] Every beach with a sampling point within a defined distance gets the official EU class (Directive 2006/7/CE) and season year — evidence: pnpm vitest run src/lib/bathing-water-quality.test.ts → 9 passed; script → season 2025, 106 beaches classified within 500 m (2026-10-31)
- [x] Beaches without a sampling point get no class instead of a guess — evidence: no-match/unclassified/non-ES620 tests pass; 87 beaches without class; validate-beaches.js → 0 errors (2026-10-31)
- [x] Source is cited on the beach page — evidence: practical-info-card.test.tsx → 14 passed (citation with season and NÁYADE link) (2026-10-31)
- [x] Retained script added and documented in docs/development.md; docs/data-schema.md updated — evidence: scripts/add-bathing-water-quality.ts documented in docs/development.md, business-rules.md, data-schema.md; build/check/test green (2026-10-31)

## Notes

## Learnings

- LRN-027: EEA bathing water data: use the ArcGIS map service, not discodata SQL
- LRN-028: Bathing water IDs carry the NUTS region: ES620 is Murcia
- LRN-029: Local scripts inherit NODE_ENV=production from the hustle shell
## Progress Log

- [2026-10-28] Created
- [2026-10-31] Started
- [2026-10-31] criterion 1 — evidence: pnpm vitest run src/lib/bathing-water-quality.test.ts → 9 passed; pnpm tsx scripts/add-bathing-water-quality.ts → season 2025, 84 ES620 points, 106 beaches classified within 500 m (105 excellent, 1 good) (2026-10-31)
- [2026-10-31] criterion 2 — evidence: tests 'gives no class when no sampling point is close enough' / 'skips unclassified points' / 'ignores sampling points outside the Región de Murcia' pass; script removed the heuristic class from 87 beaches; node scripts/validate-beaches.js → 0 errors (2026-10-31)
- [2026-10-31] criterion 3 — evidence: pnpm vitest run src/features/beaches/practical-info-card.test.tsx → 14 passed (citation 'Clasificación oficial UE, temporada 2025. Fuente: EEA / NÁYADE' linked to NÁYADE profile); src/routes/playas/$slug.tsx passes waterQualitySource (2026-10-31)
- [2026-10-31] criterion 4 — evidence: scripts/add-bathing-water-quality.ts replaces add-water-quality.ts; documented in docs/development.md, docs/business-rules.md, docs/data-schema.md; pnpm build, pnpm check, pnpm test (389 passed) green (2026-10-31)
- [2026-10-31] Completed