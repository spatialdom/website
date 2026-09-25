import Container from '../components/layout/Container';
import { contactEmail, mailtoFor } from '../data/contact';

function PrivacyPage() {
  return (
    <main className="pb-16 pt-32 sm:pt-36">
      <Container className="max-w-4xl">
        <section className="panel rounded-xl p-6 sm:p-8 lg:p-10">
          <div className="space-y-8">
            <header className="space-y-4">
              <p className="section-label">Privacy</p>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                  Privacy policy
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-text-body sm:text-base">
                  This site is currently frontend-only. It does not ask users to create accounts, submit personal
                  profiles, or send private information through the site itself.
                </p>
              </div>
            </header>

            <div className="space-y-6 text-sm leading-7 text-text-body sm:text-base">
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-text-primary">Cookies</h2>
                <p>
                  Spatialdom uses cookies or similar browser technologies to support site functionality, remember basic
                  preferences, and help advertising services operate correctly on eligible tool pages.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-text-primary">Google AdSense</h2>
                <p>
                  Spatialdom tools may display ads served through third-party advertising services such as Google
                  AdSense. Those services can use cookies or similar technologies to deliver, personalize, and measure
                  advertising. Advertising helps keep Spatialdom systems running and available to users at no direct
                  monetary cost.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-text-primary">Analytics</h2>
                <p>
                  Spatialdom may also use basic analytics tools to understand site usage, improve performance, and learn
                  which tools are most useful. If analytics are active, they may collect standard usage information such
                  as page views, device context, and interaction patterns.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-text-primary">Contact</h2>
                <p>
                  For privacy-related questions, email{' '}
                  <a className="text-link" href={mailtoFor('Privacy Question')}>
                    {contactEmail}
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}

export default PrivacyPage;
