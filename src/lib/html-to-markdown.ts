// Event-driven HTML-to-markdown converter. HTMLRewriter (workerd) feeds it
// open/text/close events; keeping it runtime-free lets Vitest drive it directly.

export type GetAttribute = (name: string) => string | null

export type MarkdownSink = {
  open: (tag: string, getAttribute: GetAttribute, hasEndTag: boolean) => void
  text: (chunk: string) => void
  close: () => void
  finish: () => string
}

type Frame = {
  tag: string
  isSkipped: boolean
  isMain: boolean
  closer: (() => void) | undefined
}

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
])

export const isVoidTag = (tag: string): boolean => VOID_TAGS.has(tag)

// Chrome, widgets and decoration that carry no readable content for agents
const SKIPPED_TAGS = new Set([
  'button',
  'canvas',
  'iframe',
  'nav',
  'noscript',
  'script',
  'select',
  'style',
  'svg',
  'template',
  'textarea',
])

const BLOCK_TAGS = new Set([
  'article',
  'aside',
  'blockquote',
  'details',
  'div',
  'dl',
  'figcaption',
  'figure',
  'footer',
  'header',
  'p',
  'section',
  'summary',
  'table',
  'tr',
])

const HEADING_LEVELS = new Map([
  ['h1', 1],
  ['h2', 2],
  ['h3', 3],
  ['h4', 4],
  ['h5', 5],
  ['h6', 6],
])

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
}

// HTMLRewriter hands over raw source text, entities included
export function decodeEntities(text: string): string {
  return text.replace(
    /&(#x[\da-f]+|#\d+|[a-z]+);/gi,
    (match, entity: string) => {
      if (entity.startsWith('#')) {
        const isHex = entity[1]?.toLowerCase() === 'x'
        const codePoint = Number.parseInt(
          entity.slice(isHex ? 2 : 1),
          isHex ? 16 : 10,
        )
        return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint)
      }
      return NAMED_ENTITIES[entity.toLowerCase()] ?? match
    },
  )
}

const isWordChar = (char: string | undefined): boolean =>
  char !== undefined && /[\p{L}\p{N}]/u.test(char)

const toAbsoluteUrl = (href: string, baseUrl: string): string | null => {
  try {
    // Opaque URLs (tel:) keep raw spaces, which would end a markdown link
    return new URL(href, baseUrl).toString().replaceAll(' ', '%20')
  } catch {
    return null
  }
}

/**
 * Converts the `<main>` element of a page to markdown, with the page title and
 * meta description as front matter. Everything outside `<main>` is ignored.
 */
