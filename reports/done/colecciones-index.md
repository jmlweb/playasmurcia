# Colecciones index (`/colecciones`) — UI review directive

Screenshot: `/tmp/ui-review-colecciones.png`, `/tmp/ui-review-colecciones-mobile.png`. Route: `src/routes/colecciones/index.tsx`.

## Design Directive: Colecciones index

### Critical (must fix)

_None._

### Important (should fix)

- **Third-party watermark on imagery**: If any collection card background shows a **Tripadvisor** (or similar) watermark, replace the asset — it reads as unlicensed stock and undermines institutional trust.
  **Fix**: Curate replacement photos from approved sources per `docs/photo-sourcing-guide.md`.

### Refinement (nice to have)

- **Thematic pastel headers**: The per-slug theme map (`ThematicThemes` ~57+) produces many neighboring hues; it is acceptable for wayfinding but **document token pairs** in `docs/ui-guidelines.md` so new collections do not invent clashing pastels.

- **“Playas por mar” two-up**: Strong pattern; ensure both cards share **identical min-height** at `md` so the row does not stagger when copy length differs.

### What works well

- **Hierarchy**: Sea collections first, then thematic grid — matches user mental model.
- **Icon + title + count + CTA** pattern is repeatable and scannable.

**Severity summary:** Critical: 0, Important: 1, Refinement: 2
