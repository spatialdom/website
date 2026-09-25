import { useEffect } from 'react';
import toolPages from '../../data/toolPages.json';

export type ToolSlug = 'tools' | 'tools/coordinate-converter' | 'tools/geojson-viewer';

export function getToolPage(slug: ToolSlug) {
  const page = toolPages.find((item) => item.slug === slug);
  if (!page) throw new Error(`Missing tool page: ${slug}`);
  return page;
}

function setMeta(selector: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
}

export function useToolMetadata(slug: ToolSlug) {
  useEffect(() => {
    const page = getToolPage(slug);
    const url = `https://spatialdom.xyz/${slug}/`;
    document.title = page.title;
    setMeta('meta[name="description"]', page.description);
    setMeta('meta[property="og:type"]', 'website');
    setMeta('meta[property="og:title"]', page.title);
    setMeta('meta[property="og:description"]', page.description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[name="twitter:title"]', page.title);
    setMeta('meta[name="twitter:description"]', page.description);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);

    return () => {
      document.title = 'Spatialdom';
      setMeta('meta[name="description"]', 'Spatialdom builds practical spatial systems for land, property, and communities. Explore Parcel Plotter, SPARTA, and RBIM Cloud.');
      setMeta('meta[property="og:type"]', 'website');
      setMeta('meta[property="og:title"]', 'Spatialdom');
      setMeta('meta[property="og:description"]', 'Practical spatial systems for land, property, and communities. Find the Spatialdom product path for your work.');
      setMeta('meta[property="og:url"]', 'https://spatialdom.xyz/');
      setMeta('meta[name="twitter:title"]', 'Spatialdom');
      setMeta('meta[name="twitter:description"]', 'Practical spatial systems for land, property, and communities.');
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', 'https://spatialdom.xyz/');
    };
  }, [slug]);
}
