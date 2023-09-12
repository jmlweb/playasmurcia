import {
  WiCloud,
  WiDayHail,
  WiDayRain,
  WiDayRainMix,
  WiDayShowers,
  WiDaySnow,
  WiDaySunny,
  WiDaySunnyOvercast,
  WiFog,
  WiHail,
  WiHot,
  WiRain,
  WiRainMix,
  WiShowers,
  WiSleet,
  WiSnow,
  WiSnowflakeCold,
} from 'react-icons/wi';

import { icon, IconProps } from './icon';

const CODES_TO_ICONS = {
  '0': WiDaySunny,
  '1': WiDaySunny,
  '2': WiDaySunnyOvercast,
  '3': WiCloud,
  '45': WiFog,
  '48': WiFog,
  '51': WiDayShowers,
  '53': WiDayRainMix,
  '55': WiDayRain,
  '56': WiDayHail,
  '57': WiHail,
  '61': WiShowers,
  '63': WiRainMix,
  '65': WiRain,
  '66': WiDayHail,
  '67': WiHail,
  '71': WiDaySnow,
  '73': WiSnow,
  '75': WiSnowflakeCold,
  '77': WiSleet,
};

export type Props = {
  mode: IconProps['mode'];
  weatherCode: number;
  maxTemperature: number;
};

const getIconComponent = (
  weatherCode: Props['weatherCode'],
  maxTemperature: Props['maxTemperature'],
) => {
  if (weatherCode < 2 && maxTemperature > 30) {
    return WiHot;
  }
  const Icon =
    CODES_TO_ICONS[weatherCode.toString() as keyof typeof CODES_TO_ICONS];
  return Icon;
};

export const WeatherIcon = ({ mode, weatherCode, maxTemperature }: Props) => {
  const className = icon({
    type: 'weather',
    mode,
  });

  const IconComponent = getIconComponent(weatherCode, maxTemperature);
  return IconComponent ? <IconComponent className={className} /> : null;
};
