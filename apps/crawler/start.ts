import * as E from 'fp-ts/Either';
import { constant, flow, pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as TE from 'fp-ts/TaskEither';
import { z } from 'zod';

import * as commands from './commands';

type Commands = typeof commands;

const commandSchema = z.enum(
  Object.keys(commands) as [keyof Commands, ...(keyof Commands)[]],
);

type Command = z.infer<typeof commandSchema>;

const getCommand = (key: Command): TE.TaskEither<string, {} | []> =>
  commands[key];

const getSecondArg: IO.IO<string> = () => process.argv[2];

const getParsedCommandKey = pipe(
  getSecondArg,
  TE.fromIO,
  TE.flatMap(
    flow(
      E.tryCatchK(commandSchema.parse, constant('Invalid command')),
      TE.fromEither,
    ),
  ),
);

export const run = pipe(getParsedCommandKey, TE.flatMap(getCommand));

run().then(console.log).catch(console.error);
