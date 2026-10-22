import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const directory = resolve('src/data/insights');
export const allInsights = readdirSync(directory).filter((file) => file.endsWith('.json')).map((file) => {
  const article = JSON.parse(readFileSync(resolve(directory, file), 'utf8'));
  if (file !== `${article.slug}.json`) throw new Error(`Insight filename does not match slug: ${file}`);
  return article;
});

export function toPublicArticle({ candidate, reviewApproval, reviewerNotes, ...article }) {
  return article;
}

export function publicManifest(articles) {
  const published = articles.filter((article) => article.state === 'published');
  const slugs = new Set(published.map((article) => article.slug));
  return published.map((article) => ({ ...toPublicArticle(article), related: article.related.filter((slug) => slugs.has(slug)) }));
}

export const publishedInsights = publicManifest(allInsights);
export function readingMinutes(article) {
  const words = [article.heading, article.intro, ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs])]
    .join(' ').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}
