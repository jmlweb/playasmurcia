---
id: TSK-137
title: Data hygiene: soilType normalization, static waves, beach count
status: pending
priority: P3
tags: [data, cleanup]
created: 2026-10-28
source: manual
depends-on: []
---

# Data hygiene: soilType normalization, static waves, beach count

## Description

`soilType` has 25 variants with near-duplicates (for example `"Arena  media y blanca"` with a double space). The static `waves` label can contradict the live wave forecast added in TSK-115. `docs/data-schema.md` says 194 beaches; the data has 193.

## Acceptance Criteria

- [ ] soilType values merged into one canonical list (no double spaces or reordered duplicates such as Arena blanca y fina)
- [ ] Decision recorded on whether the static waves label stays now that the live Open-Meteo marine forecast exists
- [ ] docs/data-schema.md shows the correct beach count (193)
- [ ] node scripts/validate-beaches.js passes

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created