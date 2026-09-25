import { useEffect, useRef, useState } from 'react';
import {
  decimalDegreesToDms,
  dmsToDecimalDegrees,
  formatDecimalDegrees,
  formatDms,
  formatMeters,
  geographicToLuzon1911Grid,
  LUZON_1911_ZONES,
  luzon1911GridToGeographic,
  type AngularFormat,
  type DmsAngle,
  type Luzon1911Zone
} from '../../shared/utils/coordinates';
import ToolLayout from '../../shared/layout/ToolLayout';
import ToolGuide from '../../shared/layout/ToolGuide';
import { getToolPage, useToolMetadata } from '../../shared/utils/toolPage';
import { emitToolEvent } from '../../shared/utils/toolEvents';

type ConversionMode = 'geographic-to-grid' | 'grid-to-geographic';

type ConversionState =
  | {
      ok: true;
      text: string;
      detailText: string;
      detail: Array<{ label: string; value: string }>;
    }
  | {
      ok: false;
      error: string;
    };

const defaultZone: Luzon1911Zone = 'III';

const defaultDecimalGeo = {
  longitude: '121.0244',
  latitude: '14.5547'
};

const defaultGrid = {
  x: '502658.309',
  y: '1609221.604'
};

const defaultLongitudeDms: DmsAngle = {
  degrees: '121',
  minutes: '1',
  seconds: '27.84',
  direction: 'E'
};

const defaultLatitudeDms: DmsAngle = {
  degrees: '14',
  minutes: '33',
  seconds: '16.92',
  direction: 'N'
};

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim());

  if (!value.trim() || Number.isNaN(parsed)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return parsed;
}

function getGeographicInput(
  angularFormat: AngularFormat,
  zone: Luzon1911Zone,
  decimalValues: typeof defaultDecimalGeo,
  dmsValues: { longitude: DmsAngle; latitude: DmsAngle }
) {
  if (angularFormat === 'dd') {
    return {
      longitude: parseNumber(decimalValues.longitude, 'Longitude'),
      latitude: parseNumber(decimalValues.latitude, 'Latitude'),
      zone
    };
  }

  return {
    longitude: dmsToDecimalDegrees(dmsValues.longitude, 'longitude'),
    latitude: dmsToDecimalDegrees(dmsValues.latitude, 'latitude'),
    zone
  };
}

function getGeographicToGridResult(
  angularFormat: AngularFormat,
  zone: Luzon1911Zone,
  decimalValues: typeof defaultDecimalGeo,
  dmsValues: { longitude: DmsAngle; latitude: DmsAngle }
): ConversionState {
  try {
    const geographic = getGeographicInput(angularFormat, zone, decimalValues, dmsValues);
    const grid = geographicToLuzon1911Grid(geographic);
    const text = `Zone ${zone} | PTM X ${formatMeters(grid.x)} | PTM Y ${formatMeters(grid.y)}`;

    return {
      ok: true,
      text,
      detailText: [
        `Zone: ${zone}`,
        `Longitude: ${formatDecimalDegrees(geographic.longitude)}`,
        `Latitude: ${formatDecimalDegrees(geographic.latitude)}`,
        `PTM X: ${formatMeters(grid.x)}`,
        `PTM Y: ${formatMeters(grid.y)}`
      ].join('\n'),
      detail: [
        { label: 'Zone', value: zone },
        { label: 'PTM X', value: formatMeters(grid.x) },
        { label: 'PTM Y', value: formatMeters(grid.y) },
        { label: 'Longitude', value: formatDecimalDegrees(geographic.longitude) },
        { label: 'Latitude', value: formatDecimalDegrees(geographic.latitude) }
      ]
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to convert geographic coordinates.'
    };
  }
}

