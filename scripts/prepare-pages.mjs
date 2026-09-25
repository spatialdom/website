import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexFile = resolve(distDir, 'index.html');
const fallbackFile = resolve(distDir, '404.html');
const pages = JSON.parse(readFileSync(resolve('src/data/parcelPages.json'), 'utf8'));
const toolPages = JSON.parse(readFileSync(resolve('src/data/toolPages.json'), 'utf8'));
const appUrl = 'https://parcel.spatialdom.xyz/';
const siteUrl = 'https://spatialdom.xyz';

if (!existsSync(indexFile)) {
  throw new Error('dist/index.html was not found. Run the Vite build before preparing GitHub Pages output.');
}

const indexHtml = readFileSync(indexFile, 'utf8');
copyFileSync(indexFile, fallbackFile);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`Missing metadata tag for ${replacement}`);
  return html.replace(pattern, replacement);
}

function renderPageBody(page) {
  const heading = escapeHtml(page.heading);
  const cta = `<a class="interactive-accent mt-7" href="${appUrl}" target="_blank" rel="noopener noreferrer">Try Early Access<span class="sr-only"> (opens in a new tab)</span></a>`;
  const breadcrumb = page.slug === 'parcel-plotter'
    ? '<span aria-current="page">Parcel Plotter</span>'
    : '<a class="text-link" href="/parcel-plotter/">Parcel Plotter</a><span aria-hidden="true">/</span><span aria-current="page">Guide</span>';
  const sections = page.sections.map((section) => `
    <section class="border-b border-border-subtle py-8 sm:py-10">
      <h2 class="text-2xl font-semibold text-text-primary">${escapeHtml(section.heading)}</h2>
      <div class="mt-4 max-w-prose space-y-4 leading-7 text-text-secondary">
        ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      </div>
    </section>`).join('');
  const related = page.related.map((item) => `<li><a class="text-link" href="/${escapeHtml(item.slug)}/">${escapeHtml(item.label)}</a></li>`).join('');
  const sources = page.sources.map((source) => `<li><a class="text-link" href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><main class="pb-16 pt-32 sm:pt-40"><div class="container-shell max-w-4xl">
    <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-sm text-text-secondary"><a class="text-link" href="/">Home</a><span aria-hidden="true">/</span>${breadcrumb}</nav>
    <header class="mt-8 max-w-[760px]">
      <p class="section-label">Parcel Plotter${page.slug === 'parcel-plotter' ? '' : ' guide'}</p>
      <h1 class="mt-4 text-[clamp(2.4rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.045em] text-text-primary">${heading}</h1>
      <p class="mt-5 text-lg leading-8 text-text-secondary">${escapeHtml(page.intro)}</p>
      ${cta}
    </header>
    <div class="mt-12 border-t border-border-subtle">${sections}</div>
    <aside class="mt-8 rounded-xl border border-border-strong bg-surface-soft p-5 sm:p-6">
      <h2 class="text-lg font-semibold text-text-primary">A technical aid, not a verification</h2>
      <p class="mt-2 max-w-prose leading-7 text-text-secondary">Parcel Plotter does not replace an official survey, title verification, or professional geodetic advice. A plotted shape does not establish title validity or a boundary on the ground.</p>
    </aside>
    <nav class="mt-10" aria-label="Related Parcel Plotter guides"><h2 class="text-xl font-semibold text-text-primary">Keep reading</h2><ul class="mt-3 space-y-3">${related}</ul></nav>
    <div class="mt-10 text-sm text-text-secondary"><h2 class="font-semibold text-text-primary">Sources and further reading</h2><ul class="mt-2 space-y-2">${sources}</ul></div>
  </div></main></div>`;
}

function renderPageHtml(page) {
  const url = `${siteUrl}/${page.slug}/`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  let html = indexHtml;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceTag(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<meta\s+property="og:type"[\s\S]*?\/>/, `<meta property="og:type" content="${page.slug === 'parcel-plotter' ? 'website' : 'article'}" />`);
  html = replaceTag(html, /<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`);
  html = replaceTag(html, /<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${title}" />`);
  html = replaceTag(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${description}" />`);
  html = replaceTag(html, /<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${description}" />`);
  html = replaceTag(html, /<div id="root"><\/div>/, renderPageBody(page));
  return html;
}

function renderToolBody(page) {
  const heading = escapeHtml(page.heading);
  const intro = escapeHtml(page.intro);
  const compact = page.slug !== 'tools';
  const toolLinks = [
    { href: '/tools/coordinate-converter/', label: 'Coordinate Converter', description: 'Convert Luzon 1911 longitude and latitude to PTM grid coordinates, or back again.' },
    { href: '/tools/geojson-viewer/', label: 'GeoJSON Viewer', description: 'Open a GeoJSON file, check its features, and inspect the data on a map.' }
  ];
  const content = page.slug === 'tools'
    ? `<section aria-labelledby="available-tools"><h2 id="available-tools">Choose a task</h2><ul>${toolLinks.map((tool) => `<li><h3>${tool.label}</h3><p>${tool.description}</p><a class="text-link" href="${tool.href}">Open ${tool.label}</a></li>`).join('')}</ul></section><section><h2>More practical tasks</h2><p>Area & Distance Calculator, Shapefile to GeoJSON Converter, and Parcel Sketch Generator are in development.</p></section>`
    : `<section><h2>How to use</h2><ol>${page.howToUse.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></section><section><h2>What the result means</h2>${page.meaning.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}${page.insight ? `<p><a class="text-link" href="${escapeHtml(page.insight.href)}">${escapeHtml(page.insight.label)}</a></p>` : ''}${page.product ? `<p><a class="text-link" href="${escapeHtml(page.product.href)}">${escapeHtml(page.product.label)}</a></p>` : ''}</section>`;

  return `<div id="root"><main class="pb-16 pt-32 sm:pt-36"><div class="container-shell"><header class="${compact ? 'max-w-3xl border-b border-border-subtle pb-5' : 'panel rounded-xl p-6 sm:p-8'}"><p class="section-label">Spatialdom Tools</p><h1 class="mt-2 ${compact ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight text-text-primary sm:text-4xl">${heading}</h1><p class="mt-2 max-w-3xl text-sm leading-7 text-text-body sm:text-base">${intro}</p></header><div class="mt-8 max-w-4xl space-y-6 leading-7 text-text-secondary">${content}</div></div></main></div>`;
}

function renderToolHtml(page) {
  const url = `${siteUrl}/${page.slug}/`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  let html = indexHtml;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceTag(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<meta\s+property="og:type"[\s\S]*?\/>/, '<meta property="og:type" content="website" />');
  html = replaceTag(html, /<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`);
  html = replaceTag(html, /<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${title}" />`);
  html = replaceTag(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${description}" />`);
  html = replaceTag(html, /<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${description}" />`);
  html = replaceTag(html, /<div id="root"><\/div>/, renderToolBody(page));
  return html;
}

for (const page of pages) {
  if (!/^[a-z0-9-]+$/.test(page.slug)) throw new Error(`Invalid page slug: ${page.slug}`);
  const pageDir = resolve(distDir, page.slug);
  mkdirSync(pageDir, { recursive: true });
  writeFileSync(resolve(pageDir, 'index.html'), renderPageHtml(page));
}

for (const page of toolPages) {
  if (!/^tools(?:\/[a-z0-9-]+)?$/.test(page.slug)) throw new Error(`Invalid tool page slug: ${page.slug}`);
  const pageDir = resolve(distDir, page.slug);
  mkdirSync(pageDir, { recursive: true });
  writeFileSync(resolve(pageDir, 'index.html'), renderToolHtml(page));
}

const urls = [`${siteUrl}/`, ...pages.map((page) => `${siteUrl}/${page.slug}/`), ...toolPages.map((page) => `${siteUrl}/${page.slug}/`)];
writeFileSync(resolve(distDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>\n`);
writeFileSync(resolve(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
