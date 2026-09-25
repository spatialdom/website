import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import pages from '../data/lguProductPages.json';
import { inquirySubjects, mailtoFor } from '../data/contact';

const spartaWorkflow = ['Digitize', 'Reconcile', 'Map', 'Validate', 'Operate', 'Maintain'];
const workflowPrompt = "Please tell us about your current tax maps and property records, what is difficult to reconcile, and what your Assessor's Office wants to improve.";

function LguProductPage({ slug }: { slug: string }) {
  const page = pages.find((item) => item.slug === slug);
  if (!page) return null;

  const isSparta = page.family === 'sparta';
  const productName = isSparta ? 'SPARTA' : 'RBIM Cloud';
  const productHref = isSparta ? '/sparta/' : '/rbim-cloud/';
  const primaryLabel = isSparta ? 'Discuss Tax Mapping' : 'Request a Demo';
  const primaryHref = mailtoFor(isSparta ? inquirySubjects.sparta : inquirySubjects.rbim);
  const related = page.related.map((relatedSlug) => pages.find((item) => item.slug === relatedSlug)).filter((item) => item !== undefined);

  return (
    <main className="pb-16 pt-32 sm:pt-40">
      <Container className="max-w-5xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
          <Link className="text-link" to="/">Home</Link><span aria-hidden="true">/</span>
          {page.kind === 'guide' ? <><Link className="text-link" to={productHref}>{productName}</Link><span aria-hidden="true">/</span></> : null}
          <span aria-current="page">{page.kind === 'product' ? productName : page.heading}</span>
        </nav>

        <header className="mt-8 max-w-3xl">
          <p className="section-label">{page.kind === 'product' ? productName : `${productName} guide`}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-5xl">{page.heading}</h1>
          <p className="mt-5 text-lg leading-8 text-text-secondary">{page.intro}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a className="interactive-accent" href={primaryHref}>{primaryLabel}</a>
            {isSparta && page.kind === 'product' ? (
              <a className="interactive-outline" href={mailtoFor(inquirySubjects.spartaWorkflow, workflowPrompt)}>Share your workflow</a>
            ) : null}
          </div>
        </header>

        {!isSparta ? (
          <aside className="mt-8 max-w-3xl rounded-xl border border-border-strong bg-surface-soft p-5 sm:p-6" aria-label="RBIM system attribution">
            <h2 className="text-lg font-semibold text-text-primary">Who developed the RBIM digital system?</h2>
            <p className="mt-2 leading-7 text-text-secondary">The RBIM digital system was developed through a Commission on Population and Development (CPD) initiative with GIZ assistance. Spatialdom provides cloud deployment, hosting, system administration, maintenance, and implementation support; Spatialdom did not create the RBIM digital system.</p>
          </aside>
        ) : null}

        {isSparta && page.kind === 'product' ? (
          <section className="mt-10" aria-labelledby="sparta-workflow-heading">
            <h2 id="sparta-workflow-heading" className="text-2xl font-semibold text-text-primary">A working sequence for the office</h2>
            <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {spartaWorkflow.map((step, index) => <li key={step} className="panel p-4"><span className="text-sm font-semibold text-accent">{index + 1}</span><span className="mt-2 block font-semibold text-text-primary">{step}</span></li>)}
            </ol>
          </section>
        ) : null}

        <div className="mt-10 max-w-3xl border-t border-border-subtle">
          {page.sections.map((section) => (
            <section key={section.heading} className="border-b border-border-subtle py-8 sm:py-10">
              <h2 className="text-2xl font-semibold text-text-primary">{section.heading}</h2>
              <div className="mt-4 max-w-prose space-y-4 leading-8 text-text-secondary">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>

        {isSparta && page.kind === 'product' ? (
          <aside className="mt-10 max-w-3xl rounded-xl border border-border-strong bg-surface-soft p-5 sm:p-6" aria-label="Assessor's Office discovery">
            <h2 className="text-xl font-semibold text-text-primary">Share your workflow</h2>
            <p className="mt-2 leading-7 text-text-secondary">We are speaking with Assessor's Offices about how tax mapping works in practice. If your LGU is digitizing tax maps, preparing for RPVARA implementation, or working with fragmented property records, we would like to understand your workflow.</p>
            <a className="text-link mt-4 inline-block" href={mailtoFor(inquirySubjects.spartaWorkflow, workflowPrompt)}>Email your current workflow to Spatialdom</a>
          </aside>
        ) : null}

        <aside className="mt-10 max-w-3xl rounded-xl border border-border-strong bg-surface p-5 sm:p-6" aria-label="Contact Spatialdom">
          <h2 className="text-xl font-semibold text-text-primary">{isSparta ? 'Discuss your tax mapping needs' : 'See whether RBIM Cloud fits your LGU'}</h2>
          <p className="mt-2 leading-7 text-text-secondary">Tell us about your current records, staff workflow, and support needs. We will use that context for a focused conversation.</p>
          <a className="interactive-accent mt-4" href={primaryHref}>{primaryLabel}</a>
          <p className="mt-3 text-sm text-text-secondary">Or email <a className="text-link" href="mailto:spatialdom@gmail.com">spatialdom@gmail.com</a>.</p>
        </aside>

        <nav className="mt-10 max-w-3xl" aria-label="Related pages">
          <h2 className="text-xl font-semibold text-text-primary">Keep exploring</h2>
          <ul className="mt-3 space-y-3">
            {related.map((item) => <li key={item.slug}><Link className="text-link" to={`/${item.slug}/`}>{item.heading}</Link></li>)}
            <li><Link className="text-link" to={isSparta ? '/insights/tax-mapping-philippine-lgu/' : '/insights/household-profiling-systems-lgu/'}>Read the related Insight guide</Link></li>
          </ul>
        </nav>

        <div className="mt-10 max-w-3xl text-sm text-text-secondary">
          <h2 className="font-semibold text-text-primary">Sources and further reading</h2>
          <ul className="mt-2 space-y-2">
            {page.sources.map((source) => <li key={source.url}><a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}
          </ul>
        </div>
      </Container>
    </main>
  );
}

export default LguProductPage;
