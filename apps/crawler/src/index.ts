import { generate } from './commands/generate/generate';

const COMMANDS = {
  generate,
};

const main = () => {
  const commandName = process.argv[2] ?? 'generate';
  if (!(commandName in COMMANDS)) {
    console.error(`Invalid command: ${commandName}`);
    process.exit(1);
  }

  const command = COMMANDS[commandName as keyof typeof COMMANDS];
  command();
};

main();
