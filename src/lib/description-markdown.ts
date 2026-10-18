// Beach descriptions use a deliberately tiny markdown subset: paragraphs
// separated by blank lines, **bold**, and an optional "**Consejo:**" tip
// paragraph. A full markdown library would be overkill for that.

export type InlineSegment = { text: string; bold: boolean }

export type DescriptionBlock = {
  type: 'paragraph' | 'tip'
  inline: InlineSegment[]
}

const TIP_PREFIX = /^\*\*Consejo:\*\*\s*/
const BOLD = /\*\*(.+?)\*\*/g

const splitParagraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter((p) => p.length > 0)

const parseInline = (text: string): InlineSegment[] =>
  text
    .split(BOLD)
    // split() with a capture group alternates plain and captured text
    .map((part, i) => ({ text: part, bold: i % 2 === 1 }))
    .filter((segment) => segment.text.length > 0)

export function parseDescription(text: string): DescriptionBlock[] {
  return splitParagraphs(text).map((paragraph) =>
    TIP_PREFIX.test(paragraph)
      ? { type: 'tip', inline: parseInline(paragraph.replace(TIP_PREFIX, '')) }
      : { type: 'paragraph', inline: parseInline(paragraph) },
  )
}

export function stripDescriptionMarkdown(text: string): string {
  return splitParagraphs(text)
    .map((p) => p.replace(BOLD, '$1'))
    .join(' ')
}
