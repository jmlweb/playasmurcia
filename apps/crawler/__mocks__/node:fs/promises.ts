const iFs = jest.requireActual('node:fs/promises');

const fs = {
  ...iFs,
  writeFile: jest.fn().mockResolvedValue(undefined),
};

export default fs;
