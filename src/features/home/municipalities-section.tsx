import type { RefObject } from 'react'

import { Link } from '@tanstack/react-router'

import type { NavMunicipalityWithBlueFlag } from '@/lib/nav-builders'

import { BlueFlagBadgeIcon } from '@/components/ui/icons'

type MunicipalitiesSectionProps = {
  ref: RefObject<HTMLElement | null>
  municipalityNav: NavMunicipalityWithBlueFlag[]
}

export function MunicipalitiesSection({
  ref,
  municipalityNav,
}: MunicipalitiesSectionProps) {
  return (
    <section
      ref={ref}
      className="reveal bg-sand-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="overline-accent mb-2 text-sm font-semibold tracking-wider text-ocean-600 uppercase">
              Explora por zona
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Municipios costeros
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {municipalityNav.map((m) => (
            <Link
              key={m.slug}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1"
              params={{ slug: m.slug }}
              to="/municipios/$slug"
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
                    {m.name}
                  </h3>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ocean-50 text-lg font-bold text-ocean-700">
                    {m.beachCount}
                  </div>
                </div>
                {m.blueFlagCount > 0 && (
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">
                    <span className="inline-flex items-center gap-1 text-ocean-600">
                      <BlueFlagBadgeIcon className="inline h-3.5 w-3.5" />
                      {m.blueFlagCount} bandera
                      {m.blueFlagCount === 1 ? '' : 's'} azul
                    </span>
                  </p>
                )}
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-ocean-600 transition-colors group-hover:text-ocean-700">
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
