# Design Directive: Collection Detail (`/colecciones/$slug`)

**File**: `src/routes/colecciones/$slug.tsx`
**Reviewed**: 2026-03-28

---

## Critical (must fix)

- **Hero h1 size is too large for a detail page**: Uses `text-4xl sm:text-5xl` which matches the index page tier. Detail pages should use the compact tier (`text-3xl sm:text-4xl`) per the hero guidelines. This makes the collection detail hero feel oversized compared to the municipality detail page.
  **Fix**: Change h1 to `text-3xl font-extrabold tracking-tight text-white sm:text-4xl`.

## Important (should fix)

- **Beach count badge in hero adds visual noise**: The `bg-ocean-800/60` badge with "6 playas" is a separate `<p>` element in the hero. Combined with the subtitle, description, and badge, the hero has 4 text levels which is one too many.
  **Fix**: Integrate the count into the subtitle: "Descubre las calas mas remotas y aisladas de la costa murciana. 6 playas." Remove the separate badge element.

- **No collection-specific visual identity in the hero**: Unlike the index page where each collection has a colored bar + themed icon, the detail page hero is a generic ocean gradient. There's no visual connection between the collection card the user clicked and the page they land on.
  **Fix**: Pass the collection's theme color (from `ThematicIcons`) to the PageHero as an accent. Options: (a) tint the gradient with the collection's color, (b) show the collection icon in the hero, (c) use a subtle colored line below the hero matching the card's accent bar color.

- **"Volver a colecciones" link style differs from municipio detail**: Coleccion detail uses `text-ocean-600 hover:text-ocean-700 text-sm font-medium` with `focus:outline-none focus-visible:underline`. Municipality detail uses the same. Good - these are actually consistent. However, the municipio detail says "Ver todos los municipios" while this says "Volver a colecciones". The verb inconsistency (Ver vs. Volver) is a minor copywriting issue.
  **Fix**: Standardize to "Ver todas las colecciones" (or "Volver" everywhere). Pick one verb and use it consistently.

## Refinement (nice to have)

- **Empty state icon is gray-400 while municipio detail empty state uses ocean-300**: Minor color inconsistency in the empty search results icon.
  **Fix**: Standardize empty state icon color to `text-gray-300` across all pages (municipio detail, coleccion detail, explorer).

## What Works Well

- Breadcrumb depth is correct: Inicio > Colecciones > {Title}. This matches the guidelines.
- The sort + pagination pattern is identical to municipality detail. Good consistency.
- Beach card grid layout matches other pages.
- The page is clean and focused. The collection context (title + description) provides enough framing without overloading.

**Severity summary**: Critical: 1, Important: 3, Refinement: 1
