import { createHash } from 'node:crypto';

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}

export function contentHash(article) {
  const { reviewApproval, state, ...content } = article;
  return createHash('sha256').update(JSON.stringify(canonical(content))).digest('hex');
}

export function hasLocalApproval(article) {
  return ['approved', 'scheduled'].includes(article.state)
    && article.reviewApproval?.contentHash === contentHash(article)
    && article.reviewApproval?.method === 'local-review'
    && /^\d{4}-\d{2}-\d{2}$/.test(article.lastReviewed ?? '')
    && Number.isFinite(Date.parse(article.reviewApproval.approvedAt));
}

export function editorialSlug(issue) {
  return issue.body.match(/^- Slug: `([^`]+)`/m)?.[1]
    ?? issue.body.match(/Article file: `src\/data\/insights\/([^`]+)\.json`/)?.[1];
}

export function withLocalReview(queue, articles) {
  return queue.map((issue) => {
    const stored = articles.find((article) => article.slug === editorialSlug(issue));
    const draft = stored?.candidate ?? stored;
    if (!draft || !Object.hasOwn(draft, 'reviewApproval') || draft.state === 'published') return issue;
    return { ...issue, state: hasLocalApproval(draft) ? draft.state : 'review' };
  });
}
