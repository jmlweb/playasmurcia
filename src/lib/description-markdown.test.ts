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
    expect(
      blocks.map((b) => (b.type === 'list' ? null : b.inline[0]?.text)),
    ).toEqual(['Uno dos.', 'Tres.'])
  })

  it('keeps unbalanced markers as literal text', () => {
    expect(parseDescription('Precio **especial')).toEqual([
      {
        type: 'paragraph',
        inline: [{ text: 'Precio **especial', bold: false }],
      },
    ])
  })

  it('parses a paragraph followed by a bullet list', () => {
    expect(
      parseDescription('Por la RM-12.\n\n- **A pie:** 10 min.\n- En barco.'),
    ).toEqual([
      { type: 'paragraph', inline: [{ text: 'Por la RM-12.', bold: false }] },
      {
        type: 'list',
        items: [
          [
            { text: 'A pie:', bold: true },
            { text: ' 10 min.', bold: false },
          ],
          [{ text: 'En barco.', bold: false }],
        ],
      },
    ])
  })

  it('treats a block mixing list and plain lines as a paragraph', () => {
    expect(parseDescription('Texto\n- no lista')[0]?.type).toBe('paragraph')
  })

  it('parses https links', () => {
    expect(
      parseDescription('Ver la [web](https://murcianatural.carm.es).'),
    ).toEqual([
      {
        type: 'paragraph',
        inline: [
          { text: 'Ver la ', bold: false },
          { text: 'web', bold: false, href: 'https://murcianatural.carm.es' },
          { text: '.', bold: false },
        ],
      },
    ])
  })

  it('renders links with unsafe schemes as plain text', () => {
    expect(parseDescription('[clic](javascript:alert(1))')).toEqual([
      {
        type: 'paragraph',
        inline: [
          { text: 'clic', bold: false },
          { text: ')', bold: false },
        ],
      },
    ])
    expect(parseDescription('[mapa](/playas/x)')).toEqual([
      { type: 'paragraph', inline: [{ text: 'mapa', bold: false }] },
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

  it('reduces lists and links to their text', () => {
    expect(
      stripDescriptionMarkdown(
        'Por la RM-12.\n\n- **A pie:** 10 min.\n- Ver [web](https://a.es).',
      ),
    ).toBe('Por la RM-12. A pie: 10 min. Ver web.')
  })

  it('leaves plain text unchanged', () => {
    expect(stripDescriptionMarkdown('Una cala.')).toBe('Una cala.')
  })
})
