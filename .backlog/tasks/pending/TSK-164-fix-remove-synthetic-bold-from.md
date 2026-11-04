---
id: TSK-164
title: Fix: Remove synthetic bold from DM Serif headings
status: pending
priority: P4
tags: [ui, bug, typography]
created: 2026-11-04
source: report/RPT-065
depends-on: [TSK-153]
---

# Fix: Remove synthetic bold from DM Serif headings

## Description

Beach detail H2s use `font-semibold` on DM Serif Display, which ships only weight 400, so the browser fakes the bold. They also render at 20px, while guidelines ask for larger section headings.

See `.backlog/reports/complete/RPT-065-synthetic-bold-on-dm-serif.md`.

## Acceptance Criteria

- [ ] Beach detail H2s render at weight 400
- [ ] Other DM Serif headings are checked for font-semibold or font-bold
- [ ] Section heading size is reviewed against docs/ui-guidelines.md
- [ ] Change is verified with scripts/screenshot.ts
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-153: both edit src/routes/playas/$slug.tsx.