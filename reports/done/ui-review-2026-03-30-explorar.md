# UI review — explorer (`/explorar`)

Sample: `http://localhost:3000/explorar`. Source: `src/routes/explorar/index.tsx`, `filter-panel.tsx`, `beach-card.tsx`, `pagination.tsx`.

## Design Directive: Explorar

### Critical (must fix)

- None.

### Important (should fix)

- **Results header redundancy:** “194 playas encontradas” adjacent to “Página 1 de 13 (194 playas)” repeats the total; consider one line for less noise.
  **Fix**: Merge into single string or drop duplicate count from pagination line.

- **Filter sidebar + grid:** At desktop, balance is strong; on tablet breakpoint confirm filter drawer/panel does not push grid below excessive fold (`073`).

- **Cards with grey placeholders:** Same as other listings—image pipeline.

### Refinement (nice to have)

- **Occupancy pill** (“Baja ocupación”) and **weather** corner badges: ensure they do not collide on very short image heights (rare).

### What works well

- **Hero search** glass panel matches homepage language.
- **Sort + pagination** feel like one system with collection/municipality lists.

**Severity summary:** Critical: 0, Important: 3, Refinement: 1
