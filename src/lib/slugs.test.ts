import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  beachToSlug,
  buildSlugIndex,
  legacyNameToSlug,
  nameToSlug,
} from './slugs'

describe('same-name beach slugs', () => {
  const beaches = JSON.parse(readFileSync('data/beaches.json', 'utf8')) as {
    code: string
    name: string
  }[]

  it('gives every beach a unique slug that resolves back to it', () => {
    const { slugToCode } = buildSlugIndex(beaches)
    expect(beaches).toHaveLength(193)
    expect(slugToCode.size).toBe(beaches.length)
    beaches.forEach((b) => {
      expect(slugToCode.get(beachToSlug(b))).toBe(b.code)
    })
  })

  it('keeps the bare slug on the beaches served today', () => {
    const byCode = new Map(beaches.map((b) => [b.code, b]))
    ;['615', '525', '564', '5907', '633'].forEach((code) => {
      const beach = byCode.get(code)!
      expect(beachToSlug(beach)).toBe(nameToSlug(beach.name))
    })
  })

  it('qualifies only the five beaches that had no page', () => {
    const qualified = beaches
      .filter((b) => beachToSlug(b) !== nameToSlug(b.name))
      .map((b) => [b.code, beachToSlug(b)])
    expect(qualified).toEqual(
      expect.arrayContaining([
        ['586', 'playa-amarilla-mazarron'],
        ['693', 'playa-de-levante-aguilas'],
        ['596', 'playa-de-poniente-aguilas'],
        ['627', 'playa-larga-cartagena'],
        ['6703', 'playa-parazuelos-lorca'],
      ]),
    )
    expect(qualified).toHaveLength(5)
  })

  it('never redirects a live slug', () => {
    const { slugToCode, retiredSlugToSlug } = buildSlugIndex(beaches)
    retiredSlugToSlug.forEach((_target, retired) => {
      expect(slugToCode.has(retired)).toBe(false)
    })
  })

  it('redirects the retired Cala Mijo URL to its current slug', () => {
    const { retiredSlugToSlug, slugToCode } = buildSlugIndex(beaches)
    const target = retiredSlugToSlug.get('cala-mijo.-(cueva-de-las-palomas)')
    expect(target).toBe('cala-mijo-cueva-de-las-palomas')
    expect(slugToCode.has(target!)).toBe(true)
  })
})

describe('nameToSlug', () => {
  it('strips parentheses and periods', () => {
    expect(nameToSlug('Cala Mijo (Cueva de las Palomas)')).toBe(
      'cala-mijo-cueva-de-las-palomas',
    )
    expect(nameToSlug('Cala Mijo. (Cueva de las Palomas)')).toBe(
      'cala-mijo-cueva-de-las-palomas',
    )
  })

  it('removes accents and collapses repeated whitespace', () => {
    expect(nameToSlug('Playa  Lomas del Castillico (Villas)')).toBe(
      'playa-lomas-del-castillico-villas',
    )
    expect(nameToSlug('Playa de Cañón')).toBe('playa-de-canon')
  })
})

describe('legacyNameToSlug', () => {
  it('keeps the retired format so old URLs can be redirected', () => {
    expect(legacyNameToSlug('Cala Túnez (Cala Cuna)')).toBe(
      'cala-tunez-(cala-cuna)',
    )
  })
})

describe('beach data slugs', () => {
  const beaches = JSON.parse(readFileSync('data/beaches.json', 'utf8')) as {
    name: string
  }[]

  it('contain only lowercase letters, digits and hyphens', () => {
    beaches.forEach((b) => {
      expect(nameToSlug(b.name)).toMatch(/^[a-z0-9-]+$/)
    })
  })

  it('do not collide for beaches whose name had punctuation', () => {
    const counts = new Map<string, number>()
    beaches.forEach((b) => {
      const slug = nameToSlug(b.name)
      counts.set(slug, (counts.get(slug) ?? 0) + 1)
    })
    beaches
      .filter((b) => legacyNameToSlug(b.name) !== nameToSlug(b.name))
      .forEach((b) => {
        expect(counts.get(nameToSlug(b.name))).toBe(1)
      })
  })

  it('never repeat a name within the same coordinates (duplicate beach)', () => {
    const seen = new Set<string>()
    const full = JSON.parse(readFileSync('data/beaches.json', 'utf8')) as {
      name: string
      coordinates: [number, number]
    }[]
    full.forEach((b) => {
      const key = `${nameToSlug(b.name)}@${b.coordinates.join(',')}`
      expect(seen.has(key)).toBe(false)
      seen.add(key)
    })
  })

  it('map every retired slug to a distinct current slug', () => {
    const retired = beaches
      .map((b) => [legacyNameToSlug(b.name), nameToSlug(b.name)] as const)
      .filter(([legacy, current]) => legacy !== current)
    expect(retired.length).toBeGreaterThan(0)
    retired.forEach(([legacy]) => {
      expect(beaches.some((b) => nameToSlug(b.name) === legacy)).toBe(false)
    })
  })
})
