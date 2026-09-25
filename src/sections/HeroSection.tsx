import Container from '../components/layout/Container';

function HeroSection() {
  return (
    <section id="hero" className="pt-32 pb-12 sm:pt-40 sm:pb-20">
      <Container>
        <div className="max-w-[820px]">
          <p className="section-label">Spatialdom</p>
          <h1 className="mt-5 text-[clamp(2.7rem,7vw,5rem)] font-bold leading-[1.02] tracking-[-0.055em] text-text-primary">
            Spatial systems for land, property, and communities.
          </h1>
          <p className="mt-6 max-w-[680px] text-lg leading-8 text-text-secondary sm:text-xl">
            We build practical geospatial tools that help people understand property and help local governments understand the places and communities they manage.
          </p>
          <p className="mt-5 text-base font-semibold text-text-primary">Everything happens somewhere.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#products" className="interactive-accent">Explore products</a>
            <a href="#contact" className="interactive-outline">Talk to Spatialdom</a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
