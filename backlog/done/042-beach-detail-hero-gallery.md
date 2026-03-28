# Task #042: Beach Detail Page Hero and Gallery Redesign

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor viewing a beach page, I want an immersive visual introduction that shows me what the beach looks like and makes me want to visit.

## Context

UI review (2026-03-28) found the beach detail page is the only page without a hero section, creating a jarring navigation experience. The gallery also appears to show a single image. See `reports/done/beach-detail.md` for full directive.

## Acceptance Criteria

- [ ] Add a hero section using the first beach photo as a full-width background with gradient overlay and beach name/municipality on top (compact tier height)
- [ ] If beach has multiple pictures, display a gallery grid below the hero: 1 large image (2/3 width) + 2 smaller stacked (1/3 width) on desktop, horizontal scroll on mobile
- [ ] If only 1 image, show it full-width with `aspect-[16/9]`
- [ ] Move breadcrumb below the hero into the `sand-50` content area (consistent with all other pages)
- [ ] Move tags below the municipality subtitle as a row (`mt-3 flex flex-wrap gap-2`)
- [ ] Ensure all section h2 inside content cards use `text-xl font-semibold text-gray-900` consistently

## Notes

- This is the most important page on the site for user engagement
- See `reports/done/beach-detail.md` for full design directive with specific fixes
