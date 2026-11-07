---
name: Playas de Murcia
description: A calm, sourced coastal reference for choosing a beach in the Región de Murcia.
colors:
  harbour-teal: '#14637e'
  channel-teal: '#1a7d9e'
  duotone-teal: '#2e9aba'
  deep-channel: '#104f65'
  night-water: '#082935'
  abyss: '#041a23'
  chart-night: '#0a1927'
  sounding-blue: '#a3d5e8'
  shallow-water: '#f0f7fa'
  buoy-coral: '#f0806e'
  lantern-coral: '#f6a395'
  dry-sand: '#fefcf8'
  wet-sand: '#fdf6eb'
  chart-white: '#ffffff'
  ink: '#101828'
  storm-ink: '#364153'
  slate-ink: '#4a5565'
  fog: '#6a7282'
  hairline: '#e5e7eb'
  flag-green: '#00bc7d'
  flag-yellow: '#fdc700'
  flag-red: '#fb2c36'
  flag-closed: '#8b0836'
typography:
  display:
    fontFamily: 'DM Serif Display, Georgia, Times New Roman, serif'
    fontSize: '3.75rem'
    fontWeight: 400
    lineHeight: 1
    letterSpacing: '-0.025em'
  headline:
    fontFamily: 'DM Serif Display, Georgia, Times New Roman, serif'
    fontSize: '2.25rem'
    fontWeight: 400
    lineHeight: 1.11
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.56
  body:
    fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: '0.2em'
rounded:
  sm: '4px'
  lg: '8px'
  xl: '12px'
  2xl: '16px'
  full: '9999px'
spacing:
  xs: '6px'
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '24px'
  2xl: '48px'
  section: '64px'
  section-lg: '80px'
components:
  button-primary:
    backgroundColor: '{colors.harbour-teal}'
    textColor: '{colors.chart-white}'
    typography: '{typography.caption}'
    rounded: '{rounded.full}'
    padding: '10px 20px'
  button-primary-hover:
    backgroundColor: '{colors.deep-channel}'
  button-hero:
    backgroundColor: '{colors.channel-teal}'
    textColor: '{colors.chart-white}'
    typography: '{typography.body}'
    rounded: '{rounded.full}'
    padding: '14px 32px'
  button-hero-hover:
    backgroundColor: '{colors.duotone-teal}'
  chip:
    backgroundColor: '{colors.chart-white}'
    textColor: '{colors.storm-ink}'
    typography: '{typography.caption}'
    rounded: '{rounded.full}'
    padding: '6px 12px'
  chip-selected:
    backgroundColor: '{colors.harbour-teal}'
    textColor: '{colors.chart-white}'
    rounded: '{rounded.full}'
    padding: '6px 12px'
  beach-card:
    backgroundColor: '{colors.chart-white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.2xl}'
    padding: '24px'
  input-search:
    backgroundColor: '{colors.chart-white}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.full}'
    padding: '14px 44px 14px 48px'
  nav-bar:
    backgroundColor: '{colors.chart-night}'
    textColor: '{colors.sounding-blue}'
    typography: '{typography.caption}'
  footer:
    backgroundColor: '{colors.night-water}'
    textColor: '{colors.sounding-blue}'
---

# Design System: Playas de Murcia

## Overview

**Creative North Star: "The Harbour Pilot Book"**

A pilot book is what a sailor trusts before entering a harbour: calm, exact, written from observation. Playas de Murcia works the same way. The mood is calm, sunlit and reliable. Photographs carry the warmth of the coast, and the interface stays quiet around them so that facts read as facts.

The system pairs one serif voice, used for page and section headings, with a plain sans for everything a person needs to scan. Deep teal frames the page at the top and bottom, warm sand holds the content, and the beach photo is the only saturated thing in view. Density is moderate: generous around sections, tight and tabular inside data.

This is a reference, not a brochure. It rejects tourism-board gloss with slogans over stock sunsets, the ad-shaped urgency of booking and listing portals, and the dated template of a blurred glass panel centered over a hero photo.

