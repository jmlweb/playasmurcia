import { DataBeach } from '@/types';

type Comparison = (a: DataBeach, b: DataBeach) => number;

const flowComparisons =
  (...comparisons: Comparison[]) =>
  (a: DataBeach, b: DataBeach) => {
    if (!comparisons.length) {
      return 0;
    }
    const result = comparisons[0](a, b);
    return result !== 0
      ? result
      : flowComparisons(...comparisons.slice(1))(a, b);
  };

const MIN_PICS_DIFFERENCE = 3;

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

export const sorter = flowComparisons(
  byPicture,
  byBlueFlag,
  byFeature('accesible'),
  byFeature('paseo-maritimo'),
);
