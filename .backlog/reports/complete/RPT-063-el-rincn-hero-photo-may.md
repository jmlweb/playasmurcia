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

## Resolution (2026-11-07, TSK-162)

Confirmed AI-generated, not an edit of the source. The CARM Nexo feed lists the source as `http://www.murciaturistica.es/webs/murciaturistica/fotos/1/playas/PLAYAS_1_645_3_g.jpg` (560×420, a cove with red cliffs and grey sand). The hosted file was 2752×1536, a different scene, with the sparkle mark bottom right. The first committed version (`48f09f7`, 1120×840) was a plain upscale of the source; the file was replaced later, outside git (`public/pictures/` is not tracked).

A dimension scan of `public/pictures/` found two more 2752×1536 covers with the same mark and unrelated scenes: `PLAYAS_1_638_3_g.jpg` (Playa Cobaticas, source is a flat shingle beach) and `PLAYAS_1_654_1_g.jpg` (Playa de El Mojón, source is a sandy bay with apartment blocks). The four 2048×1152 covers (`isla-mazarron_g`, `recurso-1-561-13p_g`, `recurso-1-674-12p_g`, `recurso-1-696-9p_g`) are upscaled phone photos, not generated.

Action: removed the three generated files from `pictures` in `data/beaches.json`, trashed the sources and their `optimized/` variants, mirrored the deletion to R2 (27 files) and migrated production. New covers: 645 `PLAYAS_1_645_1_g.jpg`, 638 `PLAYAS_1_638_7_g.jpg`, 654 `PLAYAS_1_654_4_g.jpg`. Scores stay at 2. The original 560×420 and 400×300 sources are below the 600px short-side floor, so they were not re-added.

Side finding: `pnpm run score:picture-quality -- --dry-run` reports 54 beaches whose stored `pictureQualityScore` no longer matches their files (mostly 0 → 3 after pictures were added without rescoring). Left as is; see the follow-up task.
