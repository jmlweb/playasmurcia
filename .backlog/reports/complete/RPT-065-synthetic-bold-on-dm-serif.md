---
id: RPT-065
title: Synthetic bold on DM Serif section headings
type: bug
severity: low
status: triaged
created: 2026-11-04
triaged: 2026-11-04
task-id: TSK-164
---

## Summary

Beach detail H2s use `font-semibold` on a font that ships only weight 400, so the browser fakes the bold.

## Details

`docs/ui-guidelines.md` requires `font-normal` for DM Serif Display. H2s render at 20px, weight 600, with `font-synthesis` allowing weight, and they look smeared. Sources include `location-map.tsx`, `weather-widget.tsx:589` and `src/routes/playas/$slug.tsx:289`. The H1 is correct at weight 400.

## Steps to Reproduce

1. Open `/playas/playa-de-el-rincon`.
2. Inspect any H2.
3. Compare computed `font-weight` with the loaded `DM Serif Display` faces.

## Expected vs Actual

- Expected: weight 400, with no synthesized bold.
- Actual: weight 600, synthesized by the browser.

## Error messages/logs

None.
