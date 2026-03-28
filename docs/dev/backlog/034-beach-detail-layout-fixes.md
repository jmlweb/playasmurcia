# Task #034: Beach Detail Layout and Hierarchy Fixes

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor viewing a beach detail page, I want consistent visual structure so I can scan and find information easily.

## Context

UI review (2026-03-28) found heading inconsistencies, missing card containers, and invisible UI elements. See `docs/dev/ui-review/beach-detail.md` for full directive.

## Acceptance Criteria

- [ ] Standardize all main-content `<h2>` headings to `text-xl font-semibold` (reduce "Sobre esta playa" from `text-2xl` to `text-xl`)
- [ ] Wrap Services and Activities grid sections in the same card container (`rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm`) used by other sections
- [ ] Fix gallery thumbnail fade edges: either change gradient from `from-white` to a visible color, or remove entirely
- [ ] Move certifications section below the photo gallery (out of the header area)
- [ ] Add municipality to breadcrumb: "Inicio / {municipality} / {beach name}"
- [ ] Add explicit width/height to map static image to prevent CLS

## Notes

- Sidebar sticky `top-20` offset should also be verified against actual navbar height
- See `docs/dev/ui-review/beach-detail.md` for detailed fix instructions per item
