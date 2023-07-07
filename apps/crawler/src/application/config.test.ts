import { config } from './config';

describe('config', () => {
  it('should return the proper path to the root', () => {
    const paths = config.rootPath().split('/');
    expect(paths[paths.length - 1]).toBe('crawler');
  });

  it('should return the proper path to the data', () => {
    const paths = config.dataPath().split('/');
    expect(paths[paths.length - 1]).toBe('data');
  });
});
