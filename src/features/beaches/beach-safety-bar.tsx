type BeachSafetyBarProps = {
  beachName: string
  coordinates: [number, number]
  /** Only an explicit `false` warns; a missing value says nothing */
  lifeguard?: boolean
}

export function BeachSafetyBar({
  beachName,
  coordinates,
  lifeguard,
}: BeachSafetyBarProps) {
  const [lat, lng] = coordinates
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div className="flex flex-col gap-3">
      {lifeguard === false && (
        <p
          className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
          role="note"
        >
          <svg
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span>
            Sin socorrista en esta playa. Extrema la precaución al bañarte,
            sobre todo con niños.
          </span>
        </p>
      )}
      <a
        aria-label={`Cómo llegar a ${beachName} (se abre en Google Maps en una pestaña nueva)`}
        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        href={directionsUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        Cómo llegar
      </a>
    </div>
  )
}
