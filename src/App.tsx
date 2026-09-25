import { MotionConfig } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import InsightsPage from './pages/InsightsPage';
import InsightArticlePage from './pages/InsightArticlePage';
import PrivacyPage from './pages/PrivacyPage';
import ParcelPage from './pages/ParcelPage';
import ToolsPage from './pages/ToolsPage';
import MainLayout from './shared/layout/MainLayout';
import RouteMetadata from './shared/utils/RouteMetadata';
import insightArticles from './data/insightArticles.json';

const CoordinateConverterPage = lazy(() => import('./tools/coordinate-converter/CoordinateConverterPage'));
const GeoJSONViewerPage = lazy(() => import('./tools/geojson-viewer/GeoJSONViewerPage'));

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const frame = window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <MainLayout>
        <RouteMetadata />
        <ScrollToHash />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/parcel-plotter" element={<ParcelPage slug="parcel-plotter" />} />
            <Route path="/plot-land-title-technical-description" element={<ParcelPage slug="plot-land-title-technical-description" />} />
            <Route path="/how-to-read-bearings-and-distances-land-title" element={<ParcelPage slug="how-to-read-bearings-and-distances-land-title" />} />
            <Route path="/insights" element={<InsightsPage />} />
            {insightArticles.map((article) => <Route key={article.slug} path={`/insights/${article.slug}`} element={<InsightArticlePage slug={article.slug} />} />)}
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
