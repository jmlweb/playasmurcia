import * as TE from 'fp-ts/TaskEither';

import { fetchBeachesWithPersistence } from '../fetchBeachesWithPersistence';
import { readBeaches } from '../readBeaches';

export const makeTaskEitherFallback = <E, A>(b: TE.TaskEither<E, A>) =>
  TE.orElse(() => b);

export const getBeaches = makeTaskEitherFallback(fetchBeachesWithPersistence)(
  readBeaches,
);
