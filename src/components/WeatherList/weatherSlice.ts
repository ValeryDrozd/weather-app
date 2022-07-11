import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Weather from '../../interfaces/Weather.interface';
import { getWeather } from '../../services/weather.service';

const LOCAL_STORAGE_CITIES_KEY = 'cities';

const getCitiesFromLocalStorage = (): string[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_CITIES_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_CITIES_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(data);
};

interface WeatherState {
  citiesWeather: Weather[];
  loading: boolean;
  error: boolean;
}

const initialState: WeatherState = {
  //   cities: getCitiesFromLocalStorage(),
  citiesWeather: [],
  loading: false,
  error: false,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addCity: (state, { payload }: { payload: string }) => {
      const cities = getCitiesFromLocalStorage();
      localStorage.setItem(
        LOCAL_STORAGE_CITIES_KEY,
        JSON.stringify([payload, ...cities]),
      );
    },
    removeCity: (state, { payload }: { payload: string }) => {
      const cities = getCitiesFromLocalStorage();
      localStorage.setItem(
        LOCAL_STORAGE_CITIES_KEY,
        JSON.stringify(cities.filter((city) => city !== payload)),
      );
      state.citiesWeather = state.citiesWeather.filter(
        (weather) => weather.cityName !== payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCitiesWeather.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(fetchCitiesWeather.fulfilled, (state, { payload }) => {
      state.citiesWeather = payload;
      state.loading = false;
    });
    builder.addCase(fetchCitiesWeather.rejected, (state) => {
      state.citiesWeather = [];
      state.loading = false;
      state.error = true;
    });
    builder.addCase(fetchCityWeather.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(fetchCityWeather.fulfilled, (state, { payload }) => {
      const oldWeatherIndex = state.citiesWeather.findIndex(
        (weather) => weather.cityName === payload.cityName,
      );
      if (oldWeatherIndex === -1) {
        state.citiesWeather = [payload, ...state.citiesWeather];
      } else {
        state.citiesWeather.splice(oldWeatherIndex, 1, payload);
      }
      state.loading = false;
    });
    builder.addCase(fetchCityWeather.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
  },
});

export const { removeCity, addCity } = weatherSlice.actions;

export const addNewCity = createAsyncThunk<void, string>(
  'weather/addNewCity',
  async (city, thunkApi) => {
    thunkApi.dispatch(addCity(city));
    await thunkApi.dispatch(fetchCityWeather(city));
  },
);

export const fetchCitiesWeather = createAsyncThunk<Weather[]>(
  'weather/fetchCitiesWeather',
  async (_, thunkApi) => {
    const cities = getCitiesFromLocalStorage();
    const promises = cities.map((city) => getWeather(city));
    const citiesWeather = await Promise.all(promises);
    return citiesWeather;
  },
);

export const fetchCityWeather = createAsyncThunk<Weather, string>(
  'weather/fetchCityWeather',
  async (city) => {
    const weather = await getWeather(city);
    return weather;
  },
);

export default weatherSlice.reducer;
