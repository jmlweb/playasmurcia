# UI Design Guidelines

## General Principles

- Clean, minimalist design prioritizing images and data over decoration
- Fresh, Mediterranean visual style inspired by Spanish coastal tourism websites
- Content-first approach: beach information and imagery are the primary focus
- Clear visual hierarchy through alternating section backgrounds and consistent spacing

## Color Palette

Custom coastal palette defined in `src/styles.css` via `@theme` (Tailwind v4 CSS theme):

| Token       | Hex                          | Usage                                |
| ----------- | ---------------------------- | ------------------------------------ |
| `ocean-500` | `#1a7d9e`                    | Primary CTAs, buttons                |
| `ocean-600` | `#14637e`                    | Links, interactive elements, accents |
| `ocean-700` | `#104f65`                    | Hover states                         |
| `ocean-800` | `#0c3c4d`                    | Hero gradients, section backgrounds  |
| `ocean-900` | `#082935`                    | Dark backgrounds, footer             |
| `ocean-950` | `#041a23`                    | Deepest dark tone                    |
| `nav`       | mix of ocean-950 + slate-900 | Navigation bar                       |
| `sand-50`   | `#fefcf8`                    | Default page background              |
| `sand-100`  | `#fdf6eb`                    | Card/section alt background          |
| `white`     | —                            | Card backgrounds                     |
| `coral-400` | `#f0806e`                    | Warm accent (overlines, highlights)  |
| `coral-500` | `#e8604d`                    | Warm accent (active states)          |
| `gray-500`  | —                            | Secondary text, captions             |
| `gray-900`  | —                            | Headings, high-emphasis text         |

**Gradients and accents**:

- Ocean gradient (`from-ocean-900 via-ocean-800 to-ocean-700`) for hero and section headers
- Solid ocean (`ocean-600`) for accent sections
- Nav color (`bg-nav`) for navigation bar (color-mix of ocean-950 and slate-900)
- Coral (`coral-400`/`coral-500`) for warm accent highlights (sparingly)
- Avoid introducing new brand colors without clear justification

**Allowed thematic hues** (collections, category cards):

Use only brand tokens (`ocean`, `sand`, `coral`) and these ocean-adjacent Tailwind families: `teal`, `cyan`, `sky`, `amber`. Differentiate categories via lightness/saturation steps within this set. Do not use `purple`, `pink`, `indigo`, `rose`, or other unrelated hues for thematic cards.

## Typography

**Font stack**:

- **Display (serif)**: DM Serif Display (Regular 400 only) — page titles (`h1`) and section headings (`h2`) only.
- **Body (sans)**: Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif — everything else, including **all card titles** (`font-semibold`), regardless of page. The same object (e.g. a municipality card) must never switch between serif and sans across pages.

Both are loaded from Google Fonts.

**Size hierarchy**:

| Level                   | Size       | Usage                            |
| ----------------------- | ---------- | -------------------------------- |
| `text-5xl`              | Hero       | Page titles, hero headings       |
| `text-3xl` / `text-4xl` | Section    | Section headings                 |
| `text-xl` / `text-2xl`  | Subsection | Card titles, subsection headings |
| `text-base` / `text-lg` | Body       | Paragraphs, descriptions         |
| `text-sm`               | Caption    | Metadata, labels, secondary info |

**Weight usage**: serif headings (`h1`, `h2`) are always `font-normal` (400); the base rule sets `font-synthesis-weight: none`, so `font-semibold` or `font-bold` on a serif heading has no effect and must not be used. Sans card titles and emphasis use `font-semibold`/`font-bold`; body text is regular. Avoid light weights for body text.

**Caption contrast floor**: secondary text on white or `sand-50` must be at least `gray-600` at 13px (`text-[13px]`) or `gray-500` at 14px (`text-sm`) — both ≥ 4.5:1. `gray-400` (2.6:1 on white) is for decorative or disabled text only, never for metadata users need to read (e.g. length · sand type on cards).

## Layout Patterns

### Section Rhythm

Alternate between white and sand (`sand-50`) backgrounds to create visual separation between content sections. Use consistent vertical padding (`py-16` / `py-20`) for each section.

### Content Width

Use a max-width container (`max-w-6xl` or `max-w-7xl`) centered with `mx-auto` and horizontal padding (`px-4` / `px-6`). Full-bleed backgrounds are fine, but content should stay within the container.

### Section Structure

Each major section follows a pattern:

1. **Heading** with optional subtitle in lighter text
2. **Optional "Ver todos" link** aligned right for sections with truncated content
3. **Content grid or list**

