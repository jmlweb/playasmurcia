---
id: TSK-169
title: Fix: 17 descriptions join unrelated facts with y socorrista
status: complete
priority: P4
tags: [data, content]
created: 2026-11-04
source: task/TSK-123
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Fix: 17 descriptions join unrelated facts with y socorrista

## Description

TSK-123 fixed Playa de La Concha but never ran the audit it promised for the same pattern. 17 `description` values still contain "y socorrista.", for example "con agua sin oleaje y socorrista", most of them now followed by another sentence. Codes: 579, 675, 530, 625, 682, 647, 664, 585, 608, 686, 670, 536, 650, 591, 539, 691, 696. `description` is hand-edited copy, so follow the guidelines in `docs/business-rules.md`.

## Acceptance Criteria

- [x] Each of the 17 descriptions is reviewed and rewritten where the two facts do not belong together — evidence: 17 codes rewritten plus 577, 544, 545, 4894 found by the audit; lifeguard kept only where it decides the visit (2026-11-08)
- [x] Translated descriptions are checked for the same defect — evidence: translations[*].description: no y socorrista / and lifeguard / et sauveteur / und Rettungsschwimmer matches (2026-11-08)
- [x] Spanish spelling and diacritics are verified on the edited lines — evidence: Edited lines re-read; diacritics kept (2026-11-08)
- [x] node scripts/validate-beaches.js passes — evidence: node scripts/validate-beaches.js 0 errors 0 warnings (2026-11-08)
- [x] The change is migrated to Turso before pushing — evidence: Migrated to Turso 2026-11-08 before push (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-08] Started
- [2026-11-08] Commit e73e1f5. metaDescription has the same y socorrista joins on other beaches (689, 695, 669…); out of scope, generated field.
- [2026-11-08] Completed