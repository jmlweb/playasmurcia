---
id: TSK-124
title: Fix: Beach data audit unresolved findings (Oct 2026)
status: active
priority: P3
tags: [["data"]]
created: 2026-10-19
source: report/RPT-046
depends-on: []
started: 2026-10-19
---

# Fix: Beach data audit unresolved findings (Oct 2026)

## Description

Open findings from the 2026-10-18 audit of `data/beaches.json`. Items 3 (generated `access` errors) and 4 (false Blue Flag claims) were resolved in that session.

1. **Duplicate beach**: 627 and 515 "Playa Larga" (Cartagena, Calblanque) have identical coordinates. Deleting one changes public URLs.
2. **Possible duplicate**: 633 Playa Parazuelos (Mazarrón) and 6703 Playa Parazuelos (Lorca) are ~1.3 km apart and share an AEMET point. They may be two halves of one beach split by the municipal border.
5. **Unverifiable lists**: the Q de Calidad list is from 2024 (no 2026 ICTE list found). Dog-friendly status could not be verified for 2026.
6. **Name typos**: 689 "Playa  Lomas del Castillico" (double space), 529 "Playa Paraiso" (should be Paraíso). 678 "Cala Mijo. (Cueva de las Palomas)" is covered by TSK-123.
7. 561 Playa El Arenal coordinates are 2.4 km from AEMET's El Arenal point. It is unclear which one is wrong.
8. 585 Playa de Las Salinas (Los Alcázares) has no `aemetId`. The nearest AEMET point (Punta Calera, 2.4 km) is over the 2.37 km cutoff, so the weather widget falls back to coordinates.

See .backlog/reports/complete/RPT-046-beach-data-audit-unresolved-findings.md for evidence links.

## Acceptance Criteria

- [ ] Duplicate Playa Larga (627 vs 515) resolved: one removed and its slug 301-redirects to the kept one
- [ ] Parazuelos 633 (Mazarrón) vs 6703 (Lorca) checked against official sources and merged or documented as distinct
- [ ] Q de Calidad list refreshed from the latest ICTE source, or the 2024 source year documented; dog-friendly status verified or flagged
- [ ] Name typos fixed on 689 (double space) and 529 (Paraíso), with old slugs redirected if they change (678 tracked in TSK-123)
- [ ] 561 Playa El Arenal coordinates verified and corrected, or the AEMET point mismatch documented
- [ ] 585 Playa de Las Salinas aemetId decision recorded (keep coordinate fallback or raise cutoff)
- [ ] node scripts/validate-beaches.js passes; production Turso migrated before push
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-10-19] Created
- [2026-10-19] Started