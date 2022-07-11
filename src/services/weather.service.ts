import Weather from '../interfaces/Weather.interface';

const baseUrl = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (city: string): Promise<Weather> => {
  const url = new URL(`${baseUrl}/weather`);
  url.searchParams.append('q', city);
  url.searchParams.append('units', 'metric');
  url.searchParams.append('appid', process.env.REACT_APP_WEATHER_API_KEY || '');
  const res = await fetch(url.toString());
  const obj = await res.json();

  return {
    cityName: obj.name,
    country: obj.sys.country,
    temperature: obj.main.temp,
    feelsLike: obj.main.feels_like,
    windSpeed: obj.wind.speed,
    description: obj.weather[0].main,
  };
};

// export const getHourlyWeather = async (city: string) => {
//   const url = new URL(`${baseUrl}/forecast`);
//   url.searchParams.append('q', city);
//   url.searchParams.append('units', 'metric');
//   url.searchParams.append('appid', process.env.REACT_APP_WEATHER_API_KEY || '');
//   const res = await fetch(url.toString());
//   return await res.json();
// };
