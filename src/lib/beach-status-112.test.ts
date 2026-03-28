import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Helpers re-exported for testing via internal imports
// We test via the public API and module internals where accessible.
// ---------------------------------------------------------------------------

// Mock fetch globally before importing the module so the cache is fresh
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// We need to re-import after setting up the global mock. Use dynamic import.
async function freshModule() {
  // Clear module registry to reset the in-module cache between tests
  vi.resetModules()
  return import('./beach-status-112')
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function buildXml(
  entries: Partial<{
    id: string
    dia: string
    hora: string
    municipio: string
    playa: string
    bandera: string
    estadoMar: string
  }>[],
) {
  const blocks = entries
    .map(
      (e) => `
  <banderas>
    <id>${e.id ?? '1'}</id>
    <dia>${e.dia ?? '01/08/2025'}</dia>
    <hora>${e.hora ?? '10:00'}</hora>
    <municipio>${e.municipio ?? 'AGUILAS'}</municipio>
    <playa>${e.playa ?? 'CALABARDINA'}</playa>
    <bandera>${e.bandera ?? 'VERDE'}</bandera>
    <estadoMar>${e.estadoMar ?? 'BUENO'}</estadoMar>
  </banderas>`,
    )
    .join('')
  return `<banderasplayas>${blocks}</banderasplayas>`
}

function recentDate() {
  const d = new Date()
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear())
  return `${day}/${month}/${year}`
}

function staleDate() {
  const d = new Date()
  d.setDate(d.getDate() - 10)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear())
  return `${day}/${month}/${year}`
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('getBeachStatus', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('returns null when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'))
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Calabardina', 'Aguilas')
    expect(result).toBeNull()
  })

  it('returns null when beach is not found in XML', async () => {
    const xml = buildXml([{ playa: 'CALABARDINA', municipio: 'AGUILAS' }])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Playa Inexistente', 'Aguilas')
    expect(result).toBeNull()
  })

  it('matches beach by case-insensitive name', async () => {
    const xml = buildXml([
      {
        playa: 'CALABARDINA',
        municipio: 'AGUILAS',
        bandera: 'VERDE',
        estadoMar: 'BUENO',
        dia: recentDate(),
        hora: '10:00',
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Calabardina', 'Aguilas')
    expect(result).not.toBeNull()
    expect(result?.flag).toBe('VERDE')
    expect(result?.seaState).toBe('BUENO')
    expect(result?.isOffSeason).toBe(false)
  })

  it('matches beach names with accents stripped', async () => {
    const xml = buildXml([
      {
        playa: 'BOLNUEVO',
        municipio: 'MAZARRON',
        bandera: 'AMARILLA',
        estadoMar: 'REGULAR',
        dia: recentDate(),
        hora: '11:30',
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Bolnuevo', 'Mazarrón')
    expect(result).not.toBeNull()
    expect(result?.flag).toBe('AMARILLA')
  })

  it('marks stale data as off-season', async () => {
    const xml = buildXml([
      {
        playa: 'CALABARDINA',
        municipio: 'AGUILAS',
        bandera: 'VERDE',
        estadoMar: 'BUENO',
        dia: staleDate(),
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Calabardina', 'Aguilas')
    expect(result).not.toBeNull()
    expect(result?.isOffSeason).toBe(true)
  })

  it('returns red flag data correctly', async () => {
    const xml = buildXml([
      {
        playa: 'PLAYA DE LEVANTE',
        municipio: 'CARTAGENA',
        bandera: 'ROJA',
        estadoMar: 'MALO',
        dia: recentDate(),
        hora: '09:00',
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Playa de Levante', 'Cartagena')
    expect(result?.flag).toBe('ROJA')
    expect(result?.seaState).toBe('MALO')
  })

  it('handles SIN BANDERA entries', async () => {
    const xml = buildXml([
      {
        playa: 'CALA DEL PINO',
        municipio: 'LOS ALCAZARES',
        bandera: 'SIN BANDERA',
        estadoMar: 'SIN ESTADO',
        dia: recentDate(),
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Cala del Pino', 'Los Alcázares')
    expect(result?.flag).toBe('SIN BANDERA')
    expect(result?.seaState).toBe('SIN ESTADO')
  })

  it('returns null when HTTP response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 503 })
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Calabardina', 'Aguilas')
    expect(result).toBeNull()
  })

  it('matches multiple entries and returns the correct one', async () => {
    const xml = buildXml([
      {
        playa: 'CALABARDINA',
        municipio: 'AGUILAS',
        bandera: 'VERDE',
        estadoMar: 'BUENO',
        dia: recentDate(),
      },
      {
        playa: 'LAS HIGUERICAS',
        municipio: 'AGUILAS',
        bandera: 'ROJA',
        estadoMar: 'MALO',
        dia: recentDate(),
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Las Higuericas', 'Aguilas')
    expect(result?.flag).toBe('ROJA')
  })
})
