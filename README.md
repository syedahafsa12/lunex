# Lunex — Lunar Landing Site Navigator

Lunex is a lunar south-pole exploration and mission-planning prototype. It brings interactive lunar maps, local elevation data, 3D terrain visualization, and time-specific Sun and Earth observations into one workspace.

Users can choose a prepared south-pole site, select a position on its terrain map, choose a UTC date and time, and examine how the local terrain affects the apparent visibility of the Sun and Earth.

## Explore Lunex

The main application flow is:

1. **Choose a region and site.** Browse the lunar south-pole context map and select Shackleton Rim, de Gerlache Rim, or Malapert Massif.
2. **Select a position.** Click a point on the prepared Product 78 terrain map. Lunex resolves the selected map pixel to its geographic coordinates and elevation.
3. **Inspect the terrain.** Explore the local surface in the terrain view and 360-degree explorer.
4. **Set the observation time.** Choose a UTC date and time for the selected lunar location.
5. **Review Sun and Earth visibility.** Lunex requests observer-based ephemerides from NASA/JPL Horizons and compares the apparent target positions with the sampled local terrain horizon.
6. **Explore mission windows.** Review individual observations, daily joint-visibility candidates, and visibility-cycle analysis.

## Main features

- **Lunar south-pole map:** Regional map context using NASA Moon Trek and the LRO Wide Angle Camera south-pole mosaic.
- **Prepared landing-site terrain:** Interactive Product 78 elevation maps for Shackleton Rim, de Gerlache Rim, and Malapert Massif.
- **Map-based position selection:** Geographic coordinates, raster pixels, and local elevation are resolved from the selected point.
- **3D lunar exploration:** Global Moon visualization and a 360-degree view of the selected local terrain.
- **Sun and Earth ephemerides:** Time-specific apparent positions and angular sizes from NASA/JPL Horizons for a lunar-surface observer.
- **Terrain-relative visibility:** Sampled terrain-horizon screening for the Sun and Earth.
- **Mission analysis:** Observation-time inspection, daily joint-visibility search, and visibility-cycle analysis.
- **Optional lunar imagery:** Controlled LROC South Pole NAC imagery can be requested as an image layer through the Lunaserv WMS proxy.
- **Terrain coverage awareness:** The application distinguishes obstructions found in available terrain samples from results where terrain coverage is incomplete.

## Prepared terrain sites

Lunex uses NASA PGDA LOLA Product 78 as its primary local elevation source. The following three sites have prepared elevation rasters in this repository:

| Product 78 site | Lunex location |
|---|---|
| Site 04 | Shackleton Rim |
| Site 11 | de Gerlache Rim |
| Site 23 | Malapert Massif |

The site registry also contains other Product 78 candidate locations. A registry entry is not the same as a prepared local elevation raster; the site-discovery API reports asset readiness.

### Product 78 resolution

The prepared terrain grids use 5 m pixel spacing. NASA notes that approximately 90% of the pixels in the Product 78 5 m grids are interpolated because LOLA laser tracks and measurement spots do not sample every grid cell. The 5 m value describes the grid spacing, not an independent laser measurement at every pixel.

## Data sources

