import Section from '../components/layout/Section';

function DefinitionSection() {
  return (
    <Section id="definition" className="py-14 sm:py-20">
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
        <div>
          <p className="text-2xl font-semibold text-text-primary">spa·tial·dom</p>
          <p className="mt-1 text-sm text-text-secondary">/ˈspā-shəl-dəm/</p>
          <p className="mt-2 text-sm italic text-text-secondary">noun</p>
        </div>
        <div className="max-w-[620px]">
          <h2 className="text-2xl font-semibold leading-snug text-text-primary sm:text-3xl">
            The domain of systems, decisions, and intelligence grounded in space.
          </h2>
          <p className="mt-4 text-base font-medium text-text-secondary">Everything happens somewhere.</p>
        </div>
      </div>
    </Section>
  );
}

export default DefinitionSection;