**Key Characteristics:**

- Deep teal chrome around warm sand content.
- Real photographs as the main source of color.
- One serif for headings, one sans for all data.
- Flat by default, with lift reserved for what is clickable.
- Rounded, pebble-smooth controls that change color rather than move.

## Colors

A cool teal scale taken from deep water, a warm sand neutral, and one small coral note.

### Primary

- **Harbour Teal** (`ocean-600`): Links, selected filters, standard buttons and the overline text.
- **Channel Teal** (`ocean-500`): The large call to action in heroes and the filled steps of neutral meters.
- **Duotone Teal** (`ocean-400`): The multiply layer in duotone heroes and the hover of the hero button.
- **Deep Channel** (`ocean-700`): Hover state of Harbour Teal surfaces and the top of the no-photo gradient.
- **Night Water** (`ocean-900`): Footer, hero base color and the bottom of the no-photo gradient.
- **Abyss** (`ocean-950`): Hero scrims over photographs.
- **Chart Night** (`nav`): The navigation bar. The source value is a `color-mix` in oklab of `ocean-950` and `slate-900`.
- **Sounding Blue** (`ocean-200`): Resting text on dark chrome and `::selection` background.
- **Shallow Water** (`ocean-50`): Tinted panels and hover fill on bordered pill links.

### Secondary

- **Buoy Coral** (`coral-400`): The short overline bar before section labels. Nothing larger.
- **Lantern Coral** (`coral-300`): Tracked eyebrows on solid dark surfaces only. It does not clear 4.5:1 over photographs: measured at 375px it dropped to 2.2:1 on the duotone hero and 1.6:1 on a true-color photo. Eyebrows over photographs are white over a scrim that reaches them.

### Neutral

- **Dry Sand** (`sand-50`): Default page background.
- **Wet Sand** (`sand-100`): Alternate section background and warm chips.
- **Chart White** (`white`): Card and control surfaces.
- **Ink** (`gray-900`): Headings and high-emphasis text.
- **Storm Ink** (`gray-700`): Chip and control text on white.
- **Slate Ink** (`gray-600`): Secondary text and metadata, the floor at 13px.
- **Fog** (`gray-500`): Captions at 14px and above.
- **Hairline** (`gray-200`): 1px dividers and chip borders.

### Signal

- **Flag Green, Flag Yellow, Flag Red, Flag Closed** (`emerald-500`, `yellow-400`, `red-500`, `rose-900`): Live 112 flag dots only. They always sit next to a text label.
- Advisories use a light amber panel (`amber-50` with `amber-300` border and `amber-900` text).

### Named Rules

**The Signal Is Not a Fact Rule.** Red and traffic-light hues mark danger, closures and live flags only. Neutral attributes such as occupancy, access level or child suitability use neutral text or a teal meter.

**The Single Buoy Rule.** Coral is a marker, not a surface. It never fills a button, card or section.

**The Coastal Hues Rule.** Thematic variation stays inside `ocean`, `sand`, `coral`, `teal`, `cyan`, `sky` and `amber`. Purple, pink, indigo and other unrelated hues do not enter.

## Typography

**Display Font:** DM Serif Display (with Georgia, Times New Roman)
**Body Font:** Inter (with SF Pro Display and the system sans stack)

**Character:** A high-contrast serif gives each page the voice of a printed guide, and a neutral grotesque keeps all data legible at small sizes.

### Hierarchy

- **Display** (400, 2.25rem mobile to 3.75rem at `lg`, line-height 1): The homepage `h1` only. Index pages stop at 3rem and detail pages at 2.25rem to 3rem.
- **Headline** (400, 1.875rem to 2.25rem): Section `h2`.
- **Title** (600, 1.125rem): All card titles and sidebar sub-headings set in Inter.
- **Body** (400, 1rem to 1.125rem, line-height 1.5): Descriptions and practical notes.
- **Caption** (400 to 500, 0.875rem): Metadata, filters and buttons.
- **Label** (600, 0.75rem to 0.875rem, 0.05em to 0.2em tracking, uppercase): Eyebrows and field labels.

