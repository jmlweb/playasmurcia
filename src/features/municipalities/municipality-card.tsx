import { Link } from '@tanstack/react-router'

import { ResponsiveImage } from '@/components/ui/responsive-image'
import { parseImageFilename } from '@/lib/images'

type MunicipalityCardProps = {
  name: string
  slug: string
  beachCount: number
  blueFlagCount: number
  coverPicture?: string
  /** Phones get a compact row, so a long list does not fill several screens */
  isRowOnPhone?: boolean
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
  isRowOnPhone = false,
}: MunicipalityCardProps) {
  const { baseName, ext } = parseImageFilename(coverPicture ?? '')
  const row = (classes: string): string => (isRowOnPhone ? classes : '')

  return (
    <Link
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1 ${row('max-sm:grid max-sm:grid-cols-[auto_1fr_auto] max-sm:items-center max-sm:gap-x-3 max-sm:p-2')}`}
      params={{ slug }}
      to="/municipios/$slug"
    >
      <div className={`relative ${row('max-sm:contents')}`}>
        <div
          className={`aspect-4/3 overflow-hidden bg-linear-to-br from-ocean-700 to-ocean-900 ${row('max-sm:row-span-2 max-sm:size-14 max-sm:rounded-xl')}`}
        >
          {coverPicture && (
            <ResponsiveImage
              alt={`Playas de ${name}`}
              baseName={baseName}
              className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
              ext={ext}
              variant="thumb"
            />
          )}
        </div>
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/55 via-30% to-transparent to-60% ${row('max-sm:hidden')}`}
        />
        <h3
          className={`absolute inset-x-0 bottom-0 p-5 text-xl font-semibold text-white ${row('max-sm:static max-sm:col-start-2 max-sm:self-end max-sm:p-0 max-sm:text-lg max-sm:text-gray-900')}`}
        >
          {name}
        </h3>
      </div>
      <div className={`flex flex-1 flex-col p-5 ${row('max-sm:contents')}`}>
        <p
          className={`text-sm text-gray-600 ${row('max-sm:col-start-2 max-sm:self-start')}`}
        >
          {formatMunicipalityMeta(beachCount, blueFlagCount)}
        </p>
        <span
          className={`mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-ocean-600 transition-colors group-hover:text-ocean-700 ${row('max-sm:col-start-3 max-sm:row-span-2 max-sm:row-start-1 max-sm:mt-0 max-sm:self-center max-sm:pt-0 max-sm:pr-1')}`}
        >
          <span className={row('max-sm:sr-only')}>Ver playas</span>
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
