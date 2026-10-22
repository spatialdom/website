import { readFileSync, readdirSync, writeFileSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { contentHash, hasLocalApproval } from './insights-approval.mjs';

export function reviewStore(root) {
  const directory = resolve(root, 'src/data/insights');
  const clusters = JSON.parse(readFileSync(resolve(root, 'src/data/insightClusters.json'), 'utf8')).map((item) => item.key);
  function load(slug) {
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid article slug.');
    const path = resolve(directory, `${slug}.json`);
    const raw = readFileSync(path, 'utf8');
    return { path, article: JSON.parse(raw), revision: createHash('sha256').update(raw).digest('hex') };
  }
  function view({ article, revision }) {
    const draft = article.candidate ?? article;
    const editable = Boolean(article.candidate) || article.state !== 'published';
    return { slug: article.slug, draft, revision, editable, rewrite: Boolean(article.candidate), approved: hasLocalApproval(draft) };
  }
  function validate(draft) {
    const required = (value) => typeof value === 'string' && value.trim().length > 0;
    const href = (value) => typeof value === 'string' && (/^\/(?!\/)/.test(value) || /^https?:\/\//.test(value) || /^mailto:/.test(value));
    if (!['heading', 'intro', 'title', 'description'].every((key) => required(draft[key]))) throw new Error('Title, introduction, SEO title and description are required.');
    if (!clusters.includes(draft.cluster)) throw new Error('Choose a valid topic cluster.');
    if (typeof draft.disclaimer !== 'string' && draft.disclaimer !== undefined) throw new Error('Invalid disclaimer.');
    if (!Array.isArray(draft.sections) || !draft.sections.length || !draft.sections.every((s) => s && /^[a-z0-9-]+$/.test(s.id) && required(s.heading) && Array.isArray(s.paragraphs) && s.paragraphs.length && s.paragraphs.every(required)) || new Set(draft.sections.map((s) => s.id)).size !== draft.sections.length) throw new Error('Each section needs a unique ID, heading and at least one paragraph.');
    if (!Array.isArray(draft.sources) || !draft.sources.length || !draft.sources.every((s) => s && required(s.label) && /^https?:\/\//.test(s.url))) throw new Error('Add at least one source with a label and HTTP(S) URL.');
    if (!draft.product || !required(draft.product.name) || !required(draft.product.label) || !href(draft.product.href)) throw new Error('Complete the product name, link text and valid URL.');
    const slugs = new Set(readdirSync(directory).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)));
    if (!Array.isArray(draft.related) || !draft.related.every((slug) => typeof slug === 'string' && slug !== draft.slug && slugs.has(slug))) throw new Error('Related articles must use existing article slugs, excluding this article.');
  }
  return {
    list: () => readdirSync(directory).filter((file) => file.endsWith('.json')).map((file) => view(load(file.slice(0, -5)))),
    save(slug, { revision, action, draft: input }) {
      const record = load(slug);
      if (revision !== record.revision) throw Object.assign(new Error('This article changed on disk. Reload the queue before saving.'), { status: 409 });
      if (!['save', 'approve', 'revoke'].includes(action)) throw new Error('Invalid action.');
      const current = record.article.candidate ?? record.article;
      if (!record.article.candidate && current.state === 'published') throw new Error('This article has no draft to review.');
      const draft = { ...current };
      if (action === 'save') {
        if (!input || typeof input !== 'object') throw new Error('Draft is required.');
        for (const key of ['heading', 'intro', 'title', 'description', 'cluster', 'disclaimer', 'sections', 'sources', 'product', 'related']) {
          if (Object.hasOwn(input, key)) draft[key] = input[key];
        }
      }
      validate(draft);
      draft.state = action === 'approve' ? 'approved' : 'review';
      draft.reviewApproval = null;
      if (action === 'approve') {
        const now = new Date();
        draft.lastReviewed = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
        draft.reviewApproval = { method: 'local-review', approvedAt: now.toISOString(), contentHash: contentHash(draft) };
      }
      const next = record.article.candidate ? { ...record.article, candidate: draft } : draft;
      const temporary = `${record.path}.tmp`;
      writeFileSync(temporary, JSON.stringify(next, null, 2) + '\n', 'utf8');
      renameSync(temporary, record.path);
      return view(load(slug));
    }
  };
}
