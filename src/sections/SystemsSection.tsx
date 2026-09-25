import { motion, useReducedMotion } from 'framer-motion';
import Section from '../components/layout/Section';
import SectionHeading from '../components/ui/SectionHeading';
import { systems, systemsIntro } from '../data/siteContent';
import { cn } from '../lib/cn';
import { fadeUp, staggerContainer } from '../lib/motion';

function SystemsSection() {
  const reducedMotion = useReducedMotion();
  const primarySystems = systems.filter((system) => system.emphasis === 'primary');
  const secondarySystems = systems.filter((system) => system.emphasis === 'secondary');

  return (
    <Section id="systems" tone="elevated">
      <SectionHeading
        eyebrow="Systems / Product Lines"
        title="A domain architecture, not a list of products."
        description="The structure spans public taxation systems, parcel intelligence, private asset records, surveying operations, and training."
      />
      <p className="mt-6 max-w-[720px] text-base leading-7 text-text-body sm:text-lg">
        {systemsIntro}
      </p>

      <div className="relative mt-14">
        <div className="pointer-events-none absolute inset-x-0 top-[7.5rem] hidden h-[31rem] xl:block">
          <svg className="h-full w-full" viewBox="0 0 1100 500" fill="none" aria-hidden="true">
            <path d="M206 78H544" stroke="var(--motif-line-1)" />
            <path d="M544 78H872" stroke="var(--motif-line-1)" />
            <path d="M544 78V246" stroke="var(--motif-line-2)" />
            <path d="M544 246H224" stroke="var(--motif-line-3)" />
            <path d="M544 246H864" stroke="var(--motif-line-3)" />
            <circle cx="544" cy="78" r="4" fill="var(--motif-dot-2)" />
            <circle cx="224" cy="246" r="3.5" fill="var(--motif-dot-1)" />
            <circle cx="544" cy="246" r="3.5" fill="var(--motif-dot-1)" />
            <circle cx="864" cy="246" r="3.5" fill="var(--motif-dot-1)" />
          </svg>
        </div>

        <motion.div
          className="grid gap-4 xl:grid-cols-12"
          variants={staggerContainer(Boolean(reducedMotion), 0.1, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {primarySystems.map((system, index) => (
            <motion.article
              key={system.name}
              data-cursor="card"
              variants={fadeUp(Boolean(reducedMotion), index * 0.04)}
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      scale: 1.015,
                      borderColor: 'var(--color-border-hover)',
                      backgroundColor: 'var(--color-surface-hover)'
                    }
              }
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'system-node min-h-[18rem] rounded-xl px-6 pb-7 pt-10 sm:px-7 xl:col-span-6',
                index === 1 && 'xl:translate-y-10'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label">{system.category}</p>
                  <h3 className="mt-5 max-w-[18rem] text-[clamp(1.5rem,2.3vw,2rem)] font-semibold tracking-[-0.05em] text-text-primary">
                    {system.name}
                  </h3>
                </div>
                <p className="text-sm uppercase tracking-[0.22em] text-text-faint">{system.code}</p>
              </div>
              <p className="mt-8 max-w-[30rem] text-base leading-7 text-text-body">{system.description}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="mt-4 grid gap-4 md:grid-cols-2 xl:mt-12 xl:grid-cols-12"
          variants={staggerContainer(Boolean(reducedMotion), 0.1, 0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {secondarySystems.map((system, index) => (
            <motion.article
              key={system.name}
              data-cursor="card"
              variants={fadeUp(Boolean(reducedMotion), index * 0.04)}
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      scale: 1.015,
                      borderColor: 'var(--color-border-hover)',
                      backgroundColor: 'var(--color-surface-hover)'
                    }
              }
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'system-node rounded-xl px-5 pb-6 pt-9 sm:px-6 xl:col-span-4',
                index === 1 && 'xl:translate-y-8'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label">{system.category}</p>
                  <h3 className="mt-4 text-[1.32rem] font-semibold tracking-[-0.04em] text-text-primary">
                    {system.name}
                  </h3>
                </div>
                <p className="text-xs uppercase tracking-[0.22em] text-text-faint">{system.code}</p>
              </div>
              <p className="mt-6 text-base leading-7 text-text-body">{system.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

export default SystemsSection;
