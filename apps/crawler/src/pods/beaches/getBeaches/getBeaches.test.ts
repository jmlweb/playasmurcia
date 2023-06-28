import * as TE from 'fp-ts/TaskEither';

import { makeTaskEitherFallback } from './getBeaches';

describe('getBeaches', () => {
  it('should call and resolve the task A if it is successful', async () => {
    const a: TE.TaskEither<Error, string> = jest.fn(TE.right('a'));
    const b: TE.TaskEither<Error, string> = jest.fn(TE.right('b'));
    const result = await makeTaskEitherFallback(b)(a)();
    expect(a).toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();
    expect(result).toEqual({ _tag: 'Right', right: 'a' });
  });

  it('should call both tasks, resolving B if A fails and B is successful', async () => {
    const a: TE.TaskEither<Error, string> = jest.fn(TE.left(new Error('a')));
    const b: TE.TaskEither<Error, string> = jest.fn(TE.right('b'));
    const result = await makeTaskEitherFallback(b)(a)();
    expect(a).toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
    expect(result).toEqual({ _tag: 'Right', right: 'b' });
  });

  it('should fail if both tasks fail', async () => {
    const a: TE.TaskEither<Error, string> = jest.fn(TE.left(new Error('a')));
    const b: TE.TaskEither<Error, string> = jest.fn(TE.left(new Error('b')));
    const result = await makeTaskEitherFallback(b)(a)();
    expect(a).toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
    expect(result).toEqual({ _tag: 'Left', left: new Error('b') });
  });
});
