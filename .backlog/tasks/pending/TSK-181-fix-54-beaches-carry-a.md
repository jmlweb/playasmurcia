---
id: TSK-181
title: Fix: 54 beaches carry a stale pictureQualityScore
status: pending
priority: P4
tags: [data, images, cleanup]
created: 2026-11-07
source: manual
depends-on: []
---

# Fix: 54 beaches carry a stale pictureQualityScore

## Description

### Description

`pnpm run score:picture-quality -- --dry-run` reports 54 beaches whose stored `pictureQualityScore` in `data/beaches.json` no longer matches the files in `public/pictures/` (mostly 0 → 3 or 2 → 3 after pictures were added without rescoring; for example codes 628, 551, 7053, 626 have one large photo but score 0). Found during TSK-162 (see `.backlog/reports/complete/RPT-063-el-rincn-hero-photo-may.md`). The score drives the homepage selection (LRN-019), so a full rescore changes which beaches are featured; review the result before migrating.

### Acceptance Criteria

- [ ] `pnpm score:picture-quality` run and the diff reviewed against the homepage featured selection
- [ ] `node scripts/validate-beaches.js` passes
- [ ] Production migrated by hand before pushing

## Acceptance Criteria



## Notes

## Learnings

## Progress Log

- [2026-11-07] Created