| Source | How Lunex uses it |
|---|---|
| [NASA LOLA Product 78](https://pgda.gsfc.nasa.gov/products/78) | Primary local elevation data for terrain visualization, position sampling, and terrain-horizon analysis. |
| [NASA/JPL Horizons](https://ssd.jpl.nasa.gov/horizons/) | Time-specific Sun and Earth observer ephemerides for selected lunar locations. |
| [NASA Moon Trek](https://trek.nasa.gov/moon/) | Regional lunar south-pole map context from the LRO WAC mosaic. |
| [LROC South Pole NAC mosaic](https://data.lroc.im-ldi.com/lroc/view_rdr/NAC_POLE_SOUTH_CM_AVG) | Optional high-resolution image context through Lunaserv WMS. |
| [NASA LOLA Product 90](https://pgda.gsfc.nasa.gov/products/90) | Optional supplementary regional terrain data; not the primary prepared-site terrain source. |

More detailed source descriptions, citations, and scientific context are available in [DATA_SOURCES.md](DATA_SOURCES.md). Third-party software, imagery, model, font, and license notices are recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Application routes

| Route | Purpose |
|---|---|
| `/` | Lunex home page and project overview |
| `/map` | Regional map and prepared-site selection |
| `/mission-data` | Selected-position Sun/Earth observation and mission data |
| `/explorer` | 360-degree selected-location terrain explorer |

## API reference

The Next.js application includes server-side route handlers for site discovery, terrain data, JPL Horizons requests, and lunar imagery. The browser calls these endpoints on the same application origin.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/product78/sites` | Lists Product 78 candidate sites and reports local elevation/science-asset readiness. |
| `GET` | `/api/product78/terrain-preview?siteId={siteId}` | Returns a downsampled binary terrain preview with its metadata in response headers. |
| `GET` | `/api/product78/science-sample?siteId={siteId}&col={column}&row={row}` | Samples elevation and available Product 78 science-layer values at a raster pixel. |
| `GET` | `/api/horizons?date=YYYY-MM-DD&siteId={siteId}` | Returns the selected site's date-based Sun/Earth observations and terrain-relative analysis. |
| `GET` | `/api/horizons/selected-location` | Analyzes a selected site position for a requested date, time, and duration. |
| `GET` | `/api/horizons/mission-analysis` | Runs observation, daily joint-visibility, or visibility-cycle analysis. |
| `GET` | `/api/lunar-imagery/nac-south-pole` | Retrieves the selected-location LROC NAC image through the Lunaserv WMS service. |
| `POST` | `/terrain-selection` | Samples available terrain at a supplied lunar latitude and east-positive longitude. |

### Mission-analysis modes

`/api/horizons/mission-analysis` supports these `mode` values:

- `observation` — evaluates the Sun and Earth for a selected UTC date and time.
- `joint-visibility-day` — samples a UTC day to identify candidate periods when both targets may be visible above the sampled terrain.
- `visibility-cycle` — evaluates a requested mission/emission duration, up to 168 hours, and identifies potential joint-visibility periods.

### Selected-location parameters

The `/api/horizons/selected-location` endpoint accepts:

- `siteId` — prepared Product 78 site identifier.
- `date` and `time` — requested UTC date and time.
- `durationHours` — one of 6, 12, 24, 48, or 72 hours.
- `lat` and `lon` — optional selected latitude and east-positive longitude.
- `pixelColumn` and `pixelRow` — optional raster pixel pair used to validate the selected map position.
- `includeProduct90=true` — optional request for supplementary regional terrain.

The route handlers validate coordinates and site identifiers and return structured error responses for invalid requests or unavailable data.

## Technology

- **Application:** Next.js 16, React 19, TypeScript
- **3D visualization:** Three.js, React Three Fiber, Drei
- **Mapping:** OpenLayers
- **Geospatial data:** GeoTIFF and proj4
- **Scientific data:** NASA PGDA LOLA Product 78, NASA/JPL Horizons
- **Imagery services:** NASA Moon Trek and LROC/Lunaserv WMS

Dependency versions are recorded in [package-lock.json](package-lock.json).

## Run locally

### Requirements

- Node.js version supported by Next.js 16
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL printed by Next.js in the terminal (by default, `http://localhost:3000`).

### Create and run a production build

```bash
npm run build
npm run start
```

## Tests and validation

The repository provides the following checks:

```bash
npm run lint
npm run test:integration
npm run test:explorer
```

- `lint` runs ESLint.
- `test:integration` validates the Lunex integration flow, including the Horizons response and terrain-horizon structure.
- `test:explorer` validates the explorer's terrain and visualization integration.

These checks should be run against the same source revision and deployment configuration used for the final release.

## Deployment

Lunex is deployed on **Render**. The Next.js application contains both the user interface and server-side API route handlers, so the application must run as a Node.js web service. A static-only export would not provide the API endpoints or server-side Horizons requests.

Typical Render commands for this Next.js service:

**Build command**

```bash
npm ci && npm run build
```

**Start command**

```bash
npm run start
```

The frontend makes same-origin requests to the `/api/...` route handlers. Keep those handlers available on the deployed application origin.

## Scientific scope and limitations

Lunex is a planning and visualization prototype. Its results should be interpreted within the limits of the underlying data and calculations:

- Terrain-horizon analysis uses sampled local Product 78 elevation coverage. Terrain outside the available raster or beyond the configured search distance is not established as unobstructed.
- A target above the sampled horizon is a candidate visibility result, not proof of complete global visibility.
- Daily and mission-cycle windows are based on discrete time samples; they are not exact rise/set crossing predictions.
- Sun visibility is not a solar-array power or thermal model.
- Earth visibility is geometric terrain screening, not a communications link budget.
- The application does not certify landing safety or overall mission suitability and is not flight software.

## Project documentation

- [DATA_SOURCES.md](DATA_SOURCES.md) — datasets, services, attribution, and how they are used.
- [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) — third-party dependencies, software licenses, image and model credits.
- [AI_USAGE.md](AI_USAGE.md) — AI/SI tools disclosure.
- [LICENSE](LICENSE) — Apache License 2.0 for original Lunex project material covered by that license.

## License

Lunex's original project code is released under the Apache License 2.0. This license does not replace the separate licenses, terms, or attribution requirements for NASA and partner-agency data, third-party imagery and 3D models, fonts, or software dependencies. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the corresponding notices.
