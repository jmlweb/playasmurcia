import { flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as P from 'fp-ts/predicate';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as S from 'fp-ts/string';

const EXCLUDED_WORDS = ['el', 'la', 'los', 'las', 'de', 'del', 'y'];

export const slugify = flow(
  O.fromPredicate(P.not(S.isEmpty)),
  O.flatMap(
    flow(
      (x) => x.normalize('NFD'),
      S.toLowerCase,
      S.replace(/[\u0300-\u036f().,]/g, ''),
      S.replace(/[-]{2,}/g, '-'),
      S.replace(/\s+/g, ' '),
      S.split(' '),
      RNEA.filter((x) => !EXCLUDED_WORDS.includes(x)),
    ),
  ),
  O.map(RNEA.intersperse('-')),
  O.match(() => '', RNEA.concatAll(S.Monoid)),
);
