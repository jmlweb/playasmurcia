import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { stringify } from '../../json';
import { fetchBeaches } from '../fetchBeaches';
import { writeBeaches } from '../writeBeaches';

export const fetchBeachesWithPersistence = pipe(
  TE.Do,
  TE.bind('beaches', () => fetchBeaches),
  TE.bind('operation', ({ beaches }) =>
    pipe(beaches, stringify, TE.fromEither, TE.chain(writeBeaches)),
  ),
  TE.map(({ beaches }) => beaches),
);
