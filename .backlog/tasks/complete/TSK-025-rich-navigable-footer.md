---
id: TSK-025
title: Rich Navigable Footer
status: complete
priority: P3
tags: [frontend]
created: 2026-03-27
source: manual
depends-on: []
started: 2026-03-27
completed: 2026-03-27
---

# Rich Navigable Footer

## Description

As a visitor, I want a footer with organized links to municipalities and beach characteristics so that I have an alternative way to discover content and navigate the site.

## Acceptance Criteria

- [x] Branding section with logo
- [x] Municipalities column: 9 municipality links organized in a multi-column grid
- [x] Characteristics column: key characteristic/filter links
- [x] Each link shows beach count in a styled badge
- [x] Dark background consistent with site design system
- [x] Responsive: stacks on mobile, multi-column on desktop
- [x] Data attribution line preserved
- [x] Build passes, no visual regressions

## Context

Product parity doc ([`.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md`](../../.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md#footer)) described the gap: production footer acts as a small sitemap with municipalities and characteristics (with counts).

## Notes

- Footer links double as an internal link structure, improving SEO crawlability
- Counts should stay in sync with database (query or precomputed)
- Keep the footer concise; it complements the dropdown nav, not duplicates it

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #025)
