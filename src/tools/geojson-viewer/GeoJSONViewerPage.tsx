import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl, {
  LngLatBounds,
  type GeoJSONSource,
  type Map,
  type Marker,
  type Popup,
  type RasterTileSource,
  type StyleSpecification
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import ToolLayout from '../../shared/layout/ToolLayout';
import ToolGuide from '../../shared/layout/ToolGuide';
import { getToolPage, useToolMetadata } from '../../shared/utils/toolPage';
import { emitToolEvent } from '../../shared/utils/toolEvents';
import {
  getBounds,
  getGeoJSONCrsInfo,
  parseGeoJSON,
  reprojectGeoJSONToWgs84,
  validateGeoJSON,
  type GeoJSONFeature,
  type GeoJSONFeatureCollection
} from '../../shared/utils/geojson';

type BasemapMode = 'osm' | 'satellite' | 'satellite-gray';

const EMPTY_COLLECTION: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: []
};

const SOURCE_ID = 'uploaded-geojson';
const HIGHLIGHT_SOURCE_ID = 'highlighted-geojson';
const POINT_LAYER_ID = 'geojson-points';
const LINE_LAYER_ID = 'geojson-lines';
const POLYGON_FILL_LAYER_ID = 'geojson-polygons-fill';
const POLYGON_LINE_LAYER_ID = 'geojson-polygons-line';
const HIGHLIGHT_LINE_LAYER_ID = 'geojson-highlight-line';
const HIGHLIGHT_FILL_LAYER_ID = 'geojson-highlight-fill';
const HIGHLIGHT_POINT_LAYER_ID = 'geojson-highlight-point';

const philippinesCenter: [number, number] = [121.774, 12.8797];

const basemapOptions: Array<{ value: BasemapMode; label: string }> = [
  { value: 'osm', label: 'OpenStreetMap' },
  { value: 'satellite', label: 'Google Satellite' },
  { value: 'satellite-gray', label: 'Google Satellite Gray' }
];

function getBasemapTiles(mode: BasemapMode) {
  return [
    mode === 'osm'
      ? 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
  ];
}

function buildStyle(mode: BasemapMode) {
  return {
    version: 8,
    sources: {
      basemap: {
        type: 'raster',
        tiles: getBasemapTiles(mode),
        tileSize: 256,
        attribution:
          mode === 'osm'
            ? '© OpenStreetMap contributors'
            : 'Imagery © Google'
      }
    },
    layers: [
      {
        id: 'basemap-layer',
        type: 'raster',
        source: 'basemap'
      }
    ]
  } as StyleSpecification;
}

function updateBasemapSource(map: Map, mode: BasemapMode) {
  const source = map.getSource('basemap') as RasterTileSource | undefined;

  if (!source || typeof source.setTiles !== 'function') {
    return;
  }

  source.setTiles(getBasemapTiles(mode));
  map.setPaintProperty('basemap-layer', 'raster-saturation', mode === 'satellite-gray' ? -1 : 0);
}

function featureToCollection(feature: GeoJSONFeature | null): GeoJSONFeatureCollection {
  if (!feature) {
    return EMPTY_COLLECTION;
  }

  return {
    type: 'FeatureCollection',
    features: [feature]
  };
}

function formatPropertyValue(value: unknown) {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[object]';
    }
  }

  return String(value);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character] ?? character);
}

function createPopupHtml(feature: GeoJSONFeature) {
  const properties = feature.properties ?? {};
  const entries = Object.entries(properties);

  if (entries.length === 0) {
    return '<div class="geojson-popup"><p class="geojson-popup-empty">No properties</p></div>';
  }

  const rows = entries
    .map(
      ([key, value]) =>
        `<div class="geojson-popup-row"><span class="geojson-popup-key">${escapeHtml(key)}</span><span class="geojson-popup-value">${escapeHtml(formatPropertyValue(value))}</span></div>`
    )
    .join('');

  return `<div class="geojson-popup">${rows}</div>`;
}

