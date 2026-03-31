import { lazy, Suspense } from 'react'

type LocationMapProps = {
  coordinates: [number, number]
  beachName: string
}

const LeafletMap = lazy(() =>
  import('@/features/beaches/leaflet-map').then((m) => ({
    default: m.LeafletMap,
  })),
)

function MapPlaceholder() {
  return (
    <div
      className="bg-ocean-50 flex items-center justify-center rounded-2xl"
      style={{ height: 'min(360px, 60vh)' }}
    >
      <div className="text-center">
        <svg
          aria-hidden="true"
          className="text-ocean-300 mx-auto mb-2 h-8 w-8 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          />
          <path
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          />
        </svg>
        <p className="text-ocean-400 text-sm font-medium">Cargando mapa...</p>
      </div>
    </div>
  )
}

export function LocationMap({ coordinates, beachName }: LocationMapProps) {
  const [lat, lng] = coordinates
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  return (
    <section aria-label="Ubicación">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Ubicación</h2>
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 shadow-sm">
        <Suspense fallback={<MapPlaceholder />}>
          <LeafletMap beachName={beachName} coordinates={coordinates} />
        </Suspense>
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
          <a
            className="text-ocean-600 hover:text-ocean-700 text-xs font-medium hover:underline"
            href={mapsUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Ver en Google Maps →
          </a>
        </div>
      </div>
    </section>
  )
}
