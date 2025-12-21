import { readFileSync, writeFileSync } from 'node:fs'

const BEACHES_PATH = './data/beaches.json'

// Beaches with lifeguard service (COPLA system)
// Source: https://www.112rmurcia.es/copla/copla.xml (December 2025)
const COPLA_BEACHES = [
  'BAHIA',
  'BANCO DEL TABAL',
  'BARCO PERDIDO',
  'BARNUEVO',
  'BARRACA QUEMADA',
  'BOLNUEVO',
  'CALA CORTINA',
  'CALA DEL BARCO',
  'CALA DEL PINO',
  'CALA REONA',
  'CALABARDINA',
  'CALARREONA',
  'CALBLANQUE',
  'CARRION',
  'CASICA VERDE',
  'CASTELLAR',
  'CASTILLICOS',
  'CAVANNA',
  'COLON',
  'EL ALAMILLO',
  'EL ARENAL',
  'EL CORRAL',
  'EL ESPEJO',
  'EL LASTRE',
  'EL MOJON',
  'EL PORTUS',
  'EL PUERTO',
  'ENSENADA DEL ESPARTO',
  'ENTREMARES',
  'ESTACIO',
  'GALUA',
  'HORNILLO',
  'ISLA PLANA',
  'ISLAS MENORES',
  'LA AZOHIA',
  'LA BAHIA',
  'LA CABAÑA',
  'LA CAROLINA',
  'LA COLONIA',
  'LA CONCHA',
  'LA GOLA',
  'LA HIGUERICA',
  'LA ISLA',
  'LA MOTA',
  'LA PAVA',
  'LA PUNTICA',
  'LA REYA',
  'LAS DELICIAS',
  'LAS PALMERAS',
  'LAS SALINAS',
  'LEBECHE',
  'LEVANTE',
  'LOS NAREJOS',
  'LOS NIETOS',
  'LOS URRUTIAS',
  'MANZANARES',
  'MAR DE CRISTAL',
  'MATALENTISCO',
  'MISTRAL',
  'MONTE BLANCO',
  'MORERAS',
  'NARES',
  'PARAZUELOS',
  'PEDRUCHILLO',
  'PEDRUCHO',
  'PERCHELES',
  'CALNEGRE',
  'PLAYA HONDA',
  'PLAYA PARAISO',
  'PONIENTE',
  'PUERTO',
  'RIHUETE',
  'PUERTO BELLO',
  'PUNTA BRAVA',
  'PUNTA DE ALGAS',
  'PUNTAS DE CALNEGRE',
  'SAN GINES',
  'SILLAS DE RIHUETE',
  'SIRENAS',
  'TORRE DERRIBADA',
  'VENEZIOLA',
  'VILLANANITOS',
  'VILLAS CARAVANING',
  'CABO DE PALOS',
]

const STOP_WORDS = ['PLAYA', 'CALA', 'DE', 'LA', 'EL', 'LAS', 'LOS', 'DEL', 'Y']

function normalize(name) {
  return name
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9\s]/g, '')
    .trim()
}

function getKeyWords(name) {
  return normalize(name)
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.includes(word))
}

function hasLifeguard(beachName) {
  const beachKeywords = getKeyWords(beachName)

  return COPLA_BEACHES.some(copla => {
    const coplaKeywords = getKeyWords(copla)

    // Must have at least one significant keyword match
    return coplaKeywords.some(coplaWord =>
      beachKeywords.some(beachWord =>
        // Exact match or one contains the other (for partial names)
        beachWord === coplaWord ||
        (beachWord.length >= 5 && coplaWord.length >= 5 &&
          (beachWord.includes(coplaWord) || coplaWord.includes(beachWord)))
      )
    )
  })
}

function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))

  let withLifeguard = 0
  let withoutLifeguard = 0

  beaches.forEach(beach => {
    beach.lifeguard = hasLifeguard(beach.name)
    if (beach.lifeguard) {
      withLifeguard++
    } else {
      withoutLifeguard++
    }
  })

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))

  console.log(`Total beaches: ${beaches.length}`)
  console.log(`With lifeguard: ${withLifeguard}`)
  console.log(`Without lifeguard: ${withoutLifeguard}`)

  console.log('\nBeaches WITH lifeguard:')
  beaches
    .filter(b => b.lifeguard)
    .forEach(b => console.log(`  ✓ ${b.name}`))

  console.log('\nBeaches WITHOUT lifeguard:')
  beaches
    .filter(b => !b.lifeguard)
    .forEach(b => console.log(`  ✗ ${b.name}`))
}

main()