### Cards

- **Cards are for clickable items only** (beach, municipality, collection). Static content sections (description, services, activities, cómo llegar, contacto) render **unboxed**, separated by `1px` `gray-200` hairlines with 48px vertical rhythm. Stacking many white shadowed boxes flattens hierarchy. The one exception is the beach detail side rail (directions, lifeguard warning, forecast, 112 flag): its panels are flat `ocean-50` blocks with no shadow, border or gradient, so they group today's decision without claiming to be clickable (see `DESIGN.md`, _The Lift Means Clickable Rule_).
- **One card style per object type.** A page must not mix card treatments for the same kind of item (e.g. image-strip, image-top and icon-only collection cards on `/colecciones`). Collections and seas share one card: 4:3 photo, title, short description, beach count; covers are picked by `pictureQualityScore` and kept distinct per card.
- **Filters**: the explorer sidebar opens with Para hoy as hairline rows, groups Acceso and Ocupación as segmented controls, and lists Mar, Necesidades and Municipio as hairline rows. Option counts stay out of view at rest with a mouse: rows reveal theirs on hover or keyboard focus, segments carry theirs in `title` and for screen readers. On touch screens every count stays visible, because hover does not exist there. An option with no results stays greyed out. It is sticky at `top-20` and scrolls inside its own viewport-capped box. Pages with already-scoped beaches (e.g. `/municipios/$slug`) use the horizontal `ChipFilterBar` instead. Show count and page in one results line (`35 playas · página 1 de 3`). On phones the sticky filter bar carries the count instead, and that line stays only for screen readers.
- White background with subtle shadow (`shadow-sm` or `shadow`)
- Rounded corners (`rounded-lg` or `rounded-xl`)
- Image at top, content below with padding
- **Photo overlays**: at most one chip group per corner and **max 2 tag pills** on the image; pills must never wrap to a second row at any grid width. Extra tags go in the card body as 12px outline chips (`gray-200` border, `gray-700` text).
- Clear link or CTA at the bottom ("Ver playa →"), pinned with `mt-auto` so CTAs align across a row even when optional meta lines are missing

### Grids

- 3 columns on desktop, 2 on tablet, 1 on mobile for card grids
- 2x3 or 3x2 layouts for municipality/category cards with image backgrounds
- Icon grids: 5 columns on desktop, 3 on mobile

## Images

- Beach images can be used as backgrounds in cards, heroes, and listings where they add visual value
- Always apply an overlay or gradient over background images to ensure text readability
- Municipality cards: image fills the card with text overlay (name + beach count) at the bottom
- **Photo selection**: heroes, featured slots (homepage "Selección destacada") and collection/municipality covers use photos with `pictureQualityScore` 3 (daylight, water and sand visible). Never pick by data order alone — signposts, high-rise close-ups and backlit silhouettes undersell the coast.
- **No-photo fallback**: an intentional `ocean-700` → `ocean-900` gradient with a white/30 icon or the name's initial — never a light grey box that reads as a failed load.
- Use lazy loading (`loading="lazy"`) for all images below the fold
- Prefer optimized formats (WebP/AVIF) when possible
- Provide meaningful `alt` text describing the beach or scene

## UI Elements

### Buttons

- Primary: solid ocean (`bg-ocean-500 text-white` or `bg-ocean-600 text-white`) with rounded-full shape
- Outlined/secondary: transparent with `border border-white/20` or text-only link style
- Consistent padding (`px-8 py-3.5`) and pill shape (`rounded-full`)

### Tags and Badges

- Small rounded pills (`rounded-full`, `px-3 py-1`, `text-xs` / `text-sm`)
- Icon + label format when space allows
- Light background variants for neutral tags (`bg-ocean-50 text-ocean-700`), ocean for active/selected filters
- **Semantic color is for signals, not facts**: red/rose only for warnings or danger (closures, red flag, alerts). Neutral attributes such as summer occupancy ("Alta"), access level or child suitability use neutral text or an ocean-toned meter (e.g. 3-step `●●○`), not traffic-light colors.
- Non-link text must never use the link color (`ocean-400`–`ocean-600` on light, `ocean-400` on dark) — e.g. footer descriptions or the weather "Agua" value.

### Icon Categories

- Icons displayed inside circles (light background or bordered)
- Label below the circle
- Used for beach types (Arena fina, Familiar, Salvaje...) and activities (Buceo, Paddle surf, Windsurf...)
- Keep icon style consistent (all outline or all filled, not mixed)

### Icons Policy