function getGridToGeographicResult(
  zone: Luzon1911Zone,
  gridValues: typeof defaultGrid
): ConversionState {
  try {
    const x = parseNumber(gridValues.x, 'PTM X');
    const y = parseNumber(gridValues.y, 'PTM Y');
    const geographic = luzon1911GridToGeographic({ zone, x, y });
    const longitudeDms = formatDms(geographic.longitude, 'longitude');
    const latitudeDms = formatDms(geographic.latitude, 'latitude');
    const text = `${formatDecimalDegrees(geographic.longitude)}, ${formatDecimalDegrees(geographic.latitude)} (Zone ${zone})`;

    return {
      ok: true,
      text,
      detailText: [
        `Zone: ${zone}`,
        `Longitude (DD): ${formatDecimalDegrees(geographic.longitude)}`,
        `Latitude (DD): ${formatDecimalDegrees(geographic.latitude)}`,
        `Longitude (DMS): ${longitudeDms}`,
        `Latitude (DMS): ${latitudeDms}`
      ].join('\n'),
      detail: [
        { label: 'Zone', value: zone },
        { label: 'Longitude (DD)', value: formatDecimalDegrees(geographic.longitude) },
        { label: 'Latitude (DD)', value: formatDecimalDegrees(geographic.latitude) },
        { label: 'Longitude (DMS)', value: longitudeDms },
        { label: 'Latitude (DMS)', value: latitudeDms }
      ]
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to convert PTM grid coordinates.'
    };
  }
}

