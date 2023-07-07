import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { localFileSystemService } from '@/modules/fileSystem';
import { json } from '@/modules/json';

import { BeachesRepository, beachesSchema } from '../domain';
import { generateSelectors } from './shared';

export const LocalBeachesRepository = (dataPath: string): BeachesRepository => {
  const filePath = `${dataPath}/beaches.json`;

  return generateSelectors({
    get: pipe(
      filePath,
      localFileSystemService.readFile,
      TE.chainEitherK(json.parse),
      TE.chainEitherK(E.tryCatchK(beachesSchema.parse, E.toError)),
    ),
    set: flow(
      json.stringify,
      TE.fromEither,
      TE.chain(localFileSystemService.writeFile(filePath)),
    ),
  });
};
