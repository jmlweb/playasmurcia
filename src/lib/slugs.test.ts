import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { legacyNameToSlug, nameToSlug } from './slugs'

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
