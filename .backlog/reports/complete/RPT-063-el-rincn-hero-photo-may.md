---
id: RPT-063
title: El Rincón hero photo may be AI-edited and misrepresent the beach
type: finding
severity: high
status: triaged
created: 2026-11-04
triaged: 2026-11-04
task-id: TSK-162
---

## Summary

The El Rincón lead photo shows a sparkle mark and a look that may not match the beach described in the copy.

## Details

The bottom-right corner of `PLAYAS_1_645_3_g.avif` has a four-point sparkle that resembles the Gemini watermark. The hero crop hides it, but the lightbox shows it. Copy and data say "Arena fina y gris", while the photo shows pale sand and saturated turquoise water.

AI editing is not confirmed. The filename dates from the initial data commit, but the hosted file may have been replaced later.

## Where found

- `https://img.playasmurcia.com/optimized/PLAYAS_1_645_3_g.avif` (2064×1152)
- Photo 1 of 5 in the lightbox on `/playas/playa-de-el-rincon`
- `data/beaches.json`: first entry in `pictures` for code 645

## Evidence

- Lightbox screenshot at 375px, and the full image rendered at 1032px wide, both show the mark.
- `git log -S PLAYAS_1_645_3_g -- data/beaches.json` points to `1c65381` (data initialization).
- No script or doc in the repo records AI image processing.

## Impact

An edited photo would mislead visitors about the sand and water. Compare it with the original source file, and check other photos if it was edited.
