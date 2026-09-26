import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import sitePages from '../../data/sitePages.json';
import parcelPages from '../../data/parcelPages.json';
import toolPages from '../../data/toolPages.json';
import { publishedInsights as insightArticles } from '../../data/insights';
import lguProductPages from '../../data/lguProductPages.json';

const siteUrl = 'https://spatialdom.xyz';

function setMeta(selector: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
}

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const slug = pathname.replace(/^\/+|\/+$/g, '');
    const article = slug.startsWith('insights/') ? insightArticles.find((item) => `insights/${item.slug}` === slug) : undefined;
    const lguPage = lguProductPages.find((item) => item.slug === slug);
    const page = article ?? sitePages.find((item) => item.slug === slug)
      ?? parcelPages.find((item) => item.slug === slug)
      ?? toolPages.find((item) => item.slug === slug)
      ?? lguPage
      ?? sitePages[0];
    const canonicalSlug = article ? `insights/${article.slug}` : 'slug' in page ? page.slug : '';
    const url = `${siteUrl}/${canonicalSlug ? `${canonicalSlug}/` : ''}`;
    const type = article || (slug !== 'parcel-plotter' && parcelPages.some((item) => item.slug === slug)) ? 'article' : 'website';

    document.title = page.title;
    setMeta('meta[name="description"]', page.description);
    setMeta('meta[property="og:type"]', type);
    setMeta('meta[property="og:title"]', page.title);
    setMeta('meta[property="og:description"]', page.description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[name="twitter:title"]', page.title);
    setMeta('meta[name="twitter:description"]', page.description);
    setMeta('meta[name="twitter:url"]', url);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);

    document.getElementById('route-jsonld')?.remove();
    const graph: Record<string, unknown>[] = [];
    if (article) {
      graph.push({ '@type': 'Article', headline: article.heading, description: article.description, mainEntityOfPage: url, author: { '@type': 'Organization', name: 'Spatialdom' }, publisher: { '@type': 'Organization', name: 'Spatialdom' }, ...(article.publishedAt ? { datePublished: article.publishedAt } : {}), ...(article.lastReviewed ? { dateModified: article.lastReviewed } : {}) });
    }
    if (slug) {
      const parent = article ? [{ name: 'Insights', url: `${siteUrl}/insights/` }]
        : parcelPages.some((item) => item.slug === slug && slug !== 'parcel-plotter')
          ? [{ name: 'Parcel Plotter', url: `${siteUrl}/parcel-plotter/` }]
          : lguPage?.kind === 'guide'
            ? [{ name: lguPage.family === 'sparta' ? 'SPARTA' : 'RBIM Cloud', url: `${siteUrl}/${lguPage.family === 'sparta' ? 'sparta' : 'rbim-cloud'}/` }]
          : [];
      graph.push({ '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        ...parent.map((item, index) => ({ '@type': 'ListItem', position: index + 2, name: item.name, item: item.url })),
        { '@type': 'ListItem', position: parent.length + 2, name: lguPage?.kind === 'product' ? (lguPage.family === 'sparta' ? 'SPARTA' : 'RBIM Cloud') : page.heading, item: url }
      ] });
    }
    if (graph.length > 0) {
      const script = document.createElement('script');
      script.id = 'route-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}

export default RouteMetadata;
