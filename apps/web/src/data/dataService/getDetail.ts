import { CompleteBeach } from '@/types';

import beaches from '../beaches.json';
import { getWeatherPredictions } from './getWeatherPredictions';

export const getDetail = async (slug: string): Promise<CompleteBeach> => {
  const dataBeach = beaches.find((beach) => beach.slug === slug);
  if (!dataBeach) {
    return undefined;
  }
  if (dataBeach.blueFlag) {
    dataBeach.features.push('bandera-azul');
    dataBeach.features.sort();
  }
  return {
    ...dataBeach,
    predictions: await getWeatherPredictions(
      dataBeach.position[0],
      dataBeach.position[1],
    ),
  };
};
