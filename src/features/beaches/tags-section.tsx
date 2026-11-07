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
      ? "text-sm font-medium text-white/90 not-last:after:ml-2 not-last:after:content-['·']"
      : 'bg-ocean-50 text-ocean-700 rounded-full px-3 py-1 text-sm font-medium'

  return (
    <ul aria-label="Etiquetas" className="flex flex-wrap gap-x-2 gap-y-1">
      {resolvedTags.map((tag) => (
        <li key={tag.id} className={tagClass}>
          {tag.name}
        </li>
      ))}
    </ul>
  )
}
