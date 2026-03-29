import { ResponsiveImage } from '@/components/responsive-image'
import { parseImageFilename } from '@/lib/images'
import type { Beach, Municipality } from '@/types/beach'

type NearbyBeachItem = {
  beach: Beach
  municipality: Municipality
  slug: string
}

type NearbyCarouselProps = {
  items: NearbyBeachItem[]
}

export function NearbyCarousel({ items }: NearbyCarouselProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section aria-label="Playas cercanas">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Playas cercanas
      </h2>
      <div className="scrollbar-hide flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto pb-3">
        {items.map(({ beach, municipality, slug }) => {
          const firstPicture = beach.pictures?.[0]
          const { baseName, ext } = parseImageFilename(
            firstPicture ?? 'default-beach.png',
          )

          return (
            <a
              key={beach.code}
              aria-label={`Ver playa ${beach.name}`}
              className="group hover:ring-ocean-200 focus-visible:ring-ocean-500 flex w-48 flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none motion-safe:hover:-translate-y-0.5 sm:w-56"
              href={`/playas/${slug}`}
            >
              <div className="relative h-32 overflow-hidden bg-gray-100">
                <ResponsiveImage
                  alt={beach.name}
                  baseName={baseName}
                  className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                  ext={ext}
                  variant="thumb"
                />
              </div>
              <div className="p-3">
                <p className="group-hover:text-ocean-600 line-clamp-1 text-sm font-semibold text-gray-900">
                  {beach.name}
                </p>
                <p className="text-xs text-gray-500">{municipality.name}</p>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
