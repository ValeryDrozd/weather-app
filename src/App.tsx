import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import DetailedWeatherModal from './components/DetailedWeatherModal/DetailedWeatherModal';
import MainPage from './pages/MainPage';

export default function App(): JSX.Element {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/details" element={<DetailedWeatherModal />} />
        <Route path="/" element={<MainPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/details" element={<DetailedWeatherModal />} />
        </Routes>
      )}
    </>
  );
}
