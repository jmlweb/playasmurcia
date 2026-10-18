import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  CONTENT_SIGNAL,
  asHtmlRequest,
  prefersMarkdown,
  toMarkdownResponse,
  withAcceptVary,
  withDiscoveryLinks,
} from '@/lib/markdown-negotiation'

type ElementHandler = {
  element: (element: {
    tagName: string
    getAttribute: (name: string) => string | null
    canHaveContent: boolean
    selfClosing: boolean
    onEndTag: (handler: () => void) => void
  }) => void
}

// Just enough of HTMLRewriter to drive the converter in Vitest
class FakeHtmlRewriter {
  private elementHandler?: ElementHandler
  private textHandler?: (text: { text: string }) => void

  on(_selector: string, handler: ElementHandler) {
    this.elementHandler = handler
    return this
  }

  onDocument(handler: { text: (text: { text: string }) => void }) {
    this.textHandler = handler.text
    return this
  }

  // The converter only awaits arrayBuffer(), which is where events are emitted
  transform(response: Response) {
    const emit = async () => {
      const endHandlers: (() => void)[] = []
      for (const [, closing, tag, text] of (await response.text()).matchAll(
        /<(\/)?([a-z0-9]+)[^>]*>|([^<]+)/gi,
      )) {
        if (text !== undefined) {
          this.textHandler?.({ text })
        } else if (closing) {
          endHandlers.pop()?.()
        } else if (tag) {
          this.elementHandler?.element({
            tagName: tag,
            getAttribute: () => null,
            canHaveContent: true,
            selfClosing: false,
            onEndTag: (handler) => endHandlers.push(handler),
          })
        }
      }
      return new ArrayBuffer(0)
    }
    return { arrayBuffer: emit }
  }
}

describe('prefersMarkdown', () => {
  it.each([
    ['text/markdown', true],
    ['text/markdown, text/html;q=0.9', true],
    ['text/html, text/markdown', true],
    ['text/markdown;q=0.5, text/html', false],
    ['text/html,application/xhtml+xml,*/*;q=0.8', false],
    ['*/*', false],
    ['text/markdown;q=0', false],
    [null, false],
  ])('%s -> %s', (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected)
  })
})

describe('asHtmlRequest', () => {
  it('replaces Accept and keeps the URL and other headers', () => {
    const request = asHtmlRequest(
      new Request('https://www.playasmurcia.com/playas/cala', {
        headers: { accept: 'text/markdown', 'user-agent': 'agent' },
      }),
    )
    expect(request.url).toBe('https://www.playasmurcia.com/playas/cala')
    expect(request.headers.get('accept')).toBe('text/html')
    expect(request.headers.get('user-agent')).toBe('agent')
  })
})

describe('withAcceptVary', () => {
  it('adds Vary: Accept to HTML responses only', () => {
    const html = withAcceptVary(
      new Response('<p/>', { headers: { 'content-type': 'text/html' } }),
    )
    const json = withAcceptVary(
      new Response('{}', { headers: { 'content-type': 'application/json' } }),
    )
    expect(html.headers.get('vary')).toBe('Accept')
    expect(json.headers.get('vary')).toBeNull()
  })
})

describe('toMarkdownResponse', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('passes non-HTML responses through', async () => {
    const redirect = new Response(null, {
      status: 307,
      headers: { location: '/' },
    })
    expect(await toMarkdownResponse(redirect, 'https://x.test/')).toBe(redirect)
  })

  it('converts HTML and sets markdown headers', async () => {
    vi.stubGlobal('HTMLRewriter', FakeHtmlRewriter)
    const response = await toMarkdownResponse(
      new Response(
        '<html><head><title>Cala</title></head><main><h1>Cala</h1></main></html>',
        {
          status: 200,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'content-length': '99',
            etag: '"abc"',
            vary: 'Accept',
            'x-frame-options': 'SAMEORIGIN',
          },
        },
      ),
      'https://www.playasmurcia.com/playas/cala',
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe(
      'text/markdown; charset=utf-8',
    )
    expect(response.headers.get('content-signal')).toBe(CONTENT_SIGNAL)
    expect(response.headers.get('content-length')).toBeNull()
    expect(response.headers.get('etag')).toBeNull()
    expect(response.headers.get('vary')).toBe('Accept')
    expect(response.headers.get('x-frame-options')).toBe('SAMEORIGIN')
    expect(await response.text()).toContain('# Cala')
  })
})

describe('withDiscoveryLinks', () => {
  const html = () =>
    new Response('<p>hola</p>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })

  it('links the homepage to its markdown copy and the sitemap', () => {
    const link = withDiscoveryLinks(
      html(),
      'https://www.playasmurcia.com/',
    ).headers.get('Link')

    expect(link).toContain('</>; rel="alternate"; type="text/markdown"')
    expect(link).toContain(
      '</sitemap.xml>; rel="sitemap"; type="application/xml"',
    )
  })

  it('links other pages only to their markdown copy', () => {
    const link = withDiscoveryLinks(
      html(),
      'https://www.playasmurcia.com/playas/la-manga?x=1',
    ).headers.get('Link')

    expect(link).toBe(
      '</playas/la-manga>; rel="alternate"; type="text/markdown"',
    )
  })

  it('leaves non-HTML responses untouched', () => {
    const response = new Response('{}', {
      headers: { 'Content-Type': 'application/json' },
    })

    expect(withDiscoveryLinks(response, 'https://www.playasmurcia.com/')).toBe(
      response,
    )
  })
})
