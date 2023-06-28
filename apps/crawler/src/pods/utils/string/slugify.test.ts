import { slugify } from './slugify';

describe('slugify', () => {
  it('should return the same string if it is empty', () => {
    expect(slugify('')).toEqual('');
  });

  it('should return the same string if it is already slugified', () => {
    expect(slugify('hello-world')).toEqual('hello-world');
  });

  it('should remove multiple dashes', () => {
    expect(slugify('hello---world')).toEqual('hello-world');
  });

  it('should slugify a string', () => {
    expect(slugify('Hello World')).toEqual('hello-world');
  });

  it('should slugify a string with excluded words', () => {
    expect(slugify('El mundo es bello')).toEqual('mundo-es-bello');
  });
});
