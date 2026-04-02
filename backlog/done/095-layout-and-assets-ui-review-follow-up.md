# Task #095: Layout and Assets UI Review Follow-up

## Metadata

- **Status**: completed
- **Priority**: P1 - Active
- **Started**: 2026-04-02
- **Completed**: 2026-04-02
- **Slice**: Styling
- **Created**: 2026-04-02
- **Blocked by**: -

## User Story

As a user scanning index pages, I want even card rhythm, trustworthy imagery, and unambiguous non-interactive badges so the guide feels editorial and professional.

## Context

UI review (2026-04-02): homepage wide grid density, municipios card footer alignment, duplicate count on municipality detail, collection hero count pill affordance, potential third-party watermarks on collection imagery, footer legal line contrast, minor refinements.

## Acceptance Criteria

- [x] **Homepage** (`/`): Resolve featured grid at `2xl` (cap columns or adjust card padding) per `reports/done/homepage.md`.
- [x] **Municipios index** (`/municipios`): Align municipality card CTAs / reduce uneven whitespace (e.g. `mt-auto` on footer row) per `reports/done/municipios-index.md`.
- [x] **Municipio detail** (`/municipios/$slug`): Remove or typographically differentiate duplicate “N playas” lines if redundant per `reports/done/municipio-detail.md`.
- [x] **Collection detail** (`/colecciones/$slug`): Clarify hero beach-count pill — non-interactive styling vs real control; correct semantics/focus per `reports/done/collection-detail.md`.
- [x] **Colecciones index** (`/colecciones`): Replace any hero/card imagery showing third-party watermarks; follow `docs/photo-sourcing-guide.md` per `reports/done/colecciones-index.md`.
- [x] **Footer** (`site-footer.tsx`): Verify legal attribution line contrast on `bg-ocean-900`; bump to `text-ocean-200` (or equivalent) if below AA per `reports/done/cross-cutting.md`.
- [x] Optional refinements: homepage hero line breaks / overline token consistency; explorer toolbar vertical alignment; thematic token documentation note in guidelines if patterns are finalized.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Source Reports

- `reports/done/homepage.md`
- `reports/done/municipios-index.md`
- `reports/done/municipio-detail.md`
- `reports/done/collection-detail.md`
- `reports/done/colecciones-index.md`
- `reports/done/explorar.md`
- `reports/done/cross-cutting.md`

## Progress Log

- [2026-04-02 02:15] Homepage featured grid: capped at 3 cols (removed 2xl:grid-cols-4)
- [2026-04-02 02:15] Municipios index: verified footer CTA already aligned with mt-auto
- [2026-04-02 02:15] Municipio detail: removed redundant beach count line from toolbar
- [2026-04-02 02:15] Collection detail: added role="text" to beach count pill (non-interactive)
- [2026-04-02 02:15] Colecciones index: verified no watermarks (gradient backgrounds + internal Wikimedia assets)
- [2026-04-02 02:15] Footer legal attribution: bumped from text-ocean-400/500 to text-ocean-200 (WCAG AA)
- [2026-04-02 02:15] All checks pass: pnpm build ✓, pnpm test (142) ✓, pnpm check ✓
- [2026-04-02 02:15] Task completed
