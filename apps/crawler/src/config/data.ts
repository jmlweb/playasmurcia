import { pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import path from 'path';

import { getAppPath } from './common';

export const getDataPath = pipe(
  getAppPath,
  IO.map((appPath) => path.join(appPath, './data')),
);
