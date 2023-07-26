import { SimpleBeaches } from '@/types';

import { getSortedBeaches } from './getSortedBeaches';
import { randomizeArray } from './randomizeArray';
import { toSimpleBeach } from './toSimpleBeach';

let cache: SimpleBeaches;

export const getFeaturedBeaches = async () => {
  if (!cache) {
    cache = await Promise.all(
      randomizeArray(getSortedBeaches().slice(0, 32))
        .slice(0, 12)
        .map(toSimpleBeach),
    );
  }
  return cache;
};
