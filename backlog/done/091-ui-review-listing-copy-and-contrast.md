# Task #091: Explorer Results Copy and Colecciones Thematic Contrast

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: UI
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a user browsing listings and collections, I want concise headers and readable thematic cards so that scanning is fast and text meets accessibility contrast expectations.

## Context

UI review (2026-03-30): Explorer repeats total beach count in adjacent lines; collections index thematic cards use many accent colors—body text on white must stay WCAG AA.

## Acceptance Criteria

- [x] **Explorer** (`/explorar`): Remove or merge redundant total count (“playas encontradas” vs pagination line) per `reports/done/ui-review-2026-03-30-explorar.md`.
- [x] **Colecciones index** (`/colecciones`): Audit `text-sm` body copy on white for each thematic card variant; adjust to ≥4.5:1 contrast (e.g. darker gray body or softer borders only) per directive in `reports/done/ui-review-2026-03-30-colecciones-index.md`.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Source Reports

- `reports/done/ui-review-2026-03-30-explorar.md`
- `reports/done/ui-review-2026-03-30-colecciones-index.md`
