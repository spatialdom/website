import type { PropsWithChildren } from 'react';
import AppShell from '../../components/layout/AppShell';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';

function MainLayout({ children }: PropsWithChildren) {
  return (
    <AppShell>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-surface focus:px-4 focus:py-3 focus:text-text-primary focus:shadow-panel">Skip to content</a>
      <Navbar />
      <div id="main-content" tabIndex={-1}>{children}</div>
      <Footer />
    </AppShell>
  );
}

export default MainLayout;
