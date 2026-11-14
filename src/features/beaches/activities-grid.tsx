import type { Activity } from '@/types/beach'

import { ActivityIcon } from '@/components/ui/icons'
import { listedActivityIndices } from '@/lib/activities'

type ActivitiesGridProps = {
  activityIndices: number[]
  allActivities: Activity[]
}

export function ActivitiesGrid({
  activityIndices,
  allActivities,
}: ActivitiesGridProps) {
  const resolvedActivities = listedActivityIndices(
    activityIndices,
    allActivities,
  ).map((index) => allActivities[index])

  if (resolvedActivities.length === 0) {
    return null
  }

  return (
    <section aria-label="Actividades disponibles">
      <h2 className="mb-4 text-3xl font-normal tracking-tight text-gray-900">
        Actividades
      </h2>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {resolvedActivities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-center gap-2.5 text-gray-700"
          >
            <ActivityIcon
              className="h-5 w-5 text-ocean-500"
              emoji={activity.icon}
            />
            <span>{activity.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
