import { constant, LazyArg, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

export const makeBindFn = <T>(x: LazyArg<T>) => pipe(x, TE.fromIO, constant);