export function createMarkdownSink(pageUrl: string): MarkdownSink {
  const chunks: string[] = []
  const stack: Frame[] = []
  const lists: { isOrdered: boolean; count: number }[] = []
  let pendingText = ''
  let title = ''
  let description = ''
  let mainDepth = 0
  let skipDepth = 0
  let liDepth = 0
  // List items and links must stay on one line to remain valid markdown
  let collapseDepth = 0
  // Set when a tag sits between two text runs: adjacent inline elements
  // (e.g. tag chips laid out with CSS gap) need a space between their words
  let hasTagBoundary = false

  const isEmitting = () => mainDepth > 0 && skipDepth === 0
  const lastChunk = () => chunks.at(-1) ?? ''
  const isAtLineStart = () => chunks.length === 0 || lastChunk().endsWith('\n')

  const push = (value: string) => {
    if (value) chunks.push(value)
  }

  const trimTrailingSpaces = () => {
    while (chunks.length > 0) {
      const trimmed = lastChunk().replace(/[ \t]+$/, '')
      if (trimmed) {
        chunks[chunks.length - 1] = trimmed
        return
      }
      chunks.pop()
    }
  }

  // Only 0, 1 or 2+ matters, so a couple of trailing chunks are enough
  const trailingNewlines = () => {
    const tail = chunks.slice(-2).join('')
    return /\n*$/.exec(tail)?.[0].length ?? 0
  }

  const breakLine = () => {
    trimTrailingSpaces()
    if (chunks.length > 0 && trailingNewlines() === 0) push('\n')
  }

  const breakBlock = () => {
    trimTrailingSpaces()
    if (chunks.length === 0) return
    push('\n'.repeat(Math.max(0, 2 - trailingNewlines())))
  }

  // Inside list items and links, block layout collapses to one line. The
  // separator is deferred until the next text so it never lands right after a
  // list marker or an opening link bracket.
  let hasPendingSeparator = false
  let collapsedBlockCount = 0
  const separate = () => {
    if (collapseDepth === 0) {
      breakBlock()
      return
    }
    hasPendingSeparator = true
    collapsedBlockCount += 1
  }

  const flushText = () => {
    if (!pendingText) return
    const raw = pendingText
    pendingText = ''
    const top = stack.at(-1)
    if (top?.tag === 'title') {
      title += decodeEntities(raw)
      return
    }
    if (!isEmitting()) return

    let text = decodeEntities(raw).replace(/\s+/g, ' ')
    const previous = lastChunk()
    if (isAtLineStart() || previous.endsWith(' ')) text = text.trimStart()
    if (!text) return
    if (
      hasPendingSeparator &&
      collapseDepth > 0 &&
      /[^\s[*_]$/.test(previous)
    ) {
      text = ` · ${text.trimStart()}`
    } else if (
      hasTagBoundary &&
      isWordChar(previous.at(-1)) &&
      isWordChar(text[0])
    ) {
      text = ` ${text}`
    }
    hasPendingSeparator = false
    hasTagBoundary = false
    push(text)
  }

  // Returns the closer; an element that ends up empty is removed entirely,
  // marker included
  const wrapInline = (before: string, after: () => string) => {
    const start = chunks.length
    push(before)
    const contentStart = chunks.length
    return () => {
      trimTrailingSpaces()
      if (chunks.length <= contentStart) {
        chunks.length = start
        return
      }
      push(after())
    }
  }

  /** Emits an element's opening markup and returns what to emit on close. */
  const openEmitting = (
    tag: string,
    getAttribute: GetAttribute,
  ): (() => void) | undefined => {
    const headingLevel = HEADING_LEVELS.get(tag)
    if (headingLevel !== undefined) {
      if (collapseDepth > 0) {
        separate()
        return separate
      }
      breakBlock()
      const closeHeading = wrapInline(`${'#'.repeat(headingLevel)} `, () => '')
      return () => {
        closeHeading()
        breakBlock()
      }
    }

    // Rows wrapping dt/dd pairs: dt already starts its own line
    if (BLOCK_TAGS.has(tag) && stack.at(-1)?.tag === 'dl') return undefined
    if (BLOCK_TAGS.has(tag)) {
      separate()
      return separate
    }

    switch (tag) {
      case 'ul':
      case 'ol': {
        if (liDepth === 0) breakBlock()
        lists.push({ isOrdered: tag === 'ol', count: 0 })
        return () => {
          lists.pop()
          if (liDepth === 0) breakBlock()
        }
      }
      case 'li': {
        const list = lists.at(-1)
        breakLine()
        if (list) list.count += 1
        const marker = list?.isOrdered ? `${list.count}. ` : '- '
        push(`${'  '.repeat(Math.max(0, lists.length - 1))}${marker}`)
        hasPendingSeparator = false
        liDepth += 1
        collapseDepth += 1
        return () => {
          liDepth -= 1
          collapseDepth -= 1
          breakLine()
        }
      }
      case 'dt': {
        breakLine()
        return wrapInline('- **', () => '**:')
      }
      case 'dd': {
        push(' ')
        return breakLine
      }
      case 'br': {
        breakLine()
        return undefined
      }
      case 'strong':
      case 'b':
        return wrapInline('**', () => '**')
      case 'em':
      case 'i':
        return wrapInline('_', () => '_')
      case 'a': {
        const href = getAttribute('href')
        const url =
          href && !href.startsWith('#') ? toAbsoluteUrl(href, pageUrl) : null
        if (!url) return undefined
        // Buttons rendered as sibling links have no text between them
        const linkStart = chunks.length
        if (lastChunk().endsWith(')')) push(' ')
        const closeLink = wrapInline('[', () => `](${url})`)
        hasPendingSeparator = false
        collapseDepth += 1
        const blockCountAtOpen = collapsedBlockCount
        return () => {
          collapseDepth -= 1
          closeLink()
          // Drop the spacer too when the link turned out empty
          if (chunks.length === linkStart + 1 && lastChunk() === ' ')
            chunks.pop()
          // A card-style link wrapping blocks is a block itself, so sibling
          // cards don't run together on one line
          if (collapsedBlockCount > blockCountAtOpen) separate()
        }
      }
      case 'img': {
        const alt = getAttribute('alt')?.trim()
        const src = getAttribute('src')
        const url = src ? toAbsoluteUrl(src, pageUrl) : null
        if (alt && url) push(`![${alt}](${url})`)
        return undefined
      }
      default:
        return undefined
    }
  }

  return {
    open: (tag, getRawAttribute, hasEndTag) => {
      flushText()
      // Attribute values arrive as raw source, entities included
      const getAttribute: GetAttribute = (name) => {
        const value = getRawAttribute(name)
        return value === null ? null : decodeEntities(value)
      }
      hasTagBoundary = true
      if (tag === 'meta' && getAttribute('name') === 'description') {
        description = getAttribute('content') ?? ''
      }

      const isSkipped =
        SKIPPED_TAGS.has(tag) ||
        getAttribute('aria-hidden') === 'true' ||
        getAttribute('hidden') !== null
      const closer =
        isEmitting() && !isSkipped ? openEmitting(tag, getAttribute) : undefined
      if (!hasEndTag || VOID_TAGS.has(tag)) return

      const frame: Frame = { tag, isSkipped, isMain: tag === 'main', closer }

      if (frame.isMain) mainDepth += 1
      if (isSkipped) skipDepth += 1
      stack.push(frame)
    },
    text: (chunk) => {
      pendingText += chunk
    },
    close: () => {
      flushText()
      hasTagBoundary = true
      const frame = stack.pop()
      if (!frame) return
      if (frame.isSkipped) skipDepth -= 1
      else if (isEmitting()) frame.closer?.()
      if (frame.isMain) {
        mainDepth -= 1
        breakBlock()
      }
    },
    finish: () => {
      flushText()
      const frontMatter = [
        '---',
        `title: ${JSON.stringify(decodeEntities(title).trim())}`,
        ...(description
          ? [`description: ${JSON.stringify(description.trim())}`]
          : []),
        `url: ${JSON.stringify(pageUrl)}`,
        '---',
      ].join('\n')
      const body = chunks.join('').trim()
      return `${frontMatter}\n\n${body}\n`
    },
  }
}
