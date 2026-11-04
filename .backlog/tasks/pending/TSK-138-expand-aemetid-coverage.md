---
id: TSK-138
title: Expand aemetId coverage
status: pending
priority: P4
tags: [data, weather]
created: 2026-10-28
source: manual
depends-on: [TSK-144]
---

# Expand aemetId coverage

## Description

Only 64 of 193 beaches have an `aemetId`. Match more beaches against the AEMET beach catalogue so more beaches get the official forecast.

## Acceptance Criteria

- [ ] New aemetId values are matched by name and coordinates, never by name alone
- [ ] Each new ID returns a valid AEMET forecast
- [ ] Coverage before and after reported in the task log

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created
- [2026-11-04] Lowered to P4 and made dependent on TSK-144: new IDs show nothing until the parser works, and Open-Meteo already covers every beach.