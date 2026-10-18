// Beach descriptions and access texts use a deliberately tiny markdown subset:
// paragraphs separated by blank lines, "- " bullet lists, **bold**,
// [links](https://…) and an optional "**Consejo:**" tip paragraph. A full
// markdown library would be overkill for that.

export type InlineSegment = { text: string; bold: boolean; href?: string }

export type DescriptionBlock =
  | { type: 'paragraph' | 'tip'; inline: InlineSegment[] }
  | { type: 'list'; items: InlineSegment[][] }

const TIP_PREFIX = /^\*\*Consejo:\*\*\s*/
const BOLD = /\*\*(.+?)\*\*/g
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g
const LIST_ITEM = /^-\s+/
// Anything else (javascript:, data:, relative paths) renders as plain text
const SAFE_HREF = /^https?:\/\//i

const splitBlocks = (text: string): string[][] =>
  text
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    )
    .filter((lines) => lines.length > 0)

const isList = (lines: string[]): boolean =>
  lines.every((line) => LIST_ITEM.test(line))

const toItems = (lines: string[]): string[] =>
  lines.map((line) => line.replace(LIST_ITEM, ''))

const plain = (text: string): InlineSegment => ({ text, bold: false })

const parseInline = (text: string): InlineSegment[] => {
  const matches = [...text.matchAll(INLINE)]
  const ends = [0, ...matches.map((m) => m.index + m[0].length)]

  return matches
    .flatMap((match, i): InlineSegment[] => {
      const before = plain(text.slice(ends[i], match.index))
      const [, bold, label, href] = match
      if (bold !== undefined) return [before, { text: bold, bold: true }]
      return [
        before,
        SAFE_HREF.test(href)
          ? { text: label, bold: false, href }
          : plain(label),
      ]
    })
    .concat(plain(text.slice(ends.at(-1))))
    .filter((segment) => segment.text.length > 0)
}

export function parseDescription(text: string): DescriptionBlock[] {
  return splitBlocks(text).map((lines): DescriptionBlock => {
    if (isList(lines)) {
      return { type: 'list', items: toItems(lines).map(parseInline) }
    }
    const paragraph = lines.join(' ')
    return TIP_PREFIX.test(paragraph)
      ? { type: 'tip', inline: parseInline(paragraph.replace(TIP_PREFIX, '')) }
      : { type: 'paragraph', inline: parseInline(paragraph) }
  })
}

export function stripDescriptionMarkdown(text: string): string {
  return splitBlocks(text)
    .flatMap((lines) => (isList(lines) ? toItems(lines) : [lines.join(' ')]))
    .map((p) => p.replace(BOLD, '$1').replace(LINK, '$1'))
    .join(' ')
}
