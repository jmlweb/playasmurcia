import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import type { AccessRestriction } from '@/lib/beach-notices'
import type { NearestMarina } from '@/lib/marinas'

import { BeachRichText } from '@/features/beaches/beach-rich-text'
import {
  MAP_PIN_HEIGHT,
  MAP_PIN_WIDTH,
  mapPinDataUrl,
} from '@/features/beaches/map-pin'
import { MAPBOX_STYLE } from '@/features/beaches/map-style'
import { formatDistance } from '@/lib/geo'

import { AccessRestrictionNotice } from './access-restriction-notice'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const IDLE_TIMEOUT_MS = 8_000
const OBSERVER_MARGIN = '400px'

type LocationMapProps = {
  coordinates: [number, number]
  beachName: string
  /** Editorial directions shown above the map when the beach has them */
  access?: string
  /** Street or locality line from the official source */
  address?: string
  postalCode?: string
  /** Published summer vehicle limits, shown under the directions */
  accessRestriction?: AccessRestriction
  /** Straight-line nearest leisure port, for visitors arriving by boat */
  nearestMarina?: NearestMarina
}

const LeafletMap = lazy(() =>
  import('@/features/beaches/leaflet-map').then((m) => ({
    default: m.LeafletMap,
  })),
)

// No Mapbox pin overlay: the app draws its own pin over the image so the
// static and live maps share one marker
function staticMapUrl(lat: number, lng: number) {
  return `https://api.mapbox.com/styles/v1/mapbox/${MAPBOX_STYLE}/static/${lng},${lat},14,0/600x360@2x?access_token=${MAPBOX_TOKEN}`
}

function StaticMapPlaceholder({
  lat,
  lng,
  beachName,
  onActivate,
}: {
  lat: number
  lng: number
  beachName: string
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
        alt={`Mapa de ${beachName}`}
        className="h-full w-full object-cover"
        loading="lazy"
        src={staticMapUrl(lat, lng)}
      />
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
        height={MAP_PIN_HEIGHT}
        src={mapPinDataUrl}
        width={MAP_PIN_WIDTH}
      />
      <div className="absolute inset-0 flex items-end justify-center bg-black/0 pb-4 transition-colors group-hover:bg-black/10">
        <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-md">
          Abrir mapa
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

export function LocationMap({
  coordinates,
  beachName,
  access,
  address,
  postalCode,
  accessRestriction,
  nearestMarina,
}: LocationMapProps) {
  const [lat, lng] = coordinates
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoad, activate] = useLoadTrigger(sectionRef)

  return (
    <section ref={sectionRef} aria-labelledby="como-llegar-heading">
      <h2
        className="mb-4 text-3xl font-normal tracking-tight text-gray-900"
        id="como-llegar-heading"
      >
        Cómo llegar
      </h2>
      {access && (
        <div className="mb-6">
          <BeachRichText text={access} variant="body" />
        </div>
      )}
      {accessRestriction && (
        <div className="mb-6">
          <AccessRestrictionNotice restriction={accessRestriction} />
        </div>
      )}
      {(address !== undefined || postalCode !== undefined) && (
        <p className="mb-6 text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Dirección:</span>{' '}
          {[address, postalCode && `CP ${postalCode}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
      {nearestMarina && (
        <p className="mb-6 text-sm text-gray-700">
          <span className="font-semibold text-gray-900">
            Puerto deportivo más cercano:
          </span>{' '}
          {nearestMarina.url ? (
            <a
              className="underline decoration-gray-400 underline-offset-2 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
              href={nearestMarina.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {nearestMarina.name}
            </a>
          ) : (
            nearestMarina.name
          )}
          , a {formatDistance(nearestMarina.distanceKm)} en línea recta
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 shadow-sm">
        {shouldLoad ? (
          <Suspense
            fallback={
              <StaticMapPlaceholder
                beachName={beachName}
                lat={lat}
                lng={lng}
                onActivate={activate}
              />
            }
          >
            <LeafletMap beachName={beachName} coordinates={coordinates} />
          </Suspense>
        ) : (
          <StaticMapPlaceholder
            beachName={beachName}
            lat={lat}
            lng={lng}
            onActivate={activate}
          />
        )}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-[13px] text-gray-600">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
          <a
            aria-label={`Cómo llegar a ${beachName} (se abre en Google Maps en una pestaña nueva)`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ocean-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
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