function CoordinateConverterPage() {
  useToolMetadata('tools/coordinate-converter');
  const page = getToolPage('tools/coordinate-converter');
  const [mode, setMode] = useState<ConversionMode>('geographic-to-grid');
  const [angularFormat, setAngularFormat] = useState<AngularFormat>('dd');
  const [zone, setZone] = useState<Luzon1911Zone>(defaultZone);
  const [decimalGeo, setDecimalGeo] = useState(defaultDecimalGeo);
  const [longitudeDms, setLongitudeDms] = useState(defaultLongitudeDms);
  const [latitudeDms, setLatitudeDms] = useState(defaultLatitudeDms);
  const [gridValues, setGridValues] = useState(defaultGrid);
  const [copyStatus, setCopyStatus] = useState('');
  const hasInteracted = useRef(false);

  useEffect(() => { emitToolEvent('coordinate-converter', 'opened'); }, []);

  useEffect(() => {
    if (!copyStatus) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopyStatus(''), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copyStatus]);

  const result =
    mode === 'geographic-to-grid'
      ? getGeographicToGridResult(angularFormat, zone, decimalGeo, {
          longitude: longitudeDms,
          latitude: latitudeDms
        })
      : getGridToGeographicResult(zone, gridValues);

  useEffect(() => {
    if (!hasInteracted.current || !result.ok) return;
    const timeoutId = window.setTimeout(() => emitToolEvent('coordinate-converter', 'completed'), 500);
    return () => window.clearTimeout(timeoutId);
  }, [mode, angularFormat, zone, decimalGeo, longitudeDms, latitudeDms, gridValues]);

  const handleCopy = async (value: string, successMessage: string) => {
    if (!result.ok) {
      return;
    }

    try {
      await copyText(value);
      setCopyStatus(successMessage);
      emitToolEvent('coordinate-converter', 'copied');
    } catch {
      setCopyStatus('Copy failed. Please copy manually.');
    }
  };

  const handleReset = () => {
    hasInteracted.current = false;
    setZone(defaultZone);
    setDecimalGeo(defaultDecimalGeo);
    setLongitudeDms(defaultLongitudeDms);
    setLatitudeDms(defaultLatitudeDms);
    setGridValues(defaultGrid);
    setAngularFormat('dd');
    setCopyStatus('');
  };

  const handleDmsChange =
    (field: 'longitude' | 'latitude', key: keyof DmsAngle) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      hasInteracted.current = true;
      const value = event.target.value;
      const setter = field === 'longitude' ? setLongitudeDms : setLatitudeDms;

      setter((current) => ({
        ...current,
        [key]: value
      }));
    };

  const zoneDescription = LUZON_1911_ZONES.find((item) => item.code === zone);

  return (
    <ToolLayout
      title={page.heading}
      intro={page.intro}
      compact
    >
      <div className="mx-auto grid max-w-5xl gap-6">
        <section className="panel rounded-xl p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
            <div className="space-y-1">
              <p className="section-label">Conversion Type</p>
              <h2 className="text-xl font-semibold text-text-primary">Luzon 1911 geographic and grid</h2>
              <p className="text-sm leading-6 text-text-body">
                Use `Lon, Lat, Zone` for geographic input or `PTM X, PTM Y, Zone` for grid input.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl border border-border-strong bg-surface-soft p-1">
              <button
                type="button"
                aria-pressed={mode === 'geographic-to-grid'}
                onClick={() => { hasInteracted.current = true; setMode('geographic-to-grid'); }}
                className={
                  mode === 'geographic-to-grid'
                    ? 'interactive-accent px-4 py-2.5'
                    : 'interactive-outline px-4 py-2.5'
                }
              >
                Geo to Grid
              </button>
              <button
                type="button"
                aria-pressed={mode === 'grid-to-geographic'}
                onClick={() => { hasInteracted.current = true; setMode('grid-to-geographic'); }}
                className={
                  mode === 'grid-to-geographic'
                    ? 'interactive-accent px-4 py-2.5'
                    : 'interactive-outline px-4 py-2.5'
                }
              >
                Grid to Geo
              </button>
            </div>

            <label className="space-y-2">
              <span className="text-sm text-text-secondary">Zone</span>
              <select
                value={zone}
                onChange={(event) => { hasInteracted.current = true; setZone(event.target.value as Luzon1911Zone); }}
                className="form-control"
              >
                {LUZON_1911_ZONES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label} ({item.centralMeridian}°E)
                  </option>
                ))}
              </select>
            </label>
          </div>

          {zoneDescription ? (
            <p className="mt-4 text-sm text-text-body">
              Active zone: <span className="text-text-secondary">{zoneDescription.label}</span> with central meridian{' '}
              <span className="text-text-secondary">{zoneDescription.centralMeridian}°E</span>.
            </p>
          ) : null}
        </section>

        {mode === 'geographic-to-grid' ? (
          <section className="panel rounded-xl p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="section-label">Luzon 1911 Geographic</p>
                  <h2 className="text-2xl font-semibold text-text-primary">Longitude / latitude input</h2>
                  <p className="text-sm leading-6 text-text-body">
                    Enter angular coordinates in decimal degrees or degrees-minutes-seconds, then convert to PTM X and
                    PTM Y.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl border border-border-strong bg-surface-soft p-1">
                  <button
                    type="button"
                    aria-pressed={angularFormat === 'dd'}
                    onClick={() => { hasInteracted.current = true; setAngularFormat('dd'); }}
                    className={angularFormat === 'dd' ? 'interactive-accent px-4 py-2.5' : 'interactive-outline px-4 py-2.5'}
                  >
                    Decimal Degrees
                  </button>
                  <button
                    type="button"
                    aria-pressed={angularFormat === 'dms'}
                    onClick={() => { hasInteracted.current = true; setAngularFormat('dms'); }}
                    className={angularFormat === 'dms' ? 'interactive-accent px-4 py-2.5' : 'interactive-outline px-4 py-2.5'}
                  >
                    DMS
                  </button>
                </div>
              </div>

              {angularFormat === 'dd' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-text-secondary">Longitude</span>
                    <input
                      value={decimalGeo.longitude}
                      onChange={(event) => {
                        hasInteracted.current = true;
                        setDecimalGeo((current) => ({ ...current, longitude: event.target.value }));
                      }}
                      className="form-control"
                      inputMode="decimal"
                      placeholder="e.g. 121.0244"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm text-text-secondary">Latitude</span>
                    <input
                      value={decimalGeo.latitude}
                      onChange={(event) => {
                        hasInteracted.current = true;
                        setDecimalGeo((current) => ({ ...current, latitude: event.target.value }));
                      }}
                      className="form-control"
                      inputMode="decimal"
                      placeholder="e.g. 14.5547"
                    />
                  </label>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {[
                    { label: 'Longitude', value: longitudeDms, axis: 'longitude' as const, directions: ['E', 'W'] },
                    { label: 'Latitude', value: latitudeDms, axis: 'latitude' as const, directions: ['N', 'S'] }
                  ].map((item) => (
                    <div key={item.axis} className="theme-card rounded-xl p-4">
                      <p className="mb-4 text-sm font-medium text-text-secondary">{item.label}</p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <label className="space-y-2">
                          <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Deg</span>
                          <input
                            value={item.value.degrees}
                            onChange={handleDmsChange(item.axis, 'degrees')}
                            className="form-control"
                            inputMode="numeric"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Min</span>
                          <input
                            value={item.value.minutes}
                            onChange={handleDmsChange(item.axis, 'minutes')}
                            className="form-control"
                            inputMode="numeric"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Sec</span>
                          <input
                            value={item.value.seconds}
                            onChange={handleDmsChange(item.axis, 'seconds')}
                            className="form-control"
                            inputMode="decimal"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Dir</span>
                          <select
                            value={item.value.direction}
                            onChange={handleDmsChange(item.axis, 'direction')}
                            className="form-control"
                          >
                            {item.directions.map((direction) => (
                              <option key={direction} value={direction}>
                                {direction}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleReset}
                  className="interactive-outline inline-flex items-center justify-center"
                >
                  Clear / reset
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="panel rounded-xl p-5 sm:p-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="section-label">Luzon 1911 Grid</p>
                <h2 className="text-2xl font-semibold text-text-primary">PTM X / PTM Y input</h2>
                <p className="text-sm leading-6 text-text-body">
                  Enter projected coordinates and zone to convert back to Luzon 1911 longitude and latitude.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-text-secondary">PTM X</span>
                  <input
                    value={gridValues.x}
                    onChange={(event) => { hasInteracted.current = true; setGridValues((current) => ({ ...current, x: event.target.value })); }}
                    className="form-control"
                    inputMode="decimal"
                    placeholder="e.g. 502658.309"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-text-secondary">PTM Y</span>
                  <input
                    value={gridValues.y}
                    onChange={(event) => { hasInteracted.current = true; setGridValues((current) => ({ ...current, y: event.target.value })); }}
                    className="form-control"
                    inputMode="decimal"
                    placeholder="e.g. 1609221.604"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleReset}
                  className="interactive-outline inline-flex items-center justify-center"
                >
                  Clear / reset
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="panel rounded-xl p-5 sm:p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="section-label">Output</p>
              <h2 className="text-2xl font-semibold text-text-primary">
                {mode === 'geographic-to-grid'
                  ? 'Luzon 1911 Grid result'
                  : 'Luzon 1911 Geographic result'}
              </h2>
            </div>

            {result.ok ? (
              <>
                <div className="theme-card rounded-xl p-4 sm:p-5">
                  <p className="text-sm text-text-secondary">Primary output</p>
                  <p className="mt-2 break-words text-lg font-medium text-text-primary sm:text-xl">{result.text}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {result.detail.map((item) => (
                    <div key={item.label} className="theme-card rounded-xl p-4">
                      <p className="text-sm text-text-secondary">{item.label}</p>
                      <p className="mt-2 text-base font-medium text-text-primary">{item.value}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div role="alert" className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-4 text-sm leading-6 text-[var(--color-danger)]">
                {result.error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleCopy(result.ok ? result.text : '', 'Copied compact result.')}
                  disabled={!result.ok}
                  className="interactive-accent inline-flex items-center justify-center "
                >
                  Copy result
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(result.ok ? result.detailText : '', 'Copied detailed values.')}
                  disabled={!result.ok}
                  className="interactive-outline inline-flex items-center justify-center "
                >
                  Copy details
                </button>
              </div>
              {copyStatus ? <p role="status" className="text-sm text-text-body">{copyStatus}</p> : null}
            </div>
          </div>
        </section>
      </div>
      <ToolGuide slug="tools/coordinate-converter" />
    </ToolLayout>
  );
}

export default CoordinateConverterPage;
