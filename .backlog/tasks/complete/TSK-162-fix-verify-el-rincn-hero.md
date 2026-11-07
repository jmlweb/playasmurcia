---
id: TSK-162
title: Fix: Verify El Rincón hero photo provenance
status: complete
priority: P2
tags: [images, content, bug]
created: 2026-11-04
source: report/RPT-063
depends-on: []
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Verify El Rincón hero photo provenance

## Description

`PLAYAS_1_645_3_g.avif` shows a sparkle mark resembling the Gemini watermark, and its look may not match "Arena fina y gris". AI editing is unconfirmed. Check provenance first, then act on the result.

See `.backlog/reports/complete/RPT-063-el-rincn-hero-photo-may.md`.

## Acceptance Criteria

- [x] The hosted file is compared with its original source
- [x] The result is recorded in the report or task
- [x] If edited, the photo is replaced with an unedited one and the first gallery image is corrected
- [x] If edited, other beach photos are checked for the same sparkle mark
- [x] The page is verified with scripts/screenshot.ts

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-07] Started
- [2026-11-07] Confirmed generated (2752×1536, sparkle mark, scene differs from the 560×420 source). Replaced covers of 645, 638 and 654; R2 and production migrated. Details in RPT-063.
- [2026-11-07] Production page screenshot taken after the migration; cover is PLAYAS_1_645_1_g.
- [2026-11-07] Completed