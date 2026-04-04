# UI Review — Homepage (`/`)

**Evidence:** `/tmp/ui-review-home.png`, `/tmp/ui-review-home-mobile.png` (Playwright, 2026-04-04).

## Design Directive: Homepage

### Critical (must fix)

- None.

### Important (should fix)

- **Featured grid and missing photography**: Several featured cards use the empty-state image block while neighbors show full photography, which breaks the “editorial pick” story.  
  **Fix:** Prefer curating featured rows from beaches with `pictures[0]` populated, or backfill images before featuring; if unavoidable, limit how many empty cards appear in the same row (e.g. fill from next eligible beach).

### Refinement (nice to have)

- **Hero CTA balance**: Primary “Explorar todas las playas” vs secondary “Ver colecciones” is clear on desktop; ensure focus order and touch spacing stay ≥44px on small phones (already stacked in flex column on narrow viewports).

### What works well

- **Hero**: Overline, serif headline, scrim, and dual CTAs match `docs/ui-guidelines.md` homepage tier; motion-safe hero treatment feels appropriate for a tourism brand.
- **Section rhythm**: “Selección destacada” overline + heading + “Ver todas las playas” link follows the documented section pattern.

**Severity summary:** Critical: 0, Important: 1, Refinement: 1