### Named Rules

**The One Weight Rule.** DM Serif Display ships Regular 400 only. Never apply a bold or semibold utility to it, because the browser synthesizes the weight.

**The Stable Object Rule.** The same object keeps the same typeface everywhere. Serif stops at `h1` and `h2`, and a card title is always Inter. The Coast Today heading is the single exception.

## Layout

Content sits in a centered container of 1280px (`max-w-7xl`) with side padding of 16px, 24px and 32px as width grows. Backgrounds run full-bleed while content stays inside. Sections stack on a 64px to 80px vertical rhythm, and static blocks inside a page use a 48px rhythm separated by hairlines.

Card grids run three columns on desktop, two on tablet and one on mobile. The homepage municipality list runs four columns from `lg`, and on phones each card becomes a compact row, so eight cards do not fill several screens. The beach detail page uses a two-thirds main column plus a sticky side rail for today's decision: the directions button, any lifeguard warning, the forecast and the 112 flag. On phones the rail comes first, directly under the hero. The main column runs description, practical facts, gallery, services, activities, access, map and contact. The explorer uses a sticky filter sidebar at desktop widths and a slide-in filter panel on mobile. Layouts are mobile-first and checked at 375px, 768px and 1280px.

Heroes come in four height tiers: homepage `min(52svh, 640px)` on phones and `min(72svh, 640px)` from `sm` up, beach detail `min(38svh, 300px)` on phones and `min(60svh, 560px)` from `sm` up, photo listing 320px on phones and 420px from `sm` up, and compact gradient for pages and beaches with no photo. Text anchors bottom-left inside the container. The first content after any hero starts 32px below it, 48px from `sm` up, on every route. The homepage Coast Today strip is the one exception: it sits 16px below, 24px from `sm` up, because it must clear the fold.

### Named Rules

**The True Color Rule.** A specific beach appears in real color. Duotone treatment belongs to index and listing heroes, which speak for a place rather than one beach.

**The No Panel Rule.** Hero text sits on the photo with a bottom scrim. No centered glass or blurred box goes behind it.

## Elevation & Depth

Depth means interactivity. The page is flat tonal layering of sand, white and teal, and a shadow appears only where something can be pressed or opened. Clickable cards rest on a soft shadow with a faint ring, and lift further on hover. Dark popovers and the hero search bar use stronger shadows because they float above photographs.

### Shadow Vocabulary

- **Resting card** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): Clickable cards, with a 1px `gray-200` ring at 60% alpha.
- **Raised card** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): Card hover, hero buttons and the hero search bar.
- **Floating panel** (`box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)`): The navigation popover.

### Named Rules

**The Lift Means Clickable Rule.** If nothing happens when you press it, it does not get a shadow. Static content sits unboxed between hairlines. The beach side-rail panels are flat Shallow Water, with no shadow, border or gradient.

## Shapes

Forms are smooth and water-worn. Interactive controls are full pills, containers use a 16px curve, and inner data tiles step down to 12px. Small 4px corners exist only for focus outlines and inline links. Photos clip to their container, and galleries use the same 16px curve.

Hairlines stay at 1px. Dashed borders are reserved for empty states.

## Components

The whole set is smooth as beach pebbles: rounded, tactile and quiet, changing color rather than moving.

### Buttons

- **Shape:** Full pill.
- **Primary:** Harbour Teal with white text at 14px semibold, used on light pages.
- **Hero:** Channel Teal with white text at 16px semibold and a raised shadow, used on dark heroes.
- **Hover / Focus:** Color shift in 150ms with no transform. Focus uses a 2px ring in `ocean-500` with 2px offset. Hero variants use a matching ring offset against dark.
- **Secondary:** Transparent on dark heroes with a `white/30` border. On the homepage hero at phone width it drops to an underlined text link beside the primary button, so the hero stays short. On light pages, a bordered pill with `ocean-200` border and Harbour Teal text that fills with Shallow Water on hover, used for back links.

