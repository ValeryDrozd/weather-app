import { CircularProgress, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CityWeather, {
  DetailedCityWeather,
  HourlyWeather,
} from '../../interfaces/Weather.interface';
import { getHourlyWeather } from '../../services/weather.service';
import HourlyWeatherForecast from '../HourlyWeatherRow/HourlyWeatherRow';

interface Props {
  cityWeather: CityWeather | null;
  open: boolean;
  onClose: () => void;
}

export default function DetailedWeatherModal({
  cityWeather,
  open,
  onClose,
}: Props): JSX.Element {
  const [detailedWeather, setDetailedWeather] =
    useState<DetailedCityWeather | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetailedWeather = async (): Promise<void> => {
    setLoading(true);
    const weather = await getHourlyWeather(cityWeather?.cityName as string);
    setDetailedWeather(weather);
    setLoading(false);
  };
  useEffect(() => {
    if (cityWeather) {
      fetchDetailedWeather();
    } else {
      setDetailedWeather(null);
    }
  }, [cityWeather]);

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
    <ModalContentWrapper open={open} onClose={onClose}>
      <ModalContent>
        <Title>Detailed Weather Info for {cityWeather?.cityName}</Title>
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
