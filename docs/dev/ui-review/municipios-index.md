# Design Directive: Municipios Index

Route: `src/routes/municipios/index.tsx` | URL: `/municipios`

---

## Critical (must fix)

- **Service icons display as raw text IDs**: In the municipality cards, the service badges render the `service.icon` field as visible text: "sunbeds", "parking", "showers", "toilets", "umbrellas", "wheelchair", "restaurant". These are internal identifier strings, not visual icons. The rendered HTML shows `<span aria-hidden="true">sunbeds</span>` followed by `<span>Hamacas</span>` — the user sees "sunbedsHamacas" as a badge label. This is a data/rendering bug that makes the entire card section look broken.
  **Fix**: The `icon` field in the services data must contain the actual emoji character (e.g., "sunbeds" → "🏖️", "parking" → "🅿️", "showers" → "🚿") or the component must map these string IDs to visual icons. Every service badge needs a recognizable visual icon, not a code name.

## Important (should fix)

- **Municipality cards are text-only and visually flat**: Every municipality card is a plain white card with text: name, beach count, service badges, and a "Ver playas →" link. There is no imagery, no visual hook, no differentiation between municipalities. On a beach discovery site, the municipality page should inspire exploration — instead it reads like an admin panel listing. Compare mentally to how Airbnb, Booking, or national tourism boards present their destination listings.
  **Fix**: Add a representative beach image to each municipality card. Use the first picture from the municipality's most popular/featured beach. Display it as a top banner image (aspect-ratio 16/9 or 3/2) within the card, similar to the beach cards. If no image is available, use a gradient placeholder with the ocean palette. The image transforms this from a list into a visual exploration interface.

- **Hero decorative blur circle is barely perceptible**: The hero has an `opacity-10` blur circle (`h-80 w-80 rounded-full bg-ocean-400 blur-3xl`) that is meant to add depth. At 10% opacity against the ocean-800/700 gradient, it's virtually invisible. Either commit to the effect or remove the dead markup.
  **Fix**: Either increase opacity to `opacity-20` and add a second smaller circle at a different position for more interesting visual texture, or remove the decorative div entirely. The gradient alone is sufficient.

- **No visual distinction between small and large municipalities**: Cartagena (69 beaches) and La Union (2 beaches) get identical card sizes and visual weight. The grid treats all 9 municipalities equally, giving no visual cue about relative scale.
  **Fix**: Use the beach count to drive visual hierarchy. The top 3 municipalities by beach count could span full width or use a larger card variant. Alternatively, display the beach count as a large prominent number (e.g., `text-3xl font-bold text-ocean-500`) within the card to create natural visual weight differences.

## Refinement (nice to have)

- **Service badges could be more compact**: Each badge shows "icon + name" as a horizontal pill. With 4 badges per card, this creates a dense row that competes with the municipality name for attention. The badges are metadata, not primary content.
  **Fix**: Reduce badge font size from `text-xs` to `text-[10px]`. Consider showing only icons (without labels) for the service badges, using a tooltip for the name on hover. Or limit to 3 badges maximum and add a "+2 more" indicator.

- **Grid layout could be more intentional**: The 1→2→3 column grid (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`) is functional but doesn't create visual interest. With only 9 items, the layout could be more creative.
  **Fix**: Consider a featured layout: first card (Cartagena, most beaches) spans 2 columns on desktop, remaining cards in a 2-column grid below. This creates a visual anchor and natural hierarchy. Use `sm:col-span-2` on the first card.

## What Works Well

- **Card hover animation** (translate-y + shadow + ring) is consistent with the beach cards — good system-level coherence.
- **Blue flag badge** with emoji + count is a nice data highlight.
- **Section heading pattern** (uppercase subtitle + bold h1) matches the homepage — consistent brand.
- **Breadcrumb** is correctly placed below the hero in the content area.
