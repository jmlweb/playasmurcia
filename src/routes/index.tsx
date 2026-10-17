import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useMemo } from 'react'

import { useCardWeather } from '@/features/beaches/use-card-weather'
import { FeaturedSection } from '@/features/home/featured-section'
import { HeroSection } from '@/features/home/hero-section'
import { HighlightsSection } from '@/features/home/highlights-section'
import { MunicipalitiesSection } from '@/features/home/municipalities-section'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { beachToSlug } from '@/lib/slugs'

const fetchHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const {
    getFeaturedBeaches,
    getAllBeaches,
    getAllMunicipalities,
    getAllTags,
  } = await import('@/lib/db-data/beach-queries')
  const { buildMunicipalityNavWithBlueFlag } =
    await import('@/lib/nav-builders')
  const [featured, beaches, municipalities, tags] = await Promise.all([
    getFeaturedBeaches(),
    getAllBeaches(),
    getAllMunicipalities(),
    getAllTags(),
  ])
  const municipalityNav = buildMunicipalityNavWithBlueFlag(
    beaches,
    municipalities,
  )
  return {
    featured,
    municipalities,
    municipalityNav,
    tags,
    totalBeaches: beaches.length,
  }
})

export const Route = createFileRoute('/')({
  loader: () => fetchHomeData(),
  head: ({ loaderData }) => ({
    meta: [
      { title: 'Playas de Murcia - Descubre la Costa Cálida' },
      {
        name: 'description',
        content: `Descubre las mejores playas de la Región de Murcia. ${loaderData?.totalBeaches ?? 194} playas y calas en la Costa Cálida, entre el Mediterráneo y el Mar Menor.`,
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { featured, municipalities, municipalityNav, tags, totalBeaches } =
    Route.useLoaderData()
  const weatherData = useCardWeather(featured)

  const slugMap = useMemo(
    () => new Map(featured.map((b) => [b.code, beachToSlug(b)])),
    [featured],
  )

  const featuredRef = useScrollReveal(0.05)
  const municipalitiesRef = useScrollReveal()
  const highlightsRef = useScrollReveal()

  return (
    <main className="min-h-screen bg-sand-50">
      <HeroSection totalBeaches={totalBeaches} />
      <FeaturedSection
        ref={featuredRef}
        featured={featured}
        municipalities={municipalities}
        slugMap={slugMap}
        tags={tags}
        totalBeaches={totalBeaches}
        weatherData={weatherData}
      />
      <MunicipalitiesSection
        ref={municipalitiesRef}
        municipalityNav={municipalityNav}
      />
      <HighlightsSection ref={highlightsRef} />
    </main>
  )
}
