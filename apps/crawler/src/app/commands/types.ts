import { TaskEither } from 'fp-ts/TaskEither';

export type Command = <A extends string>(
  ...args: A[]
) => TaskEither<Error, string>;
