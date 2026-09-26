export type InsightState = 'idea' | 'drafting' | 'review' | 'approved' | 'scheduled' | 'published';

export interface InsightArticle {
  slug: string;
  cluster: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  state: InsightState;
  publishedAt: string | null;
  lastReviewed: string | null;
  releasedAt?: string | null;
  legacy?: boolean;
  disclaimer?: string;
  sections: { id: string; heading: string; paragraphs: string[] }[];
  related: string[];
  product: { name: string; href: string; label: string };
  sources: { label: string; url: string }[];
}

import publicArticles from './publishedInsights.generated.json';

export const publishedInsights = (publicArticles as InsightArticle[])
  .sort((a, b) => a.heading.localeCompare(b.heading));
