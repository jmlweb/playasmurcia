import type { Tag } from "@/types/beach"

interface TagsSectionProps {
  tagIndices: Array<number>
  allTags: Array<Tag>
}

export function TagsSection({ tagIndices, allTags }: TagsSectionProps) {
  const resolvedTags = tagIndices
    .map((i) => allTags[i])
    .filter(Boolean)

  if (resolvedTags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Etiquetas">
      {resolvedTags.map((tag) => (
        <span
          key={tag.id}
          className="rounded-full bg-ocean-50 px-3 py-1 text-sm font-medium text-ocean-700"
        >
          {tag.name}
        </span>
      ))}
    </div>
  )
}
