import type { PropsWithChildren } from 'react';
import AppShell from '../../components/layout/AppShell';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';

function MainLayout({ children }: PropsWithChildren) {
  return (
    <AppShell>
      <Navbar />
      {children}
      <Footer />
    </AppShell>
  );
}

export default MainLayout;
