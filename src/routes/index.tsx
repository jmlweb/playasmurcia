import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useMemo } from 'react'

import { useCardFlagsState } from '@/features/beaches/use-card-flags'
import { useCardWeather } from '@/features/beaches/use-card-weather'
import { CoastTodayStrip } from '@/features/home/coast-today-strip'
import { FeaturedSection } from '@/features/home/featured-section'
import { HeroSection } from '@/features/home/hero-section'
import { MunicipalitiesSection } from '@/features/home/municipalities-section'
import { useCoastToday } from '@/features/home/use-coast-today'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { canonicalLink, ogUrlMeta } from '@/lib/canonical'
import { countBeachesBySea, isFlagSeason } from '@/lib/coast-today'
import { addMunicipalityCovers } from '@/lib/home-curation'
import { beachToSlug } from '@/lib/slugs'

const fetchHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const {
    getFeaturedBeaches,
    getAllBeaches,
    getAllMunicipalities,
    getAllTags,
  } = await import('@/lib/db-data/beach-queries')
  const { buildMunicipalityNavWithBlueFlag, sortMunicipalitiesByCoast } =
    await import('@/lib/nav-builders')
  const [featured, beaches, municipalities, tags] = await Promise.all([
    getFeaturedBeaches(),
    getAllBeaches(),
    getAllMunicipalities(),
    getAllTags(),
  ])
  // Covers match by array index, so the coast sort must come after them
  const municipalityNav = sortMunicipalitiesByCoast(
    addMunicipalityCovers(
      buildMunicipalityNavWithBlueFlag(beaches, municipalities),
      beaches,
    ),
  )
  return {
    featured,
    municipalities,
    municipalityNav,
    expectsFlags: isFlagSeason(),
    seaBeachCounts: countBeachesBySea(beaches),
    tags,
    totalBeaches: beaches.length,
  }
})

export const Route = createFileRoute('/')({
  loader: () => fetchHomeData(),
  head: ({ loaderData }) => ({
    meta: [
      { title: 'Playas de Murcia - Guía de la Costa Cálida' },
      {
        name: 'description',
        content: `Guía de las ${loaderData?.totalBeaches ?? 193} playas y calas de la Región de Murcia, en la Costa Cálida, entre el Mediterráneo y el Mar Menor.`,
      },
      ogUrlMeta('/'),
    ],
    links: [canonicalLink('/')],
  }),
  component: HomePage,
})

function HomePage() {
  const {
    expectsFlags,
    featured,
    municipalities,
    municipalityNav,
    seaBeachCounts,
    tags,
    totalBeaches,
  } = Route.useLoaderData()
  const coastToday = useCoastToday()
  const weatherData = useCardWeather(featured)
  const { flags: flagData, isSettled: areFlagsSettled } =
    useCardFlagsState(featured)

  const slugMap = useMemo(
    () => new Map(featured.map((b) => [b.code, beachToSlug(b)])),
    [featured],
  )

  const featuredRef = useScrollReveal(0.05)
  const municipalitiesRef = useScrollReveal()

  return (
    <main className="min-h-screen bg-sand-50">
      <HeroSection totalBeaches={totalBeaches} />
      <CoastTodayStrip
        beachCounts={seaBeachCounts}
        expectsFlags={expectsFlags}
        isLoading={coastToday.isLoading}
        today={coastToday.today}
      />
      <FeaturedSection
        ref={featuredRef}
        featured={featured}
        flagData={flagData}
        isFlagPending={!areFlagsSettled}
        municipalities={municipalities}
        slugMap={slugMap}
        tags={tags}
        weatherData={weatherData}
      />
      <MunicipalitiesSection
        ref={municipalitiesRef}
        municipalityNav={municipalityNav}
      />
    </main>
  )
}
