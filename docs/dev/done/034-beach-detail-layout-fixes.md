# Task #034: Beach Detail Layout and Hierarchy Fixes

## Metadata
- **Status**: completed
- **Priority**: P1 - Active
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: 2026-03-28
- **Completed**: 2026-03-28
- **Blocked by**: -

## User Story

As a visitor viewing a beach detail page, I want consistent visual structure so I can scan and find information easily.

## Context

UI review (2026-03-28) found heading inconsistencies, missing card containers, and invisible UI elements. See `docs/dev/ui-review/beach-detail.md` for full directive.

## Acceptance Criteria

- [x] Standardize all main-content `<h2>` headings to `text-xl font-semibold` (reduce "Sobre esta playa" from `text-2xl` to `text-xl`)
- [x] Wrap Services and Activities grid sections in the same card container (`rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm`) used by other sections
- [x] Fix gallery thumbnail fade edges: either change gradient from `from-white` to a visible color, or remove entirely
- [x] Move certifications section below the photo gallery (out of the header area)
- [x] Add municipality to breadcrumb: "Inicio / {municipality} / {beach name}"
- [x] Add explicit width/height to map static image to prevent CLS

## Notes

- Sidebar sticky `top-20` offset should also be verified against actual navbar height
- See `docs/dev/ui-review/beach-detail.md` for detailed fix instructions per item

## Progress Log

- [2026-03-28] Started task
- [2026-03-28] Task completed
