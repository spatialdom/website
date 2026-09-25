import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';

const articles = [
  {
    id: 'coordinate-systems',
    title: 'Why coordinate systems and zones matter',
    paragraphs: [
      'Longitude and latitude describe angular positions, while projected grid coordinates describe positions on a flat map. A datum and projection define how those numbers relate to places on the ground.',
      'Before converting coordinates, confirm the source datum and zone. The Spatialdom converter handles Luzon 1911 geographic and Philippine Transverse Mercator grid coordinates; it does not convert WGS 84 or UTM coordinates.'
    ],
    source: { label: 'EPSG Geodetic Parameter Dataset', href: 'https://epsg.org/home.html' }
  },
  {
    id: 'geojson-basics',
    title: 'How to read GeoJSON coordinates',
    paragraphs: [
      'GeoJSON stores geometry as points, lines, polygons, and collections of features. A feature can also carry properties, such as a name or identifier.',
      'Standard GeoJSON positions use longitude first, then latitude, in decimal degrees on WGS 84. If a dataset uses a different coordinate reference system, check or transform it before relying on its position on a web map.'
    ],
    source: { label: 'IETF RFC 7946: The GeoJSON Format', href: 'https://datatracker.ietf.org/doc/html/rfc7946' }
  },
  {
    id: 'land-title-technical-description',
    title: 'What is a land title technical description?',
    paragraphs: [
      'A technical description sets out how a parcel is described on paper. It uses a sequence of boundary lines, directions, distances, and reference points to describe the lot’s shape and position.',
      'Plotting those lines helps a reader see the parcel the description refers to and notice questions to ask about missing, unclear, or inconsistent measurements. A plotted sketch is a way to understand the document; it does not replace an approved plan, a survey, or verification with the responsible office.'
    ],
    source: { label: 'Land Registration Authority: technical descriptions', href: 'https://lra.gov.ph/mandatory-submission-of-etds/' }
  },
  {
    id: 'lgu-tax-mapping',
    title: 'What is tax mapping for an LGU?',
    paragraphs: [
      'Tax mapping connects a property record to its location on a map. For an Assessor’s Office, this makes it easier to identify a parcel and work with the related assessment information.',
      'A useful tax mapping workflow also accounts for changes. When a parcel or record is updated, the map and its linked information need to stay aligned so staff can work from a clear, current view.'
    ],
    source: { label: 'Quezon City Assessor’s Office: tax maps', href: 'https://quezoncity.gov.ph/departments/city-assessors-office/' }
  },
  {
    id: 'household-information-system',
    title: 'What is a household information system?',
    paragraphs: [
      'A household information system organizes local records about residents and households so authorized staff can find and update information needed for services and planning.',
      'The value comes from keeping records current and usable. Clear responsibilities for collecting, checking, and updating information help an LGU understand community needs and target its programs.'
    ],
    source: { label: 'DILG: Local Government Unit Support System', href: 'https://lguss.dilg.gov.ph/' }
  }
] as const;

function InsightsPage() {
  useEffect(() => {
    document.title = 'Insights | Spatialdom';
    return () => { document.title = 'Spatialdom'; };
  }, []);

  return (
    <main className="pb-16 pt-32 sm:pt-40">
      <Container className="max-w-4xl">
        <Link to="/#insights" className="text-link text-sm">Back to homepage</Link>
        <header className="mt-8 max-w-prose">
          <p className="section-label">Insights</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-text-primary">Practical spatial questions</h1>
          <p className="mt-4 text-lg leading-8 text-text-secondary">Short explanations for landowners and local government teams.</p>
        </header>
        <div className="mt-12 space-y-6">
          {articles.map((article) => (
            <article key={article.id} id={article.id} className="panel scroll-mt-32 p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-text-primary">{article.title}</h2>
              {article.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-7 text-text-secondary">{paragraph}</p>
              ))}
              {article.id === 'land-title-technical-description' ? (
                <Link className="text-link mt-5 inline-block" to="/plot-land-title-technical-description/">
                  Learn how to plot a technical description
                </Link>
              ) : null}
              {article.id === 'coordinate-systems' ? (
                <Link className="text-link mt-5 inline-block" to="/tools/coordinate-converter/">Use the coordinate converter</Link>
              ) : null}
              {article.id === 'geojson-basics' ? (
                <Link className="text-link mt-5 inline-block" to="/tools/geojson-viewer/">Open the GeoJSON viewer</Link>
              ) : null}
              <a className="text-link mt-6 inline-block text-sm" href={article.source.href} target="_blank" rel="noopener noreferrer">
                Source: {article.source.label}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}

export default InsightsPage;
