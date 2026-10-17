---
id: TSK-079
title: Cross-Cutting UI Fixes
status: complete
priority: P2
tags: [accessibility]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Cross-Cutting UI Fixes

## Description

As a visitor, I want consistent UI quality across all pages so that the site feels polished and accessible everywhere.

## Acceptance Criteria

- [x] Fix 404 page contrast: `text-ocean-200` fails WCAG AA on `bg-sand-50` → change to `text-ocean-700`+
- [x] Fix ServiceIcon resolution: resolve by `service.id` first, use `service.icon` as deprecated fallback (raw tokens like "wheelchair" visible in UI)
- [x] Add `focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2` to "Descubrir" Popover.Trigger
- [x] Add visible focus ring to dropdown panel Link items
- [x] Fix footer beach count badges from `text-[10px]` to `text-xs` minimum
- [x] Increase footer padding from `py-12` to `py-16`, add more vertical spacing

## Context

Cross-cutting report and UI audit identified issues affecting multiple pages: 404 page accessibility, ServiceIcon rendering bugs, missing focus rings, and footer sizing.

## Source Reports

- `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` — CC1–CC4
- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — FTR1, XC6

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #079)
