import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../../data/siteContent';
import { cn } from '../../lib/cn';
import { fadeUp } from '../../lib/motion';
import { useScrolled } from '../../hooks/useScrolled';
import BrandMark from '../ui/BrandMark';
import IconButton from '../ui/IconButton';
import Container from './Container';

function Navbar() {
  const scrolled = useScrolled(20);
  const reducedMotion = useReducedMotion();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  const getSectionHref = (href: string) => (href.startsWith('#') && !isHome ? `/${href}` : href);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container
        className={cn(
          'mt-4 rounded-xl border px-4 py-3 transition-all duration-500 ease-refined sm:mt-5 sm:px-5',
          scrolled ? 'theme-nav-scrolled' : 'border-transparent bg-transparent'
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-md text-sm font-medium text-text-primary transition-colors duration-300 hover:text-text-strong"
            aria-label="Spatialdom home"
          >
            <BrandMark />
            <span className="text-sm uppercase tracking-[0.18em] text-text-strong">Spatialdom</span>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-7" aria-label="Primary">
              {navItems.map((item) => (
                <Link key={item.href} to={getSectionHref(item.href)} className="nav-link" aria-current={location.pathname === item.href ? 'page' : undefined}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <IconButton
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="relative flex h-4 w-4 flex-col items-center justify-center">
              <span
                className={cn(
                  'absolute h-px w-4 rounded-full bg-current transition-transform duration-300',
                  menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-[4px]'
                )}
              />
              <span
                className={cn(
                  'absolute h-px w-4 rounded-full bg-current transition-opacity duration-300',
                  menuOpen ? 'opacity-0' : 'opacity-100'
                )}
              />
              <span
                className={cn(
                  'absolute h-px w-4 rounded-full bg-current transition-transform duration-300',
                  menuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[4px]'
                )}
              />
            </span>
          </IconButton>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              id="mobile-navigation"
              className="theme-mobile-nav mt-4 grid gap-2 pt-4 md:hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeUp(Boolean(reducedMotion))}
              aria-label="Mobile navigation"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={getSectionHref(item.href)}
                  className="theme-mobile-link px-4 py-3"
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </Container>
    </header>
  );
}

export default Navbar;
