import { Link } from 'react-router-dom';
import Section from '../components/layout/Section';
import Card from '../components/ui/Card';
import { productPaths } from '../data/homeContent';

function ProductPathsSection() {
  return (
    <Section id="products" tone="soft" className="py-14 sm:py-20">
      <div className="max-w-prose">
        <p className="section-label">Find your path</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          What are you working on?
        </h2>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {productPaths.map((product) => (
          <Card key={product.name} className="flex min-w-0 flex-col p-5 sm:p-6">
            <p className="text-sm font-semibold text-accent">{product.audience}</p>
            <h3 className="mt-4 text-2xl font-semibold text-text-primary">{product.name}</h3>
            <p className="mt-2 leading-7 text-text-secondary">{product.description}</p>
            <a
              href={product.href}
              className="interactive-accent mt-6 self-start"
              {...(product.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {product.action}
              {product.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
            </a>
            {product.name === 'Parcel Plotter' ? (
              <Link className="text-link mt-4 self-start text-sm font-medium" to="/parcel-plotter/">
                Learn about Parcel Plotter
              </Link>
            ) : null}
          </Card>
        ))}
      </div>
    </Section>
  );
}

export default ProductPathsSection;
