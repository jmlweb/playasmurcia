import { createServerFn } from '@tanstack/react-start'

import type { BeachCatalog } from './resolve-search'

import { parseSearchInput, parseSlugInput } from './tool-input'

async function loadCatalog(): Promise<BeachCatalog> {
  const {
    getAllMunicipalities,
    getAllSeas,
    getAllServices,
    getAllActivities,
    getAllTags,
  } = await import('@/lib/db-data/beach-queries')
  const [municipalities, seas, services, activities, tags] = await Promise.all([
    getAllMunicipalities(),
    getAllSeas(),
    getAllServices(),
    getAllActivities(),
    getAllTags(),
  ])
  return { municipalities, seas, services, activities, tags }
}

export const searchBeachesFn = createServerFn({ method: 'GET' })
  .validator(parseSearchInput)
  .handler(async ({ data }) => {
    const [{ getAllBeaches }, { applyFiltersAndSort }, resolve, catalog] =
      await Promise.all([
        import('@/lib/db-data/beach-queries'),
        import('@/lib/beach-filters'),
        import('./resolve-search'),
        loadCatalog(),
      ])
    const { params, unresolved } = resolve.buildSearchParams(data, catalog)
    const beaches = applyFiltersAndSort(await getAllBeaches(), params)

    return {
      total: beaches.length,
      results: beaches
        .slice(0, data.limit)
        .map((beach) => resolve.summarizeBeach(beach, catalog)),
      filters: params,
      unresolved,
    }
  })

export const getBeachFn = createServerFn({ method: 'GET' })
  .validator(parseSlugInput)
  .handler(async ({ data }) => {
    const [
      { getBeachBySlug, getNearbyBeaches },
      { summarizeBeach },
      { stripDescriptionMarkdown },
      { beachToSlug },
      catalog,
    ] = await Promise.all([
      import('@/lib/db-data/beach-queries'),
      import('./resolve-search'),
      import('@/lib/description-markdown'),
      import('@/lib/slugs'),
      loadCatalog(),
    ])
    const beach = await getBeachBySlug(data.slug)
    if (!beach) return null

    const nearby = await getNearbyBeaches(beach.nearby)
    return {
      ...summarizeBeach(beach, catalog),
      description: stripDescriptionMarkdown(beach.description),
      access: beach.access,
      soilType: beach.soilType,
      orientation: beach.orientation,
      waterQuality: beach.waterQuality,
      bestSeason: beach.bestSeason,
      promenade: beach.promenade,
      nearby: nearby.map((item) => ({
        name: item.name,
        slug: beachToSlug(item),
      })),
    }
  })

export const getBeachWeatherFn = createServerFn({ method: 'GET' })
  .validator(parseSlugInput)
  .handler(async ({ data }) => {
    const [
      { getBeachBySlug },
      { fetchOpenMeteoForecast, fetchMarineWeather },
      { getWaveLevel },
    ] = await Promise.all([
      import('@/lib/db-data/beach-queries'),
      import('@/lib/open-meteo'),
      import('@/lib/wave-level'),
    ])
    const beach = await getBeachBySlug(data.slug)
    if (!beach) return null

    const [latitude, longitude] = beach.coordinates
    const [forecast, marine] = await Promise.all([
      fetchOpenMeteoForecast(latitude, longitude),
      fetchMarineWeather(latitude, longitude),
    ])

    return {
      beach: beach.name,
      current: forecast?.current ?? null,
      forecast: forecast?.days.slice(0, 3) ?? [],
      sea: marine
        ? {
            waterTemp: marine.currentTemp,
            waveHeight: marine.waveHeight,
            waveLevel:
              marine.waveHeight !== undefined
                ? getWaveLevel(marine.waveHeight)
                : undefined,
            waveDirection: marine.waveDirection,
          }
        : null,
    }
  })
