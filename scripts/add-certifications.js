import { readFileSync, writeFileSync } from 'node:fs'

const BEACHES_PATH = './data/beaches.json'

// Blue Flag beaches 2025
// Source: https://www.banderaazul.org + https://www.banderaazulplayas.com/banderas-azules-murcia/
// Total: 29 beaches in Murcia
const BLUE_FLAG_CODES = [
  // Águilas (7)
  '679', // Playa de Calarreona
  '613', // Playa de La Casica Verde
  '612', // Playa de La Colonia
  '660', // Playa Las Delicias
  '693', // Playa de Levante (Águilas)
  '598', // Playa del Matalentisco
  '596', // Playa de Poniente (Águilas)

  // Cartagena (8)
  '512', // Cala Cortina
  '606', // Playa El Portús
  '580', // Playa de La Chapineta
  '657', // Playa Isla Plana
  '525', // Playa de Levante (Cabo de Palos)
  '685', // Playa San Ginés
  '590', // Playa de Calblanque
  '556', // Cala del Barco

  // Lorca (1)
  '663', // Cala de Calnegre

  // Mazarrón (6)
  '662', // Playa de Bahía
  '651', // Playa de El Alamillo
  '654', // Playa de El Mojón
  '675', // Playa de El Castellar (Grande-Castellar)
  '683', // Playa de Nares
  '581', // Playa de El Rihuete

  // San Javier (3)
  '562', // Playa Ensenada del Esparto
  '672', // Playa Pedrucho
  '561', // Playa El Arenal

  // San Pedro del Pinatar (3)
  '666', // Playa El Mojón
  '665', // Playa de La Llana (Playa de Las Salinas)
  '546', // Playa de La Torre Derribada

  // Cartagena-San Javier (1)
  '671', // Playa Banco del Tabal
]

// Q de Calidad Turística beaches 2024
// Source: https://www.calidadturisticahoy.es + https://www.cartagena.es
// Total: ~40 beaches in Murcia
const Q_QUALITY_CODES = [
  // Cartagena (12)
  '685', // Playa San Ginés (La Azohía)
  '512', // Cala Cortina
  '530', // Playa de Islas Menores
  '676', // Playa de Mar de Cristal
  '688', // Playa Honda
  '529', // Playa Paraiso
  '525', // Playa de Levante (Cabo de Palos)
  '607', // Playa de La Gola
  '687', // Playa Cavanna
  '577', // Cala del Pino
  '591', // Playa Galúa
  '686', // Playa del Barco Perdido (Entremares)

  // Mazarrón (6)
  '581', // Playa de El Rihuete
  '662', // Playa de Bahía
  '675', // Playa de El Castellar
  '646', // Playa de Bolnuevo
  '648', // Playa de La Reya (Junta de los Mares)
  '683', // Playa de Nares

  // Águilas (6) - Confirmed beaches
  '660', // Playa Las Delicias
  '596', // Playa de Poniente
  '693', // Playa de Levante
  '679', // Playa de Calarreona
  '612', // Playa de La Colonia
  '598', // Playa del Matalentisco

  // Los Alcázares (6)
  '692', // Playa Carrión
  '690', // Playa del Espejo
  '533', // Playa de La Concha
  '534', // Playa de Las Palmeras
  '661', // Playa de Los Narejos
  '691', // Playa Manzanares

  // San Javier (5)
  '604', // Playa El Castillico
  '696', // Playa Mistral
  '674', // Playa El Pedruchillo
  '668', // Playa de Colón
  '667', // Playa Barnuevo

  // San Pedro del Pinatar (2)
  '681', // Playa de Villananitos
  '664', // Playa de La Puntica
]

// Ecoplayas (ATEGRUS certification)
// Source: https://www.mazarron.es
// Only Mazarrón has this certification in the region
const ECOPLAYAS_CODES = [
  '581', // Playa de El Rihuete
  '675', // Playa de El Castellar
  '646', // Playa de Bolnuevo
]

function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))

  let blueFlagCount = 0
  let qQualityCount = 0
  let ecoplayasCount = 0

  beaches.forEach((beach) => {
    const certifications = []

    if (BLUE_FLAG_CODES.includes(beach.code)) {
      certifications.push('blue-flag')
      blueFlagCount++
    }

    if (Q_QUALITY_CODES.includes(beach.code)) {
      certifications.push('q-quality')
      qQualityCount++
    }

    if (ECOPLAYAS_CODES.includes(beach.code)) {
      certifications.push('ecoplayas')
      ecoplayasCount++
    }

    beach.certifications = certifications

    // Remove deprecated blueFlag property (now in certifications)
    delete beach.blueFlag
  })

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))

  console.log(`Updated ${beaches.length} beaches`)
  console.log(`\nCertification counts:`)
  console.log(`  Blue Flag: ${blueFlagCount}`)
  console.log(`  Q de Calidad: ${qQualityCount}`)
  console.log(`  Ecoplayas: ${ecoplayasCount}`)

  const certifiedBeaches = beaches.filter((b) => b.certifications.length > 0)
  console.log(`\nBeaches with certifications: ${certifiedBeaches.length}`)

  console.log('\n--- Blue Flag beaches ---')
  beaches
    .filter((b) => b.certifications.includes('blue-flag'))
    .forEach((b) => console.log(`  - ${b.name} (${b.code})`))

  console.log('\n--- Q de Calidad beaches ---')
  beaches
    .filter((b) => b.certifications.includes('q-quality'))
    .forEach((b) => console.log(`  - ${b.name} (${b.code})`))

  console.log('\n--- Ecoplayas beaches ---')
  beaches
    .filter((b) => b.certifications.includes('ecoplayas'))
    .forEach((b) => console.log(`  - ${b.name} (${b.code})`))
}

main()
