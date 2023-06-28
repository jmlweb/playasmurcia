import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { getBeaches } from '../getBeaches';

export const getBeachesPictures = pipe(
  getBeaches,
  TE.map(A.flatMap((beach) => beach.pictures)),
);
