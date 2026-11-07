---
id: TSK-179
title: Fix: Horizontal scroll from the footer at 200% text size
status: complete
priority: P3
tags: [bug, accessibility, footer]
created: 2026-11-07
source: report/RPT-078
depends-on: []
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Horizontal scroll from the footer at 200% text size

## Description

With text at 200%, `/explorar` still scrolls horizontally, and the audit traced it to the site footer. Not re-measured since the audit. See `.backlog/reports/complete/RPT-078-impeccable-audit-of-the-explorer.md`.

## Acceptance Criteria

- [x] Overflow reproduced at 200% text and the overflowing element identified
- [x] No horizontal page scroll at 200% text on /explorar and one other route
- [x] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created
- [2026-11-07] Started
- [2026-11-07] Overflow reproduced at 375px/200%: footer Fuentes rows (fixed 7.5rem label), home sea row, Fotos header button, municipality card sr-only span. scrollWidth 567 → 375. Commit ffb338e.
- [2026-11-07] Completed