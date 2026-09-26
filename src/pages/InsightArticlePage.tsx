import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import { publishedInsights as articles } from '../data/insights';
import { readingMinutes } from '../data/readingTime';

function InsightArticlePage({ slug }: { slug: string }) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return null;

  const related = article.related.map((relatedSlug) => articles.find((item) => item.slug === relatedSlug)).filter((item) => item !== undefined);
  const productLink = article.product.href.startsWith('mailto:')
    ? <a className="interactive-accent mt-4" href={article.product.href}>{article.product.label}</a>
    : <Link className="interactive-accent mt-4" to={article.product.href}>{article.product.label}</Link>;

  return (
    <main className="pb-16 pt-32 sm:pt-40">
      <Container className="max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
          <Link className="text-link" to="/">Home</Link><span aria-hidden="true">/</span>
          <Link className="text-link" to="/insights/">Insights</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{article.heading}</span>
        </nav>
        <article>
          <header className="mt-8 max-w-prose">
            <p className="section-label">Spatialdom Insights</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-5xl">{article.heading}</h1>
            <p className="mt-5 text-lg leading-8 text-text-secondary">{article.intro}</p>
            <p className="mt-4 text-sm text-text-secondary">{readingMinutes(article)} min read · Written and reviewed by Spatialdom · Last reviewed: {article.lastReviewed ? new Date(`${article.lastReviewed}T00:00:00Z`).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : 'Date not recorded'}</p>
          </header>
          {article.sections.length >= 5 && <nav aria-label="On this page" className="mt-8 rounded-xl border border-border-subtle bg-surface-soft p-5">
            <h2 className="font-semibold text-text-primary">On this page</h2>
            <ol className="mt-3 space-y-2">
              {article.sections.map((section) => <li key={section.id}><a className="text-link" href={`#${section.id}`}>{section.heading}</a></li>)}
            </ol>
          </nav>}
          <div className="mt-8 border-t border-border-subtle">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32 border-b border-border-subtle py-8 sm:py-10">
                <h2 className="text-2xl font-semibold text-text-primary">{section.heading}</h2>
                <div className="mt-4 max-w-prose space-y-4 leading-8 text-text-secondary">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
          {article.disclaimer && <p className="mt-8 max-w-prose text-sm leading-6 text-text-secondary">{article.disclaimer}</p>}
          <aside className="mt-9 rounded-xl border border-border-strong bg-surface-soft p-5 sm:p-6" aria-label="Related product">
            <h2 className="text-xl font-semibold text-text-primary">Related product: {article.product.name}</h2>
            <p className="mt-2 max-w-prose leading-7 text-text-secondary">If this is part of your ongoing work, see how Spatialdom supports the workflow.</p>
            {productLink}
          </aside>
          <nav className="mt-10" aria-label="Related articles">
            <h2 className="text-xl font-semibold text-text-primary">Keep reading</h2>
            <ul className="mt-3 space-y-3">
              {related.map((item) => <li key={item.slug}><Link className="text-link" to={`/insights/${item.slug}/`}>{item.heading}</Link></li>)}
            </ul>
          </nav>
          <div className="mt-10 text-sm text-text-secondary">
            <h2 className="font-semibold text-text-primary">Sources and further reading</h2>
            <ul className="mt-2 space-y-2">
              {article.sources.map((source) => <li key={source.url}><a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}
            </ul>
          </div>
        </article>
      </Container>
    </main>
  );
}

export default InsightArticlePage;
