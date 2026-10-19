---
id: RPT-046
title: Beach data audit: unresolved findings (Oct 2026)
type: finding
severity: medium
status: triaged
created: 2026-10-18
triaged: 2026-10-19
task-id: TSK-124
---

## Summary

Audit of `data/beaches.json` on 2026-10-18 against official sources. Verified errors were fixed in the same session. The findings below are left open because they need a decision, a regeneration script, or a source that could not be found.

## Details

Fixed in the session (not part of this report):

- 2026 Blue Flags, from the CARM announcement. Added 614, 589, 625, 582, plus 592 and 648 as halves of the joint awards. The `scripts/add-certifications.js` list is updated.
- 7 wrong `aemetId` values copied by name match from beaches 48–82 km away (592, 525, 564, 666, 597, 570 reassigned to the nearest AEMET point; 585 removed).
- 5253 Gollerón still had San Javier contact fields after its move to Cartagena.
- Lorca/Águilas phone whitespace, and 567 had a wrong digit (`37 37` instead of `37 07`).

Open findings:

1. **Duplicate beach**: 627 and 515 "Playa Larga" (Cartagena, Calblanque) have identical coordinates. Deleting one changes public URLs.
2. **Possible duplicate**: 633 Playa Parazuelos (Mazarrón) and 6703 Playa Parazuelos (Lorca) are ~1.3 km apart and share an AEMET point. They may be two halves of one beach split by the municipal border.
3. ~~Generated `access` errors~~ **Resolved 2026-10-18**: 674 Playa El Pedruchillo now says "Gran Vía de La Manga" instead of "carretera que va a Águilas". 664 Playa de La Puntica was a false positive: AP-7 exit 777 does serve San Pedro del Pinatar.
4. ~~Generated texts claim Blue Flag on uncertified beaches~~ **Resolved 2026-10-18**: only 608 Percheles and 650 Puerto de Mazarrón made the false claim. Their description, metaDescription, EN/FR/DE translations and keywords are fixed. The other ten beaches say they have no Blue Flag, which is correct. While fixing this, templated `seoKeywords` (for example "kayak en {municipality}") were found to name the wrong municipality on 77 beaches: Mazarrón beaches said Lorca, Águilas beaches said Mazarrón, and four San Javier beaches said San Pedro del Pinatar. They now use each beach's own municipality. The 2026 Blue Flag beaches also gained the "playas bandera azul {municipality}" keyword.
5. **Unverifiable lists**: the Q de Calidad list is from 2024 (no 2026 ICTE list found). Dog-friendly status could not be verified for 2026.
6. **Name typos**, left alone because names may feed slugs: 689 "Playa  Lomas del Castillico" (double space), 678 "Cala Mijo. (Cueva de las Palomas)" (stray period), 529 "Playa Paraiso" (should be Paraíso).
7. 561 Playa El Arenal coordinates are 2.4 km from AEMET's El Arenal point. It is unclear which one is wrong.
8. 585 Playa de Las Salinas (Los Alcázares) now has no `aemetId`. The nearest AEMET point (Punta Calera, 2.4 km) is over the dataset's 2.37 km cutoff, so the weather widget falls back to coordinates.

## Where found

`data/beaches.json`, `scripts/add-certifications.js`

## Evidence

- Blue Flag 2026: https://www.carm.es/web/pagina?IDCONTENIDO=124952&IDTIPO=10&RASTRO=c176%24s3%24m
- AEMET beach codes: https://www.aemet.es/documentos/es/eltiempo/prediccion/playas/Playas_codigos.csv
- Lorca beaches page lists 968 473 707: http://www.emergencias.lorca.es/playas-de-lorca.asp

## Impact

Duplicate pages and wrong generated copy mislead visitors and SEO. Certification claims in generated text contradict the badges shown on the page.
