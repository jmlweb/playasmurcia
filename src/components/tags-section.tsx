import type { Tag } from '@/types/beach'

type TagsSectionProps = {
  tagIndices: number[]
  allTags: Tag[]
}

export function TagsSection({ tagIndices, allTags }: TagsSectionProps) {
  const resolvedTags = tagIndices.map((i) => allTags[i]).filter(Boolean)

  if (resolvedTags.length === 0) {
    return null
  }

  return (
    <div aria-label="Etiquetas" className="flex flex-wrap gap-2">
      {resolvedTags.map((tag) => (
        <span
          key={tag.id}
          className="bg-ocean-50 text-ocean-700 rounded-full px-3 py-1 text-sm font-medium"
        >
          {tag.name}
        </span>
      ))}
    </div>
  )
}
