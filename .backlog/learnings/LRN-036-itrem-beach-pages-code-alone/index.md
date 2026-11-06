---
id: LRN-036
title: ITREM beach pages: code alone selects the page, unknown codes answer 200 with the list page
status: active
tags: [data, external-source, itrem]
task: TSK-146
created: 2026-11-06
---

ITREM beach pages (`https://itrem.carm.es/es/playa/<slug>-<code>/`) ignore the slug: `/es/playa/x-657/` serves Playa Isla Plana. So a beach code is enough to fetch its page, no slug lookup needed.

A code without a page does not return 404. ITREM answers HTTP 200 with the generic beach list (`<title>Playas : ...`). Detect a real page by its `<h1 class="h2 fw-bold text-dark mb-2">` title, not by the status code. On 2026-11-06, 36 of our 193 codes had no page.

The pages are ISO-8859-1. Decode with `new TextDecoder('latin1')`, or every accented name is garbled. The locality line is `<p class="fw-semibold small mb-4">`. Its labels are uppercase and drop accents (`LO PAGAN`), and 21 of them name only the municipality. Curate them; never import them as display names.

The paginated index (`/es/playas/?buscar=si&...&pagina=N`, 24 per page) lists only codes that have a page. `scripts/assign-zones.ts --fetch` does the per-code fetch.
