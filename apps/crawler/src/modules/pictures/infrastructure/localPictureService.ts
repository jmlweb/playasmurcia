import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import * as TE from 'fp-ts/TaskEither';
import download from 'image-downloader';
import sizeOf from 'image-size';

import { localFileSystemService } from '@/modules/fileSystem';

import { PictureService } from '../domain';

const taskedSizeOf = TE.taskify(sizeOf);

type Props = {
  picturesPath: string;
  picturesURL: string;
};

export const LocalPictureService = ({
  picturesPath,
  picturesURL,
}: Props): PictureService => ({
  process: (name) =>
    pipe(
      TE.Do,
      TE.bindW('url', () => TE.of(`${picturesURL}/${name}`)),
      TE.bindW('path', () =>
        pipe(
          TE.of(`${picturesPath}/${name}`),
          TE.tap(localFileSystemService.createDirsForPath),
        ),
      ),
      TE.chain(
        TE.tryCatchK(
          ({ url, path }) => download.image({ url, dest: path, timeout: 4000 }),
          E.toError,
        ),
      ),
      TE.map(({ filename }) => filename),
      TE.chain(taskedSizeOf),
      TE.chainEitherK(
        E.fromPredicate(
          ({ width, height }) => N.isNumber(width) && N.isNumber(height),
          () => new Error('Could not retrieve dimensions'),
        ),
      ),
      TE.chainEitherK(
        E.fromPredicate(
          ({ width, height }) => width! >= 250 && height! >= 250,
          ({ width, height }) =>
            new Error(`Invalid dimensions: ${width}x${height} (min: 250x250)`),
        ),
      ),
      TE.as(name),
    ),
  delete: flow(
    (name) => `${picturesPath}/${name}`,
    localFileSystemService.deleteFile,
  ),
});
