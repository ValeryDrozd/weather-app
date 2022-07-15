/* eslint-disable  @typescript-eslint/no-explicit-any */
import CityWeather, {
  DetailedCityWeather,
  HourlyWeather,
  Weather,
} from '../interfaces/Weather.interface';

const baseUrl = 'https://api.openweathermap.org/data/2.5';

const mapWeatherFromApi = (obj: Record<string, any>): Weather => {
  return {
    temperature: obj.main.temp,
    feelsLike: obj.main.feels_like,
    windSpeed: obj.wind.speed,
    description: obj.weather[0].main,
    imageURL: `https://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`,
  };
};

export const getWeather = async (city: string): Promise<CityWeather> => {
  const url = new URL(`${baseUrl}/weather`);
  url.searchParams.append('q', city);
  url.searchParams.append('units', 'metric');
  url.searchParams.append('appid', process.env.REACT_APP_WEATHER_API_KEY || '');
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Invalid city');
  }
  const obj = await res.json();

  return {
    cityName: obj.name,
    country: obj.sys.country,
    ...mapWeatherFromApi(obj),
  };
};

export const getHourlyWeather = async (
  city: string,
): Promise<DetailedCityWeather> => {
  const url = new URL(`${baseUrl}/forecast`);
  url.searchParams.append('q', city);
  url.searchParams.append('units', 'metric');
  url.searchParams.append('appid', process.env.REACT_APP_WEATHER_API_KEY || '');
  const res = await fetch(url.toString());
  const obj = await res.json();
  if (!res.ok) {
    throw new Error('Invalid city');
  }

  const forecast: HourlyWeather[] = obj.list.map(
    (item: Record<string, any>) => {
      const dateParts = item.dt_txt.split(/[- :]/);
      return {
        ...mapWeatherFromApi(item),
        date: new Date(
          dateParts[0],
          dateParts[1],
          dateParts[2],
          dateParts[3],
          dateParts[4],
          dateParts[5],
        ),
      };
    },
  );
  return {
    cityName: obj.city.name,
    country: obj.city.country,
    forecast,
  };
};
