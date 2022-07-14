import { act } from 'react-dom/test-utils';
import DetailedWeatherModal from '../DetailedWeatherModal';
import { render, screen } from '@testing-library/react';
import { DetailedCityWeather } from '../../../interfaces/Weather.interface';
import HourlyWeatherForecast from '../../HourlyWeatherForecast/HourlyWeatherForecast';
import * as reactRouterDom from 'react-router-dom';

const testHourlyWeather: DetailedCityWeather = {
  cityName: 'Kyiv',
  country: 'UA',
  forecast: [
    {
      temperature: 13,
      feelsLike: 13,
      windSpeed: 2,
      description: 'Rain',
      imageURL: 'url2',
      date: new Date(),
    },
  ],
};

jest.mock('../../../services/weather.service', () => ({
  getHourlyWeather: () => Promise.resolve(testHourlyWeather),
  getCitiesFromLocalStorage: () => ['Kyiv', 'Lviv'],
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  TextField: ({
    value,
    onChange,
    helperText,
  }: {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    helperText?: string;
  }) => (
    <>
      <label role="error-label">{helperText}</label>
      <input role="search-input" value={value} onChange={onChange} />
    </>
  ),
  Button: () => <button role="search-button"></button>,
}));

jest.mock('../../HourlyWeatherForecast/HourlyWeatherForecast', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const createLocation = (city: string | null) => ({
  search: `?city=${city ?? ''}`,
});

describe('WeatherList', () => {
  const mockLocation = reactRouterDom.useLocation as jest.Mock;
  const mockUseNavigate = reactRouterDom.useNavigate as jest.Mock;
  const navigateMock = jest.fn();
  beforeEach(() => {
    mockLocation.mockImplementation(() => createLocation('Kyiv'));
    mockUseNavigate.mockImplementation(() => navigateMock);
  });

  afterEach(() => {
    mockLocation.mockClear();
    mockUseNavigate.mockClear();
  });

  it('title is shown correctly', async () => {
    const city = 'Lviv';
    mockLocation.mockImplementation(() => createLocation(city));
    await act(async () => {
      render(<DetailedWeatherModal />);
    });

    const title = await screen.findByRole('title');
    expect(title).toHaveTextContent(`Detailed Weather Info for ${city}`);
  });

  it('forecast has correct props', async () => {
    await act(async () => {
      render(<DetailedWeatherModal />);
    });

    expect(HourlyWeatherForecast).toHaveBeenLastCalledWith(
      expect.objectContaining({
        forecast: testHourlyWeather.forecast,
      }),
      {},
    );
  });

  it('modal should be closed if city is not in store', async () => {
    mockLocation.mockImplementation(() => createLocation('Wrong City'));
    await act(async () => {
      render(<DetailedWeatherModal />);
    });

    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('modal should be closed if there is no city in URL', async () => {
    mockLocation.mockImplementation(() => createLocation(null));
    await act(async () => {
      render(<DetailedWeatherModal />);
    });

    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
