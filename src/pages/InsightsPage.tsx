import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';

const articles = [
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
