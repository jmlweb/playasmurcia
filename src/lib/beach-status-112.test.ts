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

  it('keeps PLAYA CERRADA entries as a closed beach', async () => {
    const xml = buildXml([
      {
        playa: 'PLAYA DE CALARREONA',
        municipio: 'AGUILAS',
        bandera: 'PLAYA CERRADA',
        estadoMar: 'SIN ESTADO',
        dia: recentDate(),
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBeachStatus } = await freshModule()
    const result = await getBeachStatus('Playa de Calarreona', 'Águilas')
    expect(result?.flag).toBe('PLAYA CERRADA')
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

describe('segment-suffixed feed names', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.resetModules()
  })

  async function statusFor(
    feed: Parameters<typeof buildXml>[0],
    beachName: string,
    municipalityName: string,
  ) {
    const xml = buildXml(feed.map((e) => ({ dia: recentDate(), ...e })))
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBeachStatus } = await freshModule()
    return getBeachStatus(beachName, municipalityName)
  }

  it('matches a "Playa de" name to a "(…)" segment', async () => {
    const result = await statusFor(
      [{ playa: 'BOLNUEVO (CENTRO)', municipio: 'MAZARRON', bandera: 'ROJA' }],
      'Playa de Bolnuevo',
      'Mazarrón',
    )
    expect(result?.flag).toBe('ROJA')
  })

  it('matches I/II segments', async () => {
    const result = await statusFor(
      [{ playa: 'PONIENTE I', municipio: 'AGUILAS', bandera: 'AMARILLA' }],
      'Playa de Poniente',
      'Águilas',
    )
    expect(result?.flag).toBe('AMARILLA')
  })

  it('matches (LIMA n) segments', async () => {
    const result = await statusFor(
      [
        {
          playa: 'BARNUEVO (LIMA 1)',
          municipio: 'SAN JAVIER',
          bandera: 'VERDE',
        },
      ],
      'Playa Barnuevo',
      'San Javier',
    )
    expect(result?.flag).toBe('VERDE')
  })

  it('matches stacked I/II, (…) and (LIMA n) suffixes', async () => {
    const result = await statusFor(
      [
        {
          playa: 'COLON I (SUR) (LIMA 2)',
          municipio: 'SAN JAVIER',
          bandera: 'AMARILLA',
        },
      ],
      'Playa de Colón',
      'San Javier',
    )
    expect(result?.flag).toBe('AMARILLA')
  })

  it('picks the most severe flag among several segments', async () => {
    const result = await statusFor(
      [
        {
          playa: 'BOLNUEVO (CAMPING)',
          municipio: 'MAZARRON',
          bandera: 'VERDE',
        },
        { playa: 'BOLNUEVO (CENTRO)', municipio: 'MAZARRON', bandera: 'ROJA' },
        {
          playa: 'BOLNUEVO (OASIS)',
          municipio: 'MAZARRON',
          bandera: 'AMARILLA',
        },
      ],
      'Playa de Bolnuevo',
      'Mazarrón',
    )
    expect(result?.flag).toBe('ROJA')
  })

  it('ranks a closure above a red flag', async () => {
    const result = await statusFor(
      [
        {
          playa: 'ISLAS MENORES (LEVANTE)',
          municipio: 'CARTAGENA',
          bandera: 'ROJA',
        },
        {
          playa: 'ISLAS MENORES (PONIENTE)',
          municipio: 'CARTAGENA',
          bandera: 'PLAYA CERRADA',
        },
      ],
      'Playa de Islas Menores',
      'Cartagena',
    )
    expect(result?.flag).toBe('PLAYA CERRADA')
  })

  it('does not match a longer name that only starts with the same word', async () => {
    const result = await statusFor(
      [
        {
          playa: 'PEDRUCHILLO (MAR MENOR) (LIMA 18)',
          municipio: 'SAN JAVIER',
        },
      ],
      'Playa Pedrucho',
      'San Javier',
    )
    expect(result).toBeNull()
  })

  it('does not treat the text in parentheses as the beach name', async () => {
    const result = await statusFor(
      [{ playa: 'ISLAS MENORES (LEVANTE)', municipio: 'CARTAGENA' }],
      'Playa de Levante',
      'Cartagena',
    )
    expect(result).toBeNull()
  })

  it('does not match a segment from another municipality', async () => {
    const result = await statusFor(
      [
        {
          playa: 'LAS SALINAS',
          municipio: 'SAN PEDRO DEL PINATAR',
          bandera: 'ROJA',
        },
        {
          playa: 'LAS SALINAS (ALCAZARES)',
          municipio: 'LOS ALCAZARES',
          bandera: 'VERDE',
        },
      ],
      'Playa de Las Salinas',
      'Los Alcázares',
    )
    expect(result?.flag).toBe('VERDE')
  })

  it('keeps a direct name match ahead of segment matches', async () => {
    const result = await statusFor(
      [
        {
          playa: 'TORRE DERRIBADA II (COTO)',
          municipio: 'SAN PEDRO DEL PINATAR',
          bandera: 'ROJA',
        },
        {
          playa: 'TORRE DERRIBADA',
          municipio: 'SAN PEDRO DEL PINATAR',
          bandera: 'VERDE',
        },
      ],
      'Playa de La Torre Derribada',
      'San Pedro del Pinatar',
    )
    expect(result?.flag).toBe('VERDE')
  })
})

