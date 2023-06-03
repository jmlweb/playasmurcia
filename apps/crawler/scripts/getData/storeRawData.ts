import * as E from 'fp-ts/Either';
import { constant, pipe } from 'fp-ts/function';
import * as J from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { RawBeach } from './schemas';

const writeToFile = promisify(fs.writeFile);

export const storeRawData = (data: RawBeach[]) =>
  pipe(
    data,
    J.stringify,
    E.mapLeft(constant('Failed to stringify data')),
    TE.fromEither,
    TE.flatMap(
      TE.tryCatchK(
        (data) =>
          writeToFile(path.resolve(__dirname, '../../data/raw.json'), data),
        constant('Failed to write data to file'),
      ),
    ),
    constant(TE.of(data)),
  );
