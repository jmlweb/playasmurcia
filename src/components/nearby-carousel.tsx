import type { Beach, Municipality } from "@/types/beach"

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
      <div className="flex gap-4 overflow-x-auto pb-3">
        {items.map(({ beach, municipality, slug }) => {
          const firstPicture = beach.pictures?.[0]
          const imageSrc = firstPicture
            ? `/pictures/${firstPicture}`
            : "/pictures/default-beach.svg"

          return (
            <a
              key={beach.code}
              href={`/playas/${slug}`}
              aria-label={`Ver playa ${beach.name}`}
              className="group flex w-48 flex-shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <div className="relative h-32 overflow-hidden bg-gray-100">
                <img
                  src={imageSrc}
                  alt={beach.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
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
