import type { Beach, Municipality, Tag } from "@/types/beach"

const OccupancyConfig = {
  low: { label: "Baja ocupación", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  medium: { label: "Ocupación media", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  high: { label: "Alta ocupación", className: "bg-rose-50 text-rose-700 ring-1 ring-rose-200" },
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
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-ocean-200 focus:ring-2 focus:ring-ocean-500 focus:outline-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={beach.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {beach.occupancyLevel && (
          <span
            className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${OccupancyConfig[beach.occupancyLevel].className}`}
          >
            {OccupancyConfig[beach.occupancyLevel].label}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
          {beach.name}
        </h3>
        <p className="mb-3 text-sm text-gray-500">{municipality.name}</p>
        {visibleTags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-ocean-50 px-2.5 py-0.5 text-xs font-medium text-ocean-700"
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
