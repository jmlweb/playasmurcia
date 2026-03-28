# UI Design Guidelines

## General Principles

- Clean, minimalist design prioritizing images and data over decoration
- Fresh, Mediterranean visual style inspired by Spanish coastal tourism websites
- Content-first approach: beach information and imagery are the primary focus
- Clear visual hierarchy through alternating section backgrounds and consistent spacing

## Color Palette

Custom coastal palette defined in `src/styles.css` via `@theme` (Tailwind v4 CSS theme):

| Token | Hex | Usage |
|-------|-----|-------|
| `ocean-500` | `#1a7d9e` | Primary CTAs, buttons |
| `ocean-600` | `#14637e` | Links, interactive elements, accents |
| `ocean-700` | `#104f65` | Hover states |
| `ocean-800` | `#0c3c4d` | Hero gradients, section backgrounds |
| `ocean-900` | `#082935` | Dark backgrounds, footer |
| `ocean-950` | `#041a23` | Deepest dark tone |
| `nav` | mix of ocean-950 + slate-900 | Navigation bar |
| `sand-50` | `#fefcf8` | Default page background |
| `sand-100` | `#fdf6eb` | Card/section alt background |
| `white` | — | Card backgrounds |
| `gray-500` | — | Secondary text, captions |
| `gray-900` | — | Headings, high-emphasis text |

**Gradients and accents**:

- Ocean gradient (`from-ocean-900 via-ocean-800 to-ocean-700`) for hero and section headers
- Solid ocean (`ocean-600`) for accent sections
- Nav color (`bg-nav`) for navigation bar (color-mix of ocean-950 and slate-900)
- Avoid introducing new brand colors without clear justification

## Typography

**Font stack**: Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif (loaded from Google Fonts)

**Size hierarchy**:

| Level | Size | Usage |
|-------|------|-------|
| `text-5xl` | Hero | Page titles, hero headings |
| `text-3xl` / `text-4xl` | Section | Section headings |
| `text-xl` / `text-2xl` | Subsection | Card titles, subsection headings |
| `text-base` / `text-lg` | Body | Paragraphs, descriptions |
| `text-sm` | Caption | Metadata, labels, secondary info |

**Weight usage**: Bold (`font-bold`) for headings and emphasis, regular for body text. Avoid light weights for body text.

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

- White background with subtle shadow (`shadow-sm` or `shadow`)
- Rounded corners (`rounded-lg` or `rounded-xl`)
- Image at top, content below with padding
- Tags/badges displayed as small pills within cards
- Clear link or CTA at the bottom ("Ver playa →")

### Grids

- 3 columns on desktop, 2 on tablet, 1 on mobile for card grids
- 2x3 or 3x2 layouts for municipality/category cards with image backgrounds
- Icon grids: 5 columns on desktop, 3 on mobile

## Images

- Beach images can be used as backgrounds in cards, heroes, and listings where they add visual value
- Always apply an overlay or gradient over background images to ensure text readability
- Municipality cards: image fills the card with text overlay (name + beach count) at the bottom
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

### Icon Categories

- Icons displayed inside circles (light background or bordered)
- Label below the circle
- Used for beach types (Arena Fina, Familiar, Salvaje...) and activities (Natación, Snorkel, Kayak...)
- Keep icon style consistent (all outline or all filled, not mixed)

### Icons Policy

- **Functional UI icons** (services, activities, weather, collection themes) must use SVG with `currentColor` for fill/stroke, sized consistently (20×20 or 24×24). Never use emoji as functional icons — emoji rendering varies across OS and browser.
- **Decorative/editorial emoji** (e.g. inside user-facing prose) are acceptable but not for interactive or branded UI elements.

### Stats Bar

- Horizontal row of key metrics: icon + number + label
- Used to display aggregated data (total beaches, municipalities, certifications)
- Evenly spaced across the container width

### Search

- Prominent search bar in hero section
- Input with placeholder text + blue action button
- Optional filter tags below the search bar for quick filtering

## Hero Sections

Two height tiers to create visual hierarchy between the homepage and inner pages:

| Tier | Padding | Usage |
|------|---------|-------|
| **Homepage** (immersive) | `py-16 sm:py-20 lg:py-28` | Homepage hero only — full-bleed image, staggered animation |
| **Inner page** (compact) | `py-14 sm:py-18 lg:py-20` | All other pages — gradient background, functional header |

