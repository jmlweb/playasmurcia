# UI Review — Municipality listing (`/municipios/cartagena`)

**Evidence:** `/tmp/ui-review-municipio.png`.

**Note:** There is no `/municipios` index route in `src/routes/` (only `municipios/$slug.tsx`); inventory matches current router.

## Design Directive: Municipality listing

### Critical (must fix)

- None.

### Important (should fix)

- **Bottom CTA semantics**: The link `← Volver al inicio` targets `/` (`src/routes/municipios/$slug.tsx` approx. 199–205). A left arrow reads as “back” or “previous” in browser history, not “home”.  
  **Fix:** Replace with a home affordance: e.g. label “Ir al inicio” with a small home icon, or use a leading icon that implies site root (house), not a history-style chevron/arrow. Keep `colecciones/$slug.tsx` as-is where `← Volver a colecciones` correctly means parent collection index.

### Refinement (nice to have)

- **Hero stats row**: “N playas” + “N banderas azules” is legible; ensure icon size aligns with stats bar pattern in guidelines.

### What works well

- **Photo hero** with title + stats matches listing-page hierarchy.
- **Sort + pagination + grid** mirror collection detail and explorer for learn-once behavior.

**Severity summary:** Critical: 0, Important: 1, Refinement: 1
