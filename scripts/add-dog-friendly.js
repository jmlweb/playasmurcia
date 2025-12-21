import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'

// Official dog-friendly beaches in Murcia Region (verified 2025)
// Sources:
// - https://www.redcanina.es/playas-para-perros-en-murcia/
// - https://www.turismoregiondemurcia.es/es/playas_para_mascotas/
// - https://blog.patasbox.com/playas-oficiales-para-perros-en-murcia-listado-actualizado-2024/
const DOG_FRIENDLY_CODES = [
  '638',   // Playa Cobaticas (Mazarrón)
  '4894',  // Playa de las Moreras (Mazarrón)
  '4893',  // Playa El Gachero (Mazarrón)
  '528',   // Playa de Los Alemanes (La Manga/Cartagena)
  '585',   // Playa de Las Salinas (Los Alcázares)
  '684',   // Playa Los Nietos (Cartagena)
  '524',   // Playa La Calera (Isla Plana/Cartagena)
  '5907',  // Playa Larga (Lorca)
  '678',   // Cala Mijo (Águilas)
]

function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))

  beaches.forEach(beach => {
    beach.dogFriendly = DOG_FRIENDLY_CODES.includes(beach.code)
  })

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))

  const dogFriendlyBeaches = beaches.filter(b => b.dogFriendly)
  console.log(`Updated ${beaches.length} beaches`)
  console.log(`Dog-friendly beaches: ${dogFriendlyBeaches.length}`)
  console.log('\nDog-friendly beaches:')
  dogFriendlyBeaches.forEach(b => console.log(`  - ${b.name} (${b.code})`))
}

main()
