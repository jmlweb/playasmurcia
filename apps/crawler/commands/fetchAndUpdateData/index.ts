import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { writeDataFile } from '@/lib';

import { fetchRawData } from './fetchRawData';
import { parseRawBeaches } from './parseRawBeaches';

export const fetchAndUpdateData = pipe(
  fetchRawData,
  TE.map(parseRawBeaches),
  TE.flatMap(writeDataFile('raw.json')),
);
