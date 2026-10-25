---
id: TSK-129
title: Fix: COPLA flag lookup misses beaches whose feed name carries a segment suffix
status: pending
priority: P3
tags: []
created: 2026-10-25
source: report/RPT-056
depends-on: []
---

# Fix: COPLA flag lookup misses beaches whose feed name carries a segment suffix

## Description

COPLA name matching (`src/lib/beach-status-112.ts:81-85`) misses site beaches whose feed name carries a segment suffix (`BOLNUEVO (CENTRO)`, `PONIENTE I`, `BARNUEVO (LIMA 1)`), so ~20 beaches never show a flag or closure. See `.backlog/reports/complete/RPT-056-copla-flag-lookup-misses-beaches.md`. Beaches with several segments need a deterministic rule for which flag wins (e.g. most severe).

## Acceptance Criteria

- [ ] Playa de Bolnuevo, Playa de Poniente (Águilas), Playa Barnuevo and Playa de Islas Menores resolve to their qualified COPLA entries
- [ ] The 59 beaches that match today still map to the same feed entries
- [ ] No beach matches a feed entry from another municipality
- [ ] Unit tests cover the Playa de prefix and the (…), I/II and (LIMA n) suffixes

## Notes

## Learnings

## Progress Log

- [2026-10-25] Created