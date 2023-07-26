import { DataBeach, SimpleBeach } from '@/types';

import { getCurrentWeather } from './getCurrentWeather';
import { randomizeArray } from './randomizeArray';

export const toSimpleBeach = async (beach: DataBeach): Promise<SimpleBeach> => {
  const simpleBeach: SimpleBeach = {
    name: beach.name,
    slug: beach.slug,
    municipality: beach.municipality,
    features: [...beach.features],
    ...(await getCurrentWeather(beach.position[0], beach.position[1])),
  };

  if (beach.blueFlag) {
    simpleBeach.features.push('bandera-azul');
    simpleBeach.features.sort();
  }

  if (beach.pictures.length > 0) {
    simpleBeach.picture = randomizeArray(beach.pictures)[0];
  }

  return simpleBeach;
};
