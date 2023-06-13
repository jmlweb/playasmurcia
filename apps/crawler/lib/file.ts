import { constant, flow, pipe } from 'fp-ts/function';
import IO from 'fp-ts/IO';
import * as TE from 'fp-ts/TaskEither';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { parse, stringify } from './json';

const pFs = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
};

const getFilePath =
  (fileName: string): IO.IO<string> =>
  () =>
    path.resolve(__dirname, '../data', fileName);

export const writeDataFile = (fileName: string) =>
  flow(
    TE.of,
    TE.tap(
      flow(
        stringify,
        TE.fromEither,
        TE.flatMap(
          TE.tryCatchK(
            (strData) =>
              pFs.writeFile(getFilePath(fileName)(), strData, 'utf-8'),
            constant(`Failed to write data to file: ${fileName}`),
          ),
        ),
      ),
    ),
  );

export const readDataFile = (fileName: string) =>
  pipe(
    fileName,
    getFilePath,
    TE.fromIO,
    TE.flatMap((filePath) =>
      TE.tryCatch(
        () => pFs.readFile(filePath, 'utf-8'),
        () => `Failed to read data from file: ${fileName}`,
      ),
    ),
    TE.flatMapEither(parse),
  );
