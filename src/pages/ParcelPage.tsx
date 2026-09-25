import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import parcelPages from '../data/parcelPages.json';

const appUrl = 'https://parcel.spatialdom.xyz/';

function ParcelPage({ slug }: { slug: string }) {
  const page = parcelPages.find((item) => item.slug === slug);

  if (!page) return null;

  return (
    <main className="pb-16 pt-32 sm:pt-40">
      <Container className="max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
          <Link className="text-link" to="/">Home</Link>
          <span aria-hidden="true">/</span>
          {page.slug === 'parcel-plotter' ? (
            <span aria-current="page">Parcel Plotter</span>
          ) : (
            <>
              <Link className="text-link" to="/parcel-plotter/">Parcel Plotter</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.heading}</span>
            </>
          )}
        </nav>

        <header className="mt-8 max-w-[760px]">
          <p className="section-label">{page.slug === 'parcel-plotter' ? 'Parcel Plotter' : 'Parcel Plotter guide'}</p>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.045em] text-text-primary">
            {page.heading}
          </h1>
          <p className="mt-5 text-lg leading-8 text-text-secondary">{page.intro}</p>
          <a className="interactive-accent mt-7" href={appUrl} target="_blank" rel="noopener noreferrer">
            Try Early Access <span className="sr-only">(opens in a new tab)</span>
          </a>
        </header>

        <div className="mt-12 border-t border-border-subtle">
          {page.sections.map((section) => (
            <section key={section.heading} className="border-b border-border-subtle py-8 sm:py-10">
              <h2 className="text-2xl font-semibold text-text-primary">{section.heading}</h2>
              <div className="mt-4 max-w-prose space-y-4 leading-7 text-text-secondary">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-8 rounded-xl border border-border-strong bg-surface-soft p-5 sm:p-6" aria-label="Professional boundary">
          <h2 className="text-lg font-semibold text-text-primary">A technical aid, not a verification</h2>
          <p className="mt-2 max-w-prose leading-7 text-text-secondary">
            Parcel Plotter does not replace an official survey, title verification, or professional geodetic advice. A plotted shape does not establish title validity or a boundary on the ground.
          </p>
        </aside>

        <nav className="mt-10" aria-label="Related Parcel Plotter guides">
          <h2 className="text-xl font-semibold text-text-primary">Keep reading</h2>
          <ul className="mt-3 space-y-3">
            {page.related.map((item) => (
              <li key={item.slug}><Link className="text-link" to={`/${item.slug}/`}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 rounded-xl border border-border-subtle bg-surface p-5 sm:p-6">
          <p className="text-lg font-semibold text-text-primary">Ready to see the parcel?</p>
          <p className="mt-1 text-text-secondary">Open Parcel Plotter and follow the technical description line by line.</p>
          <a className="interactive-accent mt-4" href={appUrl} target="_blank" rel="noopener noreferrer">
            Try Early Access <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <div className="mt-10 text-sm text-text-secondary">
          <h2 className="font-semibold text-text-primary">Sources and further reading</h2>
          <ul className="mt-2 space-y-2">
            {page.sources.map((source) => (
              <li key={source.url}>
                <a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label}<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
}

export default ParcelPage;
