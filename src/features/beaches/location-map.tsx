import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const IDLE_TIMEOUT_MS = 8_000
const OBSERVER_MARGIN = '400px'

type LocationMapProps = {
  coordinates: [number, number]
  beachName: string
}

const LeafletMap = lazy(() =>
  import('@/features/beaches/leaflet-map').then((m) => ({
    default: m.LeafletMap,
  })),
)

function staticMapUrl(lat: number, lng: number) {
  return `https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/pin-l+e74c3c(${lng},${lat})/${lng},${lat},14,0/600x360@2x?access_token=${MAPBOX_TOKEN}`
}

function StaticMapPlaceholder({
  lat,
  lng,
  onActivate,
}: {
  lat: number
  lng: number
  onActivate: () => void
}) {
  return (
    <button
      className="group relative w-full cursor-pointer overflow-hidden"
      style={{ height: 'min(360px, 60vh)' }}
      type="button"
      onClick={onActivate}
    >
      <img
        alt="Mapa estático de la ubicación"
        className="h-full w-full object-cover"
        loading="lazy"
        src={staticMapUrl(lat, lng)}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
        <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-md backdrop-blur-sm transition-transform group-hover:scale-105">
          Toca para interactuar con el mapa
        </span>
      </div>
    </button>
  )
}

function useLoadTrigger(
  ref: React.RefObject<HTMLElement | null>,
): [boolean, () => void] {
  const [shouldLoad, setShouldLoad] = useState(false)
  const activate = () => {
    setShouldLoad(true)
  }

  useEffect(() => {
    if (shouldLoad) return

    const el = ref.current
    if (!el) return

    // Trigger 1: IntersectionObserver with generous margin
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShouldLoad(true)
      },
      { rootMargin: OBSERVER_MARGIN },
    )
    observer.observe(el)

    // Trigger 2: idle timeout — preload after inactivity
    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, IDLE_TIMEOUT_MS)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [shouldLoad, ref])

  return [shouldLoad, activate]
}

export function LocationMap({ coordinates, beachName }: LocationMapProps) {
  const [lat, lng] = coordinates
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoad, activate] = useLoadTrigger(sectionRef)

  return (
    <section ref={sectionRef} aria-label="Ubicación">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Ubicación</h2>
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 shadow-sm">
        {shouldLoad ? (
          <Suspense
            fallback={
              <StaticMapPlaceholder lat={lat} lng={lng} onActivate={activate} />
            }
          >
            <LeafletMap beachName={beachName} coordinates={coordinates} />
          </Suspense>
        ) : (
          <StaticMapPlaceholder lat={lat} lng={lng} onActivate={activate} />
        )}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
          <a
            aria-label={`Cómo llegar a ${beachName} (se abre en Google Maps en una pestaña nueva)`}
            className="inline-flex items-center gap-1.5 rounded-full bg-ocean-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            href={directionsUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Cómo llegar
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
