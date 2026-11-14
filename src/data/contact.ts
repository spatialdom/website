export const contactEmail = 'spatialdom@gmail.com';

export const inquirySubjects = {
  parcel: 'Parcel Plotter — Early Access / Feedback',
  sparta: 'SPARTA — Professional Geodetic Engineering Inquiry',
  rbim: 'RBIM Cloud — Demo Request'
} as const;

export function mailtoFor(subject?: string, body?: string) {
  const query = [subject ? `subject=${encodeURIComponent(subject)}` : '', body ? `body=${encodeURIComponent(body)}` : ''].filter(Boolean).join('&');
  return `mailto:${contactEmail}${query ? `?${query}` : ''}`;
}
