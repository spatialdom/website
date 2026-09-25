import Section from '../components/layout/Section';
import ContactContent from '../components/contact/ContactContent';

function ContactSection() {
  return (
    <Section id="contact" tone="soft" className="py-14 sm:py-20">
      <ContactContent />
    </Section>
  );
}

export default ContactSection;
