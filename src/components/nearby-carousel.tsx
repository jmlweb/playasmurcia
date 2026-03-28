import type { Beach, Municipality } from "@/types/beach"
import { parseImageFilename } from "@/lib/images"
import { ResponsiveImage } from "@/components/responsive-image"

interface NearbyBeachItem {
  beach: Beach
  municipality: Municipality
  slug: string
}

interface NearbyCarouselProps {
  items: Array<NearbyBeachItem>
}

export function NearbyCarousel({ items }: NearbyCarouselProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section aria-label="Playas cercanas">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Playas cercanas</h2>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory scroll-pl-4">
        {items.map(({ beach, municipality, slug }) => {
          const firstPicture = beach.pictures?.[0]
          const { baseName, ext } = parseImageFilename(firstPicture ?? 'default-beach.png')

          return (
            <a
              key={beach.code}
              href={`/playas/${slug}`}
              aria-label={`Ver playa ${beach.name}`}
              className="group flex w-48 sm:w-56 flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-ocean-200 focus:ring-2 focus:ring-ocean-500 focus:outline-none"
            >
              <div className="relative h-32 overflow-hidden bg-gray-100">
                <ResponsiveImage
                  baseName={baseName}
                  ext={ext}
                  variant="thumb"
                  alt={beach.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-semibold text-gray-900 group-hover:text-ocean-600">
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
