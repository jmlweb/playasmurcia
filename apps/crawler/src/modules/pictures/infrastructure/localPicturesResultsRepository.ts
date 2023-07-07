import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as TE from 'fp-ts/TaskEither';

import { localFileSystemService } from '@/modules/fileSystem';
import { json } from '@/modules/json';

import {
  PicturesResults,
  PicturesResultsRepository,
  picturesResultsSchema,
} from '../domain';

const evolveWithFallbacks = (
  results: Partial<PicturesResults>,
): PicturesResults => ({
  invalid: results.invalid ?? [],
  valid: results.valid ?? [],
});

const mergeResults = ({
  current,
  newOpposite,
  newSame,
}: {
  current: string[];
  newOpposite: string[];
  newSame: string[];
}) => A.union(S.Eq)(A.difference(S.Eq)(current, newOpposite), newSame);

const DEFAULT_RESULTS: PicturesResults = {
  invalid: [],
  valid: [],
};

export const LocalPicturesResultsRepository = (
  dataPath: string,
): PicturesResultsRepository => {
  const filePath = `${dataPath}/pictures-by-status.json`;

  const get = pipe(
    filePath,
    localFileSystemService.readFile,
    TE.chainEitherK(json.parse),
    TE.chainEitherK(E.tryCatchK(picturesResultsSchema.parse, E.toError)),
  );

  const set = flow(
    json.stringify,
    TE.fromEither,
    TE.chain(localFileSystemService.writeFile(filePath)),
  );

  return {
    get,
    safeGet: pipe(
      get,
      TE.orElse(() => TE.of(DEFAULT_RESULTS)),
    ),
    pictures: pipe(
      get,
      TE.map(({ valid, invalid }) => A.union(S.Eq)(valid, invalid)),
    ),
    set,
    update: flow(
      evolveWithFallbacks,
      TE.of,
      TE.bindTo('payload'),
      TE.bind('current', () => get),
      TE.map(({ current, payload }) => ({
        valid: mergeResults({
          current: current.valid,
          newOpposite: payload.invalid,
          newSame: payload.valid,
        }),
        invalid: mergeResults({
          current: current.invalid,
          newOpposite: payload.valid,
          newSame: payload.invalid,
        }),
      })),
      TE.chain(set),
    ),
  };
};
