# UI review — municipalities index (`/municipios`)

Sample: `http://localhost:3000/municipios`. Source: `src/routes/municipios/index.tsx`.

## Design Directive: Municipios index

### Critical (must fix)

- None.

### Important (should fix)

- **Card imagery:** Cards are text-forward (counts, blue flags) without photography; backlog already tracks municipality imagery (`035`, `075`, `017`). Current layout is clean but below premium destination sites.
  **Fix**: Per linked tasks—background image or map thumb, stronger visual hierarchy for municipality name vs stats.

- **DevTools overlap:** Floating TanStack control can obscure card corner—see `cross-cutting.md`.

### Refinement (nice to have)

- **Badge (beach count)** top-right: ensure optical alignment with title baseline on all breakpoints.

### What works well

- **Grid rhythm** and **“Ver playas →”** pattern are consistent and readable.

**Severity summary:** Critical: 0, Important: 2, Refinement: 1
