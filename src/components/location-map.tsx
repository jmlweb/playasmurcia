import { useState } from 'react'

type LocationMapProps = {
  coordinates: [number, number]
  beachName: string
}

export function LocationMap({ coordinates, beachName }: LocationMapProps) {
  const [lat, lng] = coordinates
  const [imgError, setImgError] = useState(false)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=14&size=600x300&maptype=mapnik&markers=${lat},${lng},red`

  return (
    <section aria-label="Ubicación">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Ubicación</h2>
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 shadow-sm">
        <a
          aria-label={`Ver ${beachName} en Google Maps (abre en nueva pestaña)`}
          className="group focus-visible:ring-ocean-500 block focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          href={mapsUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="relative">
            {imgError ? (
              <div className="flex h-48 w-full items-center justify-center bg-gray-100 sm:h-64">
                <span className="text-sm text-gray-500">
                  Ver en Google Maps
                </span>
              </div>
            ) : (
              <img
                alt={`Mapa de ubicación de ${beachName}`}
                className="h-48 w-full object-cover sm:h-64"
                height={300}
                loading="lazy"
                src={staticMapUrl}
                width={600}
                onError={() => {
                  setImgError(true)
                }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                Abrir en Google Maps
              </span>
            </div>
          </div>
        </a>
        <div className="border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
        </div>
      </div>
    </section>
  )
}
