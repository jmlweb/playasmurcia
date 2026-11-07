---
id: TSK-169
title: Fix: 17 descriptions join unrelated facts with y socorrista
status: pending
priority: P4
tags: [data, content]
created: 2026-11-04
source: task/TSK-123
depends-on: []
---

# Fix: 17 descriptions join unrelated facts with y socorrista

## Description

TSK-123 fixed Playa de La Concha but never ran the audit it promised for the same pattern. 17 `description` values still contain "y socorrista.", for example "con agua sin oleaje y socorrista", most of them now followed by another sentence. Codes: 579, 675, 530, 625, 682, 647, 664, 585, 608, 686, 670, 536, 650, 591, 539, 691, 696. `description` is hand-edited copy, so follow the guidelines in `docs/business-rules.md`.

## Acceptance Criteria

- [ ] Each of the 17 descriptions is reviewed and rewritten where the two facts do not belong together
- [ ] Translated descriptions are checked for the same defect
- [ ] Spanish spelling and diacritics are verified on the edited lines
- [ ] node scripts/validate-beaches.js passes
- [ ] The change is migrated to Turso before pushing

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created