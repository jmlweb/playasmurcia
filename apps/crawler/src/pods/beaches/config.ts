import { pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import path from 'path';

import { getDataPath } from '@/config';

export const getBeachesFsPath = pipe(
  getDataPath,
  IO.map((dataPath) => path.join(dataPath, './beaches.json')),
);
