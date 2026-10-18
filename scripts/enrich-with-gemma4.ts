/**
 * Enrich beach data using local Gemma 4 via Ollama.
 *
 * Two read-only passes:
 *   1. Audit existing `tags` and suggest missing ones
 *   2. Detect logical inconsistencies across fields
 *
 * It never writes `beaches.json`: `description` and `access` are hand-edited
 * (see docs/business-rules.md).
 *
 * Requires: ollama serve + ollama pull gemma4
 *
 * @example
 *   pnpm tsx scripts/enrich-with-gemma4.ts                 # both passes
 *   pnpm tsx scripts/enrich-with-gemma4.ts --only tags      # only audit tags
 *   pnpm tsx scripts/enrich-with-gemma4.ts --only issues    # only detect inconsistencies
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const MODEL = process.env.GEMMA_MODEL || 'gemma4'
const DELAY_MS = 300
const DATA_DIR = join(process.cwd(), 'data')

type Beach = {
  code: string
  name: string
  municipality: number
  sea: number
  coordinates: [number, number]
  orientation: string
  soilType: string
  nudist: boolean
  promenade: boolean
  anchorageZone: boolean
  dogFriendly: boolean
  lifeguard: boolean
  services: number[]
  activities: number[]
  tags?: number[]
  description: string
  access: string
  nearby: string[]
  instagramHashtag: string
  occupancyLevel?: string
  accessDifficulty?: string
  childSafe?: boolean
  naturalShade?: boolean
  waterQuality?: string
  certifications?: string[]
  waves?: string
  length?: number
  pictures?: string[]
  [key: string]: unknown
}

type LookupItem = { id: string; name: string }

// --- Ollama client ---

function getOllamaBase(): string {
  const raw = process.env.OLLAMA_HOST?.trim() || '127.0.0.1:11434'
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw.replace(/\/$/, '')
  }
  return `http://${raw.replace(/\/$/, '')}`
}

async function ollamaChat(system: string, user: string): Promise<string> {
  const res = await fetch(`${getOllamaBase()}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      stream: false,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Ollama HTTP ${res.status}: ${errText}`)
  }

  const data = (await res.json()) as { message?: { content?: string } }
  const content = data?.message?.content
  if (typeof content !== 'string') {
    throw new Error('Unexpected Ollama response shape')
  }
  return content.trim()
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// --- Data loading ---

function loadJson<T>(filename: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, filename), 'utf-8')) as T
}

function beachContext(
  beach: Beach,
  municipalities: LookupItem[],
  services: LookupItem[],
  activities: LookupItem[],
  tags: LookupItem[],
): string {
  const municipality = municipalities[beach.municipality]?.name ?? '?'
  const seaName = beach.sea === 0 ? 'Mar Mediterráneo' : 'Mar Menor'
  const svcNames = beach.services
    .map((i) => services[i]?.name ?? '?')
    .join(', ')
  const actNames = beach.activities
    .map((i) => activities[i]?.name ?? '?')
    .join(', ')
  const tagNames = (beach.tags ?? [])
    .map((i) => tags[i]?.name ?? '?')
    .join(', ')

  return [
    `Nombre: ${beach.name}`,
    `Municipio: ${municipality}`,
    `Mar: ${seaName}`,
    `Orientación: ${beach.orientation}`,
    `Suelo: ${beach.soilType}`,
    `Longitud: ${beach.length ? `${beach.length}m` : 'desconocida'}`,
    `Dificultad acceso: ${beach.accessDifficulty ?? 'no indicada'}`,
    `Servicios: ${svcNames || 'ninguno'}`,
    `Actividades: ${actNames || 'ninguna'}`,
    `Tags: ${tagNames || 'ninguno'}`,
    `Nudista: ${beach.nudist ? 'sí' : 'no'}`,
    `Paseo marítimo: ${beach.promenade ? 'sí' : 'no'}`,
    `Perros: ${beach.dogFriendly ? 'sí' : 'no'}`,
    `Socorrista: ${beach.lifeguard ? 'sí' : 'no'}`,
    `Segura para niños: ${beach.childSafe ? 'sí' : 'no'}`,
    `Sombra natural: ${beach.naturalShade ? 'sí' : 'no'}`,
    `Calidad agua: ${beach.waterQuality ?? 'no indicada'}`,
    `Oleaje: ${beach.waves ?? 'no indicado'}`,
    `Certificaciones: ${(beach.certifications ?? []).join(', ') || 'ninguna'}`,
    `Zona fondeo: ${beach.anchorageZone ? 'sí' : 'no'}`,
  ].join('\n')
}

// --- Pass 1: Audit tags ---

function buildTagAuditSystem(tags: LookupItem[]): string {
  const tagList = tags.map((t, i) => `  ${i}: ${t.name} (${t.id})`).join('\n')
  return `Eres un experto en clasificación de playas de la costa de Murcia.
Dada la ficha de una playa, sugiere tags que deberían tener pero no tienen.

Tags disponibles (índice: nombre):
${tagList}

Reglas:
- Solo sugiere tags que se puedan inferir con certeza de los datos proporcionados
- No repitas tags que la playa ya tiene
- Responde SOLO con los índices numéricos separados por comas
- Si no hay sugerencias, responde "ninguno"
- No expliques tu razonamiento`
}

async function auditTags(
  beach: Beach,
  municipalities: LookupItem[],
  services: LookupItem[],
  activities: LookupItem[],
  tags: LookupItem[],
): Promise<number[]> {
  const system = buildTagAuditSystem(tags)
  const context = beachContext(
    beach,
    municipalities,
    services,
    activities,
    tags,
  )
  const user = `Ficha de la playa:\n${context}\n\nTags actuales (índices): ${JSON.stringify(beach.tags ?? [])}`

  const response = await ollamaChat(system, user)

  if (response.toLowerCase().includes('ninguno')) return []

  return response
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter(
      (n) =>
        !Number.isNaN(n) &&
        n >= 0 &&
        n < tags.length &&
        !(beach.tags ?? []).includes(n),
    )
}

// --- Pass 3: Detect inconsistencies ---

type Issue = { beach: string; code: string; issue: string }

function detectInconsistencies(
  beach: Beach,
  services: LookupItem[],
  activities: LookupItem[],
  tags: LookupItem[],
): Issue[] {
  const issues: Issue[] = []
  const tagIds = (beach.tags ?? []).map((i) => tags[i]?.id)
  const svcIds = beach.services.map((i) => services[i]?.id)
  const actIds = beach.activities.map((i) => activities[i]?.id)
  const add = (issue: string) =>
    issues.push({ beach: beach.name, code: beach.code, issue })

  // childSafe + hard access
  if (beach.childSafe && beach.accessDifficulty === 'hard') {
    add('childSafe=true pero accessDifficulty=hard')
  }

  // lifeguard=false + blue-flag (blue flag usually requires lifeguard in season)
  if (!beach.lifeguard && (beach.certifications ?? []).includes('blue-flag')) {
    add('Sin socorrista pero tiene bandera azul')
  }

  // snorkel activity but poor water quality
  if (actIds.includes('snorkeling') && beach.waterQuality === 'poor') {
    add('Actividad snorkel pero waterQuality=poor')
  }

  // tag "familiar" but not childSafe
  if (tagIds.includes('familiar') && beach.childSafe === false) {
    add('Tag "familiar" pero childSafe=false')
  }

  // tag "accesible" but hard access
  if (tagIds.includes('accesible') && beach.accessDifficulty === 'hard') {
    add('Tag "accesible" pero accessDifficulty=hard')
  }

  // tag "chiringuito" but no chiringuito service
  if (tagIds.includes('chiringuito') && !svcIds.includes('chiringuito')) {
    add('Tag "chiringuito" pero no tiene servicio chiringuito')
  }

  // tag "nudista" mismatch
  if (tagIds.includes('nudista') !== beach.nudist) {
    add(`Tag nudista=${tagIds.includes('nudista')} pero nudist=${beach.nudist}`)
  }

  // tag "canina" mismatch
  if (tagIds.includes('canina') !== beach.dogFriendly) {
    add(
      `Tag canina=${tagIds.includes('canina')} pero dogFriendly=${beach.dogFriendly}`,
    )
  }

  // tag "paseo-maritimo" mismatch
  if (tagIds.includes('paseo-maritimo') && !beach.promenade) {
    add('Tag "paseo-maritimo" pero promenade=false')
  }

  // tag "snorkel" but no snorkeling activity
  if (tagIds.includes('snorkel') && !actIds.includes('snorkeling')) {
    add('Tag "snorkel" pero no tiene actividad snorkeling')
  }

  // promenade=true but missing tag
  if (beach.promenade && !tagIds.includes('paseo-maritimo')) {
    add('promenade=true pero falta tag "paseo-maritimo"')
  }

  // nudist=true but missing tag
  if (beach.nudist && !tagIds.includes('nudista')) {
    add('nudist=true pero falta tag "nudista"')
  }

  // dogFriendly=true but missing tag
  if (beach.dogFriendly && !tagIds.includes('canina')) {
    add('dogFriendly=true pero falta tag "canina"')
  }

  // wheelchair ramp service but no "accesible" tag
  if (svcIds.includes('wheelchair-ramp') && !tagIds.includes('accesible')) {
    add('Tiene rampa accesible pero falta tag "accesible"')
  }

  return issues
}

// --- CLI ---

function parseArgs(): { only: string | null } {
  const args = process.argv.slice(2)
  let only: string | null = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--only') only = args[++i] ?? null
    else if (args[i] === '--help' || args[i] === '-h') {
      console.log(
        `Usage: pnpm tsx scripts/enrich-with-gemma4.ts [--only tags|issues]`,
      )
      process.exit(0)
    }
  }

  return { only }
}

async function main() {
  const { only } = parseArgs()
  const runTags = !only || only === 'tags'
  const runIssues = !only || only === 'issues'

  const beaches = loadJson<Beach[]>('beaches.json')
  const municipalities = loadJson<LookupItem[]>('municipalities.json')
  const services = loadJson<LookupItem[]>('services.json')
  const activities = loadJson<LookupItem[]>('activities.json')
  const tags = loadJson<LookupItem[]>('tags.json')

  console.log(`Model: ${MODEL} | Beaches: ${beaches.length}`)
  console.log(
    `Passes: ${[runTags && 'tags', runIssues && 'issues'].filter(Boolean).join(', ')}\n`,
  )

  // --- Pass 1: Audit tags ---
  const tagSuggestions: Array<{
    name: string
    code: string
    current: number[]
    suggested: number[]
  }> = []

  if (runTags) {
    console.log('\n=== Pass 1: Auditing tags ===\n')
    for (let i = 0; i < beaches.length; i++) {
      const beach = beaches[i]
      process.stderr.write(`  [${i + 1}/${beaches.length}] ${beach.name}...`)

      try {
        const suggested = await auditTags(
          beach,
          municipalities,
          services,
          activities,
          tags,
        )

        if (suggested.length > 0) {
          tagSuggestions.push({
            name: beach.name,
            code: beach.code,
            current: beach.tags ?? [],
            suggested,
          })
          process.stderr.write(
            ` +${suggested.length} (${suggested.map((i) => tags[i]?.name).join(', ')})\n`,
          )
        } else {
          process.stderr.write(' OK\n')
        }
      } catch (e) {
        process.stderr.write(` ✗ ${(e as Error).message}\n`)
      }

      if (i < beaches.length - 1) await delay(DELAY_MS)
    }

    console.log(
      `\nTag suggestions: ${tagSuggestions.length} playas con tags sugeridos`,
    )
    if (tagSuggestions.length > 0) {
      console.log('')
      for (const s of tagSuggestions) {
        const suggestedNames = s.suggested.map((i) => tags[i]?.name).join(', ')
        console.log(`  ${s.name}: añadir → ${suggestedNames}`)
      }
    }
  }

  // --- Pass 2: Detect inconsistencies ---
  if (runIssues) {
    console.log('\n=== Pass 2: Detecting inconsistencies ===\n')
    const allIssues: Issue[] = []

    for (const beach of beaches) {
      const issues = detectInconsistencies(beach, services, activities, tags)
      allIssues.push(...issues)
    }

    if (allIssues.length === 0) {
      console.log('  No se encontraron inconsistencias ✓')
    } else {
      console.log(`  ${allIssues.length} inconsistencias encontradas:\n`)
      for (const issue of allIssues) {
        console.log(`  [${issue.code}] ${issue.beach}: ${issue.issue}`)
      }
    }
  }

  // --- Write results ---
  if (tagSuggestions.length > 0) {
    const reportPath = join(process.cwd(), 'reports', 'tag-suggestions.json')
    writeFileSync(reportPath, JSON.stringify(tagSuggestions, null, 2) + '\n')
    console.log(`Tags sugeridos guardados en ${reportPath}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
