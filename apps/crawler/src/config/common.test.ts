import { getAppPath } from './common';

describe('getAppPath', () => {
  it('should return the proper path to the app', () => {
    const paths = getAppPath().split('/');
    expect(paths[paths.length - 1]).toBe('crawler');
  });
});
