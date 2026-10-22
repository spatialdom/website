import { useEffect, useState } from 'react';
import type { InsightArticle } from '../data/insights';
import { InsightArticleContent } from './InsightArticlePage';
import clusters from '../data/insightClusters.json';

type ReviewEntry = { slug: string; draft: InsightArticle; revision: string; editable: boolean; rewrite: boolean; approved: boolean };
const fieldClass = 'mt-1 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-text-primary';
const buttonClass = 'rounded-md border border-border-strong bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-soft disabled:opacity-50';

function TextField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="block text-sm font-semibold">{label}{multiline
    ? <textarea className={fieldClass} rows={Math.min(16, Math.max(3, value.split('\n').length + 1))} value={value} onChange={(event) => onChange(event.target.value)} />
    : <input className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

export default function InsightsReviewPage() {
  const [entries, setEntries] = useState<ReviewEntry[]>([]);
  const [token, setToken] = useState('');
  const [selected, setSelected] = useState('');
  const [draft, setDraft] = useState<InsightArticle | null>(null);
  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const entry = entries.find((item) => item.slug === selected);
  const dirty = Boolean(entry && draft && JSON.stringify(entry.draft) !== JSON.stringify(draft));
  const pending = entries.filter((item) => item.editable && !item.approved).length;
  const approved = entries.filter((item) => item.approved).length;

  async function reload() {
    setError('');
    try {
      const response = await fetch('/__insights-review/');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const items: ReviewEntry[] = data.articles.sort((a: ReviewEntry, b: ReviewEntry) => a.draft.heading.localeCompare(b.draft.heading));
      setEntries(items);
      setToken(data.token);
      setSelected('');
      setDraft(null);
      setEditing(false);
      setMessage('');
      setLoaded(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load drafts.'); }
  }
  useEffect(() => { void reload(); }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function mayLeave() { return !dirty || window.confirm('Discard your unsaved edits?'); }
  function select(item: ReviewEntry) {
    if (busy || !mayLeave()) return;
    setSelected(item.slug);
    setDraft(structuredClone(item.draft));
    setEditing(false);
    setError('');
    setMessage('');
  }
  function change(patch: Partial<InsightArticle>) { setDraft((current) => current ? { ...current, ...patch } : current); }
  async function save(action: 'save' | 'approve' | 'revoke') {
    if (!entry || !draft || busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch(`/__insights-review/${entry.slug}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Review-Token': token },
        body: JSON.stringify({ revision: entry.revision, action, ...(action === 'save' ? { draft } : {}) })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setEntries((items) => items.map((item) => item.slug === result.slug ? result : item));
      setDraft(structuredClone(result.draft));
      setEditing(false);
      setMessage(action === 'approve' ? 'Approved and saved. Commit and merge this version to put it in the publishing queue.' : action === 'revoke' ? 'Returned to review.' : 'Edits saved. Preview this version, then approve when ready.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save.'); }
    finally { setBusy(false); }
  }
  const visible = entries.filter((item) => (filter === 'all' ? item.editable : filter === 'review' ? item.editable && !item.approved : filter === 'approved' ? item.approved : !item.editable)
    && `${item.draft.heading} ${item.slug}`.toLowerCase().includes(search.toLowerCase()));

  return <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-28 sm:px-8 sm:pt-36" onClickCapture={(event) => {
    if (dirty && event.target instanceof Element && event.target.closest('a[href]') && !mayLeave()) { event.preventDefault(); event.stopPropagation(); }
  }}>
    <header className="mb-8">
      <p className="section-label">Local workspace</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Insights review</h1>
      <p className="mt-3 text-text-secondary">Your drafts are ready. Read, edit, and approve here. Changes save to this checkout; commit and merge when ready.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-accent-soft px-3 py-1">{pending} awaiting review</span>
        <span className="rounded-full bg-accent-soft px-3 py-1">{approved} approved</span>
        <span className="text-text-secondary">Approval queues publication; it does not publish immediately.</span>
        <button className={buttonClass} disabled={busy} onClick={() => { if (mayLeave()) void reload(); }}>Reload from disk</button>
      </div>
    </header>
    {error && <p role="alert" className="mb-4 rounded-lg border border-border-strong bg-surface p-4 text-[var(--color-danger)]">{error}</p>}
    {message && <p role="status" className="mb-4 rounded-lg bg-[var(--color-success-soft)] p-4 text-[var(--color-success)]">{message}</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-border-subtle bg-surface p-4 lg:sticky lg:top-24">
        <label className="text-sm font-semibold">Find a draft<input className={fieldClass} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles" /></label>
        <label className="mt-3 block text-sm font-semibold">Show<select className={fieldClass} value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All drafts</option><option value="review">Awaiting review</option><option value="approved">Approved</option><option value="published">Published without drafts</option>
        </select></label>
        <ul className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto">
          {visible.map((item) => <li key={item.slug}><button disabled={busy} onClick={() => select(item)} aria-current={item.slug === selected ? 'true' : undefined} className={`w-full rounded-lg border p-3 text-left hover:bg-surface-soft ${item.slug === selected ? 'border-accent bg-accent-soft' : 'border-border-subtle'}`}>
            <span className="block font-semibold leading-5">{item.draft.heading}</span>
            <span className="mt-2 block text-xs text-text-secondary">{!item.editable ? 'Published' : item.approved ? 'Approved' : 'Awaiting review'}{item.rewrite ? ' · Rewrite' : ''}</span>
          </button></li>)}
        </ul>
        {!visible.length && <p className="mt-4 text-sm text-text-secondary">{loaded ? 'No articles match this view.' : 'Loading drafts…'}</p>}
      </aside>
      {!entry || !draft ? <div className="rounded-xl border border-dashed border-border-strong p-12 text-center text-text-secondary">Select an article to review its finished page.</div> : <section className="min-w-0">
        <div className="sticky top-20 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-border-strong bg-surface p-3 shadow-sm">
          <button className={buttonClass} aria-pressed={!editing} onClick={() => setEditing(false)}>Preview{dirty ? ' unsaved edits' : ''}</button>
          {entry.editable && <>
            <button className={buttonClass} aria-pressed={editing} disabled={busy} onClick={() => setEditing(true)}>Edit</button>
            {dirty && <button className={buttonClass} disabled={busy} onClick={() => void save('save')}>Save edits</button>}
            <button className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || dirty || entry.approved || editing} onClick={() => void save('approve')}>{busy ? 'Saving…' : entry.approved ? 'Approved' : 'Approve for publication'}</button>
            {entry.approved && <button className={buttonClass} disabled={busy || dirty} onClick={() => void save('revoke')}>Return to review</button>}
          </>}
          {dirty && <span className="text-sm text-text-secondary">Unsaved · save and preview before approval</span>}
        </div>
        {draft.reviewerNotes?.length ? <details className="mt-4 rounded-xl border border-border-subtle bg-surface p-4"><summary className="cursor-pointer font-semibold">Reviewer notes ({draft.reviewerNotes.length})</summary><ul className="mt-3 list-disc space-y-2 pl-5 text-text-secondary">{draft.reviewerNotes.map((note, index) => <li key={index}>{note}</li>)}</ul></details> : null}
        {entry.approved && <p className="mt-3 text-sm text-text-secondary">Approved {draft.reviewApproval?.approvedAt ? new Date(draft.reviewApproval.approvedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) : ''}. Editing this version returns it to review.</p>}
        {editing ? <fieldset disabled={busy} className="mt-4 space-y-6 rounded-xl border border-border-subtle bg-surface p-5 sm:p-8">
          <legend className="sr-only">Edit article</legend>
          <TextField label="Article title" value={draft.heading} onChange={(heading) => change({ heading })} />
          <TextField label="Introduction" multiline value={draft.intro} onChange={(intro) => change({ intro })} />
          {draft.sections.map((section, index) => <div key={index} className="space-y-3 rounded-lg border border-border-subtle p-4">
            <TextField label={`Section ${index + 1} heading`} value={section.heading} onChange={(heading) => change({ sections: draft.sections.map((s, i) => i === index ? { ...s, heading } : s) })} />
            <TextField label="Section ID (used in links)" value={section.id} onChange={(id) => change({ sections: draft.sections.map((s, i) => i === index ? { ...s, id } : s) })} />
            <TextField label="Paragraphs (separate with a blank line)" multiline value={section.paragraphs.join('\n\n')} onChange={(text) => change({ sections: draft.sections.map((s, i) => i === index ? { ...s, paragraphs: text.split(/\n\s*\n/) } : s) })} />
            <div className="flex gap-2">
              <button className={buttonClass} disabled={index === 0} onClick={() => { const sections = [...draft.sections]; [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]]; change({ sections }); }}>Move up</button>
              <button className={buttonClass} disabled={draft.sections.length === 1} onClick={() => change({ sections: draft.sections.filter((_, i) => i !== index) })}>Remove section</button>
            </div>
          </div>)}
          <button className={buttonClass} onClick={() => change({ sections: [...draft.sections, { id: `section-${Date.now()}`, heading: '', paragraphs: [''] }] })}>Add section</button>
          <TextField label="Disclaimer" multiline value={draft.disclaimer ?? ''} onChange={(disclaimer) => change({ disclaimer })} />
          <h2 className="text-xl font-semibold">Sources</h2>
          {draft.sources.map((source, index) => <div key={index} className="space-y-3 rounded-lg border border-border-subtle p-4">
            <TextField label="Source name" value={source.label} onChange={(label) => change({ sources: draft.sources.map((s, i) => i === index ? { ...s, label } : s) })} />
            <TextField label="Source URL" value={source.url} onChange={(url) => change({ sources: draft.sources.map((s, i) => i === index ? { ...s, url } : s) })} />
            <button className={buttonClass} onClick={() => change({ sources: draft.sources.filter((_, i) => i !== index) })}>Remove source</button>
          </div>)}
          <button className={buttonClass} onClick={() => change({ sources: [...draft.sources, { label: '', url: '' }] })}>Add source</button>
          <h2 className="text-xl font-semibold">Product link</h2>
          <TextField label="Product name" value={draft.product.name} onChange={(name) => change({ product: { ...draft.product, name } })} />
          <TextField label="Product URL" value={draft.product.href} onChange={(href) => change({ product: { ...draft.product, href } })} />
          <TextField label="Product link text" value={draft.product.label} onChange={(label) => change({ product: { ...draft.product, label } })} />
          <details><summary className="cursor-pointer font-semibold">Search and discovery settings</summary><div className="mt-4 space-y-4">
            <TextField label="SEO title" value={draft.title} onChange={(title) => change({ title })} />
            <TextField label="SEO description" multiline value={draft.description} onChange={(description) => change({ description })} />
            <label className="block text-sm font-semibold">Topic cluster<select className={fieldClass} value={draft.cluster} onChange={(event) => change({ cluster: event.target.value })}>{clusters.map((cluster) => <option key={cluster.key} value={cluster.key}>{cluster.label}</option>)}</select></label>
            <TextField label="Related article slugs (one per line)" multiline value={draft.related.join('\n')} onChange={(text) => change({ related: text.split('\n').map((slug) => slug.trim()).filter(Boolean) })} />
          </div></details>
          <button className={buttonClass} disabled={!dirty || busy} onClick={() => void save('save')}>Save edits and preview</button>
        </fieldset> : <div className="mt-4 overflow-hidden rounded-xl border border-border-subtle bg-background" aria-label="Article preview"><InsightArticleContent article={draft} embedded /></div>}
      </section>}
    </div>
  </main>;
}
