import { act } from 'react-dom/test-utils';
import CityWeather from '../../../interfaces/Weather.interface';
import WeatherList from '../WeatherList';
import { addNewCity, setError } from '../weatherSlice';
import { fireEvent, render, screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';

const testCitiesWeather: CityWeather[] = [
  {
    cityName: 'Kyiv',
    country: 'UA',
    temperature: 12,
    feelsLike: 12,
    windSpeed: 1,
    description: 'Clouds',
    imageURL: 'url',
  },
  {
    cityName: 'Lviv',
    country: 'UA',
    temperature: 13,
    feelsLike: 13,
    windSpeed: 2,
    description: 'Rain',
    imageURL: 'url2',
  },
];

const testStore = {
  loading: false,
  error: null,
  citiesWeather: testCitiesWeather,
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../WeatherCard/WeatherCard', () => ({
  __esModule: true,
  default: () => <div role="weather-card"></div>,
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

jest.mock('../weatherSlice', () => {
  return {
    addNewCity: (city: string) => city,
    fetchCitiesWeather: () => null,
    setError: () => null,
  };
});

const createStoreFromSlice = (
  slice: Record<string, boolean | null | string | CityWeather[]>,
) => ({
  weather: slice,
});

describe('WeatherList', () => {
  const mockSelector = reactRedux.useSelector as jest.Mock;
  const mockDispatch = reactRedux.useDispatch as jest.Mock;
  const dispatcher = jest.fn();

  beforeEach(() => {
    dispatcher.mockImplementation(() => null);
    mockDispatch.mockImplementation(() => dispatcher);
    mockSelector.mockImplementation((selector) =>
      selector(createStoreFromSlice(testStore)),
    );
  });

  afterEach(() => {
    mockDispatch.mockClear();
    mockSelector.mockClear();
    dispatcher.mockClear();
  });

  it('correctly show cards', async () => {
    render(<WeatherList />);
    expect(await screen.findAllByRole('weather-card')).toHaveLength(2);
  });

  it('search works correctly', async () => {
    render(<WeatherList />);
    expect(dispatcher).toHaveBeenCalledTimes(1);

    const input = await screen.findByRole('search-input');
    fireEvent.change(input, { target: { value: '123' } });

    await act(async () => {
      const searchButton = await screen.findByRole('search-button');
      fireEvent.click(searchButton);
    });

    expect(dispatcher).toHaveBeenLastCalledWith(addNewCity('123'));
  });

  it('error should be shown', async () => {
    const error = 'Some error message';
    mockSelector.mockImplementationOnce((selector) =>
      selector(createStoreFromSlice({ ...testStore, error })),
    );

    render(<WeatherList />);

    const errorLabel = await screen.findByRole('error-label');
    expect(errorLabel.textContent).toBe(error);
  });

  it('error should dissappear after input change', async () => {
    const error = 'Some error message';
    mockSelector.mockImplementationOnce((selector) =>
      selector(createStoreFromSlice({ ...testStore, error })),
    );

    render(<WeatherList />);

    const input = await screen.findByRole('search-input');
    fireEvent.change(input, { target: { value: '123' } });

    expect(dispatcher).toHaveBeenLastCalledWith(setError(null));
  });
});
