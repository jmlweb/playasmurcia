import { SimpleBeach } from '@/types';

import defaultSort from './lib/defaultSort';
import queryBeaches from './lib/queryBeaches';

let cachedPromise: Promise<ReadonlyArray<SimpleBeach>>;

const getAccesibleBeaches = () => {
  if (!cachedPromise) {
    cachedPromise = queryBeaches({
      filter: ({ accesible }) => accesible,
      sort: defaultSort,
      limit: 10,
    });
  }
  return cachedPromise;
};

export default getAccesibleBeaches;
