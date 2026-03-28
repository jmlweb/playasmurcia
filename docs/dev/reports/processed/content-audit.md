# Content quality snapshot

**Last reviewed:** 2026-03-28 (metrics below reflect audit run **2026-03-27** — re-check after bulk data changes).

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total beaches | 194 | 100% |
| Missing pictures | 79 | 41% |
| Missing `waves` | 119 | 61% |
| Missing `length` | 0 | 0% |
| Short descriptions (<100 chars) | 0 | 0% |
| Short access (<80 chars) | 0 | 0% |
| Generic access patterns | 4 | 2% |
| `metaDescription` > 160 chars | 32 | 16% |
| Duplicate `metaDescription` | 0 | 0% |

## 1. Beaches missing pictures (79)

Counts by municipality (no per-beach list — use DB or `data/beaches.json` to list `pictures: []`).

| Municipality | Missing |
|--------------|---------|
| Cartagena | 30 |
| Águilas | 17 |
| Mazarrón | 14 |
| Lorca | 11 |
| San Javier | 5 |
| San Pedro del Pinatar | 1 |
| Los Alcázares | 1 |

Tracked in backlog: [017-source-missing-beach-pictures.md](./backlog/017-source-missing-beach-pictures.md).

## 2. Beaches missing `waves` (119)

### Inference rules

| Condition | Proposed `waves` value |
|-----------|------------------------|
| Mar Menor (sea: 1) | Oleaje nulo o muy suave |
| Mediterranean cala (small, sheltered) | Oleaje suave |
| Mediterranean open beach, SE orientation | Oleaje moderado |
| Mediterranean open beach, E orientation | Oleaje moderado |
| Mediterranean exposed beach | Oleaje moderado a fuerte |

### By municipality

| Municipality | Missing | Sea |
|--------------|---------|-----|
| Cartagena | 53 | Mixed |
| Águilas | 31 | Mediterranean |
| San Javier | 17 | Mixed |
| San Pedro del Pinatar | 8 | Mixed |
| Los Alcázares | 6 | Mar Menor |
| Mazarrón | 3 | Mediterranean |
| La Unión | 1 | Mediterranean |

## 3. Beach `length`

**Status: Done** — all 194 beaches have `length` (OSM / estimation work completed 2026-03-27). Historical detail: [018-complete-missing-beach-lengths.md](./done/018-complete-missing-beach-lengths.md).

## 4. Descriptions

All descriptions exceed 100 characters. Two beaches share an expected duplicate opening (La Llana sections).

## 5. Access

All access texts exceed 80 characters; four use generic openers but remain specific in the body.

## 6. `metaDescription`

**32 beaches** exceed 160 characters — trim in `data/beaches.json` while preserving meaning (mostly Cartagena, Águilas, Lorca, Mazarrón, San Pedro del Pinatar, San Javier, La Unión). Re-run `scripts/validate-beaches.js` after edits.

## 7. Action plan (status)

| Item | Status |
|------|--------|
| Picture sourcing for beaches without photos | **Open** — see task 017 |
| `waves` enrichment (119 beaches) | **Open** — apply §2 rules |
| `metaDescription` trimming (32 beaches) | **Open** |
| `length` | **Done** |
| Descriptions / access quality | **Done** (ongoing spot checks) |
