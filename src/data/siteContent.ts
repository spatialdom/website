export type NavItem = {
  label: string;
  href: `#${string}` | '/contact';
};

export const navItems: NavItem[] = [
  { label: 'Products', href: '#products' },
  { label: 'Approach', href: '#approach' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '/contact' }
];
