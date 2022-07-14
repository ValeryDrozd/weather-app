import styled from 'styled-components';
import { HourlyWeather } from '../../interfaces/Weather.interface';

interface Props {
  forecast: HourlyWeather[];
}

export default function HourlyWeatherForecast({
  forecast,
}: Props): JSX.Element | null {
  if (!forecast) {
    return null;
  }
  const forecastRows: HourlyWeather[][] = [];
  for (let i = 0; i < forecast.length; i += 8) {
    forecastRows.push(forecast.slice(i, i + 8));
  }

  const rows = forecastRows.map((currentForecast, index) => {
    const temperatures = currentForecast.map((item) => item.temperature);

    const min = Math.min(...temperatures);
    const max = Math.max(...temperatures);
    const average = (min + max) / 2;
    const radius = average - min;
    const maxDelta = 45;
    const averageDelta = maxDelta / 2;

    return (
      <Row key={`${index}-row`}>
        {currentForecast.map(({ imageURL, temperature, date }) => {
          const percentage = (average - Math.round(temperature)) / radius; // relative to average

          const day = date.getDay(),
            month = date.getMonth();
          const dayStr = `${day < 10 ? '0' : ''}${day}`;
          const monthStr = `${month < 10 ? '0' : ''}${month}`;
          return (
            <TimeWeatherBlock
              key={`${dayStr}-${monthStr}-${date.getHours()}-block`}
            >
              <Title>{date.getHours()}:00</Title>
              <Title>
                {dayStr}.{monthStr}
              </Title>
              <WeatherIconBlock>
                <WeatherIcon
                  marginTop={(percentage + 1) * averageDelta}
                  src={imageURL}
                />
              </WeatherIconBlock>
              <Title>{Math.round(temperature)}°C</Title>
            </TimeWeatherBlock>
          );
        })}
      </Row>
    );
  });

  return <ForecastBlock>{rows}</ForecastBlock>;
}

const ForecastBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const Row = styled.div`
  display: flex;
  overflow-x: auto;
  margin: 0.5rem 0;
  border-bottom: 1px solid #1976d2;
`;

const WeatherIconBlock = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 120px;
`;
const WeatherIcon = styled.img<{ marginTop: number }>`
  width: 100%;
  height: auto;
  margin-top: ${({ marginTop }): number => marginTop}px;
`;

const Title = styled.div`
  text-align: center;
  font-size: 16px;
`;

const TimeWeatherBlock = styled.div`
  width: 100px;
  height: 190px;
  display: flex;
  flex-direction: column;
`;