### Chips

- **Filter chip:** White with a Hairline border and Storm Ink text. It selects to solid Harbour Teal with white text. Used in `ChipFilterBar`.
- **Segmented control:** One outlined pill split by hairlines, used for Acceso and Ocupación.
- **Filter row:** Full-width row split by hairlines, with the label left and a tabular Slate Ink count right that appears on hover or keyboard focus, and stays visible on touch screens, where hover does not exist. It selects to Harbour Teal text with a check on a Shallow Water fill. Used for unordered options in the explorer.
- **Photo pill:** `white/95` with Ink text at 12px, maximum two per card and never wrapping.
- **Body tag:** 12px outline chip with a Hairline border.

### Cards / Containers

- **Corner Style:** 16px.
- **Background:** Chart White.
- **Shadow Strategy:** Resting card, raised on hover. Used for clickable items only.
- **Border:** Ring of `gray-200` at 60% alpha, shifting to `ocean-200` on hover.
- **Internal Padding:** 24px under a 3:2 photo.
- **Hover:** Shadow and ring over 500ms, photo scale to 1.05 under `motion-safe`, title shifts to Harbour Teal.
- **No photo:** An intentional Deep Channel to Night Water gradient with a quiet icon, never a gray box.
- **Homepage lead card:** Text on the photo over a scrim that belongs to the text block, so it reaches the white label at any card height and leaves the rest of the photo clear, with the same weather and flag pills as a Beach Card along the top and the same length and sand fact line. The "Imprescindible" label disappears on a red flag or closure.

### Inputs / Fields

- **Style:** Search is a white pill with a `white/30` border and raised shadow, built to sit on heroes, with a 20px leading icon.
- **Focus:** Shadow grows, plus the standard visible ring.
- **Sort select:** Compact white pill with a Hairline border, opening a single-choice listbox.
- **Clear search:** A 44px wide custom button. The native search cancel button is hidden so only one shows.

### Navigation

- **Bar:** Sticky Chart Night bar with a `white/10` bottom border, slightly translucent from `sm` up.
- **Links:** Hoy, Todas las playas, Municipios and Colecciones, in that order. 14px medium in Sounding Blue, white on hover and focus. Hoy leads to the homepage coast strip and carries no live data itself.
- **Colecciones popover:** Night-blue panel (`ocean-800`) with 12px corners, a Floating panel shadow and a single list with count pills, closing on a link to `/colecciones`. It scrolls within the viewport on short screens.
- **Mobile:** A hamburger opens a panel under the bar with the same four items in 44px rows. Colecciones is a collapsible group, open by default inside its section. It scrolls on its own, locks the page behind it and closes on navigation or Esc.
- **Footer:** A Night Water colophon. The brand with its wave mark and a line of counts derived from the data, and a link to all beaches, then Municipios (de norte a sur) and Colecciones destacadas as tabular rows with count pills and Lantern Coral labels, each closing on its index link. On phones both groups collapse into exclusive native disclosures in 44px rows. It closes on a Fuentes list mapping each fact to its linked source, then, under its own hairline, the personal, ad-free line above the copyright, all at 14px.

### Beach Card Weather Pill

The signature data element. A solid `white/95` pill in the top-left of the photo, the same family and height as the flag pill, with no blur. It shows a monoline sky glyph and the temperature in semibold, then a wind glyph with speed and direction at 12px, all in tabular numerals. Glyphs are single-color Harbour Teal on `currentColor` (`WeatherGlyph`), not the multicolor forecast icons. The wind glyph drops when the occupancy pill shares the row, so both fit a 288px card. It brings recent conditions onto the photo without leaving the card.

### Coast Today

The homepage strip under the hero, headed "Hoy en la costa". Two link rows, Mar Menor first, side by side from `sm` up, unboxed on sand between hairlines. Each row carries the sea name and beach count in Title and Slate Ink, then temperature and wind as ranges in tabular numerals, then flag counts as dots beside text labels. A sources line closes the strip and states how many beaches reported a flag today. Room for flag lines is reserved only from June to September, when the 112 feed publishes them. The heading is the one `h2` set in Inter, at Label size, because a Headline would outrank the data. The sky glyph appears only when every reference point agrees. Only facts with data appear. If no source answers, the rows remain as links and the heading becomes "La costa por mares".

### Beach Conditions

White text on the beach hero scrim, under the location line: sky icon and temperature, wind, waves on the open sea, and the 112 flag in season, followed by a line naming the sources. No panel goes behind it. Only facts with data appear, and the line disappears when no source answers. Directions are spelled out, because a bare "NO" reads as a negation. Live waves read "Oleaje hoy" and the stored value reads "Oleaje habitual". The Mar Menor shows no wave data anywhere.

### Overline

A 24px Buoy Coral bar followed by a tracked, uppercase Harbour Teal label. It sits above section headings and is the system's one recurring ornament.

### Beach Hero

Full-color photo at the detail tier with an Abyss scrim from 85% at the base to 10% at the top, or to 55% on phones, where the shorter hero puts the breadcrumb and title high on the photo. Breadcrumb, serif title, locality and tags stack bottom-left. Without a photo, it falls back to the night-water gradient.

### Explorer Map

Clusters are solid Harbour Teal circles of 44px with a white ring and a tabular white count, never the library's traffic-light defaults, and each announces its beach count. On touch screens one finger keeps scrolling the page and two fingers move the map, with a one-line hint under it.

### Empty State

A dashed Hairline container with 16px corners, a large pale icon, a semibold title and a Fog description.

### Beach Facts

Información práctica sits in the main column, unboxed. "Antes de ir" holds what decides the trip and "La playa" holds what describes the place. Each fact is a Slate Ink label over a medium Ink value, under a hairline, in two columns on phones and three from `sm` up.

### Beach Forecast

A flat Shallow Water panel with today on top and the next six days in one row, hairlines instead of cells. Weekend day names are Harbour Teal, because "this weekend" is half of the decision. Out of season, one line under it says when the 112 publishes flags.

### Motion

Motion is slow and settled. Entrances use `cubic-bezier(0.16, 1, 0.3, 1)` over 600ms to 700ms, duotone heroes drift with a 20s zoom to 1.06, and CTA arrows nudge 4px on hover. Everything that moves is disabled under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:

- **Do** let photographs supply the color and keep surrounding UI in teal, sand and neutral.
- **Do** keep small secondary text at Slate Ink at 13px or Fog at 14px, so it clears 4.5:1.
- **Do** use `focus-visible` rings on every interactive element.
- **Do** show a no-photo beach with the intentional night-water gradient, so a sparse record looks considered.
- **Do** pin card CTAs with `mt-auto` so they align across a row.
- **Do** put SVG icons on `currentColor` at 20px or 24px for all functional UI.
- **Do** select cover photos with `pictureQualityScore` 3 for heroes, featured slots and collection or municipality covers. A beach's cover is `pictures[0]`, chosen by eye.
- **Do** use one card treatment per object type across the site.

### Don't:

- **Don't** make the site look like a tourism-board brochure, with slogans over stock sunsets.
- **Don't** borrow booking or listing portal patterns such as urgency cues or ad-shaped modules.
- **Don't** place a centered glass or `backdrop-blur` panel behind hero text.
- **Don't** add a shadow or card box to static content.
- **Don't** use `gray-400` for text a person needs to read. It is 2.6:1 on white.
- **Don't** use link colors on non-link text.
- **Don't** use traffic-light colors for neutral attributes.
- **Don't** use emoji as functional icons.
- **Don't** apply hover transforms to buttons.
- **Don't** reuse the same hero photo on an index and its detail pages.