### Heading size tiers

Inner pages follow two sub-tiers for `h1` size:

| Sub-tier | Size | Usage |
|----------|------|-------|
| **Index** | `text-4xl font-extrabold tracking-tight text-white sm:text-5xl` | Index/listing pages (`/municipios`, `/colecciones`) |
| **Detail / tool** | `text-3xl font-extrabold tracking-tight text-white sm:text-4xl` | Detail pages (`/municipios/$slug`, `/colecciones/$slug`) and tool pages (`/explorar`) |

**Structure** (inner pages):

1. Gradient background: `bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700`
2. Optional uppercase label: `text-sm font-medium uppercase tracking-widest text-ocean-300`
3. Page title: sized per sub-tier above
4. Optional subtitle: `text-lg text-ocean-200`

Decorative blur circles are optional — use `opacity-20` minimum if present, otherwise remove.

## Breadcrumbs

Present on every page except the homepage. Always placed **below the hero**, inside the main content area (light background).

**Styling**: `text-sm text-gray-500` with separator `<span className="mx-2" aria-hidden="true">/</span>`. Links use `hover:text-ocean-600 focus-visible:text-ocean-600 focus-visible:underline`. Current page uses `text-gray-600` with `aria-current="page"`.

**Spacing**: `mb-8` below the breadcrumb, before main content.

**Depth**: Mirror the site hierarchy. Examples:
- `/municipios` → Inicio / Municipios
- `/municipios/cartagena` → Inicio / Municipios / Cartagena
- `/playas/playa-x` → Inicio / {Municipality} / {Beach name}
- `/colecciones/slug` → Inicio / Colecciones / {Collection title}
- `/explorar` → Inicio / Explorar playas

## Animation & Motion

### Reduced motion

All animations and hover transforms **must** respect `prefers-reduced-motion: reduce`. Use Tailwind's `motion-safe:` prefix for transform-based interactions (e.g., `motion-safe:hover:-translate-y-1`). Custom keyframe animations defined in `src/styles.css` must include a `@media (prefers-reduced-motion: reduce)` block that disables them.

### Transitions

| Context | Duration | Easing |
|---------|----------|--------|
| Micro-interactions (hover, focus) | 150-200ms | `ease-out` |
| Color/opacity changes | 200-300ms | `ease` (default `transition-colors`) |
| Layout changes (accordion, modal) | 200-300ms | `ease-out` |
| Page entrance animations | 400-600ms | `ease-out` |

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

| Element type | Focus style |
|-------------|-------------|
| Buttons, cards, interactive containers | `focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none` |
| Inline text links | `focus-visible:text-ocean-600 focus-visible:underline focus-visible:outline-none` |

Always use `focus-visible` (not `focus`) to avoid showing focus rings on mouse clicks.

## Empty States

When a page or section has no results (empty search, empty collection, no beaches in municipality), use a consistent visual pattern:

- Container: `rounded-2xl border border-dashed border-gray-200 py-20 text-center`
- Icon: `text-gray-300 mb-5 h-14 w-14` (centered, using a relevant SVG — typically a magnifying glass)
- Title: `text-lg font-semibold text-gray-900 mb-1`
- Description: `text-sm text-gray-500`
- Optional action button: standard primary pill button (`bg-ocean-600 text-white rounded-full`)

Extract into a shared `EmptyState` component to avoid per-page drift.

## Back Navigation Links

Pages that are children of an index (e.g. `/colecciones/$slug` → `/colecciones`) include a bottom back-link:

- Position: `mt-12 text-center` below the main content
- Style: `text-ocean-600 hover:text-ocean-700 text-sm font-medium transition-colors focus:outline-none focus-visible:underline`
- Copy: Use the pattern `← Volver a {section}` consistently (e.g. "← Volver a colecciones", "← Volver a municipios"). Do not mix with "Ver todos/as" or other verbs.

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

## Performance

- Consider Core Web Vitals (LCP, FID, CLS) without sacrificing functionality
- Lazy load images and heavy components below the fold
- Minimize unused CSS and JavaScript
- Prefer CSS-native solutions for animations and transitions over JavaScript alternatives
- Avoid layout shifts by defining explicit dimensions for images and dynamic content
