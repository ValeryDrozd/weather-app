import styled from 'styled-components';
import WeatherList from '../components/WeatherList/WeatherList';

export default function MainPage(): JSX.Element {
  return (
    <MainPageBlock>
      <Title>Weather app</Title>
      <WeatherList />
    </MainPageBlock>
  );
}

const MainPageBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  color: #f35ceb;
  font-size: 4rem;
  padding-bottom: 1rem;
  text-align: center;
  margin-top: 1rem;
  padding: 0;
`;
