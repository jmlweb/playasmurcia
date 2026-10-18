import { describe, expect, it } from 'vitest'

import {
  createMarkdownSink,
  decodeEntities,
  type MarkdownSink,
} from '@/lib/html-to-markdown'

const VOID = new Set(['br', 'img', 'meta', 'link', 'source'])

// Stands in for HTMLRewriter: well-formed HTML only, text chunks kept raw
function feed(sink: MarkdownSink, html: string): string {
  for (const [, closing, tag, attrs, selfClosing, text] of html.matchAll(
    /<(\/)?([a-z0-9]+)([^>]*?)(\/)?>|([^<]+)/gi,
  )) {
    if (text !== undefined) {
      sink.text(text)
    } else if (closing) {
      sink.close()
    } else if (tag) {
      const attributes = new Map(
        [...(attrs ?? '').matchAll(/([a-z-]+)(?:="([^"]*)")?/gi)].map(
          ([, name, value]) => [name ?? '', value ?? ''],
        ),
      )
      const lowerTag = tag.toLowerCase()
      sink.open(
        lowerTag,
        (name) => attributes.get(name) ?? null,
        !selfClosing && !VOID.has(lowerTag),
      )
    }
  }
  return sink.finish()
}

const PAGE_URL = 'https://www.playasmurcia.com/playas/cala'

const convert = (main: string, head = '<title>Cala</title>') =>
  feed(
    createMarkdownSink(PAGE_URL),
    `<html><head>${head}</head><body><nav><a href="/">Inicio</a></nav><main>${main}</main><footer>Pie</footer></body></html>`,
  )

const body = (markdown: string) => markdown.split('---\n\n')[1]

describe('decodeEntities', () => {
  it('decodes named and numeric entities', () => {
    expect(decodeEntities('A &amp; B &#x27;c&#39; &lt;d&gt; &nbsp;')).toBe(
      "A & B 'c' <d>  ",
    )
  })

  it('leaves unknown entities untouched', () => {
    expect(decodeEntities('&copy;')).toBe('&copy;')
  })
})

describe('createMarkdownSink', () => {
  it('writes front matter from title, meta description and URL', () => {
    const markdown = convert(
      '<p>Hola</p>',
      '<title>Cala Abierta | PlayasMurcia</title><meta name="description" content="Una cala &amp; más"/>',
    )
    expect(markdown).toBe(
      [
        '---',
        'title: "Cala Abierta | PlayasMurcia"',
        'description: "Una cala & más"',
        `url: "${PAGE_URL}"`,
        '---',
        '',
        'Hola',
        '',
      ].join('\n'),
    )
  })

  it('ignores content outside main, skipped tags and aria-hidden', () => {
    const markdown = body(
      convert(
        '<nav>Migas</nav><p>Texto<span aria-hidden="true">/</span></p><button>Abrir</button><script>x()</script><svg><path d="M0"></path></svg>',
      ),
    )
    expect(markdown).toBe('Texto\n')
  })

  it('renders headings, paragraphs and emphasis', () => {
    expect(
      body(
        convert(
          '<section><h1>Cala</h1><p>Arena <strong>fina</strong> y <em>calma</em>.</p><h2>Info</h2><p>Dos</p></section>',
        ),
      ),
    ).toBe('# Cala\n\nArena **fina** y _calma_.\n\n## Info\n\nDos\n')
  })

  it('makes links and images absolute and drops empty wrappers', () => {
    expect(
      body(
        convert(
          '<p><a href="/municipios/cartagena">Cartagena</a> <a href="#top">Arriba</a><a href="/x"></a><strong> </strong><img src="/p.jpg" alt="Foto"/><img src="/d.jpg" alt=""/></p>',
        ),
      ),
    ).toBe(
      '[Cartagena](https://www.playasmurcia.com/municipios/cartagena) Arriba![Foto](https://www.playasmurcia.com/p.jpg)\n',
    )
  })

  it('keeps each list item on one line, separating its blocks', () => {
    expect(
      body(
        convert(
          '<ul><li><a href="/playas/a"><div><h3>Cala A</h3><p>Cartagena</p></div></a></li><li>Dos</li></ul><ol><li>Uno</li><li>Dos<ul><li>Sub</li></ul></li></ol>',
        ),
      ),
    ).toBe(
      [
        '- [Cala A · Cartagena](https://www.playasmurcia.com/playas/a)',
        '- Dos',
        '',
        '1. Uno',
        '2. Dos',
        '  - Sub',
        '',
      ].join('\n'),
    )
  })

  it('renders definition lists as labelled bullets', () => {
    expect(
      body(
        convert(
          '<dl><dt>Longitud</dt><dd>173 m</dd><dt>Arena</dt><dd>Gris</dd></dl>',
        ),
      ),
    ).toBe('- **Longitud**: 173 m\n- **Arena**: Gris\n')
  })

  it('spaces words split only by adjacent inline tags', () => {
    expect(
      body(
        convert('<p><span>Calas</span><span>Familiar</span>, <b>bien</b>.</p>'),
      ),
    ).toBe('Calas Familiar, **bien**.\n')
  })

  it('keeps links around block content on one line', () => {
    expect(
      body(
        convert(
          '<div><a href="/playas/b"><img src="/b.jpg" alt="Cala B"/><div><h3>Cala B</h3><p>Águilas</p></div></a><a href="/playas/c"><p>Cala C</p></a></div>',
        ),
      ),
    ).toBe(
      '[![Cala B](https://www.playasmurcia.com/b.jpg) · Cala B · Águilas](https://www.playasmurcia.com/playas/b)\n\n[Cala C](https://www.playasmurcia.com/playas/c)\n',
    )
  })

  it('separates sibling links', () => {
    expect(
      body(convert('<div><a href="/a">Uno</a><a href="/b">Dos</a></div>')),
    ).toBe(
      '[Uno](https://www.playasmurcia.com/a) [Dos](https://www.playasmurcia.com/b)\n',
    )
  })

  it('decodes attribute entities and encodes spaces in opaque URLs', () => {
    expect(
      body(
        convert(
          '<p><a href="https://maps.test/?a=1&amp;b=2">Mapa</a> <a href="tel:968 12 89 55">Teléfono</a></p>',
        ),
      ),
    ).toBe(
      '[Mapa](https://maps.test/?a=1&b=2) [Teléfono](tel:968%2012%2089%2055)\n',
    )
  })

  it('keeps definition rows wrapped in divs tight', () => {
    expect(
      body(
        convert(
          '<dl><div><dt>Oleaje</dt><dd>Suave</dd></div><div><dt>Sombra</dt><dd>Sí</dd></div></dl>',
        ),
      ),
    ).toBe('- **Oleaje**: Suave\n- **Sombra**: Sí\n')
  })

  it('collapses whitespace and joins text split across chunks', () => {
    const sink = createMarkdownSink(PAGE_URL)
    sink.open('main', () => null, true)
    sink.open('p', () => null, true)
    sink.text('  Arena &am')
    sink.text('p;\n   grava  ')
    sink.close()
    sink.close()
    expect(body(sink.finish())).toBe('Arena & grava\n')
  })
})
