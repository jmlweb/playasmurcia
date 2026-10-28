---
id: TSK-134
title: Blue Flag and Q certifications with season year
status: pending
priority: P2
tags: [data, external-source]
created: 2026-10-28
source: manual
depends-on: []
---

# Blue Flag and Q certifications with season year

## Description

`certifications` is set for 58 beaches but carries no year, so it cannot be verified or refreshed. Refresh it from the current ADEAC Blue Flag list (and the Q de Calidad list) with `scripts/add-certifications.js`, and store the award year.

## Acceptance Criteria

- [ ] certifications match the 2026 ADEAC Blue Flag list
- [ ] Award year is stored and shown on the site
- [ ] scripts/add-certifications.js documented for the yearly refresh in docs/development.md

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created