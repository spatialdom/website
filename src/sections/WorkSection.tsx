import Section from '../components/layout/Section';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import { trustLine, workItems } from '../data/siteContent';

function WorkSection() {
  return (
    <Section id="work">
      <SectionHeading
        eyebrow="Selected Work / Proof"
        title="Selective signals of system-building experience."
        description="Not a gallery. A capability readout oriented around governance, records, workflows, and operational continuity."
      />
      <p className="mt-6 max-w-[640px] text-sm uppercase tracking-[0.2em] text-text-faint">
        {trustLine}
      </p>

      <div className="relative mt-14 pl-8 sm:pl-12">
        <div className="absolute left-0 top-0 h-full w-px bg-border-subtle" />
        {workItems.map((item, index) => (
          <Reveal
            key={item.name}
            as="article"
            delay={index * 0.03}
            className="group relative border-b border-border-subtle py-7 last:border-b-0 sm:py-8"
            data-cursor="card"
          >
            <span className="absolute left-[-2.2rem] top-9 h-3 w-3 rounded-full border border-border-medium bg-background sm:left-[-3.15rem]" />
            <div className="grid gap-5 lg:grid-cols-[88px_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <p className="text-xs uppercase tracking-[0.22em] text-text-faint">
                {String(index + 1).padStart(2, '0')}
              </p>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-text-faint">{item.lens}</p>
                <h3 className="mt-3 text-[1.2rem] font-semibold tracking-[-0.04em] text-text-primary transition-colors duration-300 group-hover:text-text-primary">
                  {item.name}
                </h3>
              </div>
              <p className="max-w-[620px] text-base leading-7 text-text-body transition-colors duration-300 group-hover:text-text-secondary">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export default WorkSection;
