---
id: TSK-197
title: Paginate or collapse long municipality pages
status: pending
priority: P4
tags: [ui, listing, performance]
created: 2026-11-09
source: report/RPT-081
depends-on: []
---

# Paginate or collapse long municipality pages

## Description

Municipality pages render every beach grouped by zone on one page: Cartagena is 69 cards and about 31,000 CSS px tall on a 375 px phone. Options: collapse zones after the first few cards with a 'ver las N playas' control, add a zone index with anchor links at the top, or paginate like the explorer. Follow docs/ui-guidelines.md and verify with scripts/screenshot.ts on desktop and mobile. Source: .backlog/reports/complete/RPT-081-full-site-review-2026-11-09-findings.md.

## Acceptance Criteria

- [ ] Cartagena on a phone needs far less scrolling to reach any zone
- [ ] Every beach stays reachable without JavaScript
- [ ] Screenshots desktop and mobile attached to the task

## Notes

## Learnings

## Progress Log

- [2026-11-09] Created