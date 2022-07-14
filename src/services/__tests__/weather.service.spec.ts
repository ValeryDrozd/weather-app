/* eslint-disable */
import CityWeather, {
  DetailedCityWeather,
} from '../../interfaces/Weather.interface';
import { getHourlyWeather, getWeather } from '../weather.service';

const testApiWeather = {
  weather: [
    {
      main: 'Clouds',
      icon: '04n',
    },
  ],
  main: {
    temp: 15.73,
    feels_like: 15.6,
  },
  wind: {
    speed: 0.45,
  },
  sys: {
    country: 'UA',
  },
  name: 'Kyiv',
};

const testWeather: CityWeather = {
  temperature: 15.73,
  feelsLike: 15.6,
  windSpeed: 0.45,
  country: 'UA',
  cityName: 'Kyiv',
  imageURL: `https://openweathermap.org/img/wn/04n@2x.png`,
  description: 'Clouds',
};

const testApiForecast = {
  list: [
    {
      main: {
        temp: 14.68,
        feels_like: 14.53,
      },
      weather: [
        {
          main: 'Rain',
          icon: '10n',
        },
      ],
      wind: {
        speed: 5.46,
      },
      dt_txt: '2022-07-13 21:00:00',
    },
  ],
  city: {
    name: 'Kyiv',
    country: 'UA',
  },
};

const testForecast: DetailedCityWeather = {
  cityName: 'Kyiv',
  country: 'UA',
  forecast: [
    {
      description: 'Rain',
      imageURL: `https://openweathermap.org/img/wn/10n@2x.png`,
      date: new Date('2022-07-13 21:00:00'),
      temperature: 14.68,
      feelsLike: 14.53,
      windSpeed: 5.46,
    },
  ],
};

const fetchMock = jest.fn();
// @ts-ignore
global.fetch = fetchMock;
process.env.REACT_APP_WEATHER_API_KEY = 'api_key';

describe('Weather Service', () => {
  describe('Get weather', () => {
    it('Weather fetched successfully', async () => {
      fetchMock.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(testApiWeather),
          ok: true,
        }),
      );

      const result = await getWeather('Kyiv');
      expect(result).toEqual(testWeather);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.openweathermap.org/data/2.5/weather?q=Kyiv&units=metric&appid=api_key`,
      );
    });
    it('Weather fetched failed', async () => {
      fetchMock.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(),
          ok: false,
        }),
      );

      try {
        await getWeather('Kyiv');
        expect(false).toBe(true);
      } catch (error: any) {
        expect(error.message).toBe('Invalid city');
      }
    });
  });

  describe('Get forecast', () => {
    it('Forecast fetched successfully', async () => {
      fetchMock.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(testApiForecast),
          ok: true,
        }),
      );

      const result = await getHourlyWeather('Kyiv');
      expect(result).toEqual(testForecast);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&units=metric&appid=api_key`,
      );
    });
    it('Forecast fetched failed', async () => {
      fetchMock.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(),
          ok: false,
        }),
      );

      try {
        await getHourlyWeather('Kyiv');
        expect(false).toBe(true);
      } catch (error: any) {
        expect(error.message).toBe('Invalid city');
      }
    });
  });
});
