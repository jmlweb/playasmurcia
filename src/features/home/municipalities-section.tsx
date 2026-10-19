import type { RefObject } from 'react'

import type { MunicipalityCardData } from '@/lib/home-curation'

import { MunicipalityCard } from '@/features/municipalities/municipality-card'

type MunicipalitiesSectionProps = {
  ref: RefObject<HTMLElement | null>
  municipalityNav: MunicipalityCardData[]
}

export function MunicipalitiesSection({
  ref,
  municipalityNav,
}: MunicipalitiesSectionProps) {
  return (
    <section
      ref={ref}
      className="reveal mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20"
    >
      <div>
        <div className="mb-8 flex items-end justify-between">
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
            <MunicipalityCard key={m.slug} {...m} />
          ))}
        </div>
      </div>
    </section>
  )
}
