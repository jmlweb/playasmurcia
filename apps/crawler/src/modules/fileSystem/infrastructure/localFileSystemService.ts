import fs from 'node:fs/promises';

import * as E from 'fp-ts/Either';
import { constVoid, pipe } from 'fp-ts/function';
import { ap } from 'fp-ts/Identity';
import * as TE from 'fp-ts/TaskEither';
import path from 'path';

import { FileSystemService } from '../domain';

export const localFileSystemService: FileSystemService = {
  readFile: (filePath) =>
    TE.tryCatch(() => fs.readFile(filePath, 'utf-8'), E.toError),

  writeFile: (filePath) => (data) =>
    pipe(
      filePath,
      localFileSystemService.createDirsForPath,
      TE.chain(
        TE.tryCatchK(() => fs.writeFile(filePath, data, 'utf-8'), E.toError),
      ),
    ),

  deleteFile: (filePath) => pipe(filePath, TE.tryCatchK(fs.unlink, E.toError)),

  filesFromDir: (dirPath) => TE.tryCatch(() => fs.readdir(dirPath), E.toError),

  createDirsForPath: (targetPath: string) =>
    pipe(
      path.dirname,
      ap(targetPath),
      TE.tryCatchK(
        (dirPath) => fs.mkdir(dirPath, { recursive: true }),
        E.toError,
      ),
      TE.map(constVoid),
    ),
};
