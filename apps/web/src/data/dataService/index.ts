import 'server-only';

import { randomInt } from 'crypto';

import { Beach, DataBeach, DataBeaches } from '@/types';

import dataBeaches from '../beaches.json';
import { getFeatureName } from '../getFeatureName';
import { getMunicipalityName } from '../getMunicipalityName';
import { Counter } from '../types';
import { getWeather } from './getWeather';
import { sorter } from './sorter';

const extractFeaturedBeaches = (beaches: DataBeaches) => {
  const beachesSelection = beaches.slice(0, 32);
  let featuredBeaches: typeof beachesSelection = [];
  Array.from({ length: 12 }).forEach(() => {
    const position = randomInt(0, beachesSelection.length - 1);
    featuredBeaches.push(beachesSelection[position]);
    beachesSelection.splice(position, 1);
  });
  return featuredBeaches;
};

const enhanceBeachesWithWeather = (beaches: DataBeaches) =>
  Promise.all(
    beaches.map(async (beach) => ({
      ...beach,
      ...(await getWeather(beach.position[0], beach.position[1])),
    })),
  );

const getMunicipalities = (beaches: DataBeaches) =>
  Object.values(
    beaches.reduce(
      (acc, beach) => {
        if (!acc[beach.municipality]) {
          acc[beach.municipality] = {
            slug: beach.municipality,
            name: getMunicipalityName(beach.municipality),
            count: 0,
          };
        }
        acc[beach.municipality].count += 1;
        return acc;
      },
      {} as Record<string, Counter>,
    ),
  ).sort((a, b) => a.name.localeCompare(b.name));

const getFeatures = (beaches: DataBeaches) =>
  Object.values(
    beaches.reduce(
      (acc, beach) => {
        beach.features.forEach((feature) => {
          if (!acc[feature]) {
            acc[feature] = {
              slug: feature,
              name: getFeatureName(feature),
              count: 0,
            };
          }
          acc[feature].count += 1;
        });
        if (beach.blueFlag) {
          if (!acc['bandera-azul']) {
            acc['bandera-azul'] = {
              slug: 'bandera-azul',
              name: getFeatureName('bandera-azul'),
              count: 0,
            };
          }
          acc['bandera-azul'].count += 1;
        }
        return acc;
      },
      {} as Record<string, Counter>,
    ),
  ).sort((a, b) => a.name.localeCompare(b.name));

const PER_PAGE = 24;

const findBeaches = (
  predicate: (beach: DataBeach) => boolean,
  beaches: DataBeaches,
) => beaches.filter(predicate);

const DataService = () => {
  const sortedBeaches = [...dataBeaches].sort(sorter);

  const featuredBeaches = enhanceBeachesWithWeather(
    extractFeaturedBeaches(sortedBeaches),
  );

  return {
    beaches: () => sortedBeaches,
    municipalities: () => getMunicipalities(dataBeaches),
    featuredBeaches: () => featuredBeaches,
    features: () => getFeatures(dataBeaches),
    findBeaches: async (
      predicate: Parameters<typeof findBeaches>[0],
      page: number,
    ) => {
      const validBeaches = findBeaches(predicate, sortedBeaches);
      const results = await enhanceBeachesWithWeather(
        validBeaches.slice((page - 1) * PER_PAGE, page * PER_PAGE),
      );
      return {
        beaches: results,
        total: validBeaches.length,
        pages: Math.ceil(validBeaches.length / PER_PAGE),
      };
    },
    detail: async (slug: string): Promise<Beach> => {
      const dataBeach = dataBeaches.find((beach) => beach.slug === slug);
      const weather = await getWeather(
        dataBeach.position[0],
        dataBeach.position[1],
      );
      return {
        ...dataBeach,
        ...weather,
      };
    },
  };
};

const dataService = DataService();

export default dataService;
