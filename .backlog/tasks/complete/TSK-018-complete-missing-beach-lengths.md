---
id: TSK-018
title: Complete Missing Beach Lengths
status: complete
priority: P3
tags: [data]
created: 2026-03-27
source: manual
depends-on: []
completed: 2026-03-27
---

# Complete Missing Beach Lengths

## Description

As a visitor, I want to know the length of every beach so that I can use the "sort by length" feature reliably.

## Acceptance Criteria

- [ ] Script to query OSM Overpass API for beach coastline lengths by coordinates
- [ ] Populate `length` field for the 30 missing beaches
- [ ] Manual verification for beaches not found in OSM
- [ ] Update `.backlog/reports/complete/RPT-009-content-quality-snapshot.md` with new coverage stats

## Context

Content audit (2026-03-27) identified 30 of 194 beaches (15%) missing the `length` field. This degrades the sort-by-length feature on the homepage.

See [`.backlog/reports/complete/RPT-009-content-quality-snapshot.md`](../../.backlog/reports/complete/RPT-009-content-quality-snapshot.md#3-beach-length) §3 for completion snapshot.

## Notes

- Beaches are already geolocated with coordinates, so Overpass queries can match by proximity
- Some beaches may be too small for OSM data — manual measurement via satellite imagery as fallback
- Keep script in `scripts/` if reusable for future beaches

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #018)
