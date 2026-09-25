import { MotionConfig } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import InsightsPage from './pages/InsightsPage';
import PrivacyPage from './pages/PrivacyPage';
import ToolsPage from './pages/ToolsPage';
import MainLayout from './shared/layout/MainLayout';

const CoordinateConverterPage = lazy(() => import('./tools/coordinate-converter/CoordinateConverterPage'));
const GeoJSONViewerPage = lazy(() => import('./tools/geojson-viewer/GeoJSONViewerPage'));

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const frame = window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <MainLayout>
        <ScrollToHash />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/coordinate-converter" element={<CoordinateConverterPage />} />
            <Route path="/tools/geojson-viewer" element={<GeoJSONViewerPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </MotionConfig>
  );
}

export default App;
