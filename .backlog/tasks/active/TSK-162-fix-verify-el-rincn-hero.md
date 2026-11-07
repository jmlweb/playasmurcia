---
id: TSK-162
title: Fix: Verify El Rincón hero photo provenance
status: active
priority: P2
tags: [images, content, bug]
created: 2026-11-04
source: report/RPT-063
depends-on: []
started: 2026-11-07
---

# Fix: Verify El Rincón hero photo provenance

## Description

`PLAYAS_1_645_3_g.avif` shows a sparkle mark resembling the Gemini watermark, and its look may not match "Arena fina y gris". AI editing is unconfirmed. Check provenance first, then act on the result.

See `.backlog/reports/complete/RPT-063-el-rincn-hero-photo-may.md`.

## Acceptance Criteria

- [ ] The hosted file is compared with its original source
- [ ] The result is recorded in the report or task
- [ ] If edited, the photo is replaced with an unedited one and the first gallery image is corrected
- [ ] If edited, other beach photos are checked for the same sparkle mark
- [ ] The page is verified with scripts/screenshot.ts

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-07] Started