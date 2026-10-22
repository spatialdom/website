import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { reviewStore } from './insights-review-store.mjs';
import { hasLocalApproval, withLocalReview } from './insights-approval.mjs';
import { publicManifest, toPublicArticle } from './insights-data.mjs';
import insightsReviewPlugin from './insights-review-plugin.mjs';

const sample = {
  slug: 'test-article', heading: 'Test article', intro: 'Introduction', title: 'SEO title', description: 'Description',
  cluster: 'land', state: 'review', publishedAt: null, lastReviewed: null,
  sections: [{ id: 'first', heading: 'First section', paragraphs: ['Original paragraph'] }],
  related: [], sources: [{ label: 'Source', url: 'https://example.com/source' }],
  product: { name: 'Product', label: 'Explore product', href: '/product/' }, reviewerNotes: ['A private note']
};

test('weekly releases hide related drafts until those articles are published', () => {
  const live = { ...sample, state: 'published', related: ['next-article'] };
  const next = { ...sample, slug: 'next-article', state: 'approved' };
  assert.deepEqual(publicManifest([live, next])[0].related, []);
  assert.deepEqual(publicManifest([live, { ...next, state: 'published' }])[0].related, ['next-article']);
  assert.deepEqual(live.related, ['next-article']);
});

function fixture(t, rewrite = false) {
  const root = mkdtempSync(join(tmpdir(), 'insights-review-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'src/data/insights'), { recursive: true });
  writeFileSync(join(root, 'src/data/insightClusters.json'), JSON.stringify([{ key: 'land' }]));
  const article = rewrite ? { ...sample, state: 'published', intro: 'Existing live introduction', candidate: { ...sample } } : sample;
  const path = join(root, 'src/data/insights/test-article.json');
  writeFileSync(path, JSON.stringify(article));
  return { root, path, store: reviewStore(root) };
}

test('approval covers the saved version, edits revoke it, and stale tabs cannot overwrite', (t) => {
  const { store } = fixture(t);
  const original = store.list()[0];
  const approved = store.save(original.slug, { revision: original.revision, action: 'approve' });
  assert.equal(approved.approved, true);
  assert.equal(hasLocalApproval({ ...approved.draft, intro: 'Changed outside dashboard' }), false);
  assert.throws(() => store.save(original.slug, { revision: original.revision, action: 'approve' }), /changed on disk/);
  const saved = store.save(original.slug, { revision: approved.revision, action: 'save', draft: { ...approved.draft, intro: 'My edit', state: 'published' } });
  assert.equal(saved.draft.intro, 'My edit');
  assert.equal(saved.draft.state, 'review');
  assert.equal(saved.draft.reviewApproval, null);
  assert.equal(saved.approved, false);
});

test('rewrite approval and edits preserve live content and private review data stays out of the manifest', (t) => {
  const { store, path } = fixture(t, true);
  const entry = store.list()[0];
  const saved = store.save(entry.slug, { revision: entry.revision, action: 'save', draft: { ...entry.draft, intro: 'Rewritten introduction' } });
  const record = JSON.parse(readFileSync(path, 'utf8'));
  assert.equal(record.state, 'published');
  assert.equal(record.intro, 'Existing live introduction');
  assert.equal(record.candidate.intro, 'Rewritten introduction');
  const approved = store.save(entry.slug, { revision: saved.revision, action: 'approve' });
  const revoked = store.save(entry.slug, { revision: approved.revision, action: 'revoke' });
  assert.equal(revoked.approved, false);
  assert.equal(revoked.draft.state, 'review');
  const publicData = JSON.stringify(toPublicArticle({ ...record, reviewApproval: { method: 'private' } }));
  assert.equal(publicData.includes('Rewritten introduction'), false);
  assert.equal(publicData.includes('reviewApproval'), false);
  assert.equal(publicData.includes('private note'), false);
});

test('local decisions override stale issue labels and content changes remove publication eligibility', (t) => {
  const { store } = fixture(t);
  const issue = { number: 19, body: '- Slug: `test-article`', state: 'review' };
  const entry = store.list()[0];
  const approved = store.save(entry.slug, { revision: entry.revision, action: 'approve' });
  assert.equal(withLocalReview([issue], [approved.draft])[0].state, 'approved');
  assert.equal(withLocalReview([{ ...issue, state: 'approved' }], [{ ...approved.draft, intro: 'Changed' }])[0].state, 'review');
  const revoked = store.save(entry.slug, { revision: approved.revision, action: 'revoke' });
  assert.equal(withLocalReview([{ ...issue, state: 'approved' }], [revoked.draft])[0].state, 'review');
});

test('reject invalid content and path traversal without modifying disk', (t) => {
  const { store, path } = fixture(t);
  const entry = store.list()[0];
  const before = readFileSync(path, 'utf8');
  for (const patch of [
    { sections: [] }, { heading: '' }, { related: ['missing'] },
    { product: { ...sample.product, href: 'javascript:alert(1)' } },
    { sources: [] }, { sections: [sample.sections[0], sample.sections[0]] }
  ]) assert.throws(() => store.save(entry.slug, { revision: entry.revision, action: 'save', draft: { ...entry.draft, ...patch } }));
  assert.throws(() => store.save('../test', { revision: entry.revision, action: 'approve' }), /Invalid article slug/);
  assert.equal(readFileSync(path, 'utf8'), before);
});

test('local middleware rejects remote hosts and untrusted writes', async (t) => {
  const { root } = fixture(t);
  let handler;
  insightsReviewPlugin().configureServer({ config: { root }, middlewares: { use: (_path, middleware) => { handler = middleware; } } });
  async function request(method, headers = {}, remoteAddress = '127.0.0.1') {
    let status, body;
    await handler({ method, url: '/', headers: { host: '127.0.0.1:5173', ...headers }, socket: { remoteAddress } }, {
      writeHead: (value) => { status = value; }, end: (value) => { body = JSON.parse(value); }
    });
    return { status, body };
  }
  assert.equal((await request('GET', { host: 'evil.example:5173' })).status, 403);
  assert.equal((await request('GET', {}, '192.168.1.2')).status, 403);
  const trusted = await request('GET');
  assert.equal(trusted.status, 200);
  assert.equal(trusted.body.articles.length, 1);
  assert.equal((await request('POST', { origin: 'https://evil.example', 'x-review-token': trusted.body.token, 'content-type': 'application/json' })).status, 403);
  assert.equal((await request('POST', { origin: 'http://127.0.0.1:5173', 'content-type': 'application/json' })).status, 403);
});
