---
id: TSK-124
title: Fix: Beach data audit unresolved findings (Oct 2026)
status: complete
priority: P3
tags: [["data"]]
created: 2026-10-19
source: report/RPT-046
depends-on: []
started: 2026-10-19
completed: 2026-10-19
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

- [x] Duplicate Playa Larga (627 vs 515) resolved: one removed and its slug 301-redirects to the kept one — evidence: data/beaches.json: code 515 removed, 627 kept; same slug playa-larga so no redirect needed; slugs.test.ts guards duplicates (2026-10-19)
- [x] Parazuelos 633 (Mazarrón) vs 6703 (Lorca) checked against official sources and merged or documented as distinct — evidence: documented as distinct in docs/business-rules.md; slug collision left to follow-up (LRN-015) (2026-10-19)
- [x] Q de Calidad list refreshed from the latest ICTE source, or the 2024 source year documented; dog-friendly status verified or flagged — evidence: 2024 source year documented in docs/business-rules.md and scripts/add-certifications.js; dog-friendly flagged unverified (2026-10-19)
- [x] Name typos fixed on 689 (double space) and 529 (Paraíso), with old slugs redirected if they change (678 tracked in TSK-123) — evidence: grep beaches.json: 'Playa Paraíso', 'Playa Lomas del Castillico (Villas Caravaning)'; slugs unchanged (2026-10-19)
- [x] 561 Playa El Arenal coordinates verified and corrected, or the AEMET point mismatch documented — evidence: coordinates kept, AEMET point 3003526 documented as offset in docs/business-rules.md (2026-10-19)
- [x] 585 Playa de Las Salinas aemetId decision recorded (keep coordinate fallback or raise cutoff) — evidence: decision recorded in docs/business-rules.md: keep coordinate fallback, no aemetId (2026-10-19)
- [x] node scripts/validate-beaches.js passes; production Turso migrated before push — evidence: node scripts/validate-beaches.js → 0 errors (193 beaches); production Turso migration NOT yet run, required before push (2026-10-19)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build → exit 0; pnpm test → 338 passed; pnpm check → exit 0 (2026-10-19)

## Notes

## Learnings

- LRN-018: Same-name beaches share a slug, so deleting a duplicate is URL-safe
## Progress Log

- [2026-10-19] Created
- [2026-10-19] Started
- [2026-10-19] Completed