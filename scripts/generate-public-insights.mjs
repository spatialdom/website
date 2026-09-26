import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { allInsights, publishedInsights } from './insights-data.mjs';

const states = new Set(['idea', 'drafting', 'review', 'approved', 'scheduled', 'published']);
const clusters = new Set(JSON.parse(readFileSync(resolve('src/data/insightClusters.json'), 'utf8')).map((item) => item.key));
const slugs = new Set();
for (const article of allInsights) {
  if (!states.has(article.state) || !clusters.has(article.cluster) || !/^[a-z0-9-]+$/.test(article.slug) || slugs.has(article.slug)) throw new Error(`Invalid insight state, cluster, or slug: ${article.slug}`);
  slugs.add(article.slug);
  if (article.state === 'published') {
    for (const key of ['title', 'description', 'heading', 'intro', 'sections', 'product', 'sources']) {
      if (!article[key] || (Array.isArray(article[key]) && !article[key].length)) throw new Error(`Published article ${article.slug} lacks ${key}`);
    }
    if (!article.legacy && (!/^\d{4}-\d{2}-\d{2}$/.test(article.publishedAt ?? '') || !/^\d{4}-\d{2}-\d{2}$/.test(article.lastReviewed ?? ''))) throw new Error(`Published article ${article.slug} needs verified publication and review dates`);
  }
}
for (const article of publishedInsights) {
  if (article.related.some((slug) => !publishedInsights.some((item) => item.slug === slug))) throw new Error(`Published article ${article.slug} links to an unpublished article`);
}
writeFileSync(resolve('src/data/publishedInsights.generated.json'), JSON.stringify(publishedInsights, null, 2) + '\n');
console.log(`Generated public manifest with ${publishedInsights.length} published Insights.`);
