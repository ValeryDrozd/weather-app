import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchCitiesWeather } from './weatherSlice';

export default function WeatherList(): JSX.Element {
  const { loading, citiesWeather } = useSelector(
    (state: RootState) => state.weather,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCitiesWeather());
  }, [dispatch]);

  console.log(citiesWeather);
  return <div>{loading ? 'Loading...' : null}</div>;
}
