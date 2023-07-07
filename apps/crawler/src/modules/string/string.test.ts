import { string } from './string';

describe('capitalize', () => {
  it('should return the same string if it is empty', () => {
    expect(string.capitalize('')).toEqual('');
  });

  it('should return the same string if it is already capitalized', () => {
    expect(string.capitalize('Hello')).toEqual('Hello');
  });

  it('should capitalize the first letter of a string', () => {
    expect(string.capitalize('hello')).toEqual('Hello');
  });
});

describe('makeSlugify', () => {
  const customSlugify = string.makeSlugify(['es', 'el']);
  it('should return the same string if it is empty', () => {
    expect(customSlugify('')).toEqual('');
  });

  it('should return the same string if it is already slugified', () => {
    expect(customSlugify('hello-world')).toEqual('hello-world');
  });

  it('should remove multiple dashes', () => {
    expect(customSlugify('hello---world')).toEqual('hello-world');
  });

  it('should slugify a string', () => {
    expect(customSlugify('Hello World')).toEqual('hello-world');
  });

  it('should slugify a string with excluded words', () => {
    expect(customSlugify('El mundo es bello')).toEqual('mundo-bello');
  });
});
