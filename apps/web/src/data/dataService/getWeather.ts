const weatherMap: Record<
  string,
  Promise<{
    current_weather: {
      temperature: number;
      windspeed: number;
      winddirection: number;
      weathercode: number;
    };
  }>
> = {};

export const getWeather = async (lat: number, lng: number) => {
  if (!weatherMap[`${lat},${lng}`]) {
    weatherMap[`${lat},${lng}`] = fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`,
      {
        next: {
          revalidate: 7200,
        },
      },
    ).then((response) => {
      if (!response.ok) {
        throw new Error('Invalid response');
      }
      return response.json();
    });
  }
  const data = await weatherMap[`${lat},${lng}`];
  return {
    temperature: data.current_weather.temperature,
    windSpeed: data.current_weather.windspeed,
    windDirection: data.current_weather.winddirection,
    weatherCode: data.current_weather.weathercode,
  };
};
