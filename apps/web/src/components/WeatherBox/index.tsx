import { cva } from 'class-variance-authority';

import { localizeNumber } from '@/utils/localizeNumber';

import { IconProps } from './icon';
import { parseTemperature, Temperature } from './parseTemperature';
import { WeatherIcon } from './WeatherIcon';
import { WindIcon } from './WindIcon';

const styles = {
  wrapper: cva('flex gap-2', {
    variants: {
      mode: {
        list: 'absolute top-4 left-4 right-4',
        detail: undefined,
      },
    },
  }),
  group: cva(
    [
      'flex',
      'flex-col-reverse',
      'items-center',
      'justify-between',
      'rounded',
      'bg-gradient-to-b',
      'p-2',
    ],
    {
      variants: {
        mode: {
          list: [
            'text-gray-100',
            'from-gray-500/80',
            'via-gray-600/70',
            'to-gray-700/60',
            'transition-all',
            'motion-safe:group-hover:bg-sky-800/75',
          ],
          detail: [
            'text-gray-600',
            'from-gray-100/50',
            'via-gray-100/60',
            'to-gray-100/70',
            'flex-1',
          ],
        },
      },
    },
  ),
};

type Props = {
  mode: IconProps['mode'];
  temperature: Temperature;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  weatherTitle: string;
};

export const WeatherBox = ({
  mode = 'list',
  temperature,
  weatherCode,
  windSpeed,
  windDirection,
  weatherTitle,
}: Props) => {
  const temperatureData = parseTemperature(temperature);
  return (
    <div
      className={styles.wrapper({
        mode,
      })}
    >
      <div
        className={styles.group({
          mode,
        })}
        title={weatherTitle}
      >
        <span className="text-sm font-medium tracking-wide">
          {temperatureData.asText}
        </span>
        <WeatherIcon
          mode={mode}
          weatherCode={weatherCode}
          maxTemperature={temperatureData.max}
        />
        <span className="sr-only">{weatherTitle}</span>
      </div>
      <div
        className={styles.group({
          mode,
        })}
        title={`Dirección del viento: ${windDirection}º`}
      >
        <span className="text-sm font-medium tracking-wide">
          {localizeNumber(windSpeed)} <span className="text-xs">km/h</span>
        </span>
        <WindIcon mode={mode} windDirection={windDirection} />
        <span className="sr-only">
          Dirección del viento: {windDirection} grados
        </span>
      </div>
    </div>
  );
};
