import type { Tag } from '@/types/beach'

type TagsSectionProps = {
  tagIndices: number[]
  allTags: Tag[]
  variant?: 'light' | 'dark'
}

export function TagsSection({
  tagIndices,
  allTags,
  variant = 'light',
}: TagsSectionProps) {
  const resolvedTags = tagIndices.map((i) => allTags[i]).filter(Boolean)

  if (resolvedTags.length === 0) {
    return null
  }

  const tagClass =
    variant === 'dark'
      ? 'bg-white/15 text-white backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-sm font-medium'
      : 'bg-ocean-50 text-ocean-700 rounded-full px-3 py-1 text-sm font-medium'

  return (
    <div aria-label="Etiquetas" className="flex flex-wrap gap-2">
      {resolvedTags.map((tag) => (
        <span key={tag.id} className={tagClass}>
          {tag.name}
        </span>
      ))}
    </div>
  )
}
