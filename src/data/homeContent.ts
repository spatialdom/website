import { inquirySubjects, mailtoFor } from './contact';

export const productPaths = [
  {
    audience: "I own or I'm buying land",
    name: 'Parcel Plotter',
    description: 'Understand the technical description of a land title and see the parcel it describes.',
    action: 'Try Early Access',
    href: 'https://parcel.spatialdom.xyz/',
    external: true
  },
  {
    audience: 'I work with property records in an LGU',
    name: 'SPARTA',
    description: "Build and maintain a parcel and tax mapping system around the real work of the Assessor's Office.",
    action: 'Discuss Tax Mapping',
    href: mailtoFor(inquirySubjects.sparta),
    external: false
  },
  {
    audience: 'I need better household and resident data',
    name: 'RBIM Cloud',
    description: 'Help your LGU maintain local household information for planning, targeting programs, and community services.',
    action: 'Request a Demo',
    href: mailtoFor(inquirySubjects.rbim),
    external: false
  }
] as const;

export const operatingPrinciples = [
  {
    title: 'Spatial first',
    description: 'Start with the places, parcels, and communities the work is about.'
  },
  {
    title: 'Built around real operations',
    description: 'Shape each workflow around the people who use and update the information.'
  },
  {
    title: 'Structured records over disconnected files',
    description: 'Keep the facts and their relationships clear enough to use again.'
  },
  {
    title: 'Designed for continuous updating',
    description: 'Make it practical to keep information useful as things change.'
  }
] as const;

export const insights = [
  {
    title: 'What is a land title technical description?',
    summary: 'A plain-language guide to the measurements and directions that describe a parcel.',
    href: '/insights#land-title-technical-description'
  },
  {
    title: 'What is tax mapping for an LGU?',
    summary: 'How maps and property records can support the day-to-day work of an Assessor’s Office.',
    href: '/insights#lgu-tax-mapping'
  },
  {
    title: 'What is a household information system?',
    summary: 'Why current local records matter for planning and community services.',
    href: '/insights#household-information-system'
  }
] as const;
