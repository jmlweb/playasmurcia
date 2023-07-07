import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/function';
import * as J from 'fp-ts/Json';

export const json = {
  stringify: flow(
    E.fromNullable(new Error('Cannot stringify a null value')),
    E.flatMap(flow(J.stringify, E.mapLeft(E.toError))),
  ),
  parse: flow(J.parse, E.mapLeft(E.toError)),
};
