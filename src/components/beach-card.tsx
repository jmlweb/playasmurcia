import type { Beach, Municipality, Tag } from "@/types/beach"
import type { CardWeather } from "@/lib/open-meteo"
import { parseImageFilename } from "@/lib/images"
import { ResponsiveImage } from "@/components/responsive-image"

const OccupancyConfig = {
  low: { label: "Baja ocupación", className: "bg-emerald-700 text-emerald-100" },
  medium: { label: "Ocupación media", className: "bg-amber-700 text-amber-100" },
  high: { label: "Alta ocupación", className: "bg-rose-700 text-rose-100" },
} as const

const WeatherIconMap: Record<string, string> = {
  sunny: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  rain: '🌧️',
  storm: '⛈️',
  fog: '🌫️',
  haze: '🌫️',
}

interface BeachCardProps {
  beach: Beach
  municipality: Municipality
  tags: Array<Tag>
  slug: string
  eager?: boolean
  weather?: CardWeather
}

export function BeachCard({ beach, municipality, tags, slug, eager, weather }: BeachCardProps) {
  const firstPicture = beach.pictures?.[0]
  const { baseName, ext } = parseImageFilename(firstPicture ?? 'default-beach.png')
  const visibleTags = (beach.tags ?? []).slice(0, 3).map((i) => tags[i]).filter(Boolean)

  return (
    <a
      href={`/playas/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-ocean-200 focus:ring-2 focus:ring-ocean-500 focus:outline-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <ResponsiveImage
          baseName={baseName}
          ext={ext}
          variant="thumb"
          priority={eager ? "high" : "low"}
          alt={beach.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        {weather && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm">
            <span aria-hidden="true">{WeatherIconMap[weather.icon] ?? '🌡️'}</span>
            {weather.temp}°
          </span>
        )}
        {beach.occupancyLevel && (
          <span
            className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${OccupancyConfig[beach.occupancyLevel].className}`}
          >
            {OccupancyConfig[beach.occupancyLevel].label}
          </span>
        )}
        {visibleTags.length > 0 && (
          <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
          {beach.name}
        </h3>
        <p className="text-sm text-gray-500">{municipality.name}</p>
      </div>
    </a>
  )
}
