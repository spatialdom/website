import ContactContent from '../components/contact/ContactContent';
import Container from '../components/layout/Container';

function ContactPage() {
  return (
    <main className="pb-16 pt-32 sm:pt-40">
      <Container>
        <ContactContent headingLevel="h1" />
      </Container>
    </main>
  );
}

export default ContactPage;
