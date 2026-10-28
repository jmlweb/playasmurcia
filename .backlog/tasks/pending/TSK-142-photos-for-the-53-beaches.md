---
id: TSK-142
title: Photos for the 53 beaches with no pictures
status: pending
priority: P3
tags: [data, images]
created: 2026-10-28
source: manual
depends-on: []
---

# Photos for the 53 beaches with no pictures

## Description

53 of 193 beaches have no `pictures`. Run the `scripts/source-wikimedia-pictures.ts` pipeline on them.

## Acceptance Criteria

- [ ] Number of beaches with no photo goes down, with the result reported
- [ ] Only licence-compatible images, with attribution kept
- [ ] pnpm score:picture-quality re-run

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created