import 'server-only';

import { randomInt } from 'crypto';

import { Beach } from '@/types';

import beaches from './beaches.json';

const MIN_PICS_DIFFERENCE = 3;

type Comparison = (a: Beach, b: Beach) => number;

const flowComparisons =
  (...comparisons: Comparison[]) =>
  (a: Beach, b: Beach) => {
    if (!comparisons.length) {
      return 0;
    }
    const result = comparisons[0](a, b);
    return result !== 0
      ? result
      : flowComparisons(...comparisons.slice(1))(a, b);
  };

const byPicture: Comparison = (a, b) =>
  Math.min(b.pictures.length, MIN_PICS_DIFFERENCE) -
  Math.min(a.pictures.length, MIN_PICS_DIFFERENCE);

const byBlueFlag: Comparison = (a, b) => {
  if (a.blueFlag && !b.blueFlag) {
    return -1;
  }

  if (!a.blueFlag && b.blueFlag) {
    return 1;
  }

  return 0;
};

const byFeature =
  (feature: string): Comparison =>
  (a, b) => {
    if (a.features.includes(feature) && !b.features.includes(feature)) {
      return -1;
    }
    if (b.features.includes(feature) && !a.features.includes(feature)) {
      return 1;
    }
    return 0;
  };

const DataService = () => {
  const sortedBeaches = beaches.sort(
    flowComparisons(
      byPicture,
      byBlueFlag,
      byFeature('accesible'),
      byFeature('paseo-maritimo'),
    ),
  );

  const beachesSelection = sortedBeaches.slice(0, 32);
  let featuredBeaches: typeof beachesSelection = [];
  Array.from({ length: 12 }).forEach(() => {
    const position = randomInt(0, beachesSelection.length - 1);
    featuredBeaches.push(beachesSelection[position]);
    beachesSelection.splice(position, 1);
  });

  const municipalities = Array.from(
    new Set(beaches.flatMap(({ municipality }) => municipality)),
  ).sort();

  return {
    beaches: () => sortedBeaches,
    municipalities: () => municipalities,
    featuredBeaches: () => featuredBeaches,
  };
};

const dataService = DataService();

export default dataService;
