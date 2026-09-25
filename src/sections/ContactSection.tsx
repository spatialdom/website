import Section from '../components/layout/Section';
import { productPaths } from '../data/homeContent';

function ContactSection() {
  return (
    <Section id="contact" tone="soft" className="py-14 sm:py-20">
      <p className="section-label">Contact</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">Tell us what you're working on.</h2>
      <a className="text-link mt-5 inline-block break-all text-xl font-semibold sm:text-2xl" href="mailto:spatialdom@gmail.com">
        spatialdom@gmail.com
      </a>
      <p className="mt-8 text-sm font-medium text-text-secondary">Choose a topic to start the conversation:</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {productPaths.map((product) => (
          <a
            key={product.name}
            className="interactive-outline"
            href={`mailto:spatialdom@gmail.com?subject=${encodeURIComponent(product.name === 'SPARTA' ? 'SPARTA / Tax Mapping' : product.name)}`}
          >
            {product.name === 'SPARTA' ? 'SPARTA / Tax Mapping' : product.name}
          </a>
        ))}
      </div>
    </Section>
  );
}

export default ContactSection;
