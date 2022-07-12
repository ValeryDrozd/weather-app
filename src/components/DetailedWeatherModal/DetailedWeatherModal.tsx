import { Modal } from '@mui/material';
import styled from 'styled-components';
import Weather from '../../interfaces/Weather.interface';

interface Props {
  cityWeather: Weather | null;
  onClose: () => void;
}

export default function DetailedWeatherModal({
  cityWeather,
  onClose,
}: Props): JSX.Element {
  return (
    <ModalDetails open onClose={onClose}>
      <div>
        <p>{cityWeather?.windSpeed}</p>
        <p>{cityWeather?.description}</p>
      </div>
    </ModalDetails>
  );
}

const ModalDetails = styled(Modal)``;
