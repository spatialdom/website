import { motion, useReducedMotion } from 'framer-motion';
import Container from '../components/layout/Container';
import SpatialField from '../components/ui/SpatialField';
import { hero } from '../data/siteContent';
import { fadeUp, staggerContainer } from '../lib/motion';

function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36"
    >
      <SpatialField />
      <Container className="relative">
        <motion.div
          className="relative mx-auto max-w-[960px]"
          variants={staggerContainer(Boolean(reducedMotion), 0.14, 0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp(Boolean(reducedMotion))}
            className="inline-flex max-w-max rounded-full border border-border-strong bg-surface-soft px-4 py-2 text-[0.72rem] uppercase tracking-[0.24em] text-text-subtle sm:px-5"
          >
            {hero.label}
          </motion.p>

          <motion.p
            variants={fadeUp(Boolean(reducedMotion), 0.04)}
            className="mt-8 max-w-[720px] text-[clamp(3rem,8vw,6.2rem)] font-bold leading-[0.92] tracking-[-0.085em] text-text-primary"
          >
            {hero.lead}
          </motion.p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[170px_minmax(0,1fr)] lg:items-start lg:gap-10">
            <motion.div
              variants={fadeUp(Boolean(reducedMotion), 0.08)}
              className="border-l border-border-subtle pl-4 lg:border-l-0 lg:pl-0"
            >
              <p className="text-sm uppercase tracking-[0.22em] text-text-strong">{hero.title}</p>
              <p className="mt-4 max-w-[150px] text-sm leading-6 text-text-body">
                Geospatial systems architecture and record infrastructure.
              </p>
            </motion.div>

            <motion.div variants={fadeUp(Boolean(reducedMotion), 0.1)} className="max-w-[620px]">
              <p className="text-[clamp(1.125rem,2.5vw,1.45rem)] leading-[1.45] text-text-secondary">
                {hero.primaryLine}
              </p>
              <p className="mt-5 max-w-[540px] text-sm uppercase tracking-[0.2em] text-text-faint sm:text-[0.8rem]">
                {hero.secondaryLine}
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp(Boolean(reducedMotion), 0.14)}
            className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8"
          >
            <a href="#systems" className="interactive-accent" data-cursor="link">
              Enter the domain
            </a>
            <a href="#contact" className="theme-text-link" data-cursor="link">
              Direct line
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp(Boolean(reducedMotion), 0.18)}
            className="mt-16 grid max-w-[760px] gap-4 border-t border-border-subtle pt-5 sm:grid-cols-3"
          >
            {hero.signals.map((signal) => (
              <div key={signal} className="border-t border-border-subtle pt-4 sm:border-t-0 sm:pt-0">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-text-faint">Signal</p>
                <p className="mt-3 text-base font-medium leading-6 text-text-secondary">{signal}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

export default HeroSection;
