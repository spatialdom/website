import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import { publishedInsights as articles } from '../data/insights';
import clusters from '../data/insightClusters.json';

const activeClusters = clusters.filter((cluster) => articles.some((article) => article.cluster === cluster.key));

function InsightsPage() {
  return (
    <main className="pb-16 pt-32 sm:pt-40">
      <Container className="max-w-5xl">
        <header className="max-w-3xl">
          <p className="section-label">Insights</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-text-primary">Practical spatial questions</h1>
          <p className="mt-4 text-lg leading-8 text-text-secondary">Guides for reading land records, managing property maps, and working responsibly with local household data.</p>
        </header>
        <nav aria-label="Insight topics" className="mt-8 flex flex-wrap gap-3">
          {activeClusters.map((cluster) => <a key={cluster.key} className="interactive-outline" href={`#${cluster.key}`}>{cluster.label}</a>)}
        </nav>
        <div className="mt-12 space-y-14">
          {activeClusters.map((cluster) => (
            <section key={cluster.key} id={cluster.key} className="scroll-mt-32" aria-labelledby={`${cluster.key}-heading`}>
              <h2 id={`${cluster.key}-heading`} className="text-2xl font-semibold text-text-primary">{cluster.label}</h2>
              <p className="mt-2 max-w-prose text-text-secondary">{cluster.description}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {articles.filter((article) => article.cluster === cluster.key).map((article) => (
                  <article key={article.slug} className="panel flex flex-col p-6">
                    <h3 className="text-xl font-semibold text-text-primary">{article.heading}</h3>
                    <p className="mt-2 flex-1 leading-7 text-text-secondary">{article.intro}</p>
                    <Link to={`/insights/${article.slug}/`} className="text-link mt-5 self-start">Read guide</Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
        <section className="mt-14 border-t border-border-subtle pt-8" aria-labelledby="map-data-heading">
          <h2 id="map-data-heading" className="text-2xl font-semibold text-text-primary">Coordinates & map data</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article id="coordinate-systems" className="panel scroll-mt-32 p-6">
              <h3 className="text-xl font-semibold text-text-primary">Why coordinate systems and zones matter</h3>
              <p className="mt-3 leading-7 text-text-secondary">Longitude and latitude are angular positions. A projected grid uses linear coordinates. Before converting, confirm the source datum and zone; a plausible result in the wrong zone can still be misplaced.</p>
              <Link to="/tools/coordinate-converter/" className="text-link mt-4 inline-block">Use the Luzon 1911 coordinate converter</Link>
            </article>
            <article id="geojson-basics" className="panel scroll-mt-32 p-6">
              <h3 className="text-xl font-semibold text-text-primary">How to read GeoJSON coordinates</h3>
              <p className="mt-3 leading-7 text-text-secondary">Standard GeoJSON uses WGS 84 longitude, then latitude. A feature may describe a point, line, or polygon and can carry properties. Check the coordinate reference before trusting its map position.</p>
              <Link to="/tools/geojson-viewer/" className="text-link mt-4 inline-block">Open the GeoJSON viewer</Link>
            </article>
          </div>
        </section>
      </Container>
    </main>
  );
}

export default InsightsPage;
