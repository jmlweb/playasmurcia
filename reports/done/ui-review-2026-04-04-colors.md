# UI Review — Color focus (2026-04-04)

**Role**: UI designer audit per `.claude/agents/ui-designer.md` and `.claude/templates/ui-review.md`.  
**Evidence**: Playwright screenshots via `pnpm tsx scripts/screenshot.ts` (Chromium, `networkidle`, `--full-page`). Desktop 1280×800 and mobile 375×812. Local captures: `/tmp/ui-review-{home,explorar,colecciones,coleccion-detail,playa,municipio}.png` (+ `-mobile` variants).

## Pages reviewed

| Page            | Paths |
| --------------- | ----- |
| Homepage        | `/` |
| Explorer        | `/explorar` |
| Collections index | `/colecciones` |
| Collection detail | `/colecciones/mar-menor` |
| Beach detail    | `/playas/playa-la-calera` |
| Municipality    | `/municipios/cartagena` |

## Cross-cutting — color

### Critical (must fix)

_None verified as blocking accessibility without tooling; spot-check semantic badges on beach detail for 4.5:1 on smallest text._

### Important (should fix)

- **Collections index reads as a “rainbow” product UI, not a single coastal brand.** `src/routes/colecciones/index.tsx` maps each collection slug to unrelated Tailwind semantic ramps (`teal`, `amber`, `orange`, `rose`, `purple`, `sky`, `cyan`, `indigo`, `yellow`, `green`, `blue`, `pink`). Visually this competes with the ocean/sand system in `docs/ui-guidelines.md` and `src/styles.css` (`--color-ocean-*`, `--color-sand-*`).  
  **Fix**: Replace with a **derived palette** from brand tokens only — e.g. 2–3 ocean/sand/coral steps varied by **hue shift in OKLCH** or fixed steps (`ocean-50`…`ocean-300` backgrounds + `ocean-600`/`ocean-700` icons) so cards differ by lightness/saturation, not unrelated hues. Alternatively, document an explicit “exception zone” in `docs/ui-guidelines.md` with a capped set of tints (max 4–5) that still harmonize with ocean-500/600.

- **Primary nav active state differs between desktop and mobile.** Desktop: `border-b-2 border-ocean-400` (`src/components/layout/navbar.tsx` ~212–214). Mobile drawer: `activeProps={{ className: 'text-white' }}` only (~294) — no underline or background cue.  
  **Fix**: Mirror desktop semantics on mobile (e.g. same `border-ocean-400` bottom border on the block row, or `bg-ocean-800/80` + left accent bar) so “where am I?” does not depend on viewport.

- **“Coral” accent is implemented but under-documented.** `src/styles.css` defines `--color-coral-400/500` and `.overline-accent` uses `coral-400`; `src/features/home/highlights-section.tsx` uses coral tints. `docs/ui-guidelines.md` does not list coral in the palette table — risk of one-off accents drifting.  
  **Fix**: Add coral to the guidelines palette (usage: editorial highlights / overlines only) **or** replace overline with `ocean-400`/`ocean-500` for strict two-accent brand.

### Refinement (nice to have)

- **Footer column labels** use `text-ocean-400` (`src/components/layout/site-footer.tsx` ~45, 68). On `bg-ocean-900`, this is on-brand but close to link hover states; consider `text-ocean-300` for labels if hierarchy feels flat.  
  **Fix**: A/B one step lighter for uppercase labels only; keep links `text-ocean-200`.

### What works well

- **Ocean gradient heroes** (`from-ocean-900 via-ocean-800 to-ocean-700`) and **nav** (`bg-nav`) read cohesive and premium across listing and detail routes.  
- **Footer** dark shell with `ocean-200` body and `ocean-400` section labels matches the intended coastal night-sea mood.  
- **Occupancy / CTA pills** using ocean greens/teals align with primary actions and feel consistent on cards.  
- **Beach detail “Información práctica”** uses restrained semantic tints (blue/green/amber/gray) that communicate state without neon.

---

**Severity summary**: Critical: 0, Important: 3, Refinement: 1
