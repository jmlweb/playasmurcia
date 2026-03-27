import { createFileRoute } from '@tanstack/react-router'
import type { Beach, Sea } from '@/types/beach'
import { getAllBeaches, getAllSeas } from '@/lib/db-data'

interface SeaStats {
  sea: Sea
  seaIndex: number
  beachCount: number
  avgLength: number
  blueFlagCount: number
  totalLength: number
  topActivities: Array<{ index: number; count: number }>
  lifeguardCount: number
}

const SEA_DESCRIPTIONS: Record<number, { description: string; highlights: Array<string> }> = {
  0: {
    description:
      'El Mediterraneo banba la costa sur y este de la Region de Murcia con aguas cristalinas, playas de arena y calas espectaculares entre acantilados. Sus aguas son mas profundas y con oleaje moderado, ideales para deportes acuaticos.',
    highlights: [
      'Aguas cristalinas y profundas',
      'Calas espectaculares entre acantilados',
      'Oleaje moderado, ideal para surf y kayak',
      'Fondos marinos ricos para snorkel y buceo',
    ],
  },
  1: {
    description:
      'El Mar Menor es la laguna salada mas grande de Europa, con aguas calidas, poco profundas y practicamente sin oleaje. Es perfecto para familias con ninos, deportes de vela y actividades acuaticas seguras.',
    highlights: [
      'Laguna salada mas grande de Europa',
      'Aguas calidas y poco profundas',
      'Oleaje practicamente nulo',
      'Ideal para familias y deportes de vela',
    ],
  },
}

function computeSeaStats(beaches: Array<Beach>, seas: Array<Sea>): Array<SeaStats> {
  return seas.map((sea, seaIndex) => {
    const seaBeaches = beaches.filter((b) => b.sea === seaIndex)
    const lengths = seaBeaches.filter((b) => b.length).map((b) => b.length!)
    const avgLength = lengths.length > 0 ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : 0
    const totalLength = lengths.reduce((a, b) => a + b, 0)
    const blueFlagCount = seaBeaches.filter((b) => b.certifications?.includes('blue-flag')).length
    const lifeguardCount = seaBeaches.filter((b) => b.lifeguard).length

    const activityCounts = new Map<number, number>()
    for (const beach of seaBeaches) {
      for (const act of beach.activities) {
        activityCounts.set(act, (activityCounts.get(act) ?? 0) + 1)
      }
    }
    const topActivities = [...activityCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([index, count]) => ({ index, count }))

    return {
      sea,
      seaIndex,
      beachCount: seaBeaches.length,
      avgLength,
      totalLength,
      blueFlagCount,
      topActivities,
      lifeguardCount,
    }
  })
}

export const Route = createFileRoute('/mares/')({
  loader: async () => {
    const [beaches, seas] = await Promise.all([getAllBeaches(), getAllSeas()])
    const stats = computeSeaStats(beaches, seas)
    return { stats }
  },
  head: () => ({
    meta: [
      { title: 'Mediterraneo vs Mar Menor - Playas de Murcia' },
      {
        name: 'description',
        content:
          'Compara el Mediterraneo y el Mar Menor: playas, oleaje, servicios y actividades en la Costa Calida de Murcia.',
      },
    ],
  }),
  component: MaresPage,
})

function SeaCard({ stats }: { stats: SeaStats }) {
  const info = SEA_DESCRIPTIONS[stats.seaIndex]

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200/60">
      <h2 className="mb-3 text-2xl font-bold text-gray-900">{stats.sea.name}</h2>
      <p className="mb-6 leading-relaxed text-gray-600">{info?.description}</p>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-ocean-50 p-4 text-center">
          <p className="text-3xl font-bold text-ocean-700">{stats.beachCount}</p>
          <p className="text-sm text-ocean-600">playas</p>
        </div>
        <div className="rounded-xl bg-ocean-50 p-4 text-center">
          <p className="text-3xl font-bold text-ocean-700">{stats.blueFlagCount}</p>
          <p className="text-sm text-ocean-600">bandera azul</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.avgLength}m</p>
          <p className="text-sm text-gray-500">longitud media</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.lifeguardCount}</p>
          <p className="text-sm text-gray-500">con socorrista</p>
        </div>
      </div>

      {info?.highlights && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Caracteristicas
          </h3>
          <ul className="space-y-2">
            {info.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ocean-400" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-500">
          Riesgo medusas:{' '}
          <span className={`font-medium ${stats.sea.jellyfishRisk === 'low' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {stats.sea.jellyfishRisk === 'low' ? 'Bajo' : 'Moderado'}
          </span>
        </span>
        <a
          href={`/?sea=${stats.seaIndex}`}
          className="text-sm font-medium text-ocean-600 transition-colors hover:text-ocean-700"
        >
          Explorar playas →
        </a>
      </div>
    </div>
  )
}

function MaresPage() {
  const { stats } = Route.useLoaderData()

  return (
    <main className="bg-sand-50 min-h-screen">
      <section className="relative overflow-hidden bg-ocean-800 px-4 py-16 sm:py-20">
        <div className="absolute inset-0 bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/3 rounded-full bg-ocean-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-ocean-300">
            Costa de Murcia
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Mediterraneo vs Mar Menor
          </h1>
          <p className="text-lg text-ocean-200">
            Dos mares, dos experiencias unicas en la misma costa
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-gray-500" aria-label="Ruta de navegacion">
          <a href="/" className="hover:text-ocean-600 transition-colors focus:outline-none">
            Inicio
          </a>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-600" aria-current="page">Mares</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {(stats as Array<SeaStats>).map((s) => (
            <SeaCard key={s.seaIndex} stats={s} />
          ))}
        </div>
      </div>
    </main>
  )
}
