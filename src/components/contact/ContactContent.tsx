import { useState } from 'react';
import { contactEmail, inquirySubjects, mailtoFor } from '../../data/contact';
import Button from '../ui/Button';

const inquiryOptions = [
  {
    name: 'Parcel Plotter',
    description: 'Early access or feedback about plotting a parcel.',
    action: 'Ask about Early Access',
    subject: inquirySubjects.parcel
  },
  {
    name: 'SPARTA / Tax Mapping',
    description: "Tax mapping and Assessor's Office workflows.",
    action: 'Discuss Tax Mapping',
    subject: inquirySubjects.sparta
  },
  {
    name: 'RBIM Cloud',
    description: 'A demo or deployment discussion for household data.',
    action: 'Request a Demo',
    subject: inquirySubjects.rbim
  }
] as const;

type ContactContentProps = { headingLevel?: 'h1' | 'h2' };

function ContactContent({ headingLevel = 'h2' }: ContactContentProps) {
  const Heading = headingLevel;
  const Subheading = headingLevel === 'h1' ? 'h2' : 'h3';
  const ProductHeading = headingLevel === 'h1' ? 'h3' : 'h4';
  const [copyStatus, setCopyStatus] = useState('');

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopyStatus('Email address copied.');
    } catch {
      setCopyStatus('Could not copy. You can select the address above.');
    }
  };

  return (
    <div>
      <p className="section-label">Contact</p>
      <Heading className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        Tell us what you're working on.
      </Heading>
      <p className="mt-4 max-w-prose leading-7 text-text-secondary">
        Contact Spatialdom about Parcel Plotter early access or feedback, SPARTA tax mapping, or an RBIM Cloud demo.
      </p>

      <div className="mt-8 border-t border-border-subtle pt-6">
        <Subheading className="text-lg font-semibold text-text-primary">General inquiry</Subheading>
        <a className="text-link mt-2 inline-block break-all text-xl font-semibold sm:text-2xl" href={mailtoFor()}>
          {contactEmail}
        </a>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={copyEmail}>Copy email address</Button>
          <p role="status" className="text-sm text-text-secondary">{copyStatus}</p>
        </div>
      </div>

      <div className="mt-10">
        <Subheading className="text-lg font-semibold text-text-primary">Product inquiries</Subheading>
        <p className="mt-1 text-sm text-text-secondary">Choose a topic to start an email with a useful subject line.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {inquiryOptions.map((option) => (
            <article key={option.name} className="panel flex flex-col p-5">
              <ProductHeading className="text-lg font-semibold text-text-primary">{option.name}</ProductHeading>
              <p className="mt-2 flex-1 leading-6 text-text-secondary">{option.description}</p>
              <a className="interactive-accent mt-5 self-start" href={mailtoFor(option.subject)}>
                {option.action}
              </a>
              {option.name === 'SPARTA / Tax Mapping' ? (
                <a className="text-link mt-4 self-start text-sm" href={mailtoFor(inquirySubjects.spartaWorkflow)}>
                  Discuss an Assessor's Office workflow
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactContent;
