import beaches from '../beaches.json';
import { getFeatureName } from '../getFeatureName';
import { Counter } from '../types';

let cache: Counter[];

export const getFeatures = () => {
  if (!cache) {
    cache = Object.values(
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
  }
  return cache;
};
