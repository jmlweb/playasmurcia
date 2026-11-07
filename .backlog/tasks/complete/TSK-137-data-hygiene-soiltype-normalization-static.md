---
id: TSK-137
title: Data hygiene: soilType normalization, static waves, beach count
status: complete
priority: P3
tags: [data, cleanup]
created: 2026-10-28
source: manual
depends-on: []
started: 2026-11-07
completed: 2026-11-07
---

# Data hygiene: soilType normalization, static waves, beach count

## Description

`soilType` has 25 variants with near-duplicates, for example `Arena blanca y fina` (1 beach) and word-order or partial forms such as `Arena fina` and `Arena media`. The double-space value is already gone. `docs/data-schema.md:11` and `:183` say 194 beaches; the data has 193.

## Acceptance Criteria

- [x] soilType values merged into one canonical list (no double spaces or reordered duplicates such as Arena blanca y fina)
- [x] Decision recorded on whether the static waves label stays now that the live Open-Meteo marine forecast exists — evidence: 28957e0 → static label stays as Oleaje habitual, apart from live waves (2026-11-07)
- [x] docs/data-schema.md shows the correct beach count (193)
- [x] node scripts/validate-beaches.js passes

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created
- [2026-11-07] Refreshed in 2026-11-07 grooming: double-space claim was stale.
- [2026-11-07] Started
- [2026-11-07] soilType: 25 values reviewed; the only reordered duplicate (Arena blanca y fina, Playa de Gollerón) merged into Arena fina y blanca; partial forms Arena fina / Arena media kept because the colour is unknown. Canonical pattern documented in docs/data-schema.md; beach count fixed to 193. validate-beaches passes. Commit f862ea1; migrated to production Turso and local.db on 2026-11-07.
- [2026-11-07] Completed