describe('getBatchBeachFlags', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.resetModules()
  })

  const beaches = [
    { code: 'A', name: 'Calabardina', municipalityName: 'Aguilas' },
    { code: 'B', name: 'Las Higuericas', municipalityName: 'Aguilas' },
    { code: 'C', name: 'Playa Inexistente', municipalityName: 'Aguilas' },
  ]

  it('returns flags for many beaches from one fetch', async () => {
    const xml = buildXml([
      { playa: 'CALABARDINA', municipio: 'AGUILAS', dia: recentDate() },
      {
        playa: 'LAS HIGUERICAS',
        municipio: 'AGUILAS',
        bandera: 'ROJA',
        dia: recentDate(),
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBatchBeachFlags } = await freshModule()

    const result = await getBatchBeachFlags(beaches)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(Object.fromEntries(result)).toEqual({ A: 'VERDE', B: 'ROJA' })
  })

  it('keeps closed beaches for the listing cards', async () => {
    const xml = buildXml([
      {
        playa: 'CALABARDINA',
        municipio: 'AGUILAS',
        bandera: 'PLAYA CERRADA',
        dia: recentDate(),
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBatchBeachFlags } = await freshModule()

    const result = await getBatchBeachFlags(beaches)

    expect(Object.fromEntries(result)).toEqual({ A: 'PLAYA CERRADA' })
  })

  it('omits stale entries and beaches without a flag', async () => {
    const xml = buildXml([
      { playa: 'CALABARDINA', municipio: 'AGUILAS', dia: staleDate() },
      {
        playa: 'LAS HIGUERICAS',
        municipio: 'AGUILAS',
        bandera: 'SIN BANDERA',
        dia: recentDate(),
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBatchBeachFlags } = await freshModule()

    expect((await getBatchBeachFlags(beaches)).size).toBe(0)
  })

  it('flags beaches whose feed name carries a segment suffix', async () => {
    const xml = buildXml([
      {
        playa: 'PONIENTE I',
        municipio: 'AGUILAS',
        bandera: 'VERDE',
        dia: recentDate(),
      },
      {
        playa: 'PONIENTE II',
        municipio: 'AGUILAS',
        bandera: 'ROJA',
        dia: recentDate(),
      },
    ])
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => xml })
    const { getBatchBeachFlags } = await freshModule()

    const result = await getBatchBeachFlags([
      { code: 'P', name: 'Playa de Poniente', municipalityName: 'Águilas' },
    ])

    expect(Object.fromEntries(result)).toEqual({ P: 'ROJA' })
  })

  it('returns an empty map when the 112 fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'))
    const { getBatchBeachFlags } = await freshModule()

    expect((await getBatchBeachFlags(beaches)).size).toBe(0)
  })
})
