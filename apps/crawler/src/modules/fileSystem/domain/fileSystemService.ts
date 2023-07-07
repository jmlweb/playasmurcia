import * as TE from 'fp-ts/TaskEither';

export type FileSystemService = {
  readFile: (filePath: string) => TE.TaskEither<Error, string>;
  writeFile: (
    filePath: string,
  ) => (data: string | NodeJS.ArrayBufferView) => TE.TaskEither<Error, void>;
  deleteFile: (filePath: string) => TE.TaskEither<Error, void>;
  filesFromDir: (dirPath: string) => TE.TaskEither<Error, string[]>;
  createDirsForPath: (targetPath: string) => TE.TaskEither<Error, void>;
};
