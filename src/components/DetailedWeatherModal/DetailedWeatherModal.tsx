import { CircularProgress, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  DetailedCityWeather,
  HourlyWeather,
} from '../../interfaces/Weather.interface';
import { getHourlyWeather } from '../../services/weather.service';
import HourlyWeatherForecast from '../HourlyWeatherRow/HourlyWeatherRow';
import CancelIcon from '@mui/icons-material/Cancel';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function DetailedWeatherModal(): JSX.Element {
  const [detailedWeather, setDetailedWeather] =
    useState<DetailedCityWeather | null>(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const city = searchParams.get('city');
  const citiesWeather = useSelector(
    (state: RootState) => state.weather.citiesWeather,
  );
  const navigate = useNavigate();

  const handleClose = (): void => navigate('/');

  if (!citiesWeather.find((cw) => cw.cityName === city)) {
    handleClose();
  }

  const fetchDetailedWeather = async (): Promise<void> => {
    setLoading(true);
    const weather = await getHourlyWeather(city as string);
    setDetailedWeather(weather);
    setLoading(false);
  };
  useEffect(() => {
    if (city) {
      fetchDetailedWeather();
    } else {
      setDetailedWeather(null);
    }
    // eslint-disable-next-line
  }, [city]);

  const content = loading ? (
    <SpinnerContainer>
      <CircularProgress size={60} color="secondary" />
    </SpinnerContainer>
  ) : (
    <HourlyWeatherForecast
      forecast={detailedWeather?.forecast as HourlyWeather[]}
    />
  );

  return (
    <ModalContentWrapper open onClose={handleClose}>
      <ModalContent>
        <CloseIcon onClick={handleClose} />
        <Title>Detailed Weather Info for {city}</Title>
        {content}
      </ModalContent>
    </ModalContentWrapper>
  );
}

const Title = styled.h2`
  text-align: center;
  font-size: 30px;
  color: #1976d2;
  margin: 0;
`;

const ModalContentWrapper = styled(Modal)`
  display: flex;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 300px;
  max-height: 90vh;
  overflow-y: auto;
  max-width: 600px;
  padding: 1.5rem;
  background: #f9e3f8;
  margin: auto;
  border-radius: 1rem;
  &:focus-visible {
    outline: unset;
  }
`;

const SpinnerContainer = styled.div`
  flex-grow: 1;
  display: flex;

  & > * {
    margin: auto;
  }
`;

const CloseIcon = styled(CancelIcon)`
  cursor: pointer;
`;
