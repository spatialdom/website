import proj4 from 'proj4';

export type GeoJSONGeometry =
  | { type: 'Point'; coordinates: number[] }
  | { type: 'MultiPoint'; coordinates: number[][] }
  | { type: 'LineString'; coordinates: number[][] }
  | { type: 'MultiLineString'; coordinates: number[][][] }
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] }
  | { type: 'GeometryCollection'; geometries: GeoJSONGeometry[] };

export type GeoJSONFeature = {
  type: 'Feature';
  id?: string | number;
  properties?: Record<string, unknown> | null;
  geometry: GeoJSONGeometry | null;
};

export type GeoJSONFeatureCollection = {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
};

export type SupportedGeoJSON = GeoJSONFeatureCollection | GeoJSONFeature | GeoJSONGeometry;

export type GeoJSONValidationResult =
  | {
      ok: true;
      data: GeoJSONFeatureCollection;
      featureCount: number;
      geometryTypes: string[];
    }
  | {
      ok: false;
      error: string;
    };

export type GeoJSONBounds = {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
};

export type GeoJSONCrsInfo = {
  originalName: string;
  normalizedName: string;
};

type Ellipsoid = {
  a: number;
  invF: number;
};

type HelmertParameters = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
};

type SupportedTransformation =
  | {
      kind: 'identity';
    }
  | {
      kind: 'projected';
      projectedDef: string;
      projectedCode: string;
      sourceEllipsoid: Ellipsoid;
      helmert: HelmertParameters | null;
    }
  | {
      kind: 'geographic';
      sourceEllipsoid: Ellipsoid;
      helmert: HelmertParameters | null;
    };

const CLARKE_1866: Ellipsoid = {
  a: 6378206.4,
  invF: 294.978698213898
};

const WGS84: Ellipsoid = {
  a: 6378137,
  invF: 298.257223563
};

const PRS92_HELMERT: HelmertParameters = {
  x: -127.62,
  y: -67.24,
  z: -47.04,
  rx: 3.068,
  ry: -4.903,
  rz: -1.578,
  s: -1.06
};

const LUZON1911_HELMERT: HelmertParameters = {
  x: -133,
  y: -77,
  z: -51,
  rx: 0,
  ry: 0,
  rz: 0,
  s: 0
};

const RAW_PROJ_DEFINITIONS: Record<string, string> = {
  'RAW:3121': '+proj=tmerc +lat_0=0 +lon_0=117 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:3122': '+proj=tmerc +lat_0=0 +lon_0=119 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:3123': '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:3124': '+proj=tmerc +lat_0=0 +lon_0=123 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:3125': '+proj=tmerc +lat_0=0 +lon_0=125 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:25391': '+proj=tmerc +lat_0=0 +lon_0=117 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:25392': '+proj=tmerc +lat_0=0 +lon_0=119 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:25393': '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:25394': '+proj=tmerc +lat_0=0 +lon_0=123 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:25395': '+proj=tmerc +lat_0=0 +lon_0=125 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +units=m +no_defs +type=crs',
  'RAW:32651': '+proj=utm +zone=51 +datum=WGS84 +units=m +no_defs +type=crs'
};

for (const [name, definition] of Object.entries(RAW_PROJ_DEFINITIONS)) {
  if (!proj4.defs(name)) {
    proj4.defs(name, definition);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item));
}

function isCoordinatePair(value: unknown): value is [number, number] {
  return isNumberArray(value) && value.length >= 2;
}

function validateGeometry(geometry: unknown): geometry is GeoJSONGeometry {
  if (!isObject(geometry) || typeof geometry.type !== 'string') {
    return false;
  }

  switch (geometry.type) {
    case 'Point':
      return isCoordinatePair(geometry.coordinates);
    case 'MultiPoint':
    case 'LineString':
      return Array.isArray(geometry.coordinates) && geometry.coordinates.every(isCoordinatePair);
    case 'MultiLineString':
    case 'Polygon':
      return (
        Array.isArray(geometry.coordinates) &&
        geometry.coordinates.every((line) => Array.isArray(line) && line.every(isCoordinatePair))
      );
    case 'MultiPolygon':
      return (
        Array.isArray(geometry.coordinates) &&
        geometry.coordinates.every(
          (polygon) =>
            Array.isArray(polygon) &&
            polygon.every((ring) => Array.isArray(ring) && ring.every(isCoordinatePair))
        )
      );
    case 'GeometryCollection':
      return Array.isArray(geometry.geometries) && geometry.geometries.every(validateGeometry);
    default:
      return false;
  }
}

