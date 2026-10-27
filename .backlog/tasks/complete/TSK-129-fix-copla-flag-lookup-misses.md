---
id: TSK-129
title: Fix: COPLA flag lookup misses beaches whose feed name carries a segment suffix
status: complete
priority: P3
tags: []
created: 2026-10-25
source: report/RPT-056
depends-on: []
started: 2026-10-27
completed: 2026-10-27
---

# Fix: COPLA flag lookup misses beaches whose feed name carries a segment suffix

## Description

COPLA name matching (`src/lib/beach-status-112.ts:81-85`) misses site beaches whose feed name carries a segment suffix (`BOLNUEVO (CENTRO)`, `PONIENTE I`, `BARNUEVO (LIMA 1)`), so ~20 beaches never show a flag or closure. See `.backlog/reports/complete/RPT-056-copla-flag-lookup-misses-beaches.md`. Beaches with several segments need a deterministic rule for which flag wins (e.g. most severe).

## Acceptance Criteria

- [x] Playa de Bolnuevo, Playa de Poniente (Águilas), Playa Barnuevo and Playa de Islas Menores resolve to their qualified COPLA entries — evidence: tsx getBeachStatus over data/beaches.json vs live feed 2026-10-27 → Bolnuevo, Poniente, Barnuevo, Islas Menores resolve to segment entries (2026-10-27)
- [x] The 59 beaches that match today still map to the same feed entries — evidence: diff old vs new mapping → 59/59 identical, 17 added (2026-10-27)
- [x] No beach matches a feed entry from another municipality — evidence: municipality pairs of 76 matches → all same-municipality; unit test passes (2026-10-27)
- [x] Unit tests cover the Playa de prefix and the (…), I/II and (LIMA n) suffixes — evidence: pnpm exec vitest run src/lib/beach-status-112.test.ts → 25 passed (8 failed before fix) (2026-10-27)

## Notes

## Learnings

- LRN-025: COPLA segment names: compare bare names by equality and never use the parenthesized text as an alias
- LRN-026: pnpm test fails with React.act is not a function when the shell exports NODE_ENV=production
## Progress Log

- [2026-10-25] Created
- [2026-10-27] Started
- [2026-10-27] criterion 1 — evidence: getBeachStatus run under tsx over data/beaches.json against the live COPLA feed snapshot of 2026-10-27 → Playa de Bolnuevo → BOLNUEVO (CAMPING), Playa de Poniente (Águilas) → PONIENTE I, Playa Barnuevo → BARNUEVO (LIMA 1), Playa de Islas Menores → ISLAS MENORES (LEVANTE) (2026-10-27)
- [2026-10-27] criterion 2 — evidence: diff of the old-rule mapping (59 beaches) against the new mapping on the same feed snapshot → all 59 lines identical, 17 beaches added (2026-10-27)
- [2026-10-27] criterion 3 — evidence: municipality pairs of all 76 matches on the feed snapshot → each site municipality maps only to its own feed municipio; unit test 'does not match a segment from another municipality' passes (2026-10-27)
- [2026-10-27] criterion 4 — evidence: pnpm exec vitest run src/lib/beach-status-112.test.ts → 25 passed; new cases cover the Playa de prefix, (…), I/II, (LIMA n), stacked suffixes, most-severe pick, PEDRUCHILLO and ISLAS MENORES (LEVANTE) negatives; 8 failed before the fix (2026-10-27)
- [2026-10-27] Completed