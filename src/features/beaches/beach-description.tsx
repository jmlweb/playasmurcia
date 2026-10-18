// oxlint-disable @eslint-react/no-array-index-key -- blocks and segments are parsed from static text and never reordered
import type { InlineSegment } from '@/lib/description-markdown'

import { parseDescription } from '@/lib/description-markdown'

type BeachDescriptionProps = {
  text: string
}

function Inline({ segments }: { segments: InlineSegment[] }) {
  return segments.map((segment, i) =>
    segment.bold ? (
      <strong key={i} className="font-semibold text-gray-900">
        {segment.text}
      </strong>
    ) : (
      segment.text
    ),
  )
}

export function BeachDescription({ text }: BeachDescriptionProps) {
  const blocks = parseDescription(text)

  return (
    <div className="space-y-4">
      {blocks.map((block, i) =>
        block.type === 'tip' ? (
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
          <p key={i} className="text-lg leading-relaxed text-gray-700">
            <Inline segments={block.inline} />
          </p>
        ),
      )}
    </div>
  )
}
