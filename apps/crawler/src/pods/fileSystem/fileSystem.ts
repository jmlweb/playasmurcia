import fs from 'node:fs/promises';

import * as E from 'fp-ts/Either';
import { constVoid, pipe } from 'fp-ts/function';
import { ap } from 'fp-ts/Identity';
import * as TE from 'fp-ts/TaskEither';
import path from 'path';

export const readFile = (filePath: string) =>
  TE.tryCatch(() => fs.readFile(filePath, 'utf-8'), E.toError);

export const writeFile =
  (filePath: string) => (data: Parameters<typeof fs.writeFile>[1]) =>
    pipe(
      filePath,
      createNeededDirsForPath,
      TE.chain(
        TE.tryCatchK(() => fs.writeFile(filePath, data, 'utf-8'), E.toError),
      ),
    );

export const filesFromFolder = (folderPath: string) =>
  TE.tryCatch(() => fs.readdir(folderPath), E.toError);

export const createNeededDirsForPath = (targetPath: string) =>
  pipe(
    path.dirname,
    ap(targetPath),
    TE.tryCatchK(
      (dirPath) => fs.mkdir(dirPath, { recursive: true }),
      E.toError,
    ),
    TE.map(constVoid),
  );

export const deleteFile = (filePath: string) =>
  pipe(
    filePath,
    TE.tryCatchK(() => fs.unlink(filePath), E.toError),
  );
