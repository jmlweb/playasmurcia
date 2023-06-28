import { parse, stringify } from './json';

describe('stringify', () => {
  it('should return a right with the stringified JSON if everything goes well', () => {
    const result = stringify({ foo: 'bar' });
    expect(result).toEqual({
      _tag: 'Right',
      right: '{"foo":"bar"}',
    });
  });

  it('should return a left with an error if the value is null', () => {
    const result = stringify(null);
    expect(result).toEqual({
      _tag: 'Left',
      left: new Error('Cannot stringify a null value'),
    });
  });

  it('should return a left with an error if the value is a function', () => {
    const result = stringify(() => {});
    expect(result).toEqual({
      _tag: 'Left',
      left: new Error('Converting unsupported structure to JSON'),
    });
  });
});

describe('parse', () => {
  it('should return a right with the parsed JSON if everything goes well', () => {
    const result = parse('{"foo":"bar"}');
    expect(result).toEqual({
      _tag: 'Right',
      right: { foo: 'bar' },
    });
  });

  it('should return a left with an error if the value is null', () => {
    const result = parse('"sf"": "as"');
    expect(result).toEqual({
      _tag: 'Left',
      left: new Error(
        'Unexpected non-whitespace character after JSON at position 4',
      ),
    });
  });
});
