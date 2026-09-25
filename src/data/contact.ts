export const contactEmail = 'spatialdom@gmail.com';

export const inquirySubjects = {
  parcel: 'Parcel Plotter — Early Access / Feedback',
  sparta: 'SPARTA — Tax Mapping Discussion',
  spartaWorkflow: "SPARTA — Assessor's Office Workflow Discussion",
  rbim: 'RBIM Cloud — Demo Request'
} as const;

export function mailtoFor(subject?: string) {
  return `mailto:${contactEmail}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}
