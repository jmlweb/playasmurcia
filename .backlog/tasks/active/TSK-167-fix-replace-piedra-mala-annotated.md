---
id: TSK-167
title: Fix: Replace Piedra Mala annotated cover
status: active
priority: P3
tags: [images, content, bug]
created: 2026-11-04
source: report/RPT-068
depends-on: []
started: 2026-11-07
---

# Fix: Replace Piedra Mala annotated cover

## Description

`piedramala_g.jpg` is the only photo for this beach, with `pictureQualityScore` 1, and it has a red arrow. 30 of 140 beaches with pictures score 1 or lower, so review those too.

See `.backlog/reports/complete/RPT-068-piedra-mala-cover-is-an.md`.

## Acceptance Criteria

- [ ] Playa de Piedra Mala no longer shows the red-arrow aerial image as its cover
- [ ] Any new photo has a compatible licence and recorded source
- [ ] Other beaches with pictureQualityScore 1 or lower are reviewed for annotated images
- [ ] node scripts/validate-beaches.js passes

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-07] Raised to P3 in 2026-11-07 grooming: the red-arrow image is now the first nearby card on El Rincón.
- [2026-11-07] Started