import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { designContent, inline, markdown } from './design-content.mjs';

test('approved references agree on version, date and core safeguards', () => {
  const content = designContent();
  assert.equal(content.version, content.tokens.version);
  assert.equal(content.tokens.status, 'approved');
  assert.ok(!content.introduction.includes('# Spatialdom'));
  assert.match(content.agent, /v1\.2\.0/);
  assert.match(readFileSync('docs/design/COMPONENTS.md', 'utf8'), /Version:\*\* 1\.2\.0/);
  assert.equal(content.sections.length, 21);
  assert.equal(new Set(content.sections.map(s => s.id)).size, content.sections.length);
  const html = content.sections.map(s => s.html).join('');
  for (const safeguard of ['Shape is not location', 'Do not silently adjust geometry', 'Closure is a metric', 'WCAG 2.2 AA', 'Kadastra', 'after SMACCs', 'professional accountability']) assert.ok(html.includes(safeguard), safeguard);
});

test('reference markup escapes raw HTML and unsafe links, preserving exact code', () => {
  assert.equal(inline('`a_b <tag> **literal**`'), '<code>a_b &lt;tag&gt; **literal**</code>');
  assert.equal(inline('[bad](javascript:alert)'), 'bad');
  assert.equal(inline('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
  assert.match(inline('[Tokens](/design/tokens.json)'), /href="\/design\/tokens.json"/);
  assert.match(markdown('| Name | Value |\n| --- | --- |\n| x | `4 px` |'), /<th scope="col">Name<\/th>/);
  assert.match(markdown('```tsx\n<button>Save</button>\n```'), /&lt;button&gt;Save&lt;\/button&gt;/);
});
