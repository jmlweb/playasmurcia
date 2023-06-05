export const capitalize = (x: string) =>
  x.length === 0 ? x : `${x[0].toUpperCase()}${x.slice(1).toLowerCase()}`;
