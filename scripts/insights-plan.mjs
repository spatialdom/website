export function plan(queue, articles, today, relaunch = false) {
  const review = queue.filter((issue) => issue.state === 'review').length;
  const drafts = queue.filter((issue) => issue.state === 'idea').slice(0, Math.min(5, Math.max(0, 20 - review)));
  const weekStart = new Date(`${today}T00:00:00Z`);
  weekStart.setUTCDate(weekStart.getUTCDate() - ((weekStart.getUTCDay() + 6) % 7));
  const alreadyPublished = articles.filter((article) => article.releasedAt && article.releasedAt >= weekStart.toISOString().slice(0, 10)).length;
  const limit = relaunch ? 6 : 1;
  const approved = queue.filter((issue) => ['approved', 'scheduled'].includes(issue.state) && (!relaunch || issue.legacy));
  const publish = approved.slice(0, Math.max(0, limit - alreadyPublished));
  return { review, draftCapacity: drafts.length, drafts: drafts.map((issue) => issue.number), publish: publish.map((issue) => issue.number), alreadyPublished };
}