- **Functional UI icons** (services, activities, weather, collection themes) must use SVG with `currentColor` for fill/stroke, sized consistently (20×20 or 24×24). Never use emoji as functional icons — emoji rendering varies across OS and browser.
- **Decorative/editorial emoji** (e.g. inside user-facing prose) are acceptable but not for interactive or branded UI elements.

### Service amenity icons (`ServiceIcon`)

- **Lookup key**: The SVG map for services must be keyed by **`service.id`** (stable string id from the database / `data/services.json`, e.g. `chiringuito`, `wheelchair-ramp`). That id selects the correct outline icon in the UI.
- **`icon` field**: Treat the stored `icon` value as **legacy** (historical emoji or migration artifacts). Use it only as a fallback when no SVG exists for the id — never assume `icon` matches the map keys.
- **User-visible text**: Always show the Spanish **`name`** from the service record next to the icon, not raw ids or English tokens.

### Stats Bar

- Horizontal row of key metrics: icon + number + label
- Used to display aggregated data (total beaches, municipalities, certifications)
- Evenly spaced across the container width

### Search

- Prominent search bar in hero section
- Input with placeholder text + blue action button
- Optional filter tags below the search bar for quick filtering

## Hero Sections

Height tiers create visual hierarchy between the homepage, beach detail and inner pages:

| Tier                     | Height                    | Usage                                                                  |
| ------------------------ | ------------------------- | ---------------------------------------------------------------------- |
| **Homepage** (immersive) | `min(72svh, 640px)`       | Homepage hero only — full-bleed photo, staggered animation             |
| **Beach detail**         | `min(38svh, 300px)`, `min(60svh, 560px)` from `sm` | `/playas/$slug` — first beach photo as hero with recent conditions; compact gradient tier if no photo |
| **Photo listing**        | 320px, 420px from `sm`    | Listing pages with a photo (municipios, colecciones, explorar)         |
| **Inner page** (compact) | `py-14 sm:py-18 lg:py-20` | Pages without a photo — gradient background, functional header         |

### Photo heroes

- **Full-bleed photo, no panel.** Do not place a centered glass/`backdrop-blur` box behind the hero text — it hides the photo (≈90% on mobile) and reads as a dated template pattern.
- **Duotone treatment** (`PageHero` only): the photo is grayscale (`grayscale contrast-125`) multiplied by an `ocean-400` layer, then a bottom-weighted `ocean-950` gradient (85% → transparent over ~55%). Every photo reads as the same teal tone, so white text always passes contrast. Detail is traded for legibility on purpose. For photos that end up too dark, `PageHero` takes `tone`: `soft` (mid point, used by `/explorar`) or `lifted` (brightened image, `ocean-300` tint, weaker gradient; used by `/municipios/lorca` and `/municipios/mazarron`).
- **Beach detail is exempt from duotone.** `BeachHero` (`/playas/$slug`) keeps the photo in natural colour, because visitors use it to judge the beach itself. Legibility comes from a bottom-weighted `ocean-950` scrim (85% → 55% on phones, 85% → 20% from `sm`) plus a text shadow on the heading block; the breadcrumb must still clear 4.5:1 at the hero midpoint over bright sand.
- **Text block**: left-aligned to the `max-w-7xl` container, anchored bottom-left, padding 48px desktop / 24px mobile.
- **Eyebrow**: small tracked caps must reach ≥ 4.5:1 — use white over a scrim that reaches the text, and measure it over the image; `coral-300` does not clear 4.5:1 on photos; never place small text over unscrimmed photo areas.
- **Implementation**: `PageHero` takes `size="home"` for the immersive tier (default is the ~420px listing tier) and a `breadcrumb` prop rendered inside the hero above the eyebrow. Subtitles use `text-ocean-100`.
- **Copy**: subtitle max one line on desktop (≈2 on mobile).
- **Uniqueness**: each collection/municipality uses its own hero photo; do not reuse the same image on an index and its detail pages.

### Heading size tiers

Inner pages follow two sub-tiers for `h1` size:

| Sub-tier          | Size                                                         | Usage                                                                                                                                        |
| ----------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Index**         | `text-4xl font-normal tracking-tight text-white sm:text-5xl` | Index/listing pages (`/colecciones`). Uses `font-normal` because DM Serif Display only ships Regular (400) weight.                           |
| **Detail / tool** | `text-3xl font-normal tracking-tight text-white sm:text-4xl` | Detail pages (`/municipios/$slug`, `/colecciones/$slug`) and tool pages (`/explorar`). Uses `font-normal` — same DM Serif Display rationale. |
| **Beach detail**  | `text-3xl font-normal tracking-tight text-white sm:text-5xl` | `/playas/$slug` only (`BeachHero`). The beach name is the page's subject over a full-bleed photo, so from `sm` it takes the index size; on phones it stays at the detail size so the hero keeps room for the conditions line. |

