---
id: TSK-126
title: Fix: Nearby beaches lose their distance order
status: pending
priority: P3
tags: [bug, beach-detail]
created: 2026-10-21
source: report/RPT-053
depends-on: []
---

# Fix: Nearby beaches lose their distance order

## Description

`getNearbyBeaches` (`src/lib/db-data/beach-queries.ts:213-228`) uses `inArray`, which returns rows in table order; 191 of 193 beaches get their distance-sorted `nearby` list reordered. See `.backlog/reports/complete/RPT-053-nearby-beaches-lose-their-distance.md`.

## Acceptance Criteria

- [ ] getNearbyBeaches returns beaches in the order of its codes argument
- [ ] Unit test asserts output order matches input order
- [ ] Playas cercanas carousel shows the closest beach first

## Notes

## Learnings

## Progress Log

- [2026-10-21] Created