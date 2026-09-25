import { useEffect } from 'react';
import ContactContent from '../components/contact/ContactContent';
import Container from '../components/layout/Container';

function ContactPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Contact | Spatialdom';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <main className="pb-16 pt-32 sm:pt-40">
      <Container>
        <ContactContent headingLevel="h1" />
      </Container>
    </main>
  );
}

export default ContactPage;
