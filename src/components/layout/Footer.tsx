import { Link } from 'react-router-dom';
import Container from './Container';

function Footer() {
  return (
    <footer className="border-t border-border-subtle py-8">
      <Container className="flex flex-col gap-3 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Spatialdom {'\u00A9'} 2026
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p>Everything happens somewhere.</p>
          <div className="flex items-center gap-4">
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
