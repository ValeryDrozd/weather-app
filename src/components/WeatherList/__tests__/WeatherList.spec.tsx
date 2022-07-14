import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import CityWeather from '../../../interfaces/Weather.interface';
import WeatherList from '../WeatherList';
import { addNewCity } from '../weatherSlice';

const mockDispatch = jest.fn();
const mockSelector = jest.fn();

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

jest.mock('react-redux', () => ({
  __esModule: true,
  useSelector: () => ({
    loading: false,
    error: false,
    citiesWeather: testCitiesWeather,
  }),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../WeatherCard/WeatherCard', () => ({
  __esModule: true,
  default: () => <div className="weather-card"></div>,
}));

jest.mock('../weatherSlice', () => {
  return {
    addNewCity: (city: string) => city,
    fetchCitiesWeather: () => null,
  };
});

describe('WeatherList', () => {
  let root: ReactDOM.Root;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });

    container.remove();
  });

  it('correctly show cards', () => {
    mockSelector.mockReturnValueOnce({
      loading: false,
      error: false,
      citiesWeather: testCitiesWeather,
    });
    act(() => {
      root.render(<WeatherList />);
    });

    expect(container.getElementsByClassName('weather-card')).toHaveLength(2);
  });

  it('correctly show cards', async () => {
    mockSelector.mockReturnValueOnce({
      loading: false,
      error: false,
      citiesWeather: testCitiesWeather,
    });
    act(() => {
      root.render(<WeatherList />);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    await act(async () => {
      const input = container.getElementsByTagName('input').item(0);
      input?.setAttribute('value', '123');
      input?.dispatchEvent(new InputEvent('change', { bubbles: true }));
    });

    await act(async () => {
      container
        .querySelector('button.submit-button')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(mockDispatch).toHaveBeenLastCalledWith(addNewCity('123'));
  });
});
