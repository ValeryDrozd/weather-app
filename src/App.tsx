import { Routes, Route, useLocation } from 'react-router-dom';
import DetailedWeatherModal from './components/DetailedWeatherModal/DetailedWeatherModal';
import MainPage from './pages/MainPage';
import React from 'react';

export default function App(): JSX.Element {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<MainPage />} />
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/details" element={<DetailedWeatherModal />} />
        </Routes>
      )}
    </>
  );
}
