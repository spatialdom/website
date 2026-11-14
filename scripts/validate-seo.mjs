import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { allInsights, publishedInsights as insightArticles } from './insights-data.mjs';

const data = (name) => JSON.parse(readFileSync(resolve('src/data', name), 'utf8'));
const sitePages = data('sitePages.json');
const parcelPages = data('parcelPages.json');
const toolPages = data('toolPages.json');
const lguProductPages = data('lguProductPages.json');
const siteIdentity = data('siteIdentity.json');
const pages = [
  ...sitePages,
  ...parcelPages,
  ...toolPages,
  ...lguProductPages,
  ...insightArticles.map((article) => ({ ...article, slug: `insights/${article.slug}`, article: true }))
];
const seenTitles = new Set();
const seenDescriptions = new Set();
const seenUrls = new Set();
const sitemap = readFileSync(resolve('dist/sitemap.xml'), 'utf8');

function attribute(html, tag, name) {
  const match = html.match(tag);
  return match?.[0].match(new RegExp(`${name}="([^"]*)"`))?.[1];
}

function validateSiteIdentity(html, url) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  if (!head) throw new Error(`Missing initial HTML head: ${url}`);
  for (const pattern of [
    /<title\b[^>]*>/g,
    /<meta\b[^>]*\bname="description"[^>]*>/g,
    /<link\b[^>]*\brel="canonical"[^>]*>/g,
    ...['type', 'site_name', 'url', 'title', 'description'].map((name) => new RegExp(`<meta\\b[^>]*\\bproperty="og:${name}"[^>]*>`, 'g')),
    ...['card', 'title', 'description', 'url'].map((name) => new RegExp(`<meta\\b[^>]*\\bname="twitter:${name}"[^>]*>`, 'g'))
  ]) {
    if ([...head.matchAll(pattern)].length !== 1) throw new Error(`Missing or duplicate initial metadata (${pattern}): ${url}`);
  }
  if (attribute(head, /<meta\b[^>]*property="og:site_name"[^>]*>/, 'content') !== siteIdentity.name) throw new Error(`Incorrect site name: ${url}`);
  const graphs = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap((match) => {
    const value = JSON.parse(match[1]);
    return value['@graph'] ?? (Array.isArray(value) ? value : [value]);
  });
  const websites = graphs.filter((node) => [].concat(node['@type']).includes('WebSite'));
  const organizations = graphs.filter((node) => [].concat(node['@type']).includes('Organization'));
  if (websites.length !== 1 || websites[0].name !== siteIdentity.name || websites[0].url !== siteIdentity.url || websites[0]['@id'] !== `${siteIdentity.url}#website`) throw new Error(`Conflicting WebSite identity: ${url}`);
  if (organizations.length !== 1 || organizations[0].name !== siteIdentity.name || organizations[0].url !== siteIdentity.url || websites[0].publisher?.['@id'] !== organizations[0]['@id']) throw new Error(`Conflicting organization identity: ${url}`);
  const icons = [...head.matchAll(/<link\b[^>]*\brel="icon"[^>]*>/g)];
  if (icons.length !== 1 || attribute(icons[0][0], /<link[^>]*>/, 'href') !== siteIdentity.favicon || !existsSync(resolve('dist', siteIdentity.favicon.slice(1)))) throw new Error(`Missing stable favicon: ${url}`);
  if (/<meta\b[^>]*(?:name="(?:robots|googlebot)"[^>]*content="[^"]*\b(?:noindex|none)\b|content="[^"]*\b(?:noindex|none)\b[^"]*"[^>]*name="(?:robots|googlebot)")/i.test(head)) throw new Error(`Public page is marked noindex: ${url}`);
}

validateSiteIdentity(readFileSync(resolve('index.html'), 'utf8'), 'source index.html');

