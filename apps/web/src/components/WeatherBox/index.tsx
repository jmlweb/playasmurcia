import { cva } from 'class-variance-authority';
import dynamic from 'next/dynamic';
import { LuArrowUp } from 'react-icons/lu';

const getWiIcons = () => import('react-icons/wi');

const WiHot = dynamic(() => getWiIcons().then((mod) => mod.WiHot));

const WiIcons = {
  '0': dynamic(() => getWiIcons().then((mod) => mod.WiDaySunny)),
  '1': dynamic(() => getWiIcons().then((mod) => mod.WiDaySunny)),
  '2': dynamic(() => getWiIcons().then((mod) => mod.WiDaySunnyOvercast)),
  '3': dynamic(() => getWiIcons().then((mod) => mod.WiCloud)),
  '45': dynamic(() => getWiIcons().then((mod) => mod.WiFog)),
  '48': dynamic(() => getWiIcons().then((mod) => mod.WiFog)),
  '51': dynamic(() => getWiIcons().then((mod) => mod.WiDayShowers)),
  '53': dynamic(() => getWiIcons().then((mod) => mod.WiDayRainMix)),
  '55': dynamic(() => getWiIcons().then((mod) => mod.WiDayRain)),
  '56': dynamic(() => getWiIcons().then((mod) => mod.WiDayHail)),
  '57': dynamic(() => getWiIcons().then((mod) => mod.WiHail)),
  '61': dynamic(() => getWiIcons().then((mod) => mod.WiShowers)),
  '63': dynamic(() => getWiIcons().then((mod) => mod.WiRainMix)),
  '65': dynamic(() => getWiIcons().then((mod) => mod.WiRain)),
  '66': dynamic(() => getWiIcons().then((mod) => mod.WiDayHail)),
  '67': dynamic(() => getWiIcons().then((mod) => mod.WiHail)),
  '71': dynamic(() => getWiIcons().then((mod) => mod.WiDaySnow)),
  '73': dynamic(() => getWiIcons().then((mod) => mod.WiSnow)),
  '75': dynamic(() => getWiIcons().then((mod) => mod.WiSnowflakeCold)),
  '77': dynamic(() => getWiIcons().then((mod) => mod.WiSleet)),
};

const styles = {
  wrapper: cva(['flex', 'gap-2'], {
    variants: {
      mode: {
        list: ['absolute', 'top-4', 'left-4', 'right-4'],
        detail: [],
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
  icon: cva([], {
    variants: {
      type: {
        weather: ['text-4xl'],
        wind: ['text-2xl', 'origin-center', 'mt-1.5'],
      },
      mode: {
        list: ['text-white'],
        detail: ['text-gray-500'],
      },
    },
  }),
};

type Props = {
  mode: 'list' | 'detail';
  temperature: number | number[];
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
  const temperatureArr = Array.isArray(temperature)
    ? temperature
    : [temperature];
  const maxTemperature = temperatureArr[temperatureArr.length - 1];
  const IconComponent =
    weatherCode < 2 && maxTemperature > 30
      ? WiHot
      : WiIcons[weatherCode.toString()];
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
          {temperatureArr.map((t) => `${t}`.replace('.', ',')).join(' / ')}º
        </span>
        {IconComponent && (
          <IconComponent
            className={styles.icon({
              type: 'weather',
              mode,
            })}
          />
        )}
        <span className="sr-only">{weatherTitle}</span>
      </div>
      <div
        className={styles.group({
          mode,
        })}
        title={`Dirección del viento: ${windDirection}º`}
      >
        <span className="text-sm font-medium tracking-wide">
          {`${windSpeed}`.replace('.', ',')}{' '}
          <span className="text-xs">km/h</span>
        </span>
        <LuArrowUp
          className={styles.icon({
            type: 'wind',
            mode,
          })}
          style={{
            transform: `rotate(${windDirection}deg)`,
          }}
        />
        <span className="sr-only">
          Dirección del viento: {windDirection} grados
        </span>
      </div>
    </div>
  );
};
