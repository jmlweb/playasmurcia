import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';

import { Beaches } from '../../../../domain';

export const extractPictures = (beaches: Beaches) =>
  pipe(
    beaches,
    A.chain(({ pictures }) => pictures),
  );