function ensureDataLayers(map: Map) {
  if (!map.getSource(SOURCE_ID)) {
    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: EMPTY_COLLECTION as never,
      generateId: true
    });
  }

  if (!map.getSource(HIGHLIGHT_SOURCE_ID)) {
    map.addSource(HIGHLIGHT_SOURCE_ID, {
      type: 'geojson',
      data: EMPTY_COLLECTION as never
    });
  }

  if (!map.getLayer(POLYGON_FILL_LAYER_ID)) {
    map.addLayer({
      id: POLYGON_FILL_LAYER_ID,
      type: 'fill',
      source: SOURCE_ID,
      filter: ['==', ['geometry-type'], 'Polygon'],
      paint: {
        'fill-color': '#1e5bb8',
        'fill-opacity': 0.22
      }
    });
  }

  if (!map.getLayer(POLYGON_LINE_LAYER_ID)) {
    map.addLayer({
      id: POLYGON_LINE_LAYER_ID,
      type: 'line',
      source: SOURCE_ID,
      filter: ['==', ['geometry-type'], 'Polygon'],
      paint: {
        'line-color': '#73a7ff',
        'line-width': 2
      }
    });
  }

  if (!map.getLayer(LINE_LAYER_ID)) {
    map.addLayer({
      id: LINE_LAYER_ID,
      type: 'line',
      source: SOURCE_ID,
      filter: ['==', ['geometry-type'], 'LineString'],
      paint: {
        'line-color': '#73a7ff',
        'line-width': 3
      }
    });
  }

  if (!map.getLayer(POINT_LAYER_ID)) {
    map.addLayer({
      id: POINT_LAYER_ID,
      type: 'circle',
      source: SOURCE_ID,
      filter: ['==', ['geometry-type'], 'Point'],
      paint: {
        'circle-radius': 6,
        'circle-color': '#ffffff',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#1e5bb8'
      }
    });
  }

  if (!map.getLayer(HIGHLIGHT_FILL_LAYER_ID)) {
    map.addLayer({
      id: HIGHLIGHT_FILL_LAYER_ID,
      type: 'fill',
      source: HIGHLIGHT_SOURCE_ID,
      filter: ['==', ['geometry-type'], 'Polygon'],
      paint: {
        'fill-color': '#ffffff',
        'fill-opacity': 0.16
      }
    });
  }

  if (!map.getLayer(HIGHLIGHT_LINE_LAYER_ID)) {
    map.addLayer({
      id: HIGHLIGHT_LINE_LAYER_ID,
      type: 'line',
      source: HIGHLIGHT_SOURCE_ID,
      filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'LineString']]],
      paint: {
        'line-color': '#ffffff',
        'line-width': 4
      }
    });
  }

  if (!map.getLayer(HIGHLIGHT_POINT_LAYER_ID)) {
    map.addLayer({
      id: HIGHLIGHT_POINT_LAYER_ID,
      type: 'circle',
      source: HIGHLIGHT_SOURCE_ID,
      filter: ['==', ['geometry-type'], 'Point'],
      paint: {
        'circle-radius': 8,
        'circle-color': '#ffffff',
        'circle-stroke-width': 3,
        'circle-stroke-color': '#1e5bb8'
      }
    });
  }
}

