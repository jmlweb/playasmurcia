# Content Audit Report

Generated: 2026-03-27

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

## 1. Beaches Missing Pictures (79)

### Cartagena (30)

- Cala Abierta
- Cala Arturo
- Cala Avellán
- Cala Botella
- Cala del Cuervo
- Cala del Reventón
- Cala El Bolete
- Cala Golera
- Cala Las Escalerillas
- Cala Magre
- Cala Medina
- Cala Mojarra
- Cala Pozo de la Avispa
- Cala Roja
- Playa Cabezo del Mojón
- Playa Cala Flores
- Playa Dársena Dos Mares
- Playa de La Parajola
- Playa de Los Alemanes
- Playa del Barco Perdido (Playa Las Sirenas)
- Playa del Vivero
- Playa Fatares
- Playa La Barra
- Playa La Caleta
- Playa La Galera
- Playa Larga
- Playa Las Amoladeras
- Playa Los Nietos
- Playa Parreño
- Playa Perla de Levante (Estrella de Mar)

### Águilas (17)

- Cala de La Herradura
- Cala de los Abejorros
- Playa de Calabarrilla
- Playa de La Cañada del Negro
- Playa de La Casica Verde
- Playa de La Cola
- Playa de la Rambla Elena
- Playa de Las Pulgas
- Playa del Barranco de La Mar
- Playa del Hoyo
- Playa del Matalentisco
- Playa del Pino
- Playa del Pocico del Animal
- Playa del Pozo de las Huertas
- Playa del Saladar
- Playa El Rafal
- Playa La Tortuga

### Mazarrón (14)

- Playa Cabezo de la Pelea
- Playa de Bahía
- Playa de El Palomarico
- Playa de El Rihuete (Playa del Rigüete)
- Playa de La Reya (Junta de los Mares)
- Playa de las Chapas
- Playa de las Minas
- Playa de las Moreras
- Playa de Percheles
- Playa del Ballenato
- Playa del Barranco Ancho
- Playa del Salar o Benzal
- Playa Hondón del Fondón (Playa del Jondo o del Fondo)
- Playa Parazuelos

### Lorca (11)

- Cala Blanca
- Cala de La Gruta
- Cala de San Pedro
- Cala del Ciscal
- Cala del Cuartel del Ciscar
- Cala Honda
- Cala Junquera
- Cala Leña
- Playa de los Hierros
- Playa Larga
- Playa Puntas de Calnegre

### San Javier (5)

- Esculls de La Llana y Encañizadas
- Playa de Gollerón (Cala del Turco)
- Playa de Poniente
- Playa La Isla
- Playa Lebeche

### San Pedro del Pinatar (1)

- Playa de La Llana (Playa Punta de Algas)

### Los Alcázares (1)

- Playa de Los Narejos

## 2. Beaches Missing `waves` (119)

### Inference rules for waves assignment

Based on geographical and oceanographic logic:

| Condition | Proposed `waves` value |
|-----------|----------------------|
| Mar Menor (sea: 1) | "Oleaje nulo o muy suave" |
| Mediterranean cala (small, sheltered) | "Oleaje suave" |
| Mediterranean open beach, SE orientation | "Oleaje moderado" |
| Mediterranean open beach, E orientation | "Oleaje moderado" |
| Mediterranean exposed beach | "Oleaje moderado a fuerte" |

### By municipality

| Municipality | Missing | Sea |
|-------------|---------|-----|
| Cartagena | 53 | Mixed (Mediterranean + Mar Menor) |
| Águilas | 31 | Mediterranean |
| San Javier | 17 | Mixed (Mediterranean + Mar Menor) |
| San Pedro del Pinatar | 8 | Mixed (Mediterranean + Mar Menor) |
| Los Alcázares | 6 | Mar Menor |
| Mazarrón | 3 | Mediterranean |
| La Unión | 1 | Mediterranean |

## 3. Beaches Missing `length` (0)

All 194 beaches now have length data. Completed via OSM Overpass API (3 beaches) and estimation from nearby beaches (27 beaches) on 2026-03-27.

## 4. Descriptions Quality

All 194 descriptions are >100 characters. No short or empty descriptions found.

Duplicate start patterns detected:
- 2 beaches start with "Playa de La Llana, también conocida como Playa de..." (expected — two sections of same beach system)

## 5. Access Quality

All 194 access texts are >80 characters. Only 4 use generic opening patterns but contain specific directions.

## 6. `metaDescription` Issues

### Over 160 characters (32 beaches — need trimming)

| Beach | Municipality | Length |
|-------|-------------|--------|
| Cala Arturo | Cartagena | 161 |
| Cala de Calnegre | Lorca | 166 |
| Cala de La Gruta | Lorca | 164 |
| Cala del Barco | Cartagena | 163 |
| Cala del Ciscal | Lorca | 164 |
| Cala Desnuda | Mazarrón | 164 |
| Cala El Bolete | Cartagena | 165 |
| Cala Salitrona | Cartagena | 170 |
| Playa Amarilla | Águilas | 170 |
| Playa Baño de las Mujeres | Lorca | 162 |
| Playa Cavanna | Cartagena | 166 |
| Playa de Bahía | Mazarrón | 165 |
| Playa de La Ermita | Mazarrón | 162 |
| Playa de la Galera | Águilas | 166 |
| Playa de La Llana (Playa de La Barraca Quemada) | San Pedro del Pinatar | 167 |
| Playa de La Llana (Playa de Las Salinas) | San Pedro del Pinatar | 162 |
| Playa de la Rambla Elena | Águilas | 162 |
| Playa de La Torre Derribada | San Pedro del Pinatar | 170 |
| Playa de Levante | Cartagena | 161 |
| Playa de Mar de Cristal | Cartagena | 169 |
| Playa de Poniente | Águilas | 163 |
| Playa de Portmán | La Unión | 161 |
| Playa del Barranco Ancho | Mazarrón | 162 |
| Playa del Hoyo | Águilas | 169 |
| Playa del Sombrerico | Águilas | 163 |
| Playa Isla Plana | Cartagena | 161 |
| Playa La Calera | Cartagena | 165 |
| Playa Lebeche | San Javier | 162 |
| Playa Mistral | San Javier | 166 |
| Playa Parazuelos | Lorca | 163 |
| Playa Parreño | Cartagena | 161 |
| Playa San Ginés | Cartagena | 168 |

## 7. Action Plan

1. **Waves enrichment** (119 beaches) — Apply inference rules from section 2
2. **metaDescription trimming** (32 beaches) — Trim to ≤160 chars preserving meaning
3. **Pictures** — Requires manual photo sourcing (not automatable)
4. **Length** — Requires manual measurement or OSM data (not automatable)
