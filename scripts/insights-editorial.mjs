import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { allInsights } from './insights-data.mjs';
import { plan } from './insights-plan.mjs';

const owner = 'spatialdom';
const repo = 'website';
const approver = 'kingd0mz';
const states = ['idea', 'drafting', 'review', 'approved', 'scheduled', 'published'];

function gh(...args) {
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8' }));
}

function getQueue() {
  const issues = gh('issue', 'list', '--repo', `${owner}/${repo}`, '--state', 'all', '--limit', '1000', '--json', 'number,title,body,labels');
  return issues.filter((issue) => /^INSIGHT-\d{3}\b/.test(issue.title)).map((issue) => {
    const id = Number(issue.title.match(/^INSIGHT-(\d{3})/)[1]);
    const labels = issue.labels.map((label) => label.name).filter((label) => label.startsWith('insight:'));
    if (labels.length !== 1 || !states.includes(labels[0].slice(8))) throw new Error(`Issue #${issue.number} needs exactly one editorial state`);
    return { ...issue, id, state: labels[0].slice(8), legacy: id <= 9 };
  }).sort((a, b) => a.id - b.id);
}

function hasDominicApproval(issue) {
  const events = gh('api', `repos/${owner}/${repo}/issues/${issue.number}/events?per_page=100`);
  const lastApproved = events.filter((event) => event.event === 'labeled' && event.label?.name === 'insight:approved').at(-1);
  if (lastApproved?.actor?.login !== approver) return false;
  const slug = issue.body.match(/^- Slug: `([^`]+)`/m)?.[1] ?? issue.body.match(/Article file: `src\/data\/insights\/([^`]+)\.json`/)?.[1];
  if (!slug) return false;
  const changedAt = execFileSync('git', ['log', '-1', '--format=%cI', '--', `src/data/insights/${slug}.json`], { encoding: 'utf8' }).trim();
  return Boolean(changedAt && new Date(lastApproved.created_at) >= new Date(changedAt));
}

const command = process.argv[2] ?? 'plan';
const relaunch = process.argv.includes('--relaunch');
const today = new Date().toISOString().slice(0, 10);
const queue = getQueue();
const result = plan(queue, allInsights, today, relaunch);

if (command === 'plan') {
  console.log(JSON.stringify(result, null, 2));
} else if (command === 'publish') {
  const published = [];
  for (const number of result.publish) {
    const issue = queue.find((item) => item.number === number);
    if (!hasDominicApproval(issue)) throw new Error(`Issue #${number} was not approved by ${approver}`);
    const slug = issue.body.match(/^- Slug: `([^`]+)`/m)?.[1] ?? issue.body.match(/Article file: `src\/data\/insights\/([^`]+)\.json`/)?.[1];
    if (!slug) throw new Error(`Issue #${number} needs a Slug or Article file reference`);
    const article = allInsights.find((item) => item.slug === slug);
    if (!article) throw new Error(`Article file missing for issue #${number}: ${slug}`);
    const candidate = article.candidate ?? article;
    if (!['approved', 'scheduled'].includes(candidate.state) || !/^\d{4}-\d{2}-\d{2}$/.test(candidate.lastReviewed ?? '') || candidate.lastReviewed > today || (candidate.publishedAt && !article.candidate)) throw new Error(`Article ${slug} is not ready for first publication or revision`);
    if (!Array.isArray(candidate.sections) || !candidate.sections.length || !Array.isArray(candidate.sources) || !candidate.sources.length) throw new Error(`Article ${slug} lacks content or sources`);
    const next = { ...candidate, state: 'published', publishedAt: article.legacy ? null : (article.publishedAt ?? today), lastReviewed: candidate.lastReviewed, releasedAt: today };
    delete next.candidate;
    if (article.legacy) next.legacy = true;
    writeFileSync(resolve('src/data/insights', `${slug}.json`), JSON.stringify(next, null, 2) + '\n');
    published.push({ number, slug, previousState: issue.state });
  }
  writeFileSync(resolve('insights-publication-result.json'), JSON.stringify(published, null, 2) + '\n');
  console.log(JSON.stringify({ ...result, published }, null, 2));
} else {
  throw new Error('Usage: node scripts/insights-editorial.mjs [plan|publish] [--relaunch]');
}
