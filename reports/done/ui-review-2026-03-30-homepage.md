# UI review — homepage (`/`)

Sample: `http://localhost:3000/`. Source: `src/routes/index.tsx`.

## Design Directive: Homepage

### Critical (must fix)

- **Featured, municipios, and highlights sections disappear on first paint** when sections remain outside the intersection threshold—see `cross-cutting.md` and `src/routes/index.tsx` sections at lines 152–365 (`className="reveal ..."`). Visually reads as a broken page (hero + footer only).
  **Fix**: Same as cross-cutting Critical; validate that “Selección destacada”, “Municipios costeros”, and “Lo que hace única a nuestra costa” are visible without scrolling on 1280×800 and on mobile 375×812.

### Important (should fix)

- **Hero metrics copy vs meta:** Body hero uses “252 kilómetros” and dynamic `{totalBeaches}` (`index.tsx` ~116–119). Meta description uses loader `totalBeaches` (~47–48). Ensure marketing numbers stay consistent everywhere (footer counts vs hero) to avoid trust issues.
  **Fix**: Single source of truth for coastline km and beach count strings; audit `head` and visible copy together.

### Refinement (nice to have)

- **Secondary CTA vs mobile layout:** Stack CTAs (`index.tsx` ~121–148) are clear; confirm touch targets stay ≥44px vertical on small screens when font scales.
  **Fix**: Visual pass on narrowest supported width; add `min-h` / padding if needed.

### What works well

- **Hero** glass panel, overline, and serif headline read premium and on-brand.
- **Region highlights** dark band with three links is a strong editorial pattern.

**Severity summary:** Critical: 1, Important: 1, Refinement: 1
