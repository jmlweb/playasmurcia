import { describe, expect, it } from 'vitest'

import { parseImageFilename, pictureUrl } from './images'

describe('pictureUrl', () => {
  // An explicit '' rather than undefined: undefined would fall through to the env default
  it('falls back to the local /pictures path when the base URL is empty', () => {
    expect(pictureUrl('hero.png', '')).toBe('/pictures/hero.png')
  })

  it('prefixes the configured base URL', () => {
    expect(pictureUrl('optimized/a-full.webp', 'https://img.example.com')).toBe(
      'https://img.example.com/optimized/a-full.webp',
    )
  })

  it('does not double slashes between base and path', () => {
    expect(pictureUrl('/hero.png', 'https://img.example.com/')).toBe(
      'https://img.example.com/hero.png',
    )
  })
})

describe('parseImageFilename', () => {
  it('splits base name and extension', () => {
    expect(parseImageFilename('arturo2_g.jpg')).toEqual({
      baseName: 'arturo2_g',
      ext: 'jpg',
    })
  })

  it('defaults to png without extension', () => {
    expect(parseImageFilename('hero')).toEqual({ baseName: 'hero', ext: 'png' })
  })
})
