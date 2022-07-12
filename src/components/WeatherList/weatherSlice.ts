import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CityWeather from '../../interfaces/Weather.interface';
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
  citiesWeather: CityWeather[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  citiesWeather: [],
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
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
      state.error = null;
    });
    builder.addCase(fetchCitiesWeather.fulfilled, (state, { payload }) => {
      state.citiesWeather = payload;
      state.loading = false;
    });
    builder.addCase(fetchCitiesWeather.rejected, (state) => {
      state.citiesWeather = [];
      state.loading = false;
      state.error = 'Something went wrong...';
    });

    builder.addCase(updateCityWeather.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCityWeather.fulfilled, (state, { payload }) => {
      const oldWeatherIndex = state.citiesWeather.findIndex(
        (weather) => weather.cityName === payload.cityName,
      );

      state.citiesWeather.splice(oldWeatherIndex, 1, payload);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateCityWeather.rejected, (state) => {
      state.error = "Incorrect entry. Couldn't find city";
      state.loading = false;
    });

    builder.addCase(addNewCity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addNewCity.fulfilled, (state, { payload }) => {
      if (state.citiesWeather.find((cw) => cw.cityName === payload.cityName)) {
        state.error = 'This city is already in list!';
      } else {
        const cities = getCitiesFromLocalStorage();
        localStorage.setItem(
          LOCAL_STORAGE_CITIES_KEY,
          JSON.stringify([payload.cityName, ...cities]),
        );
        state.citiesWeather = [payload, ...state.citiesWeather];
        state.error = null;
      }
      state.loading = false;
    });
    builder.addCase(addNewCity.rejected, (state, { payload }) => {
      state.error = "Incorrect entry. Couldn't find city";
      state.loading = false;
    });
  },
});

export const { removeCity } = weatherSlice.actions;

export const addNewCity = createAsyncThunk<CityWeather, string>(
  'weather/addNewCity',
  async (city) => {
    const weather = await getWeather(city);
    return weather;
  },
);

export const fetchCitiesWeather = createAsyncThunk<CityWeather[]>(
  'weather/fetchCitiesWeather',
  async () => {
    const cities = getCitiesFromLocalStorage();
    const promises = cities.map((city) => getWeather(city));
    const citiesWeather = await Promise.all(promises);
    return citiesWeather;
  },
);

export const updateCityWeather = createAsyncThunk<CityWeather, string>(
  'weather/fetchCityWeather',
  async (city) => {
    const weather = await getWeather(city);
    return weather;
  },
);

export default weatherSlice.reducer;
