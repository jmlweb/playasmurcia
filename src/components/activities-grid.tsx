import type { Activity } from "@/types/beach"

interface ActivitiesGridProps {
  activityIndices: Array<number>
  allActivities: Array<Activity>
}

export function ActivitiesGrid({ activityIndices, allActivities }: ActivitiesGridProps) {
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
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
          >
            <span className="text-xl" aria-hidden="true">
              {activity.icon}
            </span>
            <span>{activity.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
