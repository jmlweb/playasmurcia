import { describe, expect, it } from 'vitest'

import { getBeachSummary } from './beach-summary'

describe('getBeachSummary', () => {
  it('strips the markdown', () => {
    expect(
      getBeachSummary('Los Nietos', '**Los Nietos** tiene mucha arena.'),
    ).toBe('Los Nietos tiene mucha arena.')
  })

  it('keeps whole sentences within the limit', () => {
    const first = `Nietos ${'a'.repeat(100)}.`
    const second = `${'b'.repeat(100)}.`
    expect(getBeachSummary('Nietos', `${first} ${second}`)).toBe(first)
  })

  it('never jumps to a later sentence after a long first one', () => {
    const long = `Nietos ${'palabra '.repeat(30).trim()}.`
    const summary = getBeachSummary('Nietos', `${long} Hay socorrista.`)
    expect(summary).not.toContain('Hay socorrista')
    expect(summary.length).toBeLessThanOrEqual(160)
    expect(summary.endsWith('…')).toBe(true)
  })

  it('leaves out the tip block', () => {
    expect(
      getBeachSummary(
        'Nietos',
        'Nietos es tranquila.\n\n**Consejo:** llega pronto.',
      ),
    ).toBe('Nietos es tranquila.')
  })

  it('names the beach when the description does not', () => {
    expect(getBeachSummary('Playa El Mojón', 'Hay socorrista.')).toBe(
      'Playa El Mojón: Hay socorrista.',
    )
  })

  it('matches the name without accents or its generic prefix', () => {
    expect(getBeachSummary('Playa de La Grúa', 'La grua es corta.')).toBe(
      'La grua es corta.',
    )
  })
})
