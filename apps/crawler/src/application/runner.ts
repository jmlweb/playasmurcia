import chalk from 'chalk';
import * as Console from 'fp-ts/Console';
import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import { keys } from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { z } from 'zod';

import { commands } from './commands';

const getCommandName: IO.IO<string> = () => process.argv[2];
const getArguments: IO.IO<string[]> = () => process.argv.slice(3);

const okMessage = flow(chalk.green, Console.log);
const koMessage = flow(
  ({ message }: Error) => chalk.red(message),
  Console.error,
);

const commandNameSchema = z
  .string()
  .refine((s): s is keyof typeof commands =>
    keys(commands).includes(s as keyof typeof commands),
  );

export const run = pipe(
  TE.Do,
  TE.bind('command', () =>
    pipe(
      getCommandName,
      TE.fromIO,
      TE.chainEitherK(E.tryCatchK(commandNameSchema.parse, E.toError)),
      TE.map((commandName) => commands[commandName]),
    ),
  ),
  TE.bindW('args', () => pipe(getArguments, TE.fromIO)),
  TE.chain(({ command, args }) => command(args[0])),
  TE.chainIOK(okMessage),
  TE.orElseFirstIOK(koMessage),
);