function normalizeToFeatureCollection(data: SupportedGeoJSON): GeoJSONFeatureCollection {
  if (data.type === 'FeatureCollection') {
    return data;
  }

  if (data.type === 'Feature') {
    return {
      type: 'FeatureCollection',
      features: [data]
    };
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: data
      }
    ]
  };
}

function collectGeometryTypesFromGeometry(geometry: GeoJSONGeometry | null, geometryTypes: Set<string>) {
  if (!geometry) {
    return;
  }

  if (geometry.type === 'GeometryCollection') {
    geometry.geometries.forEach((item) => collectGeometryTypesFromGeometry(item, geometryTypes));
    return;
  }

  geometryTypes.add(geometry.type);
}

export function parseGeoJSON(text: string): unknown {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error('The selected file is empty.');
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error('The selected file is not valid JSON.');
  }
}

function normalizeCrsName(name: string) {
  const trimmed = name.trim().toUpperCase();

  const epsgMatch = trimmed.match(/EPSG(?::|::)(\d{4,5})$/) ?? trimmed.match(/EPSG.*?(\d{4,5})$/);

  if (epsgMatch) {
    return `EPSG:${epsgMatch[1]}`;
  }

  if (trimmed.includes('WGS 84') || trimmed.includes('WGS84')) {
    return trimmed.includes('UTM') && trimmed.includes('51') ? 'EPSG:32651' : 'EPSG:4326';
  }

  if (trimmed.includes('PRS 92') || trimmed.includes('PRS92')) {
    const zoneMatch = trimmed.match(/ZONE\s*([1-5])/);
    return zoneMatch ? `EPSG:312${zoneMatch[1]}` : 'EPSG:4683';
  }

  if (trimmed.includes('LUZON 1911')) {
    const zoneMatch = trimmed.match(/ZONE\s*([1-5])/);
    return zoneMatch ? `EPSG:2539${zoneMatch[1]}` : 'EPSG:4253';
  }

  return null;
}

export function getGeoJSONCrsInfo(input: unknown): GeoJSONCrsInfo | null {
  if (!isObject(input) || !isObject(input.crs)) {
    return null;
  }

  const crs = input.crs;

  if (crs.type === 'name' && isObject(crs.properties) && typeof crs.properties.name === 'string') {
    const normalizedName = normalizeCrsName(crs.properties.name);

    if (!normalizedName) {
      throw new Error(`Unsupported CRS: ${crs.properties.name}`);
    }

    return {
      originalName: crs.properties.name,
      normalizedName
    };
  }

  throw new Error('Unsupported GeoJSON CRS format. Use a CRS name such as EPSG:3123 or a matching OGC URN.');
}

function getTransformationForCrs(crsName: string): SupportedTransformation {
  switch (crsName) {
    case 'EPSG:4326':
      return { kind: 'identity' };
    case 'EPSG:32651':
      return {
        kind: 'projected',
        projectedDef: 'RAW:32651',
        projectedCode: crsName,
        sourceEllipsoid: WGS84,
        helmert: null
      };
    case 'EPSG:4683':
      return {
        kind: 'geographic',
        sourceEllipsoid: CLARKE_1866,
        helmert: PRS92_HELMERT
      };
    case 'EPSG:4253':
      return {
        kind: 'geographic',
        sourceEllipsoid: CLARKE_1866,
        helmert: LUZON1911_HELMERT
      };
    case 'EPSG:3121':
    case 'EPSG:3122':
    case 'EPSG:3123':
    case 'EPSG:3124':
    case 'EPSG:3125':
      return {
        kind: 'projected',
        projectedDef: `RAW:${crsName.split(':')[1]}`,
        projectedCode: crsName,
        sourceEllipsoid: CLARKE_1866,
        helmert: PRS92_HELMERT
      };
    case 'EPSG:25391':
    case 'EPSG:25392':
    case 'EPSG:25393':
    case 'EPSG:25394':
    case 'EPSG:25395':
      return {
        kind: 'projected',
        projectedDef: `RAW:${crsName.split(':')[1]}`,
        projectedCode: crsName,
        sourceEllipsoid: CLARKE_1866,
        helmert: LUZON1911_HELMERT
      };
    default:
      throw new Error(`Unsupported CRS transformation: ${crsName}`);
  }
}

function geodeticToGeocentric(longitude: number, latitude: number, ellipsoid: Ellipsoid, height = 0) {
  const lon = (longitude * Math.PI) / 180;
  const lat = (latitude * Math.PI) / 180;
  const f = 1 / ellipsoid.invF;
  const e2 = 2 * f - f * f;
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const sinLon = Math.sin(lon);
  const cosLon = Math.cos(lon);
  const nu = ellipsoid.a / Math.sqrt(1 - e2 * sinLat * sinLat);

  return {
    x: (nu + height) * cosLat * cosLon,
    y: (nu + height) * cosLat * sinLon,
    z: (nu * (1 - e2) + height) * sinLat
  };
}

