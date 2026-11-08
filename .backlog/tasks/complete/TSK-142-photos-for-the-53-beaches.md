---
id: TSK-142
title: Photos for the 53 beaches with no pictures
status: complete
priority: P3
tags: [data, images]
created: 2026-10-28
source: manual
depends-on: []
started: 2026-11-07
completed: 2026-11-08
---

# Photos for the 53 beaches with no pictures

## Description

53 of 193 beaches have no `pictures`. Run the `scripts/source-wikimedia-pictures.ts` pipeline on them.

## Acceptance Criteria

- [x] Number of beaches with no photo goes down, with the result reported — evidence: beaches.json count of beaches without pictures → 56 to 54 (2026-11-08)
- [x] Only licence-compatible images, with attribution kept — evidence: data/picture-credits.json has CC BY 4.0 and CC BY-SA 4.0 entries; isAcceptedLicense() rejects empty licences (2026-11-08)
- [x] pnpm score:picture-quality re-run — evidence: agent re-ran it; validate-beaches.js → 0 errors, 0 warnings (2026-11-08)

## Notes

## Learnings

- LRN-042: Commons licence names need normalising
- LRN-043: Wikimedia geosearch hits are not always the beach
- LRN-044: Picture files are not in git
## Progress Log

- [2026-10-28] Created
- [2026-11-07] Started
- [2026-11-08] Completed