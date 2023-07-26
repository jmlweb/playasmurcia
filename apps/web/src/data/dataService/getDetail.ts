import { Beach } from '@/types';

import beaches from '../beaches.json';
import { getCurrentWeather } from './getCurrentWeather';

export const getDetail = async (slug: string): Promise<Beach> => {
  const dataBeach = beaches.find((beach) => beach.slug === slug);
  const weather = await getCurrentWeather(
    dataBeach.position[0],
    dataBeach.position[1],
  );
  return {
    ...dataBeach,
    ...weather,
  };
};
