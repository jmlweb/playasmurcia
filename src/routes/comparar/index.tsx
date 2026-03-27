import { createFileRoute } from '@tanstack/react-router'
import type { Beach, Municipality, Service, Activity, Sea } from '@/types/beach'
import {
  beachToSlug,
  getAllActivities,
  getAllBeaches,
  getAllMunicipalities,
  getAllSeas,
  getAllServices,
  getBeachesByCodes,
} from '@/lib/db-data'

interface CompareSearch {
  playas?: string
}

export const Route = createFileRoute('/comparar/')({
  validateSearch: (search: Record<string, unknown>): CompareSearch => ({
    playas: typeof search.playas === 'string' ? search.playas : undefined,
  }),
  loaderDeps: ({ search }) => ({ playas: search.playas }),
  loader: async ({ deps }) => {
    const codes = deps.playas
      ? deps.playas
          .split(',')
          .map((c: string) => c.trim())
          .filter(Boolean)
          .slice(0, 3)
      : []

    const [selected, allBeaches, municipalities, services, activities, seas] =
      await Promise.all([
        getBeachesByCodes(codes),
        getAllBeaches(),
        getAllMunicipalities(),
        getAllServices(),
        getAllActivities(),
        getAllSeas(),
      ])

    return {
      selected,
      allBeaches: allBeaches.map((b) => ({
        code: b.code,
        name: b.name,
      })),
      municipalities,
      services,
      activities,
      seas,
    }
  },
  head: () => ({
    meta: [
      { title: 'Comparar Playas - Playas de Murcia' },
      {
        name: 'description',
        content:
          'Compara hasta 3 playas de Murcia lado a lado: servicios, actividades, certificaciones y mas.',
      },
    ],
  }),
  component: CompararPage,
})

function BooleanCell({ value }: { value: boolean }) {
  return (
    <span
      className={`text-lg ${value ? 'text-emerald-500' : 'text-gray-300'}`}
    >
      {value ? '✓' : '✗'}
    </span>
  )
}

function CompareRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pr-4 text-sm font-medium text-gray-500">
        {label}
      </td>
      {children}
    </tr>
  )
}

function CompararPage() {
  const {
    selected,
    allBeaches,
    municipalities,
    services,
    activities,
    seas,
  } = Route.useLoaderData() as {
    selected: Array<Beach>
    allBeaches: Array<{ code: string; name: string }>
    municipalities: Array<Municipality>
    services: Array<Service>
    activities: Array<Activity>
    seas: Array<Sea>
  }

  const currentCodes = selected.map((b) => b.code)

  function addBeach(code: string) {
    if (currentCodes.length >= 3 || currentCodes.includes(code)) return
    const newCodes = [...currentCodes, code]
    window.location.href = `/comparar?playas=${newCodes.join(',')}`
  }

  function removeBeach(code: string) {
    const newCodes = currentCodes.filter((c) => c !== code)
    window.location.href =
      newCodes.length > 0
        ? `/comparar?playas=${newCodes.join(',')}`
        : '/comparar'
  }

  return (
    <main className="bg-sand-50 min-h-screen">
      <section className="relative overflow-hidden bg-ocean-800 px-4 py-16 sm:py-20">
        <div className="absolute inset-0 bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/3 rounded-full bg-ocean-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-ocean-300">
            Herramienta
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Comparar playas
          </h1>
          <p className="text-lg text-ocean-200">
            Selecciona hasta 3 playas para compararlas lado a lado
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav
          className="mb-8 text-sm text-gray-400"
          aria-label="Ruta de navegacion"
        >
          <a
            href="/"
            className="hover:text-ocean-600 transition-colors focus:outline-none"
          >
            Inicio
          </a>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-gray-600" aria-current="page">
            Comparar
          </span>
        </nav>

        {/* Beach selector */}
        {currentCodes.length < 3 && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60">
            <label
              htmlFor="beach-select"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Anadir playa a la comparacion
            </label>
            <select
              id="beach-select"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 focus:outline-none"
              onChange={(e) => {
                if (e.target.value) addBeach(e.target.value)
              }}
              value=""
            >
              <option value="">Selecciona una playa...</option>
              {allBeaches
                .filter(
                  (b: { code: string; name: string }) =>
                    !currentCodes.includes(b.code),
                )
                .map((b: { code: string; name: string }) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Empty state */}
        {selected.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200/60">
            <p className="text-lg font-semibold text-gray-900">
              No hay playas seleccionadas
            </p>
            <p className="mt-2 text-gray-500">
              Usa el selector de arriba para anadir playas a la comparacion.
            </p>
          </div>
        )}

        {/* Comparison table */}
        {selected.length > 0 && (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">
                    Caracteristica
                  </th>
                  {selected.map((beach) => (
                    <th
                      key={beach.code}
                      className="min-w-[200px] p-4 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={`/playas/${beachToSlug(beach)}`}
                          className="text-sm font-semibold text-ocean-600 hover:text-ocean-700"
                        >
                          {beach.name}
                        </a>
                        <button
                          onClick={() => removeBeach(beach.code)}
                          className="shrink-0 text-xs text-gray-400 hover:text-rose-500"
                          title="Quitar"
                        >
                          ✗
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        {municipalities[beach.municipality]?.name}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Mar">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4 text-sm text-gray-900">
                      {seas[b.sea]?.name ?? '-'}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Longitud">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4 text-sm text-gray-900">
                      {b.length ? `${b.length} m` : '-'}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Tipo de suelo">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4 text-sm text-gray-900">
                      {b.soilType}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Oleaje">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4 text-sm text-gray-900">
                      {b.waves ?? '-'}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Orientacion">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4 text-sm text-gray-900">
                      {b.orientation}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Ocupacion">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4 text-sm text-gray-900">
                      {b.occupancyLevel ?? '-'}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Socorrista">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4">
                      <BooleanCell value={b.lifeguard} />
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Nudista">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4">
                      <BooleanCell value={b.nudist} />
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Paseo maritimo">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4">
                      <BooleanCell value={b.promenade} />
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Perros">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4">
                      <BooleanCell value={b.dogFriendly} />
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Apta para ninos">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4">
                      <BooleanCell value={b.childSafe ?? false} />
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Dificultad acceso">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4 text-sm text-gray-900">
                      {b.accessDifficulty ?? '-'}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Calidad agua">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4 text-sm text-gray-900">
                      {b.waterQuality ?? '-'}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Servicios">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {b.services.map((si) => {
                          const svc = services[si]
                          return svc ? (
                            <span
                              key={svc.id}
                              className="rounded-full bg-ocean-50 px-2 py-0.5 text-xs text-ocean-700"
                            >
                              {svc.name}
                            </span>
                          ) : null
                        })}
                        {b.services.length === 0 && (
                          <span className="text-xs text-gray-400">
                            Ninguno
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Actividades">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {b.activities.map((ai) => {
                          const act = activities[ai]
                          return act ? (
                            <span
                              key={act.id}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                            >
                              {act.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Certificaciones">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(b.certifications ?? []).map((cert) => (
                          <span
                            key={cert}
                            className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
                          >
                            {cert}
                          </span>
                        ))}
                        {(b.certifications ?? []).length === 0 && (
                          <span className="text-xs text-gray-400">
                            Ninguna
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Mejor temporada">
                  {selected.map((b) => (
                    <td key={b.code} className="p-4 text-sm text-gray-900">
                      {b.bestSeason?.join(', ') ?? '-'}
                    </td>
                  ))}
                </CompareRow>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
