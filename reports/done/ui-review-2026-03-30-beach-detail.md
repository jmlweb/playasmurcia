# UI review — beach detail (`/playas/$slug`)

Sample: `http://localhost:3000/playas/cala-cortina`. Source: `src/routes/playas/$slug.tsx` and imported components.

## Design Directive: Beach detail

### Critical (must fix)

- None observed beyond global reveal issue (not used on this route).

### Important (should fix)

- **Weather empty state:** Sidebar shows forecast unavailable (`Previsión no disponible en este momento`). Reads acceptable but slightly cold; ensure contrast and iconography match `docs/ui-guidelines.md` for secondary messaging.
  **Fix**: Short reassurance line + link to external forecast optional; keep one sentence max; verify `text-gray-500` (or token) on `sand-50` meets 4.5:1.

- **Certification + service grids:** Many bordered cells; confirm focus order and keyboard reachability for dense icon grids (accessibility).
  **Fix**: Spot-check tab order; ensure grid items that are informational, not interactive, are not focus traps.

### Refinement (nice to have)

- **Gallery + two-column layout:** At wide widths the ratio is strong; at mid breakpoints verify sidebar does not feel “orphaned” below the fold.
  **Fix**: Optional `sticky` sidebar behavior within main only if it does not overlap footer or map.

### What works well

- **Hero** with tags, **photo gallery** asymmetry, and **nearby beaches** row match a national-tourism-board bar.
- **Practical info** grid with semantic badges (water quality, occupancy) scans quickly.

**Severity summary:** Critical: 0, Important: 2, Refinement: 1
