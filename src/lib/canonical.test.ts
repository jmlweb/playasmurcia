import { describe, expect, it } from 'vitest'

import { canonicalLink, canonicalUrl, ogUrlMeta } from './canonical'

describe('canonicalUrl', () => {
  it.each([
    ['/', 'https://www.playasmurcia.com/'],
    ['/explorar', 'https://www.playasmurcia.com/explorar'],
    ['/explorar/', 'https://www.playasmurcia.com/explorar'],
    ['/explorar?q=sol&page=2', 'https://www.playasmurcia.com/explorar'],
    [
      '/playas/cala-cortina#mapa',
      'https://www.playasmurcia.com/playas/cala-cortina',
    ],
    ['colecciones', 'https://www.playasmurcia.com/colecciones'],
  ])('maps %s to %s', (input, expected) => {
    expect(canonicalUrl(input)).toBe(expected)
  })
})

describe('head helpers', () => {
  it('builds a canonical link', () => {
    expect(canonicalLink('/explorar')).toEqual({
      rel: 'canonical',
      href: 'https://www.playasmurcia.com/explorar',
    })
  })

  it('builds an og:url meta tag', () => {
    expect(ogUrlMeta('/explorar')).toEqual({
      property: 'og:url',
      content: 'https://www.playasmurcia.com/explorar',
    })
  })
})
