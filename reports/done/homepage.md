# Homepage (`/`) — UI review directive

Screenshots: `/tmp/ui-review-home.png`, `/tmp/ui-review-home-mobile.png`. Route: `src/routes/index.tsx`.

## Design Directive: Homepage

### Critical (must fix)

_None._

### Important (should fix)

- **Featured grid density at wide breakpoints**: At `2xl:grid-cols-4` (`index.tsx` ~174), cards become quite narrow; tag pills and dual overlays (weather + occupancy) compete for space on smaller card widths.
  **Fix**: Cap the featured grid at **3 columns** (`lg:grid-cols-3`) up to `2xl`, or reduce horizontal padding inside `BeachCard` only when `2xl` columns are active — pick one system-wide rule.

### Refinement (nice to have)

- **Hero serif scale on small phones**: `text-4xl` → `xl:text-7xl` progression is strong; on ~375px width, confirm line breaks in “Donde el Mediterráneo / abraza la costa” avoid a single orphan word (adjust `br` or `text-balance` if needed).

- **Overline “Selección destacada”**: `overline-accent` reads slightly hot vs ocean palette; if the accent is orange, ensure it is the **same token** as other section labels for brand consistency.

### What works well

- **Immersive hero**: Ken Burns on hero image, scrim, dual CTAs, and stat line tied to `totalBeaches` feel at the level of regional tourism sites.
- **Motion**: Staggered `animate-fade-up` respects hierarchy without clutter.

**Severity summary:** Critical: 0, Important: 1, Refinement: 2
