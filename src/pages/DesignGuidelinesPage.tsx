import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import content from '../data/designGuidelines.generated.json';
import ComponentExamples from '../components/design/ComponentExamples';
import Button from '../components/ui/Button';
import '../styles/guidelines.css';

const sections = [...content.sections.map(({ id, title }) => ({ id, title })), { id: 'component-reference', title: 'Component reference' }, { id: 'ai-instructions', title: 'AI development instructions' }, { id: 'adoption', title: 'Repository adoption' }];

export default function DesignGuidelinesPage() {
  const [active, setActive] = useState(sections[0].id);
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => {
    let frame = 0;
    const updateActive = () => {
      let current = sections[0].id;
      for (const { id } of sections) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 200) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updateActive); };
    updateActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); };
  }, []);
  const goToSection = (id: string) => {
    window.location.hash = id;
    document.getElementById(id)?.focus({ preventScroll: true });
    setActive(id);
  };
  return <main className="guidelines-page">
    <div className="guide-shell">
      <nav aria-label="Breadcrumb" className="guide-breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>Design</span><span aria-hidden="true">/</span><span aria-current="page">Guidelines</span></nav>
      <header className="guide-header"><p className="guide-eyebrow">Spatialdom design system</p><h1>Design guidelines</h1><p className="guide-lead">The interface disappears.<br />The user’s task remains.</p><p>A shared standard for clear, accountable spatial software. Built for the people working with land, property and communities.</p><div className="guide-meta"><span className="guide-badge">v{content.version}</span><span>{content.status}</span><span>Published <time dateTime="2026-11-14">14 November 2026</time></span></div><div className="guide-resource-links"><a href="/design/GUIDELINES.md">Guidelines ↗</a><a href="/design/COMPONENTS.md">Components ↗</a><a href="/design/tokens.json">Tokens JSON ↗</a><a href="#ai-instructions">For coding agents ↓</a></div></header>
      <div className="guide-layout"><aside className="guide-sidebar"><nav aria-label="Guidelines sections"><p>On this page</p>{sections.map(({ id, title }) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setActive(id)}>{title.replace(/^\d+ · /, '')}</a>)}</nav><a className="guide-back-top" href="#guidelines-top">Back to top ↑</a></aside>
        <div className="guide-reading" id="guidelines-top">
          <div className="guide-mobile-nav"><label htmlFor="guide-section-select">Jump to section</label><select id="guide-section-select" value={active} onChange={event => goToSection(event.target.value)}>{sections.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}</select></div>
          <div className="guide-introduction" dangerouslySetInnerHTML={{ __html: content.introduction }} />
          {content.sections.map(section => <section className="guide-section" key={section.id} id={section.id} tabIndex={-1} aria-labelledby={`${section.id}-heading`}><h2 id={`${section.id}-heading`}><a href={`#${section.id}`}>{section.title}<span className="guide-anchor" aria-hidden="true"> #</span></a></h2><div dangerouslySetInnerHTML={{ __html: section.html }} /></section>)}
          <ComponentExamples />
          <section id="ai-instructions" className="guide-section" tabIndex={-1}><p className="guide-eyebrow">For coding agents</p><h2>AI development instructions</h2><p>Use the approved snippet in a repository’s local AGENTS.md alongside a pinned copy of the complete standard. The public URL is a reference, not a runtime dependency.</p><div className="guide-actions"><Button onClick={async () => { try { await navigator.clipboard.writeText(content.agent); setCopyStatus('Instructions copied.'); } catch { setCopyStatus('Copy unavailable. Select the instructions below or download the Markdown file.'); } }}>Copy instructions</Button><a href="/design/AGENTS_SNIPPET.md">Raw agent instructions</a></div><p role="status" className="guide-status">{copyStatus}</p><pre tabIndex={0} aria-label="Approved agent instructions"><code>{content.agent}</code></pre></section>
          <section id="adoption" className="guide-section" tabIndex={-1}><h2>Repository adoption</h2><p>SPARTA, Parcel Plotter, RBIM Cloud, future products and developer repositories adopt the same standard through a reviewed pull request.</p><ol><li>Copy the four raw reference files into your repository’s <code>docs/design/</code>.</li><li>Pin version <strong>1.2.0</strong>, the source commit and adoption date. Add the agent instructions to your local AGENTS.md.</li><li>Map semantic tokens to your application’s existing roles. Review visual differences and preserve authoritative domain computation.</li><li>Run keyboard, responsive, zoom and domain checks. Record exceptions with rule, reason, impact, owner and review date.</li><li>Review each future upgrade, synchronize all four files and update the local changelog. Applications must not fetch this website at runtime.</li></ol><pre tabIndex={0} aria-label="Adoption record example"><code>{'Guideline version: 1.2.0\nSource: spatialdom/website @ <reviewed commit SHA>\nAdopted: <actual repository adoption date>\nReferences: docs/design/\nExceptions: <decision record or none>'}</code></pre><p><a href="https://github.com/spatialdom/website/tree/master/docs/design">Source files and version history</a> · <a href="/design/source/GUIDELINES.md">Original supplied guidelines</a> · <a href="/design/source/COMPONENTS.md">Supplied SPARTA inventory</a></p></section>
        </div>
      </div>
    </div>
  </main>;
}
