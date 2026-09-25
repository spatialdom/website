import { Link } from 'react-router-dom';
import Section from '../components/layout/Section';
import { insights } from '../data/homeContent';

function InsightsSection() {
  return (
    <Section id="insights" className="py-14 sm:py-20">
      <p className="section-label">Insights</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">Useful starting points</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {insights.map((insight) => (
          <article key={insight.href} className="panel flex flex-col p-5 sm:p-6">
            <h3 className="text-xl font-semibold text-text-primary">{insight.title}</h3>
            <p className="mt-3 flex-1 leading-7 text-text-secondary">{insight.summary}</p>
            <Link className="text-link mt-5 self-start font-medium" to={insight.href}>Read article</Link>
          </article>
        ))}
      </div>
    </Section>
  );
}

export default InsightsSection;
