import type { ReactNode } from 'react'

import { groupBeachesByZone } from '@/lib/zones'

type ZoneSectionsProps<T extends { code: string; zone?: string }> = {
  /** Already filtered and sorted; the order is kept inside each zone */
  beaches: T[]
  renderBeach: (beach: T) => ReactNode
}

const UNZONED_HEADING = 'Otras playas'

const countLabel = (count: number) =>
  count === 1 ? '1 playa' : `${count} playas`

export function ZoneSections<T extends { code: string; zone?: string }>({
  beaches,
  renderBeach,
}: ZoneSectionsProps<T>) {
  return (
    <div className="space-y-12">
      {groupBeachesByZone(beaches).map(({ zone, beaches: zoneBeaches }) => {
        const headingId = `zona-${zone?.id ?? 'otras'}`
        return (
          <section key={headingId} aria-labelledby={headingId}>
            <div className="mb-5 flex items-baseline gap-3">
              <h2
                className="text-2xl font-normal text-gray-900"
                id={headingId}
              >
                {zone?.name ?? UNZONED_HEADING}
              </h2>
              <span className="text-sm text-gray-600">
                {countLabel(zoneBeaches.length)}
              </span>
            </div>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
              {zoneBeaches.map((beach) => (
                // grid stretches the card to the row height, like a direct grid child
                <li key={beach.code} className="grid">
                  {renderBeach(beach)}
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
