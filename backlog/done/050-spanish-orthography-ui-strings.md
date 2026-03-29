# Task #050: Spanish Orthography and Pagination Copy (UI Review 2026-03-29)

## Metadata

- **Status**: completed
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-03-29
- **Started**: 2026-03-29
- **Completed**: 2026-03-29
- **Blocked by**: -

## User Story

As a Spanish-speaking visitor, I want all visible copy, meta descriptions, and accessibility labels to use correct accents and spelling so the site feels professional and trustworthy.

## Context

Full-site UI review (`/ui-review`, 2026-03-29). See `reports/done/cross-cutting.md` for the file-by-file table and rationale (aligns with `AGENTS.md` spelling rules).

## Acceptance Criteria

- [x] Apply all string fixes listed under **Critical** in `reports/done/cross-cutting.md` for: `src/routes/index.tsx`, `src/routes/municipios/index.tsx`, `src/routes/colecciones/index.tsx`, `src/routes/explorar/index.tsx`, `src/components/site-footer.tsx`, `src/routes/__root.tsx` (404 copy), `src/components/page-info.tsx`, `src/components/pagination.tsx`, `src/components/practical-info-card.tsx`, `src/components/breadcrumb.tsx`, `src/lib/collections.ts`
- [x] Apply beach-detail strings in `reports/done/beach-detail.md` (Critical): `Como llegar` → `Cómo llegar`, gallery CTA accents, plus any practical-info/breadcrumb items not already covered
- [x] Update `src/components/practical-info-card.test.tsx` (and any other tests) so asserted accessible names match the corrected Spanish

## Notes

- After edits, run `pnpm test` and `pnpm check`; no separate visual test required beyond string changes.
