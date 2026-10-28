---
id: TSK-138
title: Expand aemetId coverage
status: pending
priority: P3
tags: [data, weather]
created: 2026-10-28
source: manual
depends-on: []
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