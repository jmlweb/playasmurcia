---
id: TSK-038
title: Add Pagination for Large Beach Lists
status: complete
priority: P3
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-28
---

# Add Pagination for Large Beach Lists

## Description

As a visitor viewing a municipality with many beaches, I want the page to load fast and be easy to browse without scrolling through 60+ cards.

## Acceptance Criteria

- [ ] Add "Cargar mas" progressive loading to municipality detail pages with >15 beaches: show first 15 cards, then load more on button click
- [ ] Add same progressive loading to collection detail pages with >15 beaches
- [ ] Ensure URL state is preserved when loading more (scroll position, filters)
- [ ] Show total count and loaded count (e.g., "Mostrando 15 de 69 playas")

## Context

UI review (2026-03-28) found that Cartagena renders 69 beach cards simultaneously with no pagination. This is a performance issue on mobile (massive DOM, dozens of image requests). See `.backlog/reports/complete/RPT-017-design-directive-municipality-detail.md` for full directive.

## Notes

- This is a client-side pagination — all data is already loaded, just rendering progressively
- Consider intersection observer for infinite scroll as an alternative to "Cargar mas" button
- Explorer page already handles large lists via its filter system, so it may not need this

## Learnings

- LRN-005: Progressive loading > classic pagination
## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #038)
