---
id: RPT-047
title: UI review (2026-10-19): Cross-cutting findings
type: finding
severity: high
status: triaged
created: 2026-10-18
triaged: 2026-10-18
task-id: TSK-117
---

## Summary

Production UI review of https://www.playasmurcia.com on 2026-10-19 (Playwright, desktop 1280×800 and mobile 375×812, full page). Pages audited: `/`, `/playas/playa-de-la-concha`, `/municipios`, `/municipios/cartagena`, `/colecciones`, `/colecciones/bandera-azul`, `/explorar`, 404. This report holds issues that repeat on 2+ pages. The site is clean and coherent, but it reads as a well-made template rather than a premium tourism product: the same frosted panel, card and pill patterns repeat everywhere, and the photography (the main asset) is often hidden or poorly chosen.

## Where found

All routes; shared components `src/components/layout/page-hero.tsx`, `src/features/beaches/beach-card.tsx`, `src/components/layout/site-footer.tsx`.

## Evidence

## Design Directive: Cross-cutting

### Critical (must fix)

- **Card metadata fails contrast**: `beach-card.tsx:164` renders length · sand type (e.g. "2219 m · Arena fina y dorada") at 12px gray-400 (#99a1af) on white = **2.6:1**. AA needs 4.5:1. This line appears on every listing card site-wide.
  **Fix**: gray-600 (#4b5563, ~7.5:1) at 13px. If it must stay secondary, gray-500 at 14px minimum.
- **Hero photo buried under a frosted panel**: `page-hero.tsx` places a ~900×220px dark glass box (rounded, backdrop blur) over the hero photo on `/`, `/municipios`, `/municipios/$slug`, `/colecciones`, `/colecciones/$slug`, `/explorar`. On mobile the panel covers ~90% of the photo, so the image adds almost nothing. A glass card centered on a hero is a 2021 pattern and the main source of the "template" feel.
  **Fix**: Remove the panel. Use a full-bleed photo with a bottom-weighted gradient scrim (transparent → ocean-950 at 75% over the bottom 60%), and left-align the title block to the 7xl container at bottom-left (padding 48px desktop / 24px mobile). Raise hero height to min(72vh, 640px) on home and 420px on listing pages. Title stays white, so text contrast is guaranteed by the scrim and not by the box.

### Important (should fix)

- **Breadcrumb sits below the hero, after a large gap**: about 90px of empty space between the hero bottom and the breadcrumb on every listing page (`/municipios`, `/colecciones`, `/explorar`, collection/municipality detail). On beach detail the breadcrumb sits between the teal header and the gallery. Placement is inconsistent and the gap reads as a layout bug.
  **Fix**: Put the breadcrumb inside the hero, above the eyebrow, at 14px white/80. Otherwise put it directly under the hero with 24px top padding. Pick one and apply it on all routes.
- **Card tag pills crowd the photo**: three white pills sit bottom-right on every card image (`beach-card.tsx:143-147`). They wrap to two rows on narrower columns (`/explorar`, "Playa Las Delicias"). Together with the weather chip at top-left, two overlays compete on every photo.
  **Fix**: Max 2 tags on the image, or move tags into the card body as quiet 12px outline chips (gray-200 border, gray-700 text). Keep only the weather chip on the photo.
- **Over-carding**: every content block is a white rounded-2xl card with shadow and ring (beach detail has 7 of them stacked; home has 3 card styles). Without hierarchy between surfaces, nothing stands out.
  **Fix**: Keep the card surface for clickable items (beach, municipality, collection). Render static sections (description, services, activities, how to get there, contact) as unboxed sections divided by 1px gray-200 hairlines with 48px vertical rhythm.
- **Hero eyebrow contrast is unreliable**: the coral-400 (#f0806e) 13px tracked caps eyebrow ("COSTA CÁLIDA · REGIÓN DE MURCIA", "COSTA DE MURCIA") sits on translucent glass over a photo. On `/colecciones` it lands on a light hillside and is hard to read.
  **Fix**: With the scrim fix above, use coral-300 or white/80. Never put small caps text on photo areas without a guaranteed ≥4.5:1 backdrop.
- **Footer brand description styled as a link**: the "Guía completa de las playas…" paragraph uses ocean-400 (#2e9aba). That is the link color, but the paragraph is not clickable. Footer count pills use ocean-400 on ocean-800 (#0c3c4d) at 12px, around 3.4:1.
  **Fix**: Paragraph in ocean-200 (same as the footer body). Pills in ocean-200 on ocean-800, or drop the pills and show "Cartagena · 70" inline in ocean-300.

### Refinement (nice to have)

- **Heading font switches between sans and serif for the same object**: municipality card titles are serif on `/municipios` and sans on the home "Municipios costeros" section. Beach card titles are sans everywhere.
  **Fix**: Use serif (display) for page and section headings only. Use sans 600 for all card titles.
- **Repeated hero image**: `/colecciones` and `/colecciones/bandera-azul` use the same photo. Give each collection its own hero, taken from its highest-rated member beach.
- **Footer collections list (5) does not match the collections index (14)**. Either list all collections or label the list "Colecciones destacadas".

### What Works Well

- The palette (deep ocean navy, sand-50 background, coral accent) is restrained and on-brand.
- The serif display face for headings gives editorial character.
- Live weather chips on cards are a real differentiator and are well executed.
- Hover lift respects `motion-safe`, and scroll reveal is progressive (content is visible without JS).

Critical: 2, Important: 5, Refinement: 3

## Impact

Contrast failures affect every listing card (AA compliance). Hero and surface choices define the site's perceived quality across all routes. These are the highest-leverage fixes in this review.

## Related tasks

TSK-117 (heroes, breadcrumb, eyebrow), TSK-118 (card contrast, tag pills), TSK-119 (surfaces, typography, footer).
