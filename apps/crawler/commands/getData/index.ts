import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { fetchAndUpdateData } from '../fetchAndUpdateData';
import { getRawDataFromFile } from './getRawDataFromFile';

export const getData = pipe(
  getRawDataFromFile,
  TE.orElse(() => fetchAndUpdateData),
);
