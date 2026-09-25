import { useState } from 'react';
import Section from '../components/layout/Section';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import { contact, trustLine } from '../data/siteContent';

function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section id="contact" className="pb-24 sm:pb-28">
      <div className="contact-frame grid gap-10 py-10 sm:py-12 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <div className="max-w-[220px]">
            <p className="section-label">Contact</p>
            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-text-faint">{contact.label}</p>
            <p className="mt-4 text-sm leading-7 text-text-body">{contact.context}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative pl-0 sm:pl-10" data-cursor="card">
            <div className="mb-8 hidden h-[72px] w-[72px] border-l border-t border-border-subtle sm:block" />
            <a
              href={`mailto:${contact.email}`}
              className="block text-[clamp(1.55rem,3vw,2.45rem)] font-semibold tracking-[-0.06em] text-text-primary transition-colors duration-300 hover:text-text-strong"
              data-cursor="link"
            >
              {contact.email}
            </a>
            <p className="mt-5 max-w-[520px] text-base leading-7 text-text-body">
              For collaborations, systems, and inquiries, a direct line is enough.
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-text-faint">{trustLine}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Button className="max-w-max" onClick={handleCopy}>
                {copied ? 'Email copied' : 'Copy email'}
              </Button>
              <a
                href={contact.github}
                target="_blank"
                rel="noreferrer"
                className="theme-text-link"
                data-cursor="link"
              >
                GitHub
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default ContactSection;
