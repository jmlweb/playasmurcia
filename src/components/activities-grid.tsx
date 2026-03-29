import { ActivityIcon } from '@/components/icons'
import type { Activity } from '@/types/beach'

type ActivitiesGridProps = {
  activityIndices: number[]
  allActivities: Activity[]
}

export function ActivitiesGrid({
  activityIndices,
  allActivities,
}: ActivitiesGridProps) {
  const resolvedActivities = activityIndices
    .map((i) => allActivities[i])
    .filter(Boolean)

  if (resolvedActivities.length === 0) {
    return null
  }

  return (
    <section aria-label="Actividades disponibles">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Actividades</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {resolvedActivities.map((activity) => (
          <li
            key={activity.id}
            className="bg-sand-100 flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm text-gray-700"
          >
            <ActivityIcon
              className="text-ocean-500 h-5 w-5"
              emoji={activity.icon}
            />
            <span>{activity.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
