import type { Beach, Municipality, Tag } from "@/types/beach"

const OccupancyConfig = {
  low: { label: "Baja ocupación", className: "bg-green-100 text-green-800" },
  medium: { label: "Ocupación media", className: "bg-yellow-100 text-yellow-800" },
  high: { label: "Alta ocupación", className: "bg-red-100 text-red-800" },
} as const

interface BeachCardProps {
  beach: Beach
  municipality: Municipality
  tags: Array<Tag>
  slug: string
}

export function BeachCard({ beach, municipality, tags, slug }: BeachCardProps) {
  const firstPicture = beach.pictures?.[0]
  const imageSrc = firstPicture ? `/pictures/${firstPicture}` : "/pictures/default-beach.svg"
  const visibleTags = (beach.tags ?? []).slice(0, 3).map((i) => tags[i]).filter(Boolean)

  return (
    <a
      href={`/playas/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={beach.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {beach.occupancyLevel && (
          <span
            className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${OccupancyConfig[beach.occupancyLevel].className}`}
          >
            {OccupancyConfig[beach.occupancyLevel].label}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
          {beach.name}
        </h3>
        <p className="mb-3 text-sm text-gray-500">{municipality.name}</p>
        {visibleTags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}
