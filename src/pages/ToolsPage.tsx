import { Link } from 'react-router-dom';
import ToolLayout from '../shared/layout/ToolLayout';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

const tools = [
  {
    title: 'Coordinate Converter',
    description: 'Convert decimal latitude and longitude to UTM coordinates and back in a fast browser workflow.',
    href: '/tools/coordinate-converter',
    status: 'live' as const
  },
  {
    title: 'GeoJSON Viewer',
    description: 'Inspect features, coordinates, and geometry structure directly in the browser.',
    href: '/tools/geojson-viewer',
    status: 'live' as const
  },
  {
    title: 'Area & Distance Calculator',
    description: 'Quick browser-based measurements for parcels, boundaries, and field planning.',
    href: '#',
    status: 'coming soon' as const
  },
  {
    title: 'Shapefile to GeoJSON Converter',
    description: 'Client-side conversion for lightweight shapefile uploads and quick GeoJSON export.',
    href: '#',
    status: 'coming soon' as const
  },
  {
    title: 'Parcel Sketch Generator',
    description: 'Generate clean parcel sketch outputs from structured bearings, distances, and point sequences.',
    href: '#',
    status: 'coming soon' as const
  }
];

function ToolsPage() {
  return (
    <ToolLayout
      title="Tools"
      intro="Spatialdom micro tools are lightweight frontend-only utilities for practical geospatial work. The launcher is designed to stay minimal while giving future tools a clear, scalable entry point."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="p-6">
            <div className="flex h-full flex-col gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge tone={tool.status === 'live' ? 'success' : 'neutral'}>
                    {tool.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-text-primary">{tool.title}</h2>
                  <p className="text-sm leading-7 text-text-body">{tool.description}</p>
                </div>
              </div>

              <div className="mt-auto">
                {tool.status === 'live' ? (
                  <Link to={tool.href} className="interactive-accent inline-flex items-center">
                    Open tool
                  </Link>
                ) : (
                  <span className="status-badge status-neutral">Coming soon</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ToolLayout>
  );
}

export default ToolsPage;
