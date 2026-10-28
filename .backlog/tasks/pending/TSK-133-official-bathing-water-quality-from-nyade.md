---
id: TSK-133
title: Official bathing-water quality from NÁYADE / EEA
status: pending
priority: P2
tags: [data, external-source]
created: 2026-10-28
source: manual
depends-on: []
---

# Official bathing-water quality from NÁYADE / EEA

## Description

Replace the editorial `waterQuality` field (currently 169 excellent / 23 good / 1 sufficient, not sourced) with the official bathing-water classification from the Ministerio de Sanidad NÁYADE system or the EEA bathing water dataset. Match sampling points to beaches by coordinates and store the classification season year so the value is citable and refreshable.

## Acceptance Criteria

- [ ] Every beach with a sampling point within a defined distance gets the official EU class (Directive 2006/7/CE) and season year
- [ ] Beaches without a sampling point get no class instead of a guess
- [ ] Source is cited on the beach page
- [ ] Retained script added and documented in docs/development.md; docs/data-schema.md updated

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created