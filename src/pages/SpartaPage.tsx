import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import { inquirySubjects, mailtoFor } from '../data/contact';

export default function SpartaPage() {
  return <main className="pb-16 pt-32 sm:pt-40"><Container className="max-w-5xl">
    <nav aria-label="Breadcrumb" className="text-sm"><Link className="text-link" to="/">Home</Link> / <span aria-current="page">SPARTA</span></nav>
    <header className="mt-8 max-w-3xl"><p className="section-label">SPARTA</p><h1 className="mt-3 text-3xl font-semibold sm:text-5xl">Professional Geodetic Engineering workspace.</h1><p className="mt-5 text-lg leading-8 text-text-secondary">SPARTA brings projects, survey workflows and professional deliverables into a task-focused professional Geodetic Engineering workspace.</p><a className="interactive-accent mt-6" href={mailtoFor(inquirySubjects.sparta)}>Ask about SPARTA</a></header>
    <section className="mt-12 max-w-3xl border-t border-border-subtle pt-8"><h2 className="text-2xl font-semibold">Built around professional work</h2><p className="mt-4 leading-8 text-text-secondary">Relocation, as-built and topographic survey workflows require traceable source records, clear assumptions, professional review and accountable deliverables. Software outputs do not replace verification by a licensed Geodetic Engineer or an authorized agency.</p></section>
    <aside className="panel mt-10 max-w-3xl p-6"><h2 className="text-xl font-semibold">Looking for LGU tax mapping?</h2><p className="mt-3 leading-7 text-text-secondary">Kadastra is the future LGU tax-mapping and property-assessment platform. Coming soon. Development deferred until after SMACCs.</p><div className="mt-4 flex flex-wrap gap-4"><Link className="text-link" to="/kadastra/">View Kadastra status</Link><Link className="text-link" to="/tax-mapping-system-philippines/">Read the tax-mapping guide</Link></div></aside>
  </Container></main>;
}
