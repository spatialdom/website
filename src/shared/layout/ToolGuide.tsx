import { Link } from 'react-router-dom';
import { getToolPage, type ToolSlug } from '../utils/toolPage';
import { emitToolEvent } from '../utils/toolEvents';

function ToolGuide({ slug }: { slug: Exclude<ToolSlug, 'tools'> }) {
  const page = getToolPage(slug);

  return (
    <aside className="mt-10 grid gap-6 border-t border-border-subtle pt-8 lg:grid-cols-2" aria-label="Tool guidance">
      <section>
        <h2 className="text-xl font-semibold text-text-primary">How to use</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7 text-text-secondary">
          {page.howToUse?.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-text-primary">What the result means</h2>
        <div className="mt-3 space-y-3 leading-7 text-text-secondary">
          {page.meaning?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="mt-5 flex flex-col items-start gap-3 text-sm">
          {page.insight && <Link className="text-link" to={page.insight.href}>{page.insight.label}</Link>}
          {page.product && <Link className="text-link" to={page.product.href} onClick={() => emitToolEvent(slug, 'product_clicked')}>{page.product.label}</Link>}
        </div>
      </section>
    </aside>
  );
}

export default ToolGuide;
