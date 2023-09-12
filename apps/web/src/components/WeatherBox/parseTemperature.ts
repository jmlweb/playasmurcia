import { localizeNumber } from '@/utils/localizeNumber';

export type Temperature = number | number[];

export const parseTemperature = (temperature: Temperature) => {
  const asArray = Array.isArray(temperature) ? temperature : [temperature];
  const max = asArray[asArray.length - 1];
  const asText = `${asArray.map(localizeNumber).join(' / ')}º`;

  return {
    max,
    asText,
  };
};
