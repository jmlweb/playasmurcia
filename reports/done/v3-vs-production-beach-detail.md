# Beach Detail Page: v3 vs Production Comparison

**Date**: 2026-03-28
**Production URL**: https://www.playasmurcia.com/playa/playa-casica-verde
**v3 route**: `src/routes/playas/$slug.tsx`

---

## Executive Summary

The v3 beach detail page has **downgraded two key sections** compared to production: the **interactive map** has been replaced by a static image, and the **meteorology widget** has been moved to the sidebar with reduced data (3 days instead of 7). Both changes reduce the information density and user experience of the page.

---

## 1. Map Section

### Production

- **Type**: Interactive map loaded dynamically via `Suspense` boundary (likely Leaflet or similar)
- **Height**: `min(360px, 60vh)` on mobile, `min(600px, 400px + 10vw)` on desktop — large and prominent
- **Width**: Full-width within the content area (`mx-4` / `md:mx-6` / `lg:mx-0`)
- **Background**: `bg-sky-200` while loading
- **Loading state**: Animated "Cargando mapa..." text with wiggle animation
- **Interactivity**: Pan, zoom, marker interaction — full map experience
- **Position**: Main content area, standalone section

### v3 (`src/components/location-map.tsx`)

- **Type**: Static image from `staticmap.openstreetmap.de`
- **Height**: `h-48` (192px) on mobile, `sm:h-64` (256px) on larger screens — significantly smaller
- **Width**: Constrained within the 2/3 main column
- **Interactivity**: Click-through link to Google Maps (opens in new tab)
- **Loading state**: None (native `<img>` lazy loading)
- **Fallback**: "Ver en Google Maps" text on image error
- **Position**: Main content column, below "Como llegar"

### Impact

| Aspect | Production | v3 |
|--------|------------|----|
| Map height (mobile) | ~360px | 192px |
| Map height (desktop) | ~600px | 256px |
| Interactive | Yes (pan/zoom) | No (static image) |
| User action needed to explore | None | Must leave site |
| Visual prominence | High | Medium |

### Recommendation

Restore the interactive map component. The static image approach loses the key benefit of letting users explore the beach location without leaving the site. Consider using Leaflet with `react-leaflet` or Mapbox GL JS with lazy loading via `Suspense` to maintain performance.

---

## 2. Meteorology / Weather Section

### Production

- **Position**: Main content area (full-width grid)
- **Layout**: Responsive grid — `xs:grid-cols-2`, `lg:grid-cols-3`, `xl:grid-cols-4`, `2xl:grid-cols-6`
- **Days shown**: Current conditions ("Ahora") + 6-day forecast = **7 entries total**
- **Card style**: Gradient background (`bg-gradient-to-b`), rounded cards with vertical layout
- **Data per card**:
  - Weather icon
  - Temperature (min/max)
  - Wind speed (km/h)
  - Wind direction with **rotated arrow** (CSS `transform: rotate(XXdeg)`)
- **Visibility**: All data visible at once — no tabs, no collapse

### v3 (`src/components/weather-widget.tsx`)

- **Position**: Sidebar (right column, ~1/3 width)
- **Layout**: Today card + grid of `grid-cols-2` for next days
- **Days shown**: Today + 2 next days = **3 entries total**
- **Card style**: Flat cards with `bg-gray-50/60` and subtle border
- **Data per card**:
  - Weather icon (custom SVG)
  - Temperature (max/min)
  - Wind (text only, today card only)
  - UV index badge (today card only)
- **Source label**: Shows "AEMET" or "Open-Meteo"

### Impact

| Aspect | Production | v3 |
|--------|------------|----|
| Forecast days | 7 (current + 6) | 3 (today + 2) |
| Position | Main content (prominent) | Sidebar (secondary) |
| Wind visualization | Rotated arrow icons | Text only |
| Grid columns | Up to 6 | Max 2 |
| Card visual style | Gradient, rich | Flat, minimal |
| UV Index | Not visible | Shown (improvement) |

### Recommendation

Move the weather section back to the main content area with the full 6-day forecast grid. The sidebar placement is too constrained for weather data — users planning a beach visit want to see multiple days at a glance. Keep the UV index badge from v3 as an improvement over production. Restore the rotated wind arrows for visual clarity.

---

## 3. Overall Page Layout Comparison

### Production structure

```
Header / Nav
Beach name + municipality + features/tags
Coordinates (link to Google Maps)
Weather forecast (full-width grid, 7 days)
Interactive map (full-width, 360-600px)
Footer
```

### v3 structure

```
Header / Nav
Breadcrumb
Beach name + municipality + tags
Photo gallery + certifications
[2-column layout]
  Main (2/3):
    Description
    Services grid
    Activities grid
    How to get there
    Static map image
    Nearby beaches carousel
  Sidebar (1/3):
    Weather widget (3 days)
    Beach status widget
    Practical info card
    Contact info
```

### What v3 adds (improvements)

- Photo gallery
- Certifications badges
- Services and activities grids
- "How to get there" section
- Nearby beaches carousel
- Beach status widget
- Practical info card (access difficulty, water quality, etc.)
- Contact info
- Structured breadcrumb navigation
- SEO: JSON-LD schema, meta descriptions, keywords

### What v3 loses (regressions)

- Interactive map → static image
- 7-day prominent weather forecast → 3-day sidebar widget
- Wind direction arrows → text-only wind info

---

## 4. Suggested Action Plan

1. **Restore interactive map** — Replace `LocationMap` static image with a lazy-loaded interactive map (Leaflet/Mapbox). Keep the Google Maps link as secondary action.
2. **Expand weather to main content** — Move `WeatherWidget` from sidebar to main content area. Show all available forecast days (up to 7). Add rotated wind arrows.
3. **Keep v3 improvements** — Photo gallery, services, activities, nearby beaches, practical info, and contact sections are all valuable additions that production lacks.

---

*Report generated by comparing production (https://www.playasmurcia.com/playa/playa-casica-verde) HTML output with v3 source code in `src/routes/playas/$slug.tsx` and related components.*
