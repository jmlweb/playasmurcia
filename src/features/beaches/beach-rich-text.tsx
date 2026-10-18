// oxlint-disable @eslint-react/no-array-index-key -- blocks and segments are parsed from static text and never reordered
import type { InlineSegment } from '@/lib/description-markdown'

import { parseDescription } from '@/lib/description-markdown'

const VARIANT_CLASSES = {
  lead: 'text-lg leading-relaxed text-gray-700',
  body: 'leading-relaxed text-gray-600',
} as const

type BeachRichTextProps = {
  text: string
  variant?: keyof typeof VARIANT_CLASSES
}

function Inline({ segments }: { segments: InlineSegment[] }) {
  return segments.map((segment, i) => {
    if (segment.href) {
      return (
        <a
          key={i}
          className="font-medium text-ocean-700 underline underline-offset-2 hover:text-ocean-800"
          href={segment.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {segment.text}
        </a>
      )
    }
    return segment.bold ? (
      <strong key={i} className="font-semibold text-gray-900">
        {segment.text}
      </strong>
    ) : (
      segment.text
    )
  })
}

export function BeachRichText({ text, variant = 'lead' }: BeachRichTextProps) {
  const blocks = parseDescription(text)
  const textClasses = VARIANT_CLASSES[variant]

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === 'list') {
          return (
            <ul
              key={i}
              className={`list-disc space-y-2 pl-5 marker:text-ocean-500 ${textClasses}`}
            >
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline segments={item} />
                </li>
              ))}
            </ul>
          )
        }
        return block.type === 'tip' ? (
          <aside
            key={i}
            className="rounded-r-xl border-l-4 border-ocean-500 bg-ocean-50/60 px-4 py-3 text-gray-700"
          >
            <p className="mb-1 text-xs font-semibold tracking-wide text-ocean-700 uppercase">
              Consejo
            </p>
            <p className="leading-relaxed">
              <Inline segments={block.inline} />
            </p>
          </aside>
        ) : (
          <p key={i} className={textClasses}>
            <Inline segments={block.inline} />
          </p>
        )
      })}
    </div>
  )
}
