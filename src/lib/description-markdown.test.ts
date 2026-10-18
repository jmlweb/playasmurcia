import { describe, expect, it } from 'vitest'

import {
  parseDescription,
  stripDescriptionMarkdown,
} from './description-markdown'

describe('parseDescription', () => {
  it('returns a single plain paragraph for plain text', () => {
    expect(parseDescription('Una cala tranquila.')).toEqual([
      {
        type: 'paragraph',
        inline: [{ text: 'Una cala tranquila.', bold: false }],
      },
    ])
  })

  it('splits bold segments', () => {
    expect(parseDescription('Tiene **arena fina** y agua.')).toEqual([
      {
        type: 'paragraph',
        inline: [
          { text: 'Tiene ', bold: false },
          { text: 'arena fina', bold: true },
          { text: ' y agua.', bold: false },
        ],
      },
    ])
  })

  it('detects the tip paragraph and removes its prefix', () => {
    const blocks = parseDescription(
      'Playa larga.\n\n**Consejo:** trae escarpines.',
    )
    expect(blocks).toHaveLength(2)
    expect(blocks[1]).toEqual({
      type: 'tip',
      inline: [{ text: 'trae escarpines.', bold: false }],
    })
  })

  it('ignores extra blank lines and joins single line breaks', () => {
    const blocks = parseDescription('Uno\ndos.\n\n\n\nTres.\n')
    expect(blocks.map((b) => b.inline[0]?.text)).toEqual(['Uno dos.', 'Tres.'])
  })

  it('keeps unbalanced markers as literal text', () => {
    expect(parseDescription('Precio **especial')).toEqual([
      {
        type: 'paragraph',
        inline: [{ text: 'Precio **especial', bold: false }],
      },
    ])
  })

  it('returns no blocks for empty text', () => {
    expect(parseDescription('  \n\n ')).toEqual([])
  })
})

describe('stripDescriptionMarkdown', () => {
  it('removes bold markers and joins paragraphs', () => {
    expect(
      stripDescriptionMarkdown(
        'Tiene **arena fina**.\n\n**Consejo:** trae agua.',
      ),
    ).toBe('Tiene arena fina. Consejo: trae agua.')
  })

  it('leaves plain text unchanged', () => {
    expect(stripDescriptionMarkdown('Una cala.')).toBe('Una cala.')
  })
})