**Structure** (inner pages):

1. Gradient background: `bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700`
2. Optional uppercase label: `text-sm font-medium uppercase tracking-widest text-ocean-300`
3. Page title: sized per sub-tier above
4. Optional subtitle: `text-lg text-ocean-200`

Decorative blur circles are optional — use `opacity-20` minimum if present, otherwise remove.

## Breadcrumbs

Present on every page except the homepage. On pages with a `PageHero` or `BeachHero` the breadcrumb is rendered **inside the hero**, above the eyebrow (or above the beach name), via the `breadcrumb` prop (`tone="onPhoto"`: `text-sm text-white`, `mb-4`; links underlined with `decoration-white/50`, current item `font-semibold`; solid white, because `white/80` measured 2.6:1 to 3.7:1 over bright sand on desktop heroes). Beach detail keeps the breadcrumb inside its hero even without a photo, over the compact gradient. Only pages with no hero at all place it in the main content area (light background).

**Styling**: `text-sm text-gray-500` with separator `<span className="mx-2" aria-hidden="true">/</span>`. Links use `hover:text-ocean-600 focus-visible:text-ocean-600 focus-visible:underline`. Current page uses `text-gray-600` with `aria-current="page"`.

**Spacing** (pages with no hero): `pt-6` (24px) above the breadcrumb and `mb-8` below it, before main content. Inside a hero the breadcrumb follows the hero's own padding and the `mb-4` above.

**Depth**: Mirror the site hierarchy. Examples:

- `/municipios/cartagena` → Inicio / Municipios / Cartagena
- `/playas/playa-x` → Inicio / {Municipality} / {Beach name}
- `/colecciones/slug` → Inicio / Colecciones / {Collection title}
- `/explorar` → Inicio / Explorar playas

## Animation & Motion

### Reduced motion

All animations and hover transforms **must** respect `prefers-reduced-motion: reduce`. Use Tailwind's `motion-safe:` prefix for transform-based interactions (e.g., `motion-safe:hover:-translate-y-1`). Custom keyframe animations defined in `src/styles.css` must include a `@media (prefers-reduced-motion: reduce)` block that disables them.

### Transitions

| Context                           | Duration  | Easing                               |
| --------------------------------- | --------- | ------------------------------------ |
| Micro-interactions (hover, focus) | 150-200ms | `ease-out`                           |
| Color/opacity changes             | 200-300ms | `ease` (default `transition-colors`) |
| Layout changes (accordion, modal) | 200-300ms | `ease-out`                           |
| Page entrance animations          | 400-600ms | `ease-out`                           |

### Hover effects

- **Cards**: `motion-safe:hover:-translate-y-1` + `hover:shadow-lg` + `hover:ring-ocean-200`. Duration: 300ms.
- **Images inside cards**: `motion-safe:group-hover:scale-105`. Duration: 500ms.
- **Buttons**: color shift only, no transform. Duration: 150ms.
- **Text links**: `hover:text-ocean-600` or `hover:text-white` (on dark backgrounds).

## Accessibility

- Ensure sufficient contrast for text over images (overlay required)
- Support keyboard navigation on all interactive elements
- Use descriptive `alt` text on all images
- Maintain semantic heading structure (`h1` > `h2` > `h3`, no skipped levels)
- Use semantic HTML elements (`nav`, `main`, `section`, `article`) appropriately
- Exactly one `<main>` element per page — do not nest `<main>` inside `<main>`
- Respect `prefers-reduced-motion` (see Animation & Motion section)

### Focus states

Two patterns, applied consistently:

| Element type                           | Focus style                                                                                                |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Buttons, cards, interactive containers | `focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none` |
| Inline text links                      | `focus-visible:text-ocean-600 focus-visible:underline focus-visible:outline-none`                          |

Always use `focus-visible` (not `focus`) to avoid showing focus rings on mouse clicks.

## Empty States

When a page or section has no results (empty search, empty collection, no beaches in municipality), use a consistent visual pattern:

- Container: `rounded-2xl border border-dashed border-gray-200 py-20 text-center`
- Icon: `text-gray-300 mb-5 h-14 w-14` (centered, using a relevant SVG — typically a magnifying glass)
- Title: `text-lg font-normal text-gray-900 mb-1` (serif `h2`, weight 400)
- Description: `text-sm text-gray-500`
- Optional action button: standard primary pill button (`bg-ocean-600 text-white rounded-full`)

