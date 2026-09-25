import Section from '../components/layout/Section';
import { operatingPrinciples } from '../data/homeContent';

function PrinciplesSection() {
  return (
    <Section id="approach" tone="soft" className="py-14 sm:py-20">
      <p className="section-label">Our approach</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">Four operating principles</h2>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2">
        {operatingPrinciples.map((principle, index) => (
          <li key={principle.title} className="panel p-5 sm:p-6">
            <span className="text-sm font-semibold tabular-nums text-accent">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="mt-2 text-xl font-semibold text-text-primary">{principle.title}</h3>
            <p className="mt-2 leading-7 text-text-secondary">{principle.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export default PrinciplesSection;
