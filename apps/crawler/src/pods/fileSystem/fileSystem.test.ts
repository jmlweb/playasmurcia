import fs from 'node:fs/promises';

import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import path from 'path';

import {
  createNeededDirsForPath,
  filesFromFolder,
  readFile,
  writeFile,
} from './fileSystem';

jest.mock('fs');

describe('readFile', () => {
  it('should return a left with an error when the file does not exist', async () => {
    const result = pipe(
      'non-existing-file.txt',
      readFile,
      TE.getOrElseW((err) => {
        throw err;
      }),
    )();
    expect(result).rejects.toThrowError(
      "Error: ENOENT: no such file or directory, open 'non-existing-file.txt'",
    );
  });

  it('should return a right with the file content when the file exists', async () => {
    const result = pipe(
      path.resolve(__dirname, './fileSystem.test.ts'),
      readFile,
      TE.getOrElseW((err) => {
        throw err;
      }),
    )();
    expect(result).resolves.toStrictEqual(expect.any(String));
  });
});

describe('writeFile', () => {
  it('should return a left with an error when writeFile fails', async () => {
    (fs.writeFile as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('internal error')),
    );

    const result = pipe(
      writeFile('file.txt')('content'),
      TE.getOrElseW((err) => {
        throw err;
      }),
    )();
    expect(result).rejects.toThrowError('internal error');
  });

  it('should return a right with undefined when the operation works', async () => {
    const result = pipe(
      writeFile('file.txt')('content'),
      TE.getOrElseW((err) => {
        throw err;
      }),
    )();
    expect(result).resolves.toBe(undefined);
  });
});

describe('filesFromFolder', () => {
  it('should return a left with an error when the folder does not exist', async () => {
    const result = pipe(
      'non-existing-folder',
      filesFromFolder,
      TE.getOrElseW((err) => {
        throw err;
      }),
    )();
    expect(result).rejects.toThrowError(
      "Error: ENOENT: no such file or directory, scandir 'non-existing-folder'",
    );
  });
  it('should return the list of files in the folder otherwise', async () => {
    const result = pipe(
      path.resolve(__dirname, './'),
      filesFromFolder,
      TE.getOrElseW((err) => {
        throw err;
      }),
    )();
    expect(result).resolves.toEqual([
      'fileSystem.test.ts',
      'fileSystem.ts',
      'index.ts',
    ]);
  });
});

describe('createNeededDirsForPath', () => {
  it('should return the path if the dir exists', async () => {
    const result = pipe(
      path.resolve(__dirname, './fileSystem.test.ts'),
      createNeededDirsForPath,
      TE.getOrElseW((err) => {
        throw err;
      }),
    )();
    expect(result).resolves.toBe(undefined);
  });
});