Extract into a shared `EmptyState` component to avoid per-page drift.

## Error and not-found pages

Pages such as **404 Not Found** or route-level **not found** often sit on the default **`sand-50`** page background (same as the main shell). Light ocean tints (**`ocean-100`–`ocean-300`**) on that background fail WCAG contrast for text, including large display numerals.

- **Display codes** (e.g. “404”): use **`text-gray-900`** or **`text-ocean-800` / `text-ocean-700`** — same emphasis band as empty-state titles.
- **Primary heading** (e.g. “Página no encontrada”): **`text-gray-900`** with clear hierarchy above body copy.
- **Supporting copy**: **`text-gray-500`** or **`text-gray-600`**; links and buttons follow normal button/link tokens (`ocean-600`, etc.).
- **Consistency**: Error and not-found layouts should feel related to [Empty States](#empty-states) (spacing, typography scale) without reusing illegible hero-style pale blues on light sand.

## Back Navigation Links

Pages that are children of an index (e.g. `/colecciones/$slug` → `/colecciones`) include a bottom back-link:

- Position: `mt-12 text-center` below the main content
- Style: **bordered pill button** — `border-ocean-200 text-ocean-600 hover:bg-ocean-50 hover:text-ocean-700 inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none`. The pill button provides better affordance and visual consistency than a plain text link.
- Copy: Use the pattern `← Volver a {section}` consistently (e.g. "← Volver a colecciones", "← Volver a municipios"). Do not mix with "Ver todos/as" or other verbs.

## Data in the UI

Editorial JSON and the database store **machine-oriented** values (English enums, internal codes, slugs). The site’s **public UI and metadata** are **Spanish** (see [AGENTS.md](../AGENTS.md) — spelling and orthography).

- **Do not render raw schema values** in labels or paragraphs when they are not end-user Spanish — for example: compass **`orientation`** (`east`, `northeast` → **Este**, **Noreste**), **`waves`** enums, **`bestSeason`** keys, or similar. Map them through a small shared dictionary or helper at the presentation layer.
- **Meta titles and descriptions**: Use correct Spanish spelling and accents (e.g. **Colección**, not `Coleccion` in user-visible strings and `<title>` / `description` where applicable).
- **Single source of truth**: Prefer one mapping module or table per domain (orientation, seasons, wave labels) so listing pages, beach detail, and future tools stay aligned.

## Components

- Prefer standard HTML elements over custom components
- Only create custom components when the improvement in accessibility, reusability, or design is significant
- Do not install component libraries without clear justification
- Keep component APIs simple with minimal props

## Responsive Design

- Mobile-first approach using Tailwind standard breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`)
- Create mobile/desktop-specific variants when needed
- Prefer CSS-based responsive techniques over JavaScript-driven layout changes
- Test layouts at common breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)

### Site footer

- Colophon on `ocean-900`, not a sitemap: brand with the shared `WaveMarkIcon`, one factual line computed from the data (never hard-coded), then the link groups, then the mapped sources, the personal and ad-free line and the copyright, all at 14px.
- Column labels are `<p>` elements in `coral-300` at 0.2em tracking, not `h2`, which is serif by default. Municipios and Colecciones are `<nav aria-labelledby>` landmarks, each closing on its index link; "Todas las playas" sits under the brand line.
- Rows put the name left and the count right, with `tabular-nums` and an `aria-label` that carries the unit ("Cartagena, 69 playas"). Collections with no beaches are dropped.
- Below `sm`, Municipios and Colecciones collapse into native `<details>` sharing one `name`, so only one stays open, and every link is at least 44px tall. From `sm` up, `.footer-disclosure` in `src/styles.css` keeps them open through `::details-content`; browsers without it keep the disclosure.
- Link only to pages that exist. Each source names the fact it supplies, in a `dl` on the same columns as the link groups, with a fixed label width, so rows stay even and both blocks align.
- The current page reads in white and semibold through `aria-[current=page]`, so all footer `Link`s set `activeOptions={{ exact: true }}`.

## Performance

- Consider Core Web Vitals (LCP, FID, CLS) without sacrificing functionality
- Lazy load images and heavy components below the fold
- Minimize unused CSS and JavaScript
- Prefer CSS-native solutions for animations and transitions over JavaScript alternatives
- Avoid layout shifts by defining explicit dimensions for images and dynamic content
