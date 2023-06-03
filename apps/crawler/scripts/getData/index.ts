import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { fetchRawData } from './fetchRawData';
import { getRawDataFromFile } from './getRawDataFromFile';
import { storeRawData } from './storeRawData';

const getData = pipe(
  getRawDataFromFile,
  TE.orElse(() => pipe(fetchRawData, TE.flatMap(storeRawData))),
  TE.getOrElse((e) => () => Promise.reject(e)),
);

getData().then(console.log).catch(console.error);
