# UI review — collections index (`/colecciones`)

Sample: `http://localhost:3000/colecciones`. Source: `src/routes/colecciones/index.tsx`.

## Design Directive: Colecciones index

### Critical (must fix)

- None.

### Important (should fix)

- **Thematic grid (12 cards):** Each card uses a distinct top border + icon hue. Verify body text contrast on white for the lightest accents (yellow sunset, pale blue flag)—WCAG AA for `text-sm` paragraphs.
  **Fix**: Audit hex pairs; darken body copy to `gray-700` where needed or soften accent borders only.

- **“Playas por mar”** large cards: strong; ensure icon + title alignment matches RTL/spacing of thematic cards for one system.

### Refinement (nice to have)

- **External badge** (e.g. regional seal) on one card: if intentional, repeat pattern rules in guidelines; if stray asset, remove for uniformity.

### What works well

- **Two-tier structure** (sea + thematic) makes navigation mental model obvious.
- **Serif section titles** match rest of site.

**Severity summary:** Critical: 0, Important: 2, Refinement: 1