function geocentricToGeodetic(x: number, y: number, z: number, ellipsoid: Ellipsoid) {
  const a = ellipsoid.a;
  const f = 1 / ellipsoid.invF;
  const b = a * (1 - f);
  const e2 = 2 * f - f * f;
  const ep2 = (a * a - b * b) / (b * b);
  const p = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(z * a, p * b);
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const longitude = Math.atan2(y, x);
  const latitude = Math.atan2(
    z + ep2 * b * Math.pow(sinTheta, 3),
    p - e2 * a * Math.pow(cosTheta, 3)
  );

  return {
    longitude: (longitude * 180) / Math.PI,
    latitude: (latitude * 180) / Math.PI
  };
}

function applyHelmertCoordinateFrame(
  geocentric: { x: number; y: number; z: number },
  parameters: HelmertParameters
) {
  const rx = (-parameters.rx * Math.PI) / (180 * 3600);
  const ry = (-parameters.ry * Math.PI) / (180 * 3600);
  const rz = (-parameters.rz * Math.PI) / (180 * 3600);
  const scale = 1 + parameters.s * 1e-6;

  return {
    x: parameters.x + scale * (geocentric.x - rz * geocentric.y + ry * geocentric.z),
    y: parameters.y + scale * (rz * geocentric.x + geocentric.y - rx * geocentric.z),
    z: parameters.z + scale * (-ry * geocentric.x + rx * geocentric.y + geocentric.z)
  };
}

function projectCoordinateToWgs84(coordinate: number[], transformation: SupportedTransformation): number[] {
  if (!isCoordinatePair(coordinate)) {
    return coordinate;
  }

  const [first, second, ...rest] = coordinate;

  if (transformation.kind === 'identity') {
    return [first, second, ...rest];
  }

  if (transformation.kind === 'projected') {
    const [longitude, latitude] =
      transformation.projectedCode === 'EPSG:32651'
        ? proj4(transformation.projectedDef, 'EPSG:4326', [first, second])
        : proj4(transformation.projectedDef, 'EPSG:4326', [first, second]);

    if (!transformation.helmert) {
      return [longitude, latitude, ...rest];
    }

    const geocentric = geodeticToGeocentric(longitude, latitude, transformation.sourceEllipsoid);
    const shifted = applyHelmertCoordinateFrame(geocentric, transformation.helmert);
    const geographic = geocentricToGeodetic(shifted.x, shifted.y, shifted.z, WGS84);

    return [geographic.longitude, geographic.latitude, ...rest];
  }

  const geocentric = geodeticToGeocentric(first, second, transformation.sourceEllipsoid);

  if (!transformation.helmert) {
    return [first, second, ...rest];
  }

  const shifted = applyHelmertCoordinateFrame(geocentric, transformation.helmert);
  const geographic = geocentricToGeodetic(shifted.x, shifted.y, shifted.z, WGS84);

  return [geographic.longitude, geographic.latitude, ...rest];
}

function transformGeometry(geometry: GeoJSONGeometry | null, transformation: SupportedTransformation): GeoJSONGeometry | null {
  if (!geometry) {
    return null;
  }

  switch (geometry.type) {
    case 'Point':
      return {
        ...geometry,
        coordinates: projectCoordinateToWgs84(geometry.coordinates, transformation)
      };
    case 'MultiPoint':
    case 'LineString':
      return {
        ...geometry,
        coordinates: geometry.coordinates.map((coordinate) =>
          projectCoordinateToWgs84(coordinate, transformation)
        )
      } as GeoJSONGeometry;
    case 'MultiLineString':
    case 'Polygon':
      return {
        ...geometry,
        coordinates: geometry.coordinates.map((line) =>
          line.map((coordinate) => projectCoordinateToWgs84(coordinate, transformation))
        )
      } as GeoJSONGeometry;
    case 'MultiPolygon':
      return {
        ...geometry,
        coordinates: geometry.coordinates.map((polygon) =>
          polygon.map((ring) =>
            ring.map((coordinate) => projectCoordinateToWgs84(coordinate, transformation))
          )
        )
      };
    case 'GeometryCollection':
      return {
        ...geometry,
        geometries: geometry.geometries
          .map((item) => transformGeometry(item, transformation))
          .filter(Boolean) as GeoJSONGeometry[]
      };
    default:
      return geometry;
  }
}

