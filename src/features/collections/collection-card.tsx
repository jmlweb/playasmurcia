import { Link } from '@tanstack/react-router'

import { ResponsiveImage } from '@/components/ui/responsive-image'
import { parseImageFilename } from '@/lib/images'

type CollectionCardProps = {
  slug: string
  title: string
  description: string
  beachCount: number
  coverPicture?: string
}

export function CollectionCard({
  slug,
  title,
  description,
  beachCount,
  coverPicture,
}: CollectionCardProps) {
  const { baseName, ext } = parseImageFilename(coverPicture ?? '')

  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1"
      params={{ slug }}
      to="/colecciones/$slug"
    >
      <div className="aspect-4/3 overflow-hidden bg-linear-to-br from-ocean-700 to-ocean-900">
        {coverPicture && (
          <ResponsiveImage
            alt=""
            aria-hidden="true"
            baseName={baseName}
            className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
            ext={ext}
            variant="thumb"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
        <p className="mt-auto text-sm text-gray-600">
          <strong className="font-semibold text-gray-900">{beachCount}</strong>{' '}
          {beachCount === 1 ? 'playa' : 'playas'}
        </p>
      </div>
    </Link>
  )
}
