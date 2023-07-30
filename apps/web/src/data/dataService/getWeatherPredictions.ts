import { Prediction } from '@/types';

import { getWeatherTitle } from './getWeatherTitle';

type Response = {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
  };
  daily: {
    time: number[];
    weathercode: number[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    windspeed_10m_max: number[];
    winddirection_10m_dominant: number[];
  };
};

const getDayOfWeek = (day: number) => {
  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  return days[day];
};

export const getWeatherPredictions = async (lat: number, lng: number) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_min,temperature_2m_max,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timeformat=unixtime&timezone=Europe%2FBerlin&forecast_days=5`,
    {
      next: {
        revalidate: 14400,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Invalid response');
  }
  const { current_weather: currentWeather, daily }: Response =
    await response.json();

  const result: Prediction[] = [];

  for (let i = 0; i < daily.time.length; i++) {
    if (i === 0) {
      result.push({
        day: 'Ahora',
        weatherCode: currentWeather.weathercode,
        temperature: currentWeather.temperature,
        windSpeed: currentWeather.windspeed,
        windDirection: currentWeather.winddirection,
        weatherTitle: getWeatherTitle(currentWeather.weathercode),
      });
    }
    result.push({
      day: getDayOfWeek(new Date(daily.time[i] * 1000).getDay()),
      weatherCode: daily.weathercode[i],
      temperature: [daily.temperature_2m_min[i], daily.temperature_2m_max[i]],
      windSpeed: daily.windspeed_10m_max[i],
      windDirection: daily.winddirection_10m_dominant[i],
      weatherTitle: getWeatherTitle(daily.weathercode[i]),
    });
  }

  return result;
};
