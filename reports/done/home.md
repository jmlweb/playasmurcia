# Homepage design directive (UI review 2026-03-29)

**URL**: `/` — `src/routes/index.tsx`

## Design Directive: Homepage

### Critical (must fix)

- None observed beyond cross-cutting items (see `reports/done/cross-cutting.md`).

### Important (should fix)

- **Featured grid placeholders**: Several beach cards still show grey placeholders while others load photos (mobile full-page capture). Ensure reserved aspect ratio and low-contrast skeleton match `docs/ui-guidelines.md` imagery section so the grid does not “jump” when images resolve.
  **Fix**: Confirm `BeachCard` / image wrapper uses explicit `aspect-*` or min-height; verify LCP target uses `fetchPriority` only where appropriate.

### Refinement (nice to have)

- **Hero CTA hierarchy**: Primary vs secondary pills are clear; optional 1px hairline on secondary border (`border-white/25`) for slightly stronger affordance on bright hero photos.

### What works well

- Hero typography scale, gradient overlay, and dual CTAs read as a credible regional tourism entry.
- “Playas que no te puedes perder” grid density and tag pills match the design system.

**Severity summary**: Critical: 0, Important: 1, Refinement: 1
