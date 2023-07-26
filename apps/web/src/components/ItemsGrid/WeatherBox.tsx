import dynamic from 'next/dynamic';
import { LuArrowUp } from 'react-icons/lu';

const Hot = dynamic(() => import('react-icons/wi').then((mod) => mod.WiHot));

const Icons = {
  '0': dynamic(() => import('react-icons/wi').then((mod) => mod.WiDaySunny)),
  '1': dynamic(() => import('react-icons/wi').then((mod) => mod.WiDaySunny)),
  '2': dynamic(() =>
    import('react-icons/wi').then((mod) => mod.WiDaySunnyOvercast),
  ),
  '3': dynamic(() => import('react-icons/wi').then((mod) => mod.WiCloud)),
  '45': dynamic(() => import('react-icons/wi').then((mod) => mod.WiFog)),
  '48': dynamic(() => import('react-icons/wi').then((mod) => mod.WiFog)),
  '51': dynamic(() => import('react-icons/wi').then((mod) => mod.WiDayShowers)),
  '53': dynamic(() => import('react-icons/wi').then((mod) => mod.WiDayRainMix)),
  '55': dynamic(() => import('react-icons/wi').then((mod) => mod.WiDayRain)),
  '56': dynamic(() => import('react-icons/wi').then((mod) => mod.WiDayHail)),
  '57': dynamic(() => import('react-icons/wi').then((mod) => mod.WiHail)),
  '61': dynamic(() => import('react-icons/wi').then((mod) => mod.WiShowers)),
  '63': dynamic(() => import('react-icons/wi').then((mod) => mod.WiRainMix)),
  '65': dynamic(() => import('react-icons/wi').then((mod) => mod.WiRain)),
  '66': dynamic(() => import('react-icons/wi').then((mod) => mod.WiDayHail)),
  '67': dynamic(() => import('react-icons/wi').then((mod) => mod.WiHail)),
  '71': dynamic(() => import('react-icons/wi').then((mod) => mod.WiDaySnow)),
  '73': dynamic(() => import('react-icons/wi').then((mod) => mod.WiSnow)),
  '75': dynamic(() =>
    import('react-icons/wi').then((mod) => mod.WiSnowflakeCold),
  ),
  '77': dynamic(() => import('react-icons/wi').then((mod) => mod.WiSleet)),
};

type Props = {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  weatherTitle: string;
};

export const WeatherBox = ({
  temperature,
  weatherCode,
  windSpeed,
  windDirection,
  weatherTitle,
}: Props) => {
  const IconComponent =
    weatherCode < 3 && temperature > 30 ? Hot : Icons[weatherCode.toString()];
  return (
    <div className="absolute top-4 left-4 right-4 flex gap-2">
      <div
        className="flex flex-col-reverse items-center justify-between rounded bg-gradient-to-b from-gray-500/80 via-gray-600/70 to-gray-700/60 p-2 text-gray-100 transition-all motion-safe:group-hover:bg-sky-800/75"
        title={weatherTitle}
      >
        <span className="text-sm font-semibold tracking-wide">
          {`${temperature}`.replace('.', ',')}º
        </span>
        {IconComponent && <IconComponent className="text-4xl text-white" />}
        <span className="sr-only">{weatherTitle}</span>
      </div>
      <div
        className="flex flex-col-reverse items-center justify-between rounded bg-gradient-to-b from-gray-500/80 via-gray-600/70 to-gray-700/60 p-2 text-gray-100  transition-all motion-safe:group-hover:bg-sky-800/75"
        title={`Dirección del viento: ${windDirection}º`}
      >
        <span className="text-sm font-semibold tracking-wide">
          {`${windSpeed}`.replace('.', ',')}
          <span className="text-xs">km/h</span>
        </span>
        <LuArrowUp
          className="text-2xl text-white origin-center mt-1.5"
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
