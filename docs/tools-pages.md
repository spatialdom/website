# Free tools pages

| Route | First thought | First action |
| --- | --- | --- |
| `/tools/` | These are free, practical geospatial utilities. | Choose Coordinate Converter or GeoJSON Viewer. |
| `/tools/coordinate-converter/` | This converts Luzon 1911 geographic and PTM grid coordinates. | Pick a direction and zone, then enter coordinates. |
| `/tools/geojson-viewer/` | This checks and maps a GeoJSON file in the browser. | Choose or drop a GeoJSON file. |

The tools are a utility destination, separate from Parcel Plotter, SPARTA, and RBIM Cloud. The conversion and file inspection run in the browser without sign-in. The GeoJSON map separately requests basemap tiles from its selected provider.

`src/data/toolPages.json` supplies titles, descriptions, and concise explanatory copy. The build writes real HTML for the three routes, with route-specific metadata and sitemap entries. The interactive tools load only on their own routes. `spatialdom:tool` browser events carry an action and tool name for future analytics; there is no listener, network tracking, or storage in this issue.
