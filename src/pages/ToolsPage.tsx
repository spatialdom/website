import { Link } from 'react-router-dom';
import ToolLayout from '../shared/layout/ToolLayout';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { getToolPage } from '../shared/utils/toolPage';

const liveTools = [
  { title: 'Coordinate Converter', description: 'Convert Luzon 1911 longitude and latitude to PTM grid coordinates, or back again.', href: '/tools/coordinate-converter/', icon: 'coordinates' },
  { title: 'GeoJSON Viewer', description: 'Open a GeoJSON file, check its features, and inspect the data on a map.', href: '/tools/geojson-viewer/', icon: 'map' }
];

const plannedTools = [
  { title: 'Area & Distance Calculator', description: 'Measure simple areas and distances for planning.' },
  { title: 'Shapefile to GeoJSON Converter', description: 'Convert small shapefiles for use in web maps.' },
  { title: 'Parcel Sketch Generator', description: 'Sketch a parcel from bearings and distances.' }
];

function ToolsPage() {
  const page = getToolPage('tools');

  return (
    <ToolLayout title={page.heading} intro={page.intro}>
      <section aria-labelledby="available-tools">
        <div className="mb-5">
          <p className="section-label">Available now</p>
          <h2 id="available-tools" className="mt-2 text-2xl font-semibold text-text-primary">Choose a task</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {liveTools.map((tool) => (
            <Card key={tool.href} className="flex flex-col p-6">
              <div className="flex items-center justify-between gap-4">
                <Badge tone="success">Free tool</Badge>
                <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 fill-none stroke-accent" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {tool.icon === 'coordinates' ? <><path d="M4 16h24M16 4v24" /><circle cx="16" cy="16" r="6" /><circle cx="16" cy="16" r="1" /></> : <><path d="M5 7 12 5l8 2 7-2v20l-7 2-8-2-7 2zM12 5v20M20 7v20" /><circle cx="16" cy="15" r="2" /></>}
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-text-primary">{tool.title}</h3>
              <p className="mt-2 max-w-prose flex-1 leading-7 text-text-secondary">{tool.description}</p>
              <Link to={tool.href} className="interactive-accent mt-6 self-start">Open {tool.title}</Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border-subtle pt-8" aria-labelledby="planned-tools">
        <p className="section-label">In development</p>
        <h2 id="planned-tools" className="mt-2 text-xl font-semibold text-text-primary">More practical tasks</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {plannedTools.map((tool) => (
            <li key={tool.title} className="panel p-5">
              <h3 className="font-semibold text-text-primary">{tool.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{tool.description}</p>
              <span className="status-badge status-neutral mt-4">Coming soon</span>
            </li>
          ))}
        </ul>
      </section>
    </ToolLayout>
  );
}

export default ToolsPage;
