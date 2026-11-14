import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Deliberately small, escaped renderer for the checked-in reference package.
// Raw HTML is never interpreted. Code spans are protected before inline formatting.
export function inline(text) {
  const codes = [];
  let value = text.replace(/`([^`]+)`/g, (_, code) => `\u0000${codes.push(`<code>${escape(code)}</code>`) - 1}\u0000`);
  value = escape(value).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    if (!/^(https:\/\/|\/design\/)/.test(href)) return label;
    return `<a href="${href}">${label}</a>`;
  }).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return value.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)]);
}

export function markdown(source) {
  const lines = source.replace(/\r/g, '').split('\n');
  let html = '';
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith('```')) {
      const code = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++; html += `<pre tabindex="0" aria-label="Code example"><code>${escape(code.join('\n'))}</code></pre>`; continue;
    }
    if (/^###? /.test(line)) { html += `<h3>${inline(line.replace(/^#+ /, ''))}</h3>`; i++; continue; }
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++].split('|').slice(1, -1).map(c => c.trim()));
      html += `<div class="guide-table-scroll" role="region" aria-label="Reference table" tabindex="0"><table><thead><tr>${rows[0].map(c => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(2).map(row => `<tr>${row.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; continue;
    }
    if (/^(?:- |\d+\. )/.test(line)) {
      const ordered = /^\d/.test(line), tag = ordered ? 'ol' : 'ul', items = [];
      const pattern = ordered ? /^\d+\. / : /^- /;
      while (i < lines.length && pattern.test(lines[i])) items.push(lines[i++].replace(pattern, ''));
      html += `<${tag}>${items.map(item => `<li>${inline(item)}</li>`).join('')}</${tag}>`; continue;
    }
    if (line.startsWith('>')) {
      const quote = [];
      while (i < lines.length && lines[i].startsWith('>')) quote.push(lines[i++].replace(/^> ?/, ''));
      html += `<blockquote>${inline(quote.join(' '))}</blockquote>`; continue;
    }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(?:#|\||>|- |\d+\. |```)/.test(lines[i])) paragraph.push(lines[i++]);
    html += `<p>${inline(paragraph.join(' '))}</p>`;
  }
  return html;
}

export function designContent() {
  const source = readFileSync('docs/design/GUIDELINES.md', 'utf8');
  const parts = source.split(/^## /m);
  const sections = parts.slice(1).map(part => {
    const split = part.indexOf('\n'), title = part.slice(0, split).trim();
    return { id: slugify(title), title, html: markdown(part.slice(split + 1)) };
  });
  return { version: '1.2.0', status: 'Approved standard', prepared: '2026-11-14',
    introduction: markdown(parts[0].replace(/^# [^\n]*\n/, '').replace(/^\*\*(?:Version|Published|Status|Canonical destination):[^\n]*\n/gm, '')), sections,
    agent: readFileSync('docs/design/AGENTS_SNIPPET.md', 'utf8'),
    tokens: JSON.parse(readFileSync('docs/design/tokens.json', 'utf8')) };
}

export function generateDesignContent() {
  const content = designContent();
  const flatten = (value, prefix = '') => Object.entries(value).flatMap(([key, item]) => typeof item === 'object' ? flatten(item, `${prefix}${key}-`) : [[`${prefix}${key}`, item]]);
  const roles = { canvas: 'background', surface: 'surface', 'text-primary': 'text-primary', 'text-secondary': 'text-secondary', 'action-primary': 'accent', 'action-hover': 'accent-hover', 'action-pressed': 'accent-pressed', 'action-link': 'accent-link', 'selection-surface': 'accent-soft', 'status-success': 'success', 'status-warning': 'warning', 'status-danger': 'danger' };
  writeFileSync('src/styles/design-tokens.generated.css', `.guidelines-page {\n${flatten(content.tokens.color).map(([name, value]) => `  --color-${roles[name]}: ${value};`).join('\n')}\n}\n`);
  writeFileSync('src/data/designGuidelines.generated.json', JSON.stringify(content, null, 2) + '\n');
  mkdirSync('public/design', { recursive: true });
  for (const name of ['GUIDELINES.md', 'COMPONENTS.md', 'AGENTS_SNIPPET.md', 'tokens.json']) copyFileSync(`docs/design/${name}`, `public/design/${name}`);
  mkdirSync('public/design/source', { recursive: true });
  for (const name of ['GUIDELINES.md', 'COMPONENTS.md', 'AGENTS_SNIPPET.md', 'tokens.json']) copyFileSync(`docs/design/source-supplied/${name}`, `public/design/source/${name}`);
  return content;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generateDesignContent();