export function reprojectGeoJSONToWgs84(
  data: GeoJSONFeatureCollection,
  crsInfo: GeoJSONCrsInfo | null
): GeoJSONFeatureCollection {
  if (!crsInfo || crsInfo.normalizedName === 'EPSG:4326') {
    return data;
  }

  const transformation = getTransformationForCrs(crsInfo.normalizedName);

  return {
    type: 'FeatureCollection',
    features: data.features.map((feature) => ({
      ...feature,
      geometry: transformGeometry(feature.geometry, transformation)
    }))
  };
}

export function validateGeoJSON(input: unknown): GeoJSONValidationResult {
  if (!isObject(input)) {
    return { ok: false, error: 'GeoJSON must be a JSON object.' };
  }

  if (typeof input.type !== 'string') {
    return { ok: false, error: 'GeoJSON must include a top-level "type" property.' };
  }

  if (input.type === 'FeatureCollection') {
    if (!Array.isArray(input.features)) {
      return { ok: false, error: 'FeatureCollection must include a "features" array.' };
    }

    const invalidFeature = input.features.find(
      (feature) =>
        !isObject(feature) ||
        feature.type !== 'Feature' ||
        !('geometry' in feature) ||
        (feature.geometry !== null && !validateGeometry(feature.geometry))
    );

    if (invalidFeature) {
      return { ok: false, error: 'One or more features contain invalid geometry.' };
    }

    const data = normalizeToFeatureCollection(input as SupportedGeoJSON);
    const geometryTypes = new Set<string>();
    data.features.forEach((feature) => collectGeometryTypesFromGeometry(feature.geometry, geometryTypes));

    return {
      ok: true,
      data,
      featureCount: data.features.length,
      geometryTypes: Array.from(geometryTypes)
    };
  }

  if (input.type === 'Feature') {
    if (!('geometry' in input) || (input.geometry !== null && !validateGeometry(input.geometry))) {
      return { ok: false, error: 'Feature must include a valid geometry object.' };
    }

    const data = normalizeToFeatureCollection(input as SupportedGeoJSON);
    const geometryTypes = new Set<string>();
    data.features.forEach((feature) => collectGeometryTypesFromGeometry(feature.geometry, geometryTypes));

    return {
      ok: true,
      data,
      featureCount: data.features.length,
      geometryTypes: Array.from(geometryTypes)
    };
  }

  if (validateGeometry(input)) {
    const data = normalizeToFeatureCollection(input);
    const geometryTypes = new Set<string>();
    data.features.forEach((feature) => collectGeometryTypesFromGeometry(feature.geometry, geometryTypes));

    return {
      ok: true,
      data,
      featureCount: data.features.length,
      geometryTypes: Array.from(geometryTypes)
    };
  }

  return {
    ok: false,
    error: 'GeoJSON must be a FeatureCollection, Feature, or valid geometry object.'
  };
}

function updateBounds(bounds: GeoJSONBounds | null, coordinate: number[]): GeoJSONBounds | null {
  if (!isCoordinatePair(coordinate)) {
    return bounds;
  }

  const [lng, lat] = coordinate;

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return bounds;
  }

  if (!bounds) {
    return {
      minLng: lng,
      minLat: lat,
      maxLng: lng,
      maxLat: lat
    };
  }

  return {
    minLng: Math.min(bounds.minLng, lng),
    minLat: Math.min(bounds.minLat, lat),
    maxLng: Math.max(bounds.maxLng, lng),
    maxLat: Math.max(bounds.maxLat, lat)
  };
}

function collectBoundsFromGeometry(geometry: GeoJSONGeometry | null, bounds: GeoJSONBounds | null): GeoJSONBounds | null {
  if (!geometry) {
    return bounds;
  }

  if (geometry.type === 'GeometryCollection') {
    return geometry.geometries.reduce(
      (currentBounds, item) => collectBoundsFromGeometry(item, currentBounds),
      bounds
    );
  }

  const stack: unknown[] = [geometry.coordinates];
  let currentBounds = bounds;

  while (stack.length > 0) {
    const current = stack.pop();

    if (isCoordinatePair(current)) {
      currentBounds = updateBounds(currentBounds, current);
      continue;
    }

    if (Array.isArray(current)) {
      current.forEach((item) => stack.push(item));
    }
  }

  return currentBounds;
}

export function getBounds(data: GeoJSONFeatureCollection): GeoJSONBounds | null {
  return data.features.reduce(
    (bounds, feature) => collectBoundsFromGeometry(feature.geometry, bounds),
    null as GeoJSONBounds | null
  );
}
