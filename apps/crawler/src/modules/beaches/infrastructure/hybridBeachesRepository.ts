import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { BeachesRepository } from '../domain';
import { LocalBeachesRepository } from './localBeachesRepository';
import { RemoteBeachesRepository } from './remoteBeachesRepository';
import { generateSelectors } from './shared';

export const HybridBeachesRepository = (
  dataPath: string,
): BeachesRepository => {
  const localBeachesRepository = LocalBeachesRepository(dataPath);
  const remoteBeachesRepository = RemoteBeachesRepository();

  const fetchBeachesWithPersistence = pipe(
    remoteBeachesRepository.get,
    TE.tap(localBeachesRepository.set),
  );

  return generateSelectors({
    get: pipe(
      localBeachesRepository.get,
      TE.orElse(() => fetchBeachesWithPersistence),
    ),
    set: localBeachesRepository.set,
  });
};
