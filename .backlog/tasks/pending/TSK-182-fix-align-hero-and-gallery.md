---
id: TSK-182
title: Fix: Align hero and gallery alt text formats
status: pending
priority: P4
tags: [ui, accessibility]
created: 2026-11-07
source: review/2026-11-07
depends-on: []
---

# Fix: Align hero and gallery alt text formats

## Description

TSK-166 changed the beach detail gallery alt to '<beach>, <municipality>: fotografía N de M' (src/routes/playas/$slug.tsx), but src/features/beaches/beach-hero.tsx and src/features/beaches/photo-gallery.tsx still emit '<name> - foto N'. Same beach, two formats. Align both on the gallery format (or delete photo-gallery.tsx if it is dead code: only its test imports it).

## Acceptance Criteria

- [ ] Hero alt uses the gallery format with municipality
- [ ] photo-gallery.tsx aligned or removed with its test
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created