for (const page of pages) {
  const url = `${siteIdentity.url}${page.slug ? `${page.slug}/` : ''}`;
  const path = resolve('dist', page.slug, 'index.html');
  if (!existsSync(path)) throw new Error(`Missing generated HTML: ${path}`);
  const html = readFileSync(path, 'utf8');
  validateSiteIdentity(html, url);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = attribute(html, /<meta name="description"[^>]*\/>/, 'content');
  const canonical = attribute(html, /<link rel="canonical"[^>]*\/>/, 'href');
  const ogUrl = attribute(html, /<meta property="og:url"[^>]*\/>/, 'content');
  const twitterUrl = attribute(html, /<meta name="twitter:url"[^>]*\/>/, 'content');
  const ogTitle = attribute(html, /<meta property="og:title"[^>]*\/>/, 'content');
  const ogDescription = attribute(html, /<meta property="og:description"[^>]*\/>/, 'content');
  const twitterTitle = attribute(html, /<meta name="twitter:title"[^>]*\/>/, 'content');
  const twitterDescription = attribute(html, /<meta name="twitter:description"[^>]*\/>/, 'content');
  if (ogTitle !== title || twitterTitle !== title || ogDescription !== description || twitterDescription !== description) throw new Error(`Conflicting title or description: ${url}`);
  if (!page.slug && (title !== page.title || description !== page.description || !title.startsWith(`${siteIdentity.name} |`) || !description.startsWith(`${siteIdentity.name} `))) throw new Error('Homepage metadata does not match its brand and content configuration.');
  if (!title || !description || !html.includes('<h1') || seenTitles.has(title) || seenDescriptions.has(description)) throw new Error(`Missing or duplicate content metadata: ${url}`);
  if (canonical !== url || ogUrl !== url || twitterUrl !== url || !sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`Incorrect canonical or sitemap URL: ${url}`);
  if (seenUrls.has(url)) throw new Error(`Duplicate URL: ${url}`);
  seenTitles.add(title);
  seenDescriptions.add(description);
  seenUrls.add(url);
  if (page.slug) {
    const jsonldText = html.match(/<script id="route-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    if (!jsonldText) throw new Error(`Missing route JSON-LD: ${url}`);
    const graph = JSON.parse(jsonldText)['@graph'];
    if (!graph.some((item) => item['@type'] === 'BreadcrumbList')) throw new Error(`Missing breadcrumb JSON-LD: ${url}`);
    if (page.article && (!graph.some((item) => item['@type'] === 'Article') || !html.includes('Related product:'))) throw new Error(`Missing article content: ${url}`);
  }
  if (page.family === 'kadastra' && (!html.includes('Development deferred until after SMACCs') || html.includes('Discuss Tax Mapping'))) throw new Error(`Incorrect Kadastra availability: ${url}`);
  if (page.family === 'rbim' && (!html.includes('Request a Demo') || !html.includes('GIZ assistance') || !html.includes('Spatialdom did not create'))) throw new Error(`Missing RBIM CTA or attribution: ${url}`);
}

const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
for (const article of allInsights.filter((item) => item.state !== 'published')) {
  if (existsSync(resolve('dist/insights', article.slug, 'index.html')) || sitemap.includes(`/insights/${article.slug}/`)) throw new Error(`Unpublished Insight was made public: ${article.slug}`);
}
if (sitemapUrls.length !== pages.length || sitemapUrls.some((url) => !seenUrls.has(url))) throw new Error('Sitemap has missing or unexpected URLs.');
if (!existsSync(resolve('dist/404.html')) || !existsSync(resolve('dist/CNAME'))) throw new Error('GitHub Pages fallback or CNAME is missing.');
if (readFileSync(resolve('dist/CNAME'), 'utf8').trim() !== 'spatialdom.xyz') throw new Error('GitHub Pages custom domain must be spatialdom.xyz.');
const fallbackHtml = readFileSync(resolve('dist/404.html'), 'utf8');
if (!fallbackHtml.includes('<div id="root"></div>') || !fallbackHtml.includes('src="/assets/')) throw new Error('GitHub Pages SPA fallback is missing the app entry.');
if (!readFileSync(resolve('dist/index.html'), 'utf8').includes('src="/assets/')) throw new Error('Vite assets must use the custom-domain root base path.');
if (!readFileSync(resolve('dist/robots.txt'), 'utf8').includes('Allow: /')) throw new Error('robots.txt does not allow public content.');
console.log(`Validated ${pages.length} canonical pages, metadata, sitemap, and structured data.`);

// The design route and raw references are part of the existing Pages contract.
const designHtml = readFileSync('dist/design/guidelines/index.html', 'utf8');
const ids = [...designHtml.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate design page IDs');
for (const match of designHtml.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.includes(match[1])) throw new Error(`Broken design anchor: ${match[1]}`);
}
for (const match of designHtml.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) {
  const href = match[1];
  if (!existsSync(resolve('dist', '.' + href)) && !existsSync(resolve('dist', '.' + href, 'index.html'))) throw new Error(`Broken design asset or link: ${href}`);
}
for (const name of ['GUIDELINES.md', 'COMPONENTS.md', 'AGENTS_SNIPPET.md', 'tokens.json']) {
  if (readFileSync(`docs/design/${name}`, 'utf8') !== readFileSync(`dist/design/${name}`, 'utf8')) throw new Error(`Out-of-sync design reference: ${name}`);
  if (readFileSync(`docs/design/source-supplied/${name}`, 'utf8') !== readFileSync(`dist/design/source/${name}`, 'utf8')) throw new Error(`Out-of-sync original source: ${name}`);
}
const spartaHtml = readFileSync('dist/sparta/index.html', 'utf8');
if (!spartaHtml.includes('Professional Geodetic Engineering workspace') || /SPARTA (?:tax mapping|helps Assessor)/i.test(spartaHtml)) throw new Error('Incorrect SPARTA definition');
console.log('Validated design anchors, assets, raw reference parity and product definitions.');
