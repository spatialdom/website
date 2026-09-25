import ContactSection from '../sections/ContactSection';
import DefinitionSection from '../sections/DefinitionSection';
import HeroSection from '../sections/HeroSection';
import InsightsSection from '../sections/InsightsSection';
import PrinciplesSection from '../sections/PrinciplesSection';
import ProductPathsSection from '../sections/ProductPathsSection';

// First thought: Spatialdom builds practical spatial systems for land, property, and communities.
// First action: identify the product path that matches the visitor's problem.
function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProductPathsSection />
      <DefinitionSection />
      <PrinciplesSection />
      <InsightsSection />
      <ContactSection />
    </main>
  );
}

export default HomePage;
