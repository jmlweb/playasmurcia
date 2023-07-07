import { constant, flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as P from 'fp-ts/predicate';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as S from 'fp-ts/string';

const makeSlugify = (excludedWords: string[] = []) =>
  flow(
    O.fromPredicate(P.not(S.isEmpty)),
    O.flatMap(
      flow(
        (x) => x.normalize('NFD'),
        S.toLowerCase,
        S.replace(/[\u0300-\u036f().,]/g, ''),
        S.replace(/[-]{2,}/g, '-'),
        S.replace(/\s+/g, ' '),
        S.split(' '),
        RNEA.filter((x) => !excludedWords.includes(x)),
      ),
    ),
    O.map(RNEA.intersperse('-')),
    O.match(() => '', RNEA.concatAll(S.Monoid)),
  );

export const string = {
  makeSlugify,
  slugify: makeSlugify(),
  capitalize: flow(
    O.fromPredicate(P.not(S.isEmpty)),
    O.map(S.toLowerCase),
    O.map(
      flow(
        S.split(''),
        RNEA.modifyHead(S.toUpperCase),
        RNEA.concatAll(S.Monoid),
      ),
    ),
    O.getOrElse(constant(S.empty)),
  ),
};
