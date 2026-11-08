---
id: TSK-182
title: Fix: Align hero and gallery alt text formats
status: complete
priority: P4
tags: [ui, accessibility]
created: 2026-11-07
source: review/2026-11-07
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Fix: Align hero and gallery alt text formats

## Description

TSK-166 changed the beach detail gallery alt to '<beach>, <municipality>: fotografía N de M' (src/routes/playas/$slug.tsx), but src/features/beaches/beach-hero.tsx and src/features/beaches/photo-gallery.tsx still emit '<name> - foto N'. Same beach, two formats. Align both on the gallery format (or delete photo-gallery.tsx if it is dead code: only its test imports it).

## Acceptance Criteria

- [x] Hero alt uses the gallery format with municipality — evidence: BeachHero alt = name, municipality: fotografía 1 de N (pictureCount prop); beach-hero.test.tsx (2026-11-08)
- [x] photo-gallery.tsx aligned or removed with its test — evidence: photo-gallery.tsx and its test removed (only the test imported it) (2026-11-08)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test, pnpm check exit 0 (2026-11-08) (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created
- [2026-11-08] Started
- [2026-11-08] Commit cbd73fb.
- [2026-11-08] Completed