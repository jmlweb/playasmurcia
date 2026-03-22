# UI Design Guidelines

## General Principles

- Clean, minimalist design prioritizing images and data over decoration
- Fresh, Mediterranean visual style inspired by Spanish coastal tourism websites
- Content-first approach: beach information and imagery are the primary focus
- Clear visual hierarchy through alternating section backgrounds and consistent spacing

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `blue-600` | Primary | CTAs, buttons, links, interactive elements |
| `blue-800` | Primary dark | Navigation bar, footer background |
| `white` | Background | Default page/card background |
| `gray-50` | Background alt | Alternating sections for visual separation |
| `gray-500` | Text light | Secondary text, captions |
| `gray-600` | Text medium | Body text |
| `gray-700` | Text dark | Subheadings, emphasized body |
| `gray-900` | Text darkest | Headings, high-emphasis text |

**Gradients and accents**:

- Blue gradient (`from-blue-800 to-blue-600`) for hero sections
- Solid blue (`blue-600`) for accent sections that need to stand out (e.g., activity grids)
- Dark blue/navy (`blue-900` / `blue-950`) for footer
- Avoid introducing new brand colors without clear justification

## Typography

**Font stack**: Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif

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

Alternate between white and light gray (`gray-50`) backgrounds to create visual separation between content sections. Use consistent vertical padding (`py-12` / `py-16`) for each section.

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

- Primary: solid blue (`bg-blue-600 text-white`) with rounded corners
- Outlined/secondary: white background with blue border or text
- Consistent padding (`px-6 py-3`) and rounded shape (`rounded-lg` or `rounded-full`)

### Tags and Badges

- Small rounded pills (`rounded-full`, `px-3 py-1`, `text-xs` / `text-sm`)
- Icon + label format when space allows
- Light background variants for neutral tags, blue for active/selected filters

### Icon Categories

- Icons displayed inside circles (light background or bordered)
- Label below the circle
- Used for beach types (Arena Fina, Familiar, Salvaje...) and activities (Natación, Snorkel, Kayak...)
- Keep icon style consistent (all outline or all filled, not mixed)

### Stats Bar

- Horizontal row of key metrics: icon + number + label
- Used to display aggregated data (total beaches, municipalities, certifications)
- Evenly spaced across the container width

### Search

- Prominent search bar in hero section
- Input with placeholder text + blue action button
- Optional filter tags below the search bar for quick filtering

## Accessibility

- Ensure sufficient contrast for text over images (overlay required)
- Support keyboard navigation on all interactive elements
- Use descriptive `alt` text on all images
- Maintain semantic heading structure (`h1` > `h2` > `h3`, no skipped levels)
- Use semantic HTML elements (`nav`, `main`, `section`, `article`) appropriately

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
