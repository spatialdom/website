import type { InsightArticle } from './insights';

export function readingMinutes(article: InsightArticle) {
  const words = [article.heading, article.intro, ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs])]
    .join(' ').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}
