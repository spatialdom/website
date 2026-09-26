import assert from 'node:assert/strict';
import test from 'node:test';
import { plan } from './insights-plan.mjs';
import { toPublicArticle } from './insights-data.mjs';

const ideas = Array.from({ length: 8 }, (_, i) => ({ number: i + 1, state: 'idea' }));
const approved = Array.from({ length: 8 }, (_, i) => ({ number: i + 21, state: 'approved', legacy: i < 7 }));

test('draft slots stop at the twenty-item review ceiling', () => {
  assert.equal(plan([...Array.from({ length: 19 }, () => ({ state: 'review' })), ...ideas], [], '2026-09-28').draftCapacity, 1);
  assert.equal(plan([...Array.from({ length: 20 }, () => ({ state: 'review' })), ...ideas], [], '2026-09-28').draftCapacity, 0);
});

test('weekly publication limits and legacy relaunch', () => {
  assert.deepEqual(plan(approved, [], '2026-09-28').publish, [21]);
  assert.deepEqual(plan(approved, [], '2026-09-28', true).publish, [21, 22, 23, 24, 25, 26]);
  assert.deepEqual(plan(approved, [{ releasedAt: '2026-09-28' }], '2026-09-28').publish, []);
  assert.deepEqual(plan(approved, [{ releasedAt: '2026-09-28' }], '2026-09-28', true).publish, [21, 22, 23, 24, 25]);
});

test('a legacy rewrite remains private until release', () => {
  const article = toPublicArticle({ slug: 'existing', state: 'published', candidate: { state: 'review', intro: 'Unapproved draft text' } });
  assert.equal(JSON.stringify(article).includes('Unapproved draft text'), false);
});
