import { useRef, useState } from 'react';
import Button from '../ui/Button';
import content from '../../data/designGuidelines.generated.json';

export default function ComponentExamples() {
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState(0);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const tabs = ['Overview', 'Source records'];
  const colors = [
    ['Canvas', content.tokens.color.canvas], ['Surface', content.tokens.color.surface],
    ['Primary action', content.tokens.color.action.primary], ['Primary text', content.tokens.color.text.primary],
    ['Success', content.tokens.color.status.success], ['Warning', content.tokens.color.status.warning], ['Danger', content.tokens.color.status.danger]
  ];
  return <section id="component-reference" className="guide-section" tabIndex={-1} aria-labelledby="components-heading">
    <p className="guide-eyebrow">In practice</p><h2 id="components-heading">Component reference</h2>
    <p>Interactive documentation examples with synthetic data. These controls change this example only; they do not save projects or establish professional approval.</p>
    <p><a href="/design/COMPONENTS.md">Read the component contracts (Markdown)</a></p>
    <div className="guide-example">
      <h3>Buttons and actions</h3><p>One primary action, precise labels, and a minimum 44px touch area at both sizes.</p>
      <div className="guide-actions">
        <Button onClick={() => { setSaved(true); setMessage('Example project saved in this page only.'); }}>Save example</Button>
        <Button variant="secondary" onClick={() => { setTab(1); setMessage('Source records selected in the example tabs below.'); }}>View source records</Button>
        <button className="guide-tertiary" onClick={() => { setSaved(false); setMessage('Example reset.'); }}>Reset example</button>
      </div>
      <div className="guide-actions"><Button className="guide-small" variant="secondary" onClick={() => setMessage('Small example button activated.')}>Small action</Button><Button disabled>Export example (unavailable)</Button></div>
      <p role="status" className="guide-status">{message || 'Ready to try the example.'}</p>
    </div>
    <div className="guide-example">
      <h3>Inputs, selects and validation</h3>
      <form noValidate onSubmit={event => { event.preventDefault(); const invalid = !field.current?.value.trim(); setError(invalid); if (invalid) field.current?.focus(); else setMessage('Example input accepted. Your text remains in the field.'); }}>
        <div className="guide-form-grid"><div><label htmlFor="example-project">Project name</label><input ref={field} id="example-project" name="project" required aria-invalid={error} aria-describedby={`example-project-hint${error ? ' example-project-error' : ''}`} placeholder="Example relocation survey" onChange={() => setError(false)} />
        <p id="example-project-hint">Synthetic example. Your input stays on this page.</p>{error && <p id="example-project-error" className="guide-error">Enter a project name. Your other inputs are preserved.</p>}</div>
        <div><label htmlFor="example-survey">Survey type</label><select id="example-survey" defaultValue="relocation"><option value="relocation">Relocation survey</option><option value="as-built">As-built survey</option><option value="topographic">Topographic survey</option></select></div></div>
        <Button type="submit" variant="secondary">Validate example</Button>
      </form>
    </div>
    <div className="guide-example">
      <h3>Panels, tabs and status</h3>
      <div role="tablist" aria-label="Example record views" className="guide-tabs">{tabs.map((label, index) => <button key={label} id={`example-tab-${index}`} role="tab" aria-selected={tab === index} aria-controls={`example-panel-${index}`} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={event => {
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : event.key === 'ArrowRight' || event.key === 'ArrowLeft' ? 1 - index : null;
        if (next !== null) { event.preventDefault(); setTab(next); document.getElementById(`example-tab-${next}`)?.focus(); }
      }}>{label}</button>)}</div>
      {tabs.map((_, index) => <div key={index} id={`example-panel-${index}`} role="tabpanel" aria-labelledby={`example-tab-${index}`} tabIndex={0} hidden={tab !== index} className="guide-panel">
        <h4>{index === 0 ? 'Example parcel record' : 'Document-stated measurements'}</h4>
        <p>{index === 0 ? 'Computed area: 598.7 m². Declared area: 600 m². This local plot has no geographic reference.' : 'Source: synthetic technical description. No CRS, datum or tie point has been established.'}</p>
        <span className="guide-badge">{saved ? 'Saved in example' : 'Draft'}</span> <span className="guide-badge guide-warning">Needs review</span>
      </div>)}
      <aside className="guide-alert"><strong>Local plot only</strong><p>Add a valid geographic reference before using map exports. Mathematical closure does not establish ownership or a legal boundary.</p></aside>
    </div>
    <div className="guide-example"><h3>Tables and measurements</h3><div className="guide-table-scroll" role="region" aria-label="Example course table" tabIndex={0}><table><caption>Synthetic courses — technical aid only</caption><thead><tr><th scope="col">Course</th><th scope="col">Bearing</th><th scope="col" className="guide-number">Distance</th><th scope="col">Source state</th></tr></thead><tbody><tr><th scope="row">1–2</th><td>N 30° 15′ E</td><td className="guide-number">24.15 m</td><td>Document-stated</td></tr><tr><th scope="row">2–3</th><td>S 59° 45′ E</td><td className="guide-number">25.00 m</td><td>Document-stated</td></tr></tbody></table></div></div>
    <div className="guide-example"><h3>Dialogs and destructive actions</h3><p>A native modal contains focus, supports Escape and returns focus to its opener.</p><button ref={opener} type="button" className="button button-danger" onClick={() => dialog.current?.showModal()}>Delete example record</button>
      <dialog ref={dialog} className="guide-dialog" aria-labelledby="example-dialog-heading" aria-describedby="example-dialog-description" onClose={() => opener.current?.focus()} onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }}>
        <h3 id="example-dialog-heading">Delete this example record?</h3><p id="example-dialog-description">This is a demonstration. No product records will be changed.</p><div className="guide-actions"><Button variant="secondary" autoFocus onClick={() => dialog.current?.close()}>Keep example</Button><Button variant="danger" onClick={() => { dialog.current?.close(); setMessage('Example deletion confirmed. No product data was changed.'); }}>Delete example</Button></div>
      </dialog>
    </div>
    <div className="guide-example"><h3>Typography and outline icons</h3><p className="guide-type-sample">Clear information. Confident decisions.</p><p>Source Sans 3 · Body 400 · Labels 500 · Headings 600 · Sentence case</p><div className="guide-actions">{['Document', 'Add course', 'Reviewed'].map((label, index) => <span className="guide-icon-example" key={label}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">{index === 0 ? <><path d="M14 3H5v18h14V8z"/><path d="M14 3v5h5M8 12h8M8 16h5"/></> : index === 1 ? <path d="M12 5v14M5 12h14"/> : <path d="m5 12 4 4L19 6"/>}</svg>{label}</span>)}</div></div>
    <div className="guide-example"><h3>Color and spacing tokens</h3><p>Reference values from the versioned token manifest. Existing product mappings require review.</p><div className="guide-swatches">{colors.map(([label, value]) => <div key={label}><span className="guide-swatch" style={{ backgroundColor: value }} /><strong>{label}</strong><code>{value}</code></div>)}</div><div className="guide-spacing">{content.tokens.spacePx.map(value => <div key={value}><span style={{ width: value }} /><code>{value}px</code></div>)}</div></div>
  </section>;
}
