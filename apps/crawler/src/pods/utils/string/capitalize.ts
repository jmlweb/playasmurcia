import { constant, flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/option';
import * as P from 'fp-ts/predicate';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as S from 'fp-ts/string';

export const capitalize = (str: string) =>
  pipe(
    str,
    O.fromPredicate(P.not(S.isEmpty)),
    O.map(S.toLowerCase),
    O.map(
      flow(
        S.split(''),
        RNEA.modifyHead(S.toUpperCase),
        RNEA.concatAll(S.Monoid),
      ),
    ),
    O.getOrElse(constant(str)),
  );
