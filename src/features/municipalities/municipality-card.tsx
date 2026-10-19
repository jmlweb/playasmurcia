import { Link } from '@tanstack/react-router'

import { ResponsiveImage } from '@/components/ui/responsive-image'
import { parseImageFilename } from '@/lib/images'

type MunicipalityCardProps = {
  name: string
  slug: string
  beachCount: number
  blueFlagCount: number
  coverPicture?: string
}

export function formatMunicipalityMeta(
  beachCount: number,
  blueFlagCount: number,
): string {
  const beaches = `${beachCount} ${beachCount === 1 ? 'playa' : 'playas'}`
  if (blueFlagCount === 0) return beaches
  const flags = `${blueFlagCount} ${blueFlagCount === 1 ? 'bandera azul' : 'banderas azules'}`
  return `${beaches} · ${flags}`
}

export function MunicipalityCard({
  name,
  slug,
  beachCount,
  blueFlagCount,
  coverPicture,
}: MunicipalityCardProps) {
  const { baseName, ext } = parseImageFilename(coverPicture ?? '')

  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1"
      params={{ slug }}
      to="/municipios/$slug"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-ocean-700 to-ocean-900">
        {coverPicture && (
          <ResponsiveImage
            alt={`Playas de ${name}`}
            baseName={baseName}
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            ext={ext}
            variant="thumb"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
        />
        <h3 className="absolute inset-x-0 bottom-0 p-5 text-xl font-semibold text-white">
          {name}
        </h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-gray-600">
          {formatMunicipalityMeta(beachCount, blueFlagCount)}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-ocean-600 transition-colors group-hover:text-ocean-700">
          Ver playas
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17 8l4 4m0 0l-4 4m4-4H3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </span>
      </div>
    </Link>
  )
}
