import { Link } from 'react-router-dom';
import Container from './Container';
import logoWordmark from '../../assets/logo_transparent.png';

function Footer() {
  return (
    <footer className="border-t border-border-subtle py-8">
      <Container className="flex flex-col gap-3 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="Spatialdom home" className="inline-flex shrink-0">
            <img src={logoWordmark} alt="" aria-hidden="true" width="112" height="112" loading="lazy" className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
          </Link>
          <p>Spatialdom {'\u00A9'} 2026</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p>Everything happens somewhere.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/parcel-plotter/" className="theme-text-link">
              Parcel Plotter
            </Link>
            <Link to="/sparta/" className="theme-text-link">SPARTA</Link>
            <Link to="/rbim-cloud/" className="theme-text-link">RBIM Cloud</Link>
            <Link to="/contact" className="theme-text-link">
              Contact
            </Link>
            <Link to="/tools" className="theme-text-link">
              Tools
            </Link>
            <Link to="/privacy" className="theme-text-link">
              Privacy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
