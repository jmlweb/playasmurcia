---
id: TSK-078
title: BeachCard Visual Enhancements
status: complete
priority: P3
tags: [styling]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# BeachCard Visual Enhancements

## Description

As a visitor browsing beach listings, I want more cinematic cards with useful at-a-glance info so that I can evaluate beaches without clicking into each one.

## Acceptance Criteria

- [x] Change aspect ratio from `aspect-[4/3]` to `aspect-[3/2]` for cinematic feel
- [x] Increase internal padding from `p-5` to `p-6`
- [x] Strengthen gradient overlay `from-black/30 to-transparent` for better tag contrast
- [x] Add 1 line of secondary info (length or soil type as `text-xs text-gray-400 truncate`)
- [x] Increase weather badge from `px-2 py-0.5 text-xs` to `px-2.5 py-1 text-sm bg-white/90`
- [x] Ensure explicit `aspect-*` or `min-height` on image wrapper for CLS prevention

## Context

UI audit (2026-03-29) identified BeachCard as slightly cramped with no secondary info beyond the name and location.

## Source Reports

- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — BC1–BC3, I10, I11
- `.backlog/reports/complete/RPT-016-homepage-ui-review-directive.md` — HP5
- `.backlog/reports/complete/RPT-015-homepage-design-directive-ui-review.md` — HM1

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #078)
