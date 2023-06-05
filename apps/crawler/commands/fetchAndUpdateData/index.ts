import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { writeDataFile } from '@/lib';

import { fetchRawData } from './fetchRawData';

export const fetchAndUpdateData = pipe(
  fetchRawData,
  TE.flatMap(writeDataFile('raw.json')),
);
