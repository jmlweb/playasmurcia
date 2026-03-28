import type { Service } from '@/types/beach'

type ServicesGridProps = {
  serviceIndices: number[]
  allServices: Service[]
}

export function ServicesGrid({
  serviceIndices,
  allServices,
}: ServicesGridProps) {
  const resolvedServices = serviceIndices
    .map((i) => allServices[i])
    .filter(Boolean)

  if (resolvedServices.length === 0) {
    return null
  }

  return (
    <section aria-label="Servicios disponibles">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Servicios</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {resolvedServices.map((service) => (
          <li
            key={service.id}
            className="hover:border-ocean-200 hover:bg-ocean-50/50 flex items-center gap-2.5 rounded-xl border border-gray-200/60 bg-white px-3.5 py-3 text-sm text-gray-700 shadow-sm transition-colors"
          >
            <span aria-hidden="true" className="text-xl">
              {service.icon}
            </span>
            <span>{service.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
