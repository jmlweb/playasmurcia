import { constant, pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import path from 'path';

import { getAppPath } from './common';
import { getDataPath } from './data';

export const getPicturesPath: IO.IO<string> = pipe(
  getAppPath,
  IO.map((appPath) => path.join(appPath, './pictures')),
);

export const getPicturesByStatusPath = pipe(
  getDataPath,
  IO.map((dataPath) => `${dataPath}/pictures-by-status.json`),
);

export const getPicturesURL = constant(
  'http://www.murciaturistica.es/webs/murciaturistica/fotos/1/playas/',
);
