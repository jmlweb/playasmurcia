---
id: RPT-048
title: UI review (2026-10-19): Homepage
type: finding
severity: medium
status: triaged
created: 2026-10-18
triaged: 2026-10-18
task-id: TSK-120
---

## Summary

Design directive for `/` (production). See RPT-047 for cross-cutting items (hero panel, card contrast, tag pills) that also apply here.

## Where found

`src/routes/index.tsx`, `src/features/home/hero-section.tsx`, `featured-section.tsx`, `municipalities-section.tsx`, `highlights-section.tsx`.

## Evidence

## Design Directive: Homepage

### Critical (must fix)

- **"Selección destacada" shows unflattering photos**: the 12 featured cards include a signpost close-up (Playa La Calera), high-rise blocks (Barco Perdido, the first card), a backlit dark silhouette (Playa de La Concha) and grey overcast shots. A tourism homepage's first grid is its shop window. Users currently judge the coast by its worst photos.
  **Fix**: Curate the featured set by photo quality, not by data. `data/beaches.json` already has `pictureQualityScore`; rank by it (or keep a manual list of 6–9 slugs) whose first photo shows water and sand in daylight. Prefer 6 strong cards over 12 mixed ones.

### Important (should fix)

- **Flat grid with no hierarchy**: 12 identical 3-column cards, then a CTA. Nothing leads the eye.
  **Fix**: Make the first item a 2×2 feature card (large photo, name at 28px over a scrim). Follow with 4–6 standard cards. Alternatively, split the section into "Calas salvajes" / "Mar Menor en familia" rows with horizontal scroll on mobile.
- **Municipality cards are text-only and misaligned**: in `municipalities-section.tsx` the cards without blue flags (Los Alcázares, La Unión) skip the flag row, so "Ver playas" sits 40px higher than on sibling cards. The "34"-style count badge has no label, so it is unclear what it counts.
  **Fix**: Add a 16:9 representative photo to each municipality card. Show "34 playas · 7 banderas azules" as one meta line; when there are no flags, show "34 playas" alone. Pin the CTA to the card bottom (flex-col + mt-auto). Remove the unlabeled badge.
- **Hero copy is too long for the space**: the subtitle runs to 3 lines on desktop and 6 on mobile. "tenemos la playa que necesitas" is generic.
  **Fix**: Keep a single line: "252 km de litoral y 194 playas entre el Mediterráneo y el Mar Menor." Move the second sentence out of the hero.
- **Highlights section is a stock "3 features" block**: generic icon tiles ("Dos mares / 300 días de sol / Aguas cristalinas") on a dark band. It adds no navigation and no proof.
  **Fix**: Turn each tile into a link with a real photo: "Dos mares" → split image linking to Mar Menor / Mediterráneo collections; "Aguas cristalinas" → Snorkel collection. Otherwise remove the section.

### Refinement (nice to have)

- The first fold has no search box. `/explorar` has one, so add the same search input to the home hero (users arrive with a beach name in mind).
- The "Ver todas las playas →" link (top-right of the section) and the "Ver las 194 playas" button duplicate each other. Keep the bottom button only.

### What Works Well

- The serif H1 "Encuentra tu playa ideal" has good scale and tracking.
- The section eyebrow (coral rule + tracked caps) is a tasteful, consistent device.

Critical: 1, Important: 4, Refinement: 2

## Impact

The homepage is the main entry point. Weak featured photography and a flat layout lower perceived quality and click-through to beach pages.
