---
id: RPT-051
title: Content/data issues visible in UI (2026-10-19 review)
type: bug
severity: medium
status: triaged
created: 2026-10-18
triaged: 2026-10-18
task-id: TSK-123
---

## Summary

Content and data defects found during the 2026-10-19 production UI review. They affect what users read and click.

## Details

1. **Suspicious contact email on 7 Los Alcázares beaches**: `turismo@ayto.di3d.es` (Playa Carrión, La Concha, Las Palmeras, Las Salinas, Los Narejos, Del Espejo, Manzanares). The domain does not look like an official council domain. Users who click "mailto" may reach a wrong or dead mailbox. Verify the address against the Los Alcázares council website and correct it in `data/beaches.json`.
2. **Broken description copy for Playa de La Concha** (`data/beaches.json:8390`): "tiene 693 metros de arena gruesa frente al Mar Menor y socorrista." The phrase "frente al Mar Menor y socorrista" joins two unrelated facts. Rewrite it, for example: "tiene 693 metros de arena gruesa frente al Mar Menor y cuenta con socorrista." Audit other generated descriptions for the same "… y socorrista." pattern.
3. **Stray period in a beach name** (`data/beaches.json:3207`): "Cala Mijo. (Cueva de las Palomas)". The period leaks into the URL slug `/playas/cala-mijo.-(cueva-de-las-palomas)`. It should be "Cala Mijo (Cueva de las Palomas)". Changing the name changes the slug, so add a redirect from the old slug.
4. **Slugs keep parentheses** (`/playas/playa-del-barco-perdido-(playa-entremares)`). Parentheses in URLs are legal but ugly and often percent-encoded when shared. Strip `().` in slug generation and redirect the old slugs.

## Steps to Reproduce

1. Open https://www.playasmurcia.com/playas/playa-de-la-concha and read the description and the Contacto block.
2. Open the homepage and hover the "Cala Mijo. (Cueva de las Palomas)" card to see its URL.

## Expected vs Actual

- Expected: grammatical copy, official contact email, clean names and slugs.
- Actual: as listed in Details.

## Error messages/logs

None. These are content defects.
