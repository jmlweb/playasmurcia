---
id: TSK-179
title: Fix: Horizontal scroll from the footer at 200% text size
status: pending
priority: P3
tags: [bug, accessibility, footer]
created: 2026-11-07
source: report/RPT-078
depends-on: []
---

# Fix: Horizontal scroll from the footer at 200% text size

## Description

With text at 200%, `/explorar` still scrolls horizontally, and the audit traced it to the site footer. Not re-measured since the audit. See `.backlog/reports/complete/RPT-078-impeccable-audit-of-the-explorer.md`.

## Acceptance Criteria

- [ ] Overflow reproduced at 200% text and the overflowing element identified
- [ ] No horizontal page scroll at 200% text on /explorar and one other route
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created