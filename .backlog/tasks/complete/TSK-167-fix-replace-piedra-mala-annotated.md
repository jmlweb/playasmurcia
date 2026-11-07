---
id: TSK-167
title: Fix: Replace Piedra Mala annotated cover
status: complete
priority: P3
tags: [images, content, bug]
created: 2026-11-04
source: report/RPT-068
depends-on: []
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Replace Piedra Mala annotated cover

## Description

`piedramala_g.jpg` is the only photo for this beach, with `pictureQualityScore` 1, and it has a red arrow. 30 of 140 beaches with pictures score 1 or lower, so review those too.

See `.backlog/reports/complete/RPT-068-piedra-mala-cover-is-an.md`.

## Acceptance Criteria

- [x] Playa de Piedra Mala no longer shows the red-arrow aerial image as its cover
- [x] Any new photo has a compatible licence and recorded source
- [x] Other beaches with pictureQualityScore 1 or lower are reviewed for annotated images
- [x] node scripts/validate-beaches.js passes

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-07] Raised to P3 in 2026-11-07 grooming: the red-arrow image is now the first nearby card on El Rincón.
- [2026-11-07] Started
- [2026-11-07] Reviewed all 31 beaches with pictureQualityScore <= 1 (40 files, contact sheets). Annotated red-arrow aerials: piedramala_g.jpg (644), descargador_g.jpg (519), salitrona_g.jpg (510). scripts/source-wikimedia-pictures.ts geosearch (2 km) and manual Commons text searches found no licensed replacement (only hit: a windmill at Cabo de Palos). Removed the three images from pictures, score reset to 0; beaches now use the no-photo hero. No new photo, so no licence to record and no R2 sync. Other low-score images are poor but not annotated (canas_g.jpg and carmoli2_g.jpg are plain satellite shots; playa-blanca-aguilas-2_g.jpg is a boat). Commit af08e87; production Turso migrated 2026-11-07, /playas/playa-de-piedra-mala no longer references the file.
- [2026-11-07] Completed