# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Spanish-speaking locals and domestic visitors, often on a phone, deciding which beach in the Región de Murcia to go to today or this weekend.

Second audience: AI agents and in-browser assistants that answer questions about these beaches for a person. They are a confirmed audience, not an accident of the implementation.

## Product Purpose

Playas de Murcia (www.playasmurcia.com) is a guide to every beach on the Murcia coast, Mediterranean and Mar Menor. It helps someone choose a beach by showing what it is like, what it offers and what conditions are right now.

It is a personal, non-commercial, ad-free project. Success means organic traffic and being the trusted reference for beaches in the Región de Murcia.

## Positioning

The site joins official sources for one beach in one place: live 112 flag and sea state, AEMET forecasts, EU bathing-water class, Blue Flag and other certifications, and lifeguard data.

It does this for the whole regional coast in one comparable directory, including small coves that larger sites skip, and it serves the same facts to agents as structured, readable data.

## Operating Context

- The typical decision happens close to leaving, so live conditions matter more than general description.
- Organic traffic is the success measure, so beach, municipality and collection pages must each work as an entry point.
- Beach detail, the explorer (`/explorar`), municipalities (`/municipios`) and collections (`/colecciones`) are the main paths. Sea-based browsing lives in `/colecciones/mar-mediterraneo` and `/colecciones/mar-menor`.
- Beach data is edited in `data/*.json` and migrated to Turso. Certifications, lifeguard data and water quality refresh annually or seasonally through scripts in `scripts/`.

## Capabilities and Constraints

- Directory of 193 beaches across 8 municipalities: Cartagena, Lorca, Águilas, Mazarrón, San Javier, Los Alcázares, San Pedro del Pinatar and La Unión.
- Beach facts: sand, waves, access difficulty, services, activities, certifications, shore bearing, occupancy, map and nearby beaches.
- Weather comes from AEMET where a beach has an `aemetId`, with Open-Meteo for coordinates elsewhere.
- Agents can use WebMCP tools (Chrome origin trial, token expires 2027-03-30) and request any page as markdown with `Accept: text/markdown`.
- Crawl policy: `ai-train=no`, `search=yes`, `ai-input=yes`. Agents may use the content to answer; training on it is declined.
- The site is Spanish only. EN/FR/DE `translations` exist in the data but are older machine output and are not shown.
- Runtime is Cloudflare Workers (workerd), so no Node built-ins and no `file:` database URLs.
- Terminology: playa, municipio, zona, colección, Mar Menor, Costa Cálida. Keep public URLs and UI copy in Spanish with correct diacritics.
- The Mares and Comparar sections were removed on purpose. Do not recreate them.

## Brand Commitments

- Name: Playas de Murcia. Domain: www.playasmurcia.com.
- Logos: `public/logo192.png`, `public/logo512.png`, `public/favicon.ico`.
- No ads or sponsored placement today.

## Evidence on Hand

- `data/beaches.json`: 193 beaches, all with hand-edited Spanish `description` and `access` copy.
- Photos: `public/pictures/`, mirrored to `img.playasmurcia.com`. 140 of 193 beaches have pictures; 53 have none (TSK-142). The provenance of the El Rincón hero is unverified (TSK-162).
- Official data coverage is partial: 64 of 193 beaches have an `aemetId` and 106 of 193 have an official `waterQuality` class.
- No testimonials, user reviews, press, traffic figures or partner endorsements exist in the repository. Do not fabricate them.

## Product Principles

1. **Serve today's decision first.** When two things compete for attention, the one that helps someone choose a beach now wins.
2. **Source or silence.** Show official data with its origin and show nothing when it is missing. Never estimate or imply a value that does not exist.
3. **Every beach counts.** A small cove with no photo and partial data still gets a complete, useful page. Coverage is the point, so sparse records must not read as broken.
4. **Trust is the product.** With no commercial goal, accuracy and independence outrank engagement. Nothing on the site should be there to serve anyone but the reader.
5. **Agents read the same truth.** Any fact a person can see stays reachable by agents through structured data, without a separate or weaker version.

## Accessibility & Inclusion

- Text meets a 4.5:1 contrast floor, including text over photos and secondary captions (`docs/ui-guidelines.md`).
- All animation respects `prefers-reduced-motion`.
- Pages must work well on phones, since that is a common decision scene.
- `aria-*` labels and all other Spanish copy keep correct orthography and diacritics.
