---
id: TSK-134
title: Blue Flag and Q certifications with season year
status: complete
priority: P2
tags: [data, external-source]
created: 2026-10-28
source: manual
depends-on: []
started: 2026-11-03
completed: 2026-11-03
---

# Blue Flag and Q certifications with season year

## Description

`certifications` is set for 58 beaches but carries no year, so it cannot be verified or refreshed. Refresh it from the current ADEAC Blue Flag list (and the Q de Calidad list) with `scripts/add-certifications.js`, and store the award year.

## Acceptance Criteria

- [x] certifications match the 2026 ADEAC Blue Flag list — evidence: node scripts/add-certifications.js; git diff data/beaches.json → empty; 35 codes = 33 CARM 2026 awards (2 joint), Las Delicias confirmed by Murcia Today (2026-11-03) (2026-11-03)
- [x] Award year is stored and shown on the site — evidence: pnpm vitest run certification-seasons + certifications-badge tests → 11 passed; data/certification-seasons.json; Temporada YYYY in built _slug bundle (2026-11-03) (2026-11-03)
- [x] scripts/add-certifications.js documented for the yearly refresh in docs/development.md — evidence: docs/development.md Yearly certification refresh section; pnpm build, check, test → pass, 382 tests (2026-11-03) (2026-11-03)

## Notes

## Learnings

- LRN-027: New beaches columns break prod until Turso is migrated; bundle list-level metadata instead
- LRN-028: Local test run needs NODE_ENV unset, a seeded local.db and a prior build
## Progress Log

- [2026-10-28] Created
- [2026-11-03] Started
- [2026-11-03] criterion 1 — evidence: node scripts/add-certifications.js && git diff data/beaches.json → no diff (35 blue-flag codes = 33 CARM 2026 awards incl. 2 joint; Águilas 10th beach Las Delicias confirmed by Murcia Today 2026) (2026-11-03)
- [2026-11-03] criterion 2 — evidence: pnpm vitest run src/lib/certification-seasons.test.ts src/features/beaches/certifications-badge.test.tsx → 11 passed; data/certification-seasons.json stores blue-flag 2026 / q-quality 2024, badge shows 'Temporada YYYY'; rg Temporada dist/server → found in _slug bundle (2026-11-03)
- [2026-11-03] criterion 3 — evidence: docs/development.md 'Yearly certification refresh (add-certifications.js)' section added; pnpm build/check/test → pass, 382 tests (2026-11-03)
- [2026-11-03] Completed