const EXCLUDED_WORDS = ['el', 'la', 'los', 'las', 'de', 'del', 'y'];

export const capitalize = (x: string) =>
  x.length === 0 ? x : `${x[0].toUpperCase()}${x.slice(1).toLowerCase()}`;

export const slugify = (x: string, replaceExcludedWords = true) => {
  const parts = x
    .normalize('NFD')
    .toLowerCase()
    .replace(/[\u0300-\u036f()]/g, '')
    .replace(/[.,-]/g, '')
    .replace(/\s+/g, ' ')
    .split(' ');
  const filteredParts = replaceExcludedWords
    ? parts.filter((part) => !EXCLUDED_WORDS.includes(part))
    : parts;
  return filteredParts.join('-');
};
