import beaches from '../beaches.json';
import { getMunicipalityName } from '../getMunicipalityName';
import { Counter } from '../types';

let cache: Counter[];

export const getMunicipalities = () => {
  if (!cache) {
    cache = Object.values(
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
  }
  return cache;
};
