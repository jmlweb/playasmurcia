import { capitalize } from './capitalize';

describe('capitalize', () => {
  it('should return the same string if it is empty', () => {
    expect(capitalize('')).toEqual('');
  });

  it('should return the same string if it is already capitalized', () => {
    expect(capitalize('Hello')).toEqual('Hello');
  });

  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toEqual('Hello');
  });
});
