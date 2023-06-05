import * as E from 'fp-ts/Either';
import { constant, flow, pipe } from 'fp-ts/function';
import * as J from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const DATA_PATH = path.resolve(__dirname, '../data');

export const writeDataFile = (fileName: string) =>
  flow(
    TE.of,
    TE.tap(
      flow(
        J.stringify,
        E.mapLeft(constant('Failed to stringify data')),
        TE.fromEither,
        TE.flatMap(
          TE.tryCatchK(
            (strData) => writeFile(path.join(DATA_PATH, fileName), strData),
            constant(`Failed to write data to file: ${fileName}`),
          ),
        ),
      ),
    ),
  );

export const readDataFile = (fileName: string) =>
  pipe(
    TE.tryCatch(
      () => readFile(path.join(DATA_PATH, fileName), 'utf-8'),
      constant(`Failed to read data from file: ${fileName}`),
    ),
    TE.flatMapEither(
      flow(J.parse, E.mapLeft(constant('Failed to parse JSON'))),
    ),
  );
