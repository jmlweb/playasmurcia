import { createMarkdownSink, isVoidTag } from '@/lib/html-to-markdown'

// Mirrors public/robots.txt so agents reading markdown see the same preferences
export const CONTENT_SIGNAL = 'ai-train=no, search=yes, ai-input=yes'

const MARKDOWN_TYPE = 'text/markdown'
const HTML_TYPE = 'text/html'

const mediaTypeQuality = (accept: string, mediaType: string): number => {
  const entry = accept
    .split(',')
    .map((part) => part.trim().toLowerCase().split(';'))
    .find(([type]) => type.trim() === mediaType)
  if (!entry) return 0
  const qualityParam = entry
    .slice(1)
    .map((param) => param.trim())
    .find((param) => param.startsWith('q='))
  const quality = qualityParam ? Number(qualityParam.slice(2)) : 1
  return Number.isNaN(quality) ? 0 : quality
}

/**
 * True when the client asks for markdown at least as strongly as HTML.
 * Browsers list `text/html` explicitly and never `text/markdown`, so they keep
 * getting HTML; wildcards do not count as a request for either.
 */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false
  const markdownQuality = mediaTypeQuality(accept, MARKDOWN_TYPE)
  return (
    markdownQuality > 0 &&
    markdownQuality >= mediaTypeQuality(accept, HTML_TYPE)
  )
}

/** The router answers 406 unless HTML is acceptable, so render with HTML first. */
export function asHtmlRequest(request: Request): Request {
  const headers = new Headers(request.headers)
  headers.set('Accept', HTML_TYPE)
  return new Request(request, { headers })
}

const isHtmlResponse = (response: Response): boolean =>
  (response.headers.get('content-type') ?? '').includes(HTML_TYPE)

// Shared caches must not hand the HTML copy to a markdown client or vice versa
export function withAcceptVary(response: Response): Response {
  if (!isHtmlResponse(response)) return response
  const headers = new Headers(response.headers)
  headers.append('Vary', 'Accept')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

// Minimal HTMLRewriter surface: the project does not ship workers-types
type RewriterElement = {
  tagName: string
  getAttribute: (name: string) => string | null
  canHaveContent?: boolean
  selfClosing?: boolean
  onEndTag: (handler: () => void) => void
}
type RewriterText = { text: string }
type HtmlRewriter = {
  on: (
    selector: string,
    handlers: { element: (element: RewriterElement) => void },
  ) => HtmlRewriter
  onDocument: (handlers: { text: (text: RewriterText) => void }) => HtmlRewriter
  transform: (response: Response) => Response
}
type HtmlRewriterConstructor = new () => HtmlRewriter

export async function htmlToMarkdown(
  response: Response,
  pageUrl: string,
): Promise<string> {
  const Rewriter = (
    globalThis as unknown as { HTMLRewriter: HtmlRewriterConstructor }
  ).HTMLRewriter
  const sink = createMarkdownSink(pageUrl)
  await new Rewriter()
    .on('*', {
      element: (element) => {
        const tag = element.tagName.toLowerCase()
        const hasEndTag =
          !isVoidTag(tag) &&
          element.canHaveContent !== false &&
          element.selfClosing !== true
        sink.open(tag, (name) => element.getAttribute(name), hasEndTag)
        if (!hasEndTag) return
        try {
          element.onEndTag(() => {
            sink.close()
          })
        } catch {
          // Elements whose end tag the parser can't see would leave the sink's
          // stack unbalanced, so close them right away
          sink.close()
        }
      },
    })
    .onDocument({
      text: (text) => {
        sink.text(text.text)
      },
    })
    .transform(response)
    .arrayBuffer()
  return sink.finish()
}

/**
 * Converts an HTML page response to markdown, keeping its status and headers.
 * Non-HTML responses (redirects, server-function payloads) pass through.
 */
export async function toMarkdownResponse(
  response: Response,
  pageUrl: string,
): Promise<Response> {
  if (!isHtmlResponse(response)) return response
  const markdown = await htmlToMarkdown(response, pageUrl)
  const headers = new Headers(response.headers)
  headers.set('Content-Type', `${MARKDOWN_TYPE}; charset=utf-8`)
  headers.set('Content-Signal', CONTENT_SIGNAL)
  headers.delete('Content-Length')
  headers.delete('ETag')
  if (!(headers.get('Vary') ?? '').toLowerCase().includes('accept')) {
    headers.append('Vary', 'Accept')
  }
  return new Response(markdown, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
