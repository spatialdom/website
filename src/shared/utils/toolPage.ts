import toolPages from '../../data/toolPages.json';

export type ToolSlug = 'tools' | 'tools/coordinate-converter' | 'tools/geojson-viewer';

export function getToolPage(slug: ToolSlug) {
  const page = toolPages.find((item) => item.slug === slug);
  if (!page) throw new Error(`Missing tool page: ${slug}`);
  return page;
}
