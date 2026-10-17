---
id: RPT-036
title: UI Review — Cross-cutting findings
type: finding
severity: low
status: triaged
created: 2026-10-17
triaged: 2026-10-17
---

**Audit date:** 2026-04-04  
**Evidence:** Playwright full-page screenshots (`pnpm tsx scripts/screenshot.ts`), desktop 1280×800 and mobile 375×812, against `http://localhost:3000`.

## Design Directive: Beach cards (all listing surfaces)

### Critical (must fix)

- None identified in this pass.

### Important (should fix)

- **Tag pills on card imagery**: On `BeachCard`, feature tags use `text-xs` on `bg-white/80` over photographic backgrounds (`src/features/beaches/beach-card.tsx` approx. 110–118). On busy sand/sky/water, small type and semi-transparent white fail WCAG AA for normal text and are hard to scan on mobile in full-page captures of `/`, `/municipios/cartagena`, `/colecciones/bandera-azul`, and `/explorar`.  
  **Fix:** Increase minimum type size to match caption tier (`text-sm` or equivalent), raise pill opacity (e.g. `bg-white/95` or solid `bg-white` with `text-gray-900`), and/or add a stronger bottom scrim (`from-black/60` or a dedicated tag bar) so label contrast is ≥4.5:1. Verify occupancy badge + weather chip hierarchy still reads clearly.

- **Empty image blocks at scale**: Many cards show the gradient + wave + “Sin foto” placeholder on homepage, municipality, collection, and explorer grids. Visually the grids read as unfinished despite functional layout.  
  **Fix:** Editorial/pipeline work remains primary (`docs/photo-sourcing-guide.md`). For UI: consider a subtler placeholder (no heavy icon stack), consistent aspect ratio (already `aspect-3/2`), and optional single-line editorial hint only in dev or for admins — avoid cluttering production. Align with existing backlog on image fallbacks where applicable.

### Refinement (nice to have)

- **Card metadata rhythm**: Title (serif) + municipality + length/sand line is consistent; ensure line length on narrow mobile does not orphan single words in beach names where trivial via `text-balance` or shorter labels.

### What works well

- **System cohesion**: Nav, hero tiers, ocean/sand palette, and card shell (radius, ring, hover lift) read as one product across audited routes.
- **Footer structure**: Three-column layout and pill counts match the premium-directory pattern; copyright uses runtime year (`site-footer.tsx`).

**Severity summary:** Critical: 0, Important: 2, Refinement: 1