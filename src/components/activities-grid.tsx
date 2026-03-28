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
            className="hover:border-ocean-200 hover:bg-ocean-50/50 flex items-center gap-2.5 rounded-xl border border-gray-200/60 bg-white px-3.5 py-3 text-sm text-gray-700 shadow-sm transition-colors"
          >
            <span aria-hidden="true" className="text-xl">
              {activity.icon}
            </span>
            <span>{activity.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
