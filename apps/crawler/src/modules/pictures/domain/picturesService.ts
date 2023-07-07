import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';

import { PictureService, PicturesResults } from './types';

const convertToTask =
  <A, B>(fn: (x: string) => TE.TaskEither<A, B>) =>
  (source: string) =>
    pipe(
      source,
      fn,
      TE.match(
        () => E.left(source),
        () => E.right(source),
      ),
    );

export const PicturesService = (pictureService: PictureService) => {
  const executeChunk = (fn: ReturnType<typeof convertToTask>) =>
    flow(
      A.map(fn),
      A.sequence(T.ApplicativePar),
      T.map(
        A.reduce(
          { valid: [], invalid: [] } as PicturesResults,
          (acc, curr) => ({
            ...acc,
            ...pipe(
              curr,
              E.matchW(
                (l) => ({ invalid: A.append(l)(acc.invalid) }),
                (r) => ({ valid: A.append(r)(acc.valid) }),
              ),
            ),
          }),
        ),
      ),
    );

  const executeInChunks =
    (fn: ReturnType<typeof convertToTask>) => (sources: string[]) =>
      pipe(
        sources,
        A.chunksOf(5),
        A.map(executeChunk(fn)),
        A.sequence(T.ApplicativeSeq),
        T.map(
          A.reduce(
            { valid: [], invalid: [] } as PicturesResults,
            (acc, curr) => {
              acc.valid.push(...curr.valid);
              acc.invalid.push(...curr.invalid);
              return acc;
            },
          ),
        ),
      );

  return {
    process: executeInChunks(convertToTask(pictureService.process)),
    delete: executeInChunks(convertToTask(pictureService.delete)),
  };
};
