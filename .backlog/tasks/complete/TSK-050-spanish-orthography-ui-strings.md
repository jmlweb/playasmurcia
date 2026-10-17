---
id: TSK-050
title: Spanish Orthography and Pagination Copy (UI Review 2026-03-29)
status: complete
priority: P2
tags: [styling]
created: 2026-03-29
source: manual
depends-on: []
started: 2026-03-29
completed: 2026-03-29
---

# Spanish Orthography and Pagination Copy (UI Review 2026-03-29)

## Description

As a Spanish-speaking visitor, I want all visible copy, meta descriptions, and accessibility labels to use correct accents and spelling so the site feels professional and trustworthy.

## Acceptance Criteria

- [x] Apply all string fixes listed under **Critical** in `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` for: `src/routes/index.tsx`, `src/routes/municipios/index.tsx`, `src/routes/colecciones/index.tsx`, `src/routes/explorar/index.tsx`, `src/components/site-footer.tsx`, `src/routes/__root.tsx` (404 copy), `src/components/page-info.tsx`, `src/components/pagination.tsx`, `src/components/practical-info-card.tsx`, `src/components/breadcrumb.tsx`, `src/lib/collections.ts`
- [x] Apply beach-detail strings in `.backlog/reports/complete/RPT-004-beach-detail-playasslug-ui-review.md` (Critical): `Como llegar` → `Cómo llegar`, gallery CTA accents, plus any practical-info/breadcrumb items not already covered
- [x] Update `src/components/practical-info-card.test.tsx` (and any other tests) so asserted accessible names match the corrected Spanish

## Context

Full-site UI review (`/ui-review`, 2026-03-29). See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` for the file-by-file table and rationale (aligns with `AGENTS.md` spelling rules).

## Notes

- After edits, run `pnpm test` and `pnpm check`; no separate visual test required beyond string changes.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #050)
