export const makePluralize =
  (word: string, plural: string = `${word}s`) =>
  (quantity: number) =>
    quantity === 1 ? word : plural;
