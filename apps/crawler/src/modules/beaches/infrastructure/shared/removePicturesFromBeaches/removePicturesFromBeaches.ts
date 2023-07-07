import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

import { Beaches } from '../../../domain';

export const removePicturesFromBeaches =
  (pictures: string[]) => (beaches: Beaches) =>
    pipe(
      beaches,
      A.reduce(
        { invalidPictures: pictures, beaches: [] as Beaches },
        (acc, curr) => {
          const invalidPicturesFromCurr = A.intersection(S.Eq)(
            curr.pictures,
            acc.invalidPictures,
          );
          acc.beaches.push({
            ...curr,
            pictures: A.difference(S.Eq)(
              curr.pictures,
              invalidPicturesFromCurr,
            ),
          });
          acc.invalidPictures = A.difference(S.Eq)(
            acc.invalidPictures,
            invalidPicturesFromCurr,
          );
          return acc;
        },
      ),
      ({ beaches }) => beaches,
    );
