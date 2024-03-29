import styled from 'styled-components';
import CityWeather from '../../interfaces/Weather.interface';
import { Card, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import UpdateIcon from '@mui/icons-material/Update';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { removeCity, updateCityWeather } from '../WeatherList/weatherSlice';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  cityWeather: CityWeather;
}

export default function WeatherCard({ cityWeather }: Props): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.stopPropagation();
    dispatch(removeCity(cityWeather.cityName));
  };

  const handleUpdateButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.stopPropagation();
    dispatch(updateCityWeather(cityWeather.cityName));
  };

  const handleCardClick = (): void => {
    navigate(`details?city=${cityWeather.cityName}`, {
      state: {
        backgroundLocation: location,
      },
    });
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <CardRow>
        <StyledHeader>
          {cityWeather.cityName} ({cityWeather.country})
        </StyledHeader>
        <ButtonsBlock>
          <IconButton onClick={handleUpdateButtonClick}>
            <UpdateIcon />
          </IconButton>
          <IconButton onClick={handleDeleteButtonClick}>
            <DeleteIcon />
          </IconButton>
        </ButtonsBlock>
      </CardRow>
      <CardRow>
        <TemperatureBlock>
          <CardText>
            Temperature: {Math.round(cityWeather.temperature)}°C
          </CardText>
          <CardText>Feels Like: {Math.round(cityWeather.feelsLike)}°C</CardText>
          <CardText>
            Wind Speed: {Math.round(cityWeather.windSpeed)} m/s
          </CardText>
        </TemperatureBlock>
        <ImageBlock>
          <StyledImg src={`${cityWeather.imageURL}`} />
          <CardText>{cityWeather.description}</CardText>
        </ImageBlock>
      </CardRow>
    </StyledCard>
  );
}

const CardRow = styled.div`
  display: flex;
  padding: 0 0.25rem;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  min-width: 14rem;
  height: 10rem;
  margin: 1.5rem 1.5rem;
  padding: 0.5rem;
  border: 2px solid #f35ceb;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: #f2a5ee;
  transition: all 0.5s ease;
  position: relative;

  &:hover {
    transform: scale(1.1, 1.1);
  }

  ${CardRow}:last-child {
    flex-grow: 1;
  }
`;

const StyledHeader = styled.h2`
  margin: 0.3rem;
`;

const StyledImg = styled.img`
  width: 4rem;
  height: 4rem;
`;

const TemperatureBlock = styled.div`
  display: flex;
  padding: 0.5rem;
  flex-grow: 1;
  flex-direction: column;

  & * {
    flex-grow: 1;
  }
`;

const ButtonsBlock = styled.div`
  && {
    display: flex;
    margin-left: auto;
  }
`;

const IconButton = styled(Button)`
  && {
    min-width: 30px;
  }
`;

const CardText = styled.span`
  font-size: medium;
  margin-top: 0.5rem;
  vertical-align: middle;
`;

const ImageBlock = styled.div`
  display: flex;
  padding: 0.25rem;
  flex-direction: column;
  & span {
    margin: 0;
    text-align: center;
  }
`;
