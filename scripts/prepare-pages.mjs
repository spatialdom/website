import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { publishedInsights as insightArticles, readingMinutes } from './insights-data.mjs';

const distDir = resolve('dist');
const indexFile = resolve(distDir, 'index.html');
const fallbackFile = resolve(distDir, '404.html');
const pages = JSON.parse(readFileSync(resolve('src/data/parcelPages.json'), 'utf8'));
const toolPages = JSON.parse(readFileSync(resolve('src/data/toolPages.json'), 'utf8'));
const sitePages = JSON.parse(readFileSync(resolve('src/data/sitePages.json'), 'utf8'));
const insightClusters = JSON.parse(readFileSync(resolve('src/data/insightClusters.json'), 'utf8'));
const lguProductPages = JSON.parse(readFileSync(resolve('src/data/lguProductPages.json'), 'utf8'));
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
    : `<a class="text-link" href="/parcel-plotter/">Parcel Plotter</a><span aria-hidden="true">/</span><span aria-current="page">${heading}</span>`;
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
  return replaceTag(indexHtml, /<div id="root"><\/div>/, renderPageBody(page));
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
  return replaceTag(indexHtml, /<div id="root"><\/div>/, renderToolBody(page));
}

function structuredData(page, slug, url, article = false) {
  const graph = [];
  if (article) {
    graph.push({ '@type': 'Article', headline: page.heading, description: page.description, mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'Spatialdom' }, publisher: { '@type': 'Organization', name: 'Spatialdom' },
      ...(page.publishedAt ? { datePublished: page.publishedAt } : {}), ...(page.lastReviewed ? { dateModified: page.lastReviewed } : {}) });
  }
  if (slug) {
    const lguPage = lguProductPages.find((item) => item.slug === slug);
    const parent = slug.startsWith('insights/')
      ? [{ '@type': 'ListItem', position: 2, name: 'Insights', item: `${siteUrl}/insights/` }]
      : pages.some((item) => item.slug === slug && slug !== 'parcel-plotter')
        ? [{ '@type': 'ListItem', position: 2, name: 'Parcel Plotter', item: `${siteUrl}/parcel-plotter/` }]
        : lguPage?.kind === 'guide'
          ? [{ '@type': 'ListItem', position: 2, name: lguPage.family === 'sparta' ? 'SPARTA' : 'RBIM Cloud', item: `${siteUrl}/${lguPage.family === 'sparta' ? 'sparta' : 'rbim-cloud'}/` }]
        : [];
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      ...parent,
      { '@type': 'ListItem', position: parent.length + 2, name: lguPage?.kind === 'product' ? (lguPage.family === 'sparta' ? 'SPARTA' : 'RBIM Cloud') : page.heading, item: url }
    ] });
  }
  return graph.length ? `<script id="route-jsonld" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>` : '';
}