function GeoJSONViewerPage() {
  useToolMetadata('tools/geojson-viewer');
  const page = getToolPage('tools/geojson-viewer');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileReadIdRef = useRef(0);
  const mapRef = useRef<Map | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const uploadedDataRef = useRef<GeoJSONFeatureCollection>(EMPTY_COLLECTION);
  const highlightedFeatureRef = useRef<GeoJSONFeature | null>(null);
  const [basemap, setBasemap] = useState<BasemapMode>('osm');
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState<{ featureCount: number; geometryTypes: string[] } | null>(null);
  const [geojsonData, setGeojsonData] = useState<GeoJSONFeatureCollection>(EMPTY_COLLECTION);

  const mapClassName = useMemo(
    () => 'overflow-hidden rounded-xl border border-border-strong',
    []
  );

  useEffect(() => { emitToolEvent('geojson-viewer', 'opened'); }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: buildStyle('osm'),
      center: philippinesCenter,
      zoom: 4.8,
      cooperativeGestures: true
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: '320px'
    });

    map.on('load', () => {
      ensureDataLayers(map);
      map.setPaintProperty('basemap-layer', 'raster-saturation', 0);
    });

    const interactiveLayerIds = [POINT_LAYER_ID, LINE_LAYER_ID, POLYGON_FILL_LAYER_ID];

    map.on('mouseenter', interactiveLayerIds, () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', interactiveLayerIds, () => {
      map.getCanvas().style.cursor = '';
      popupRef.current?.remove();
    });

    map.on('mousemove', interactiveLayerIds, (event) => {
      const feature = event.features?.[0] as GeoJSONFeature | undefined;

      if (!feature || !popupRef.current) {
        return;
      }

      popupRef.current
        .setLngLat(event.lngLat)
        .setHTML(createPopupHtml(feature))
        .addTo(map);
    });

    map.on('click', interactiveLayerIds, (event) => {
      const feature = event.features?.[0] as GeoJSONFeature | undefined;

      if (!feature) {
        return;
      }

      highlightedFeatureRef.current = feature;
      const highlightSource = map.getSource(HIGHLIGHT_SOURCE_ID) as GeoJSONSource | undefined;
      highlightSource?.setData(featureToCollection(feature) as never);
    });

    mapRef.current = map;

    return () => {
      popupRef.current?.remove();
      userMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    updateBasemapSource(map, basemap);
  }, [basemap]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !map.isStyleLoaded()) {
      uploadedDataRef.current = geojsonData;
      return;
    }

    uploadedDataRef.current = geojsonData;
    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    source?.setData(geojsonData as never);

    const bounds = getBounds(geojsonData);

    if (bounds) {
      map.fitBounds(
        new LngLatBounds([bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]),
        { padding: 48, duration: 500, maxZoom: 15 }
      );
    }
  }, [geojsonData]);

  const handleParsedGeoJSON = (text: string, name: string) => {
    try {
      const parsed = parseGeoJSON(text);
      const validation = validateGeoJSON(parsed);

      if (!validation.ok) {
        setError(validation.error);
        setInfo(null);
        setGeojsonData(EMPTY_COLLECTION);
        setFileName(name);
        return;
      }

      const crsInfo = getGeoJSONCrsInfo(parsed);
      const reprojectedData = reprojectGeoJSONToWgs84(validation.data, crsInfo);

      setGeojsonData(reprojectedData);
      setInfo({
        featureCount: validation.featureCount,
        geometryTypes: [
          ...validation.geometryTypes,
          `CRS ${crsInfo?.normalizedName ?? 'EPSG:4326'}`
        ]
      });
      setFileName(name);
      setError('');
      emitToolEvent('geojson-viewer', 'completed');
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : 'Unable to read the selected file.');
      setInfo(null);
      setGeojsonData(EMPTY_COLLECTION);
      setFileName(name);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setError('No file selected.');
      return;
    }

    const file = files[0];
    const fileReadId = ++fileReadIdRef.current;
    const lowerName = file.name.toLowerCase();

    if (!lowerName.endsWith('.geojson') && !lowerName.endsWith('.json')) {
      setError('Unsupported file format. Choose a .geojson or .json file.');
      setInfo(null);
      setGeojsonData(EMPTY_COLLECTION);
      setFileName(file.name);
      return;
    }

    if (file.size === 0) {
      setError('The selected file is empty.');
      setInfo(null);
      setGeojsonData(EMPTY_COLLECTION);
      setFileName(file.name);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (fileReadId !== fileReadIdRef.current) return;
      handleParsedGeoJSON(String(reader.result ?? ''), file.name);
    };

    reader.onerror = () => {
      if (fileReadId !== fileReadIdRef.current) return;
      setError('The file could not be read.');
      setInfo(null);
      setGeojsonData(EMPTY_COLLECTION);
      setFileName(file.name);
    };

    reader.readAsText(file);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapRef.current;

        if (!map) {
          return;
        }

        setError('');

        if (!userMarkerRef.current) {
          userMarkerRef.current = new maplibregl.Marker({ color: '#ffffff' });
        }

        userMarkerRef.current.setLngLat([longitude, latitude]).addTo(map);
        map.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true
        });
      },
      (geoError) => {
        setError(geoError.message || 'Unable to access your location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  };

  const handleZoomToExtents = () => {
    const map = mapRef.current;
    const bounds = getBounds(geojsonData);

    if (!map || !bounds) {
      setError('Load a valid GeoJSON file first to zoom to its extents.');
      return;
    }

    setError('');
    map.fitBounds(
      new LngLatBounds([bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]),
      { padding: 48, duration: 500, maxZoom: 15 }
    );
  };

  return (
    <ToolLayout
      title={page.heading}
      intro={page.intro}
      compact
    >
      <div className="mx-auto grid max-w-6xl gap-6">
        <section className="panel rounded-xl p-5 sm:p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="section-label">Open locally</p>
              <h2 className="text-2xl font-semibold text-text-primary">Drag, drop, or browse a GeoJSON file</h2>
              <p className="text-sm leading-6 text-text-body">
                Accepted formats: <span className="text-text-secondary">.geojson</span> and{' '}
                <span className="text-text-secondary">.json</span>. Your file stays in this browser; the map requests basemap tiles separately.
              </p>
            </div>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragActive(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                handleFiles(event.dataTransfer.files);
              }}
              className={
                dragActive
                  ? 'rounded-xl border border-border-hover bg-surface-hover px-5 py-10 text-center transition'
                  : 'rounded-xl border border-dashed border-border-strong bg-surface-soft px-5 py-10 text-center transition'
              }
            >
              <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
                <p className="text-base font-medium text-text-primary">Drop a GeoJSON file here</p>
                <p className="text-sm leading-6 text-text-body">
                  Or tap below to choose a file from your device.
                </p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="interactive-accent inline-flex items-center justify-center">
                  Choose file
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".geojson,.json,application/json"
              className="hidden"
              onChange={(event) => {
                handleFiles(event.target.files);
                event.target.value = '';
              }}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="theme-card rounded-xl p-4">
                <p className="text-sm text-text-secondary">Loaded file</p>
                <p className="mt-2 break-words text-base font-medium text-text-primary">
                  {fileName || 'No file loaded'}
                </p>
              </div>
              <div className="theme-card rounded-xl p-4">
                <p className="text-sm text-text-secondary">Features</p>
                <p className="mt-2 text-base font-medium text-text-primary">
                  {info ? info.featureCount : 0}
                </p>
              </div>
              <div className="theme-card rounded-xl p-4">
                <p className="text-sm text-text-secondary">Geometry types</p>
                <p className="mt-2 break-words text-base font-medium text-text-primary">
                  {info && info.geometryTypes.length > 0 ? info.geometryTypes.join(', ') : 'None'}
                </p>
              </div>
            </div>

            {error ? (
              <div role="alert" className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-4 text-sm leading-6 text-[var(--color-danger)]">
                {error}
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel rounded-xl p-5 sm:p-6">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="section-label">Map Controls</p>
                <h2 className="text-2xl font-semibold text-text-primary">Basemap and location</h2>
                <p className="text-sm leading-6 text-text-body">
                  Switch the basemap, center on your GPS location, and inspect properties directly on the map.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm text-text-secondary">Basemap</span>
                  <select
                    value={basemap}
                    onChange={(event) => setBasemap(event.target.value as BasemapMode)}
                    className="form-control"
                  >
                    {basemapOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="space-y-2">
                  <span className="text-sm text-text-secondary">Location</span>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="interactive-outline inline-flex w-full items-center justify-center"
                  >
                    Use My Location
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-text-secondary">View</span>
                  <button
                    type="button"
                    onClick={handleZoomToExtents}
                    className="interactive-outline inline-flex w-full items-center justify-center"
                  >
                    Zoom to Extents
                  </button>
                </div>
              </div>
            </div>

            <div className={mapClassName}>
              <div ref={mapContainerRef} className="h-[420px] w-full sm:h-[520px]" />
            </div>
          </div>
        </section>

      </div>
      <ToolGuide slug="tools/geojson-viewer" />
    </ToolLayout>
  );
}

export default GeoJSONViewerPage;
