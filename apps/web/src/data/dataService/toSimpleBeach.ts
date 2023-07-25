import { DataBeach, SimpleBeach } from '@/types';

import { getWeather } from './getWeather';

export const toSimpleBeach = async (beach: DataBeach): Promise<SimpleBeach> => {
  const simpleBeach: SimpleBeach = {
    name: beach.name,
    slug: beach.slug,
    municipality: beach.municipality,
    features: beach.features,
    ...(await getWeather(beach.position[0], beach.position[1])),
  };

  if (beach.blueFlag) {
    simpleBeach.features.unshift('bandera-azul');
  }

  if (beach.pictures.length > 0) {
    simpleBeach.picture = beach.pictures[0];
  }

  return simpleBeach;
};
