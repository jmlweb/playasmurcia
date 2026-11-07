// oxlint-disable @eslint-react/no-array-index-key -- blocks and segments are parsed from static text and never reordered
import type { InlineSegment } from '@/lib/description-markdown'

import { parseDescription } from '@/lib/description-markdown'

const VARIANT_CLASSES = {
  lead: 'max-w-[58ch] text-lg leading-[1.6] text-pretty text-gray-700',
  body: 'max-w-[58ch] leading-relaxed text-pretty text-gray-600',
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
            className="max-w-[58ch] rounded-xl bg-ocean-50 px-4 py-3 text-gray-700"
          >
            <p className="mb-1 text-sm font-semibold text-ocean-700">Consejo</p>
            <p className="leading-relaxed first-letter:uppercase">
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
