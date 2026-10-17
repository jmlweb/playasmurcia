---
id: TSK-071
title: PracticalInfoCard Redesign
status: complete
priority: P3
tags: [ui]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# PracticalInfoCard Redesign

## Description

As a visitor, I want practical beach information presented clearly so that I can quickly find key details like access, facilities, and conditions.

## Acceptance Criteria

- [x] Redesign as 2-column grid for grouped info items
- [x] Extract top 3–4 most useful facts into a visible summary grid
- [x] Collapse remaining details into an expandable accordion section
- [x] Use card-based groupings replacing `border-b` separator lines
- [x] More prominent badge-styled values for key metrics
- [x] Map `beach.orientation` through a Spanish label map (e.g., "east" → "Este")
- [x] Move ContactInfo closer to the map

## Context

UI audit (2026-03-29) flagged the current PracticalInfoCard as a dense wall of `border-b` separated rows. Information hierarchy is flat, making it hard to scan.

## Source Reports

- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — C4, C5, PIC1
- `.backlog/reports/complete/RPT-004-beach-detail-playasslug-ui-review.md` — BD1

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #071)
