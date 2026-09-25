import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const data = (name) => JSON.parse(readFileSync(resolve('src/data', name), 'utf8'));
const sitePages = data('sitePages.json');
const parcelPages = data('parcelPages.json');
const toolPages = data('toolPages.json');
const insightArticles = data('insightArticles.json');
const lguProductPages = data('lguProductPages.json');
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

for (const page of pages) {
  const url = `https://spatialdom.xyz/${page.slug ? `${page.slug}/` : ''}`;
  const path = resolve('dist', page.slug, 'index.html');
  if (!existsSync(path)) throw new Error(`Missing generated HTML: ${path}`);
  const html = readFileSync(path, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = attribute(html, /<meta name="description"[^>]*\/>/, 'content');
  const canonical = attribute(html, /<link rel="canonical"[^>]*\/>/, 'href');
  const ogUrl = attribute(html, /<meta property="og:url"[^>]*\/>/, 'content');
  const twitterUrl = attribute(html, /<meta name="twitter:url"[^>]*\/>/, 'content');
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
  if (page.family === 'sparta' && (!html.includes('Discuss Tax Mapping') || !html.includes('mailto:spatialdom@gmail.com'))) throw new Error(`Missing SPARTA contact flow: ${url}`);
  if (page.family === 'rbim' && (!html.includes('Request a Demo') || !html.includes('GIZ assistance') || !html.includes('Spatialdom did not create'))) throw new Error(`Missing RBIM CTA or attribution: ${url}`);
}

const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length !== pages.length || sitemapUrls.some((url) => !seenUrls.has(url))) throw new Error('Sitemap has missing or unexpected URLs.');
if (!existsSync(resolve('dist/404.html')) || !existsSync(resolve('dist/CNAME'))) throw new Error('GitHub Pages fallback or CNAME is missing.');
if (!readFileSync(resolve('dist/robots.txt'), 'utf8').includes('Allow: /')) throw new Error('robots.txt does not allow public content.');
console.log(`Validated ${pages.length} canonical pages, metadata, sitemap, and structured data.`);