function finalizePageHtml(html, page, slug, article = false) {
  const url = `${siteUrl}/${slug ? `${slug}/` : ''}`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceTag(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<meta\s+property="og:type"[\s\S]*?\/>/, `<meta property="og:type" content="${article ? 'article' : 'website'}" />`);
  html = replaceTag(html, /<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`);
  html = replaceTag(html, /<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${title}" />`);
  html = replaceTag(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${description}" />`);
  html = replaceTag(html, /<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${description}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:url"[\s\S]*?\/>/, `<meta name="twitter:url" content="${url}" />`);
  return html.replace('</head>', `${structuredData(page, slug, url, article)}</head>`);
}

function renderInsightBody(page) {
  const sections = page.sections.map((section) => `<section id="${escapeHtml(section.id)}" class="scroll-mt-32 border-b border-border-subtle py-8 sm:py-10"><h2 class="text-2xl font-semibold text-text-primary">${escapeHtml(section.heading)}</h2><div class="mt-4 max-w-prose space-y-4 leading-8 text-text-secondary">${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div></section>`).join('');
  const related = page.related.map((slug) => insightArticles.find((item) => item.slug === slug)).filter(Boolean).map((item) => `<li><a class="text-link" href="/insights/${escapeHtml(item.slug)}/">${escapeHtml(item.heading)}</a></li>`).join('');
  const sources = page.sources.map((source) => `<li><a class="text-link" href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');
  const toc = page.sections.length >= 5 ? `<nav aria-label="On this page" class="mt-8 rounded-xl border border-border-subtle bg-surface-soft p-5"><h2 class="font-semibold">On this page</h2><ol>${page.sections.map((section) => `<li><a class="text-link" href="#${escapeHtml(section.id)}">${escapeHtml(section.heading)}</a></li>`).join('')}</ol></nav>` : '';
  const reviewed = page.lastReviewed ? new Date(`${page.lastReviewed}T00:00:00Z`).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : 'Date not recorded';
  return `<div id="root"><main class="pb-16 pt-32 sm:pt-40"><div class="container-shell max-w-4xl"><nav aria-label="Breadcrumb" class="text-sm"><a href="/">Home</a> / <a href="/insights/">Insights</a> / ${escapeHtml(page.heading)}</nav><article><header class="mt-8 max-w-prose"><p class="section-label">Spatialdom Insights</p><h1 class="mt-3 text-3xl font-bold text-text-primary sm:text-5xl">${escapeHtml(page.heading)}</h1><p class="mt-5 text-lg leading-8 text-text-secondary">${escapeHtml(page.intro)}</p><p class="mt-4 text-sm text-text-secondary">${readingMinutes(page)} min read · Written and reviewed by Spatialdom · Last reviewed: ${reviewed}</p></header>${toc}<div class="mt-8 border-t border-border-subtle">${sections}</div>${page.disclaimer ? `<p class="mt-8 max-w-prose text-sm leading-6 text-text-secondary">${escapeHtml(page.disclaimer)}</p>` : ''}<aside class="mt-9 rounded-xl border border-border-strong bg-surface-soft p-5"><h2 class="text-xl font-semibold">Related product: ${escapeHtml(page.product.name)}</h2><p>If this is part of your ongoing work, see how Spatialdom supports the workflow.</p><a class="interactive-accent mt-4" href="${escapeHtml(page.product.href)}">${escapeHtml(page.product.label)}</a></aside><nav class="mt-10" aria-label="Related articles"><h2 class="text-xl font-semibold">Keep reading</h2><ul>${related}</ul></nav><div class="mt-10 text-sm"><h2 class="font-semibold">Sources and further reading</h2><ul>${sources}</ul></div></article></div></main></div>`;
}

function renderInsightsIndexBody() {
  const clusters = insightClusters.filter((cluster) => insightArticles.some((article) => article.cluster === cluster.key));
  return `<div id="root"><main class="pb-16 pt-32 sm:pt-40"><div class="container-shell max-w-5xl"><header><p class="section-label">Insights</p><h1 class="mt-3 text-4xl font-bold">Practical spatial questions</h1><p>Guides for reading land records, managing property maps, and working responsibly with local household data.</p></header>${clusters.map((cluster) => `<section id="${cluster.key}" class="mt-12"><h2 class="text-2xl font-semibold">${cluster.label}</h2><ul>${insightArticles.filter((article) => article.cluster === cluster.key).map((article) => `<li class="mt-4"><h3 class="text-xl font-semibold"><a class="text-link" href="/insights/${escapeHtml(article.slug)}/">${escapeHtml(article.heading)}</a></h3><p>${escapeHtml(article.intro)}</p></li>`).join('')}</ul></section>`).join('')}<section class="mt-12"><h2>Coordinates & map data</h2><h3 id="coordinate-systems">Why coordinate systems and zones matter</h3><p>Confirm the datum and zone before converting coordinates.</p><a href="/tools/coordinate-converter/">Use the coordinate converter</a><h3 id="geojson-basics">How to read GeoJSON coordinates</h3><p>Standard GeoJSON uses WGS 84 longitude, then latitude.</p><a href="/tools/geojson-viewer/">Open the GeoJSON viewer</a></section></div></main></div>`;
}

function renderSiteBody(page) {
  if (page.slug === 'insights') return renderInsightsIndexBody();
  if (page.slug === 'contact') return `<div id="root"><main class="pb-16 pt-32"><div class="container-shell"><h1 class="text-4xl font-bold">Contact Spatialdom</h1><p class="mt-4">Ask about Parcel Plotter, SPARTA tax mapping, RBIM Cloud, or another spatial workflow.</p><p class="mt-5"><a class="text-link" href="mailto:spatialdom@gmail.com">spatialdom@gmail.com</a></p></div></main></div>`;
  if (page.slug === 'privacy') return `<div id="root"><main class="pb-16 pt-32"><div class="container-shell"><h1 class="text-4xl font-bold">Privacy policy</h1><p class="mt-4">This frontend-only site does not ask users to create accounts or submit personal profiles.</p><h2>Cookies and advertising</h2><p>Cookies or similar technologies may support site functionality and advertising on eligible tool pages.</p><h2>Privacy questions</h2><p>Email <a href="mailto:spatialdom@gmail.com">spatialdom@gmail.com</a>.</p></div></main></div>`;
  return `<div id="root"><main class="pb-16 pt-32"><div class="container-shell"><h1 class="text-4xl font-bold">${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p><nav aria-label="Explore Spatialdom"><a href="/parcel-plotter/">Parcel Plotter</a> · <a href="/tools/">Free tools</a> · <a href="/insights/">Insights</a> · <a href="/contact/">Contact</a></nav></div></main></div>`;
}

function renderLguProductBody(page) {
  const isSparta = page.family === 'sparta';
  const productName = isSparta ? 'SPARTA' : 'RBIM Cloud';
  const productSlug = isSparta ? 'sparta' : 'rbim-cloud';
  const primaryLabel = isSparta ? 'Discuss Tax Mapping' : 'Request a Demo';
  const primarySubject = isSparta ? 'SPARTA — Tax Mapping Discussion' : 'RBIM Cloud — Demo Request';
  const primaryHref = `mailto:spatialdom@gmail.com?subject=${encodeURIComponent(primarySubject)}`;
  const workflowHref = `mailto:spatialdom@gmail.com?subject=${encodeURIComponent("SPARTA — Assessor's Office Workflow Discussion")}&body=${encodeURIComponent("Please tell us about your current tax maps and property records, what is difficult to reconcile, and what your Assessor's Office wants to improve.")}`;
  const parent = page.kind === 'guide' ? `<a class="text-link" href="/${productSlug}/">${productName}</a> / ` : '';
  const attribution = isSparta ? '' : `<aside class="mt-8 max-w-3xl rounded-xl border border-border-strong bg-surface-soft p-5"><h2 class="text-lg font-semibold">Who developed the RBIM digital system?</h2><p class="mt-2 leading-7">The RBIM digital system was developed through a Commission on Population and Development (CPD) initiative with GIZ assistance. Spatialdom provides cloud deployment, hosting, system administration, maintenance, and implementation support; Spatialdom did not create the RBIM digital system.</p></aside>`;
  const workflow = isSparta && page.kind === 'product' ? `<section class="mt-10"><h2 class="text-2xl font-semibold">A working sequence for the office</h2><ol class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">${['Digitize', 'Reconcile', 'Map', 'Validate', 'Operate', 'Maintain'].map((step) => `<li class="panel p-4">${step}</li>`).join('')}</ol></section>` : '';
  const discovery = isSparta && page.kind === 'product' ? `<aside class="mt-10 max-w-3xl rounded-xl border border-border-strong bg-surface-soft p-5"><h2 class="text-xl font-semibold">Share your workflow</h2><p>We are speaking with Assessor's Offices about how tax mapping works in practice. If your LGU is digitizing tax maps, preparing for RPVARA implementation, or working with fragmented property records, we would like to understand your workflow.</p><a class="text-link" href="${escapeHtml(workflowHref)}">Email your current workflow to Spatialdom</a></aside>` : '';
  const sections = page.sections.map((section) => `<section class="border-b border-border-subtle py-8 sm:py-10"><h2 class="text-2xl font-semibold">${escapeHtml(section.heading)}</h2><div class="mt-4 max-w-prose space-y-4 leading-8 text-text-secondary">${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div></section>`).join('');
  const related = page.related.map((slug) => lguProductPages.find((item) => item.slug === slug)).filter(Boolean).map((item) => `<li><a class="text-link" href="/${escapeHtml(item.slug)}/">${escapeHtml(item.heading)}</a></li>`).join('');
  const insightHref = isSparta ? '/insights/tax-mapping-philippine-lgu/' : '/insights/household-profiling-systems-lgu/';
  const sources = page.sources.map((source) => `<li><a class="text-link" href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('');

  return `<div id="root"><main class="pb-16 pt-32 sm:pt-40"><div class="container-shell max-w-5xl"><nav aria-label="Breadcrumb" class="text-sm"><a class="text-link" href="/">Home</a> / ${parent}<span aria-current="page">${escapeHtml(page.kind === 'product' ? productName : page.heading)}</span></nav><header class="mt-8 max-w-3xl"><p class="section-label">${productName}${page.kind === 'guide' ? ' guide' : ''}</p><h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">${escapeHtml(page.heading)}</h1><p class="mt-5 text-lg leading-8">${escapeHtml(page.intro)}</p><div class="mt-7 flex flex-wrap gap-3"><a class="interactive-accent" href="${escapeHtml(primaryHref)}">${primaryLabel}</a>${isSparta && page.kind === 'product' ? `<a class="interactive-outline" href="${escapeHtml(workflowHref)}">Share your workflow</a>` : ''}</div></header>${attribution}${workflow}<div class="mt-10 max-w-3xl border-t border-border-subtle">${sections}</div>${discovery}<aside class="mt-10 max-w-3xl rounded-xl border border-border-strong bg-surface p-5"><h2 class="text-xl font-semibold">${isSparta ? 'Discuss your tax mapping needs' : 'See whether RBIM Cloud fits your LGU'}</h2><p>Tell us about your current records, staff workflow, and support needs.</p><a class="interactive-accent mt-4" href="${escapeHtml(primaryHref)}">${primaryLabel}</a><p>Or email <a class="text-link" href="mailto:spatialdom@gmail.com">spatialdom@gmail.com</a>.</p></aside><nav class="mt-10" aria-label="Related pages"><h2 class="text-xl font-semibold">Keep exploring</h2><ul>${related}<li><a class="text-link" href="${insightHref}">Read the related Insight guide</a></li></ul></nav><div class="mt-10 text-sm"><h2 class="font-semibold">Sources and further reading</h2><ul>${sources}</ul></div></div></main></div>`;
}

for (const page of pages) {
  if (!/^[a-z0-9-]+$/.test(page.slug)) throw new Error(`Invalid page slug: ${page.slug}`);
  const pageDir = resolve(distDir, page.slug);
  mkdirSync(pageDir, { recursive: true });
  writeFileSync(resolve(pageDir, 'index.html'), finalizePageHtml(renderPageHtml(page), page, page.slug, page.slug !== 'parcel-plotter'));
}

for (const page of toolPages) {
  if (!/^tools(?:\/[a-z0-9-]+)?$/.test(page.slug)) throw new Error(`Invalid tool page slug: ${page.slug}`);
  const pageDir = resolve(distDir, page.slug);
  mkdirSync(pageDir, { recursive: true });
  writeFileSync(resolve(pageDir, 'index.html'), finalizePageHtml(renderToolHtml(page), page, page.slug));
}

for (const page of sitePages) {
  if (page.slug && !/^[a-z0-9-]+$/.test(page.slug)) throw new Error(`Invalid site page slug: ${page.slug}`);
  const pageDir = resolve(distDir, page.slug);
  mkdirSync(pageDir, { recursive: true });
  const html = indexHtml.replace('<div id="root"></div>', renderSiteBody(page));
  writeFileSync(resolve(pageDir, 'index.html'), finalizePageHtml(html, page, page.slug));
}

const lguSlugs = new Set();
for (const page of lguProductPages) {
  if (!/^[a-z0-9-]+$/.test(page.slug) || lguSlugs.has(page.slug)) throw new Error(`Invalid or duplicate LGU page slug: ${page.slug}`);
  lguSlugs.add(page.slug);
  if (page.related.some((slug) => !lguProductPages.some((item) => item.slug === slug))) throw new Error(`Broken related LGU page on ${page.slug}`);
  const pageDir = resolve(distDir, page.slug);
  mkdirSync(pageDir, { recursive: true });
  const html = replaceTag(indexHtml, /<div id="root"><\/div>/, renderLguProductBody(page));
  writeFileSync(resolve(pageDir, 'index.html'), finalizePageHtml(html, page, page.slug));
}

const insightSlugs = new Set();
for (const page of insightArticles) {
  if (!/^[a-z0-9-]+$/.test(page.slug) || insightSlugs.has(page.slug)) throw new Error(`Invalid or duplicate insight slug: ${page.slug}`);
  insightSlugs.add(page.slug);
  if (page.related.some((slug) => !insightArticles.some((article) => article.slug === slug))) throw new Error(`Broken related article on ${page.slug}`);
  const slug = `insights/${page.slug}`;
  const pageDir = resolve(distDir, slug);
  mkdirSync(pageDir, { recursive: true });
  const html = indexHtml.replace('<div id="root"></div>', renderInsightBody(page));
  writeFileSync(resolve(pageDir, 'index.html'), finalizePageHtml(html, page, slug, true));
}

const urls = [
  ...sitePages.map((page) => `${siteUrl}/${page.slug ? `${page.slug}/` : ''}`),
  ...pages.map((page) => `${siteUrl}/${page.slug}/`),
  ...lguProductPages.map((page) => `${siteUrl}/${page.slug}/`),
  ...toolPages.map((page) => `${siteUrl}/${page.slug}/`),
  ...insightArticles.map((page) => `${siteUrl}/insights/${page.slug}/`)
];
writeFileSync(resolve(distDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>\n`);
writeFileSync(resolve(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
