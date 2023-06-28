import * as E from 'fp-ts/Either';
import { getOrElse } from 'fp-ts/EitherT';
import { flow, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import sizeOf from 'image-size';

import { deleteFile } from '@/pods/fileSystem';

const taskedSizeOf = TE.taskify(sizeOf);

export const validatePictureDimensions = (picturePath: string) =>
  pipe(
    picturePath,
    taskedSizeOf,
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
  );
