import * as E from 'fp-ts/Either';
import { constant, flow } from 'fp-ts/function';
import * as J from 'fp-ts/Json';
import * as S from 'fp-ts/string';

export const stringify = flow(
  E.fromNullable('Cannot stringify a nullable value'),
  E.flatMap(flow(J.stringify, E.mapLeft(constant('Failed to stringify JSON')))),
);

export const parse = flow(
  E.fromPredicate(S.isString, constant('Cannot parse a non-string value')),
  E.flatMap(flow(J.parse, E.mapLeft(constant('Failed to parse JSON')))),
);
