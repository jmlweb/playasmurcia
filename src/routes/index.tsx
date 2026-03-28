import { Link, createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { useMemo } from "react"
import { beachToSlug } from "@/lib/slugs"
import { BeachCard } from "@/components/beach-card"

const fetchHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const { getFeaturedBeaches, getAllBeaches, getAllMunicipalities, getAllTags } = await import("@/lib/db-data")
  const { municipalityToSlug } = await import("@/lib/slugs")
  const { fetchBatchCardWeather } = await import("@/lib/open-meteo")
  const [featured, beaches, municipalities, tags] = await Promise.all([
    getFeaturedBeaches(),
    getAllBeaches(),
    getAllMunicipalities(),
    getAllTags(),
  ])
  const weatherMap = await fetchBatchCardWeather(featured)
  const weatherData = Object.fromEntries(weatherMap)
  const municipalityNav = municipalities.map((m, i) => ({
    name: m.name,
    slug: municipalityToSlug(m),
    beachCount: beaches.filter((b) => b.municipality === i).length,
  }))
  return { featured, municipalities, municipalityNav, tags, totalBeaches: beaches.length, weatherData }
})

export const Route = createFileRoute("/")({
  loader: () => fetchHomeData(),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Playas de Murcia - Descubre la Costa Calida" },
      {
        name: "description",
        content:
          `Descubre las mejores playas de la Region de Murcia. ${loaderData?.totalBeaches ?? 194} playas y calas en la Costa Calida, entre el Mediterraneo y el Mar Menor.`,
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { featured, municipalities, municipalityNav, tags, totalBeaches, weatherData } = Route.useLoaderData()

  const slugMap = useMemo(
    () => new Map(featured.map((b) => [b.code, beachToSlug(b)])),
    [featured],
  )

  return (
    <main className="min-h-screen bg-sand-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ocean-900 px-4 py-16 sm:py-20 lg:py-28">
        <img
          src="/pictures/hero.png"
          alt="Vista aerea de la costa de Murcia"
          width={1408}
          height={768}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/70 via-ocean-900/60 to-ocean-900/90" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ocean-300 sm:text-base animate-fade-up">
            Costa Calida &middot; Region de Murcia
          </p>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl animate-fade-up [animation-delay:100ms]">
            Donde el Mediterraneo
            <br className="hidden sm:block" />{" "}
            abraza la costa
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-ocean-100 sm:text-xl animate-fade-up [animation-delay:200ms]">
            252 kilometros de litoral, {totalBeaches} playas y calas entre dos mares.
            Desde las aguas cristalinas de Cabo de Palos hasta las calidas
            orillas del Mar Menor, descubre tu playa ideal.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up [animation-delay:300ms]">
            <Link
              to="/explorar"
              className="inline-flex items-center gap-2 rounded-full bg-ocean-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-ocean-400 hover:shadow-xl focus:ring-2 focus:ring-ocean-400 focus:ring-offset-2 focus:ring-offset-ocean-900 focus:outline-none"
            >
              Explorar todas las playas
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/colecciones"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 focus:ring-2 focus:ring-white/40 focus:outline-none"
            >
              Ver colecciones
            </Link>
          </div>
        </div>
      </section>

      {/* Featured beaches */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-ocean-600">
            Seleccion destacada
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Playas que no te puedes perder
          </h2>
        </div>

        <div className="grid gap-x-4 gap-y-6 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-6 xl:gap-y-8 2xl:grid-cols-4">
          {featured.map((beach, i) => {
            const slug = slugMap.get(beach.code) ?? beachToSlug(beach)
            return (
              <BeachCard
                key={beach.code}
                beach={beach}
                municipality={municipalities[beach.municipality]}
                tags={tags}
                slug={slug}
                eager={i < 4}
                weather={weatherData[beach.code]}
              />
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/explorar"
            className="inline-flex items-center gap-2 rounded-full bg-ocean-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-ocean-700 hover:shadow-md focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 focus:outline-none"
          >
            Ver las {totalBeaches} playas
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Municipalities */}
      <section className="border-t border-gray-200 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-ocean-600">
              Explora por zona
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Municipios costeros
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {municipalityNav.map((m) => (
              <a
                key={m.slug}
                href={`/municipios/${m.slug}`}
                className="group flex flex-col items-center rounded-xl bg-sand-50 px-4 py-5 ring-1 ring-gray-200/60 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-ocean-200"
              >
                <span className="text-base font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
                  {m.name}
                </span>
                <span className="mt-1 text-sm text-gray-500">
                  {m.beachCount} {m.beachCount === 1 ? "playa" : "playas"}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Region highlights */}
      <section className="border-t border-gray-200 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/colecciones"
              className="group text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-600 transition-colors group-hover:bg-ocean-100">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">Dos mares</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                El Mediterraneo y el Mar Menor ofrecen experiencias de playa completamente diferentes en pocos kilometros.
              </p>
            </Link>
            <Link
              to="/colecciones/mejores-atardeceres"
              className="group text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">300 dias de sol</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Con una de las mejores climatologias de Europa, la Costa Calida hace honor a su nombre durante todo el ano.
              </p>
            </Link>
            <Link
              to="/colecciones/bandera-azul"
              className="group text-center sm:col-span-2 lg:col-span-1"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">Aguas cristalinas</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Reservas marinas, calas protegidas y banderas azules que certifican la calidad de nuestro litoral.
              </p>
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
