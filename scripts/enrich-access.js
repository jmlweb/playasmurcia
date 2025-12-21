import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'
const MUNICIPALITIES_PATH = './data/municipalities.json'
const SAVE_INTERVAL = 5
const MIN_ACCESS_LENGTH = 50

// Playas específicas de Gemini (sin access o con access pobre)
const GEMINI_ACCESS = {
  '571': 'Se accede principalmente por mar o mediante rutas de senderismo a través del espacio natural de la Sierra de la Muela, Cabo Tiñoso y Roldán. Es una cala de acceso difícil que no cuenta con zonas de aparcamiento en las inmediaciones.',
  '530': 'El acceso se realiza por la autovía A-7, tomando la salida 790 en dirección a Los Alcázares. La playa es plenamente accesible, dispone de un área de aparcamiento con más de 100 plazas y cuenta con conexión mediante las líneas de autobús 21 y 46.',
  '4894': 'Ubicada en Mazarrón, se encuentra situada entre la Avenida del Castellar y la Avenida de Bolnuevo. Es una playa de entorno urbano con un acceso muy sencillo y directo tanto a pie como en coche.',
  '585': 'El acceso principal se efectúa desde la autovía AP-7, tomando la salida indicada hacia Los Alcázares. La zona está bien comunicada por carretera y dispone de servicios regulares de autobús urbano.',
  '4893': 'Situada en el Puerto de Mazarrón, se accede a ella a través de la Avenida de El Alamillo y la calle Cabo Machichaco. Se localiza en la zona de la punta de El Rihuete y es fácilmente accesible desde el casco urbano.',
}

async function callOllama(prompt) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma3:4b',
      prompt,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`)
  }

  const data = await response.json()
  return data.response.trim()
}

function buildPrompt(beach, municipalityName) {
  const info = beach.accessInfo || {}

  // Construir datos conocidos desde accessInfo
  const knownFacts = []
  if (info.hasParking === true) knownFacts.push('dispone de parking')
  if (info.hasParking === false) knownFacts.push('no hay parking cercano')
  if (info.hasBusAccess === true) knownFacts.push('accesible en autobús')
  if (info.walkingRequired === true) knownFacts.push('requiere caminar')
  if (info.roadType === 'dirt') knownFacts.push('acceso por camino de tierra')
  if (info.roadType === 'path') knownFacts.push('acceso por sendero')
  if (info.difficultyLevel === 'difficult') knownFacts.push('acceso difícil')
  if (info.difficultyLevel === 'easy') knownFacts.push('acceso fácil')

  const factsText = knownFacts.length > 0
    ? `\nDatos conocidos: ${knownFacts.join(', ')}.`
    : ''

  return `Escribe una descripción de acceso para la playa "${beach.name}" en ${municipalityName}, Región de Murcia.

Información actual: "${beach.access || 'No disponible'}"${factsText}

Instrucciones:
- Escribe 2-3 frases descriptivas que integren toda la información disponible
- Menciona la ubicación general y cómo llegar
- Incluye información sobre parking, dificultad y tipo de acceso si la tienes
- NO inventes números de líneas de bus ni datos específicos que no tengas
- Usa un tono informativo y útil
- Responde SOLO con la descripción, sin explicaciones adicionales`
}

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))
  const municipalities = JSON.parse(readFileSync(MUNICIPALITIES_PATH, 'utf-8'))

  // Identificar playas que necesitan procesamiento
  const toEnrich = beaches.filter((beach) => {
    // Si tiene access de Gemini pendiente
    if (GEMINI_ACCESS[beach.code]) return true
    // Si tiene accessInfo que consolidar
    if (beach.accessInfo) return true
    // Si el access es muy corto
    if (!beach.access || beach.access.length < MIN_ACCESS_LENGTH) return true
    return false
  })

  const withGemini = toEnrich.filter((b) => GEMINI_ACCESS[b.code]).length
  const withAccessInfo = toEnrich.filter((b) => b.accessInfo && !GEMINI_ACCESS[b.code]).length
  const shortAccess = toEnrich.filter((b) => !GEMINI_ACCESS[b.code] && !b.accessInfo).length

  console.log(`Playas a procesar: ${toEnrich.length}`)
  console.log(`  - Con datos Gemini: ${withGemini}`)
  console.log(`  - Con accessInfo a consolidar: ${withAccessInfo}`)
  console.log(`  - Access corto sin accessInfo: ${shortAccess}`)
  console.log('')

  let processed = 0
  let errors = 0

  for (const beach of toEnrich) {
    const municipalityName = municipalities[beach.municipality]?.name || 'Murcia'

    try {
      let newAccess

      // Si tenemos datos de Gemini, usarlos directamente
      if (GEMINI_ACCESS[beach.code]) {
        newAccess = GEMINI_ACCESS[beach.code]
        console.log(`[Gemini] ${beach.name}`)
      } else {
        // Generar con Ollama
        const prompt = buildPrompt(beach, municipalityName)
        newAccess = await callOllama(prompt)
        console.log(`[Ollama] ${beach.name}`)
      }

      // Actualizar en el array original
      const index = beaches.findIndex((b) => b.code === beach.code)
      beaches[index].access = newAccess

      // Eliminar accessInfo (ya integrado en access)
      if (beaches[index].accessInfo) {
        delete beaches[index].accessInfo
      }

      processed++

      // Guardar progreso periódicamente
      if (processed % SAVE_INTERVAL === 0) {
        writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
        console.log(`  Guardado progreso: ${processed}/${toEnrich.length}`)
      }
    } catch (error) {
      console.error(`  Error en ${beach.name}: ${error.message}`)
      errors++
    }
  }

  // Guardar final
  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))

  console.log('')
  console.log('=== Completado ===')
  console.log(`Procesadas: ${processed}`)
  console.log(`Errores: ${errors}`)
  console.log(`Campo accessInfo eliminado de todas las playas procesadas`)
}

main().catch(console.error)
