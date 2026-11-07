---
id: TSK-164
title: Fix: Remove synthetic bold from DM Serif headings site-wide
status: complete
priority: P4
tags: [ui, bug, typography]
created: 2026-11-04
source: report/RPT-065
depends-on: [TSK-153]
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Remove synthetic bold from DM Serif headings

## Description

DM Serif Display ships only weight 400, so `font-semibold` makes the browser fake the bold. `src/styles.css` applies it to every `h1` and `h2`.

Beach detail section H2s were fixed in 28957e0 (`text-3xl font-normal`). These headings still use `font-semibold`:

- `src/features/home/featured-section.tsx:47`
- `src/features/home/municipalities-section.tsx:27`
- `src/routes/colecciones/index.tsx:80` and `:93`
- `src/components/ui/empty-state.tsx:19`
- `src/components/layout/root-error.tsx:7`
- `src/components/layout/not-found.tsx:11`
- `src/routes/playas/$slug.tsx:98`

`src/features/listing/filter-panel.tsx` H2s set the default font, so they are not affected.

See `.backlog/reports/complete/RPT-065-synthetic-bold-on-dm-serif.md`.

## Acceptance Criteria

- [x] Beach detail H2s render at weight 400 — evidence: src/features/beaches → section H2s use font-normal (2026-11-07)
- [x] The headings listed above no longer use font-semibold or font-bold
- [x] Section heading size is reviewed against docs/ui-guidelines.md — evidence: src/features/beaches → section H2s use text-3xl (2026-11-07)
- [x] Change is verified with scripts/screenshot.ts
- [x] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-153: both edit src/routes/playas/$slug.tsx.
- [2026-11-07] Beach detail fixed by 28957e0. Rescoped in 2026-11-07 grooming to the remaining site-wide headings.
- [2026-11-07] Started
- [2026-11-07] Base h1/h2 rule now sets font-weight 400 and font-synthesis-weight none; every listed heading plus zone-sections.tsx switched to font-normal, sizes unchanged. Playwright computed weight 400 on /, /colecciones, /playas/playa-de-el-rincon and /404. Screenshots in scratchpad shots/164-*. docs/ui-guidelines.md weight rule and empty-state title updated. Commit 5426293, merged 5c183c0.
- [2026-11-07] Completed