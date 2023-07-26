import 'server-only';

import { randomInt } from 'crypto';

export const randomizeArray = <T>(remaining: T[], processed: T[] = []): T[] => {
  if (remaining.length < 2) {
    return [...processed, ...remaining];
  }

  const position = randomInt(0, remaining.length - 1);

  return randomizeArray(
    [...remaining.slice(0, position), ...remaining.slice(position + 1)],
    [...processed, remaining[position]],
  );
};
