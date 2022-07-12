import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../../store/store';
import WeatherCard from '../WeatherCard/WeatherCard';
import {
  addNewCity,
  fetchCitiesWeather,
  removeCity,
  updateCityWeather,
} from './weatherSlice';
import { TextField, Button } from '@mui/material';
import Weather from '../../interfaces/Weather.interface';
import DetailedWeatherModal from '../DetailedWeatherModal/DetailedWeatherModal';
import Spinner from '../Spinner/Spinner';

export default function WeatherList(): JSX.Element {
  const { loading, citiesWeather, error } = useSelector(
    (state: RootState) => state.weather,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [currectCityWeather, setCurrentCityWeather] = useState<Weather | null>(
    null,
  );

  useEffect(() => {
    dispatch(fetchCitiesWeather());
  }, [dispatch]);

  const [inputCity, setInputCity] = useState<string>('');

  const handleCityWeatherDelete = (cityName: string): void => {
    dispatch(removeCity(cityName));
  };

  const handleCityWeatherUpdate = (cityName: string): void => {
    dispatch(updateCityWeather(cityName));
  };

  const weatherCards = citiesWeather.map((item) => (
    <WeatherCard
      cityWeather={item}
      onClick={(): void => setCurrentCityWeather(item)}
      onDelete={(): void => handleCityWeatherDelete(item.cityName)}
      onUpdate={(): void => handleCityWeatherUpdate(item.cityName)}
    />
  ));

  const modal = !!currectCityWeather ? (
    <DetailedWeatherModal
      onClose={(): void => setCurrentCityWeather(null)}
      cityWeather={currectCityWeather}
    />
  ) : null;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await dispatch(addNewCity(inputCity));
    setInputCity('');
  };

  return (
    <WeatherListBlock>
      {modal}
      <Spinner open={loading} />
      <SearchDiv>
        <SearchForm onSubmit={handleSubmit}>
          <SearchBar
            error={!!error}
            label="Input City"
            value={inputCity}
            onChange={({ target }): void => setInputCity(target.value)}
            helperText={error}
            variant="filled"
          />
          <Button type="submit">Search</Button>
        </SearchForm>
      </SearchDiv>
      <CardBlock>{weatherCards}</CardBlock>
    </WeatherListBlock>
  );
}

const WeatherListBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.25rem;
`;

const SearchDiv = styled.div`
  margin: auto;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SearchBar = styled(TextField)`
  border-radius: 0.25rem;
  && label {
    color: #1976d2;
  }
`;

const CardBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const SearchForm = styled.form`
  display: flex;
  & button {
    height: 56px;
  }
`;
