# LUNEX — Lunar Landing Site Navigator

LUNEX is a lunar south-pole mission-planning prototype. It combines local lunar elevation data with time-dependent Sun and Earth observations to help a planner inspect a selected landing point and explore when both targets may clear the available local terrain.

> **Scientific scope:** LUNEX is a decision-support and visualization prototype. It does not certify a safe landing site, guarantee solar power, calculate an RF communications link budget, or establish overall mission suitability. Positive terrain-clearance results are provisional when the complete horizon is not verified.

## What the application does

- Provides a south-polar regional map using NASA Moon Trek / LRO Wide Angle Camera tiles.
- Provides high-resolution, clickable LOLA terrain maps for the locally prepared Product 78 sites:
  - Site 04 — Shackleton Rim
  - Site 11 — de Gerlache Rim
  - Site 23 — Malapert Massif
- Resolves the selected geographic observer location and its raster pixel position from the chosen Product 78 terrain map.
- Requests observer-based Sun and Earth ephemerides from NASA/JPL Horizons for a selected UTC epoch.
- Samples a local terrain horizon and displays geometric and terrain-relative celestial measurements.
- Searches sampled UTC times for potential simultaneous Sun/Earth visibility and separates provisional candidates from verified results.
- Provides a 360-degree surface explorer for inspecting the selected location.

The Product 78 catalogue contains more registered site entries, but only the three sites listed above have prepared local elevation assets in this repository's current deployment path. Registry entries must not be interpreted as proof that a local raster is available.

## Scientific data and limitations

The local elevation assets are derived from NASA PGDA's LOLA Product 78 south-pole landing-site DEMs. The source product is distributed at 5 m/pixel, in a south-polar stereographic coordinate system, with the MOON_ME reference frame and DE421 ephemeris. NASA's product description notes that approximately 90% of the 5 m pixels in these polar DEMs are interpolated. Pixel spacing is not the same as absolute measurement accuracy.

LUNEX calculates a sampled local horizon from the available raster. Raster boundaries and missing terrain beyond the available coverage can hide obstructions. A positive clearance therefore describes the sampled terrain only unless complete horizon coverage is independently verified. Current responses explicitly report incomplete coverage.

The daily joint-visibility analysis uses sampled observations. Its candidate windows are estimates at the sampling interval, not exact astronomical rise/set crossings.

See [DATA_SOURCES.md](DATA_SOURCES.md) for data provenance and citations, and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for software and asset licensing notes.

## Technology

- Next.js, React and TypeScript
- Three.js, React Three Fiber and Drei
- OpenLayers, GeoTIFF and proj4
- NASA PGDA LOLA Product 78 elevation assets
- NASA/JPL Horizons API
- NASA Moon Trek / LRO WAC map tiles
- LROC NAC imagery through the Lunaserv WMS

Exact dependency versions are recorded in [package-lock.json](package-lock.json).

## Run locally

Requirements: Node.js compatible with the Next.js version in `package.json`.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build and start:

```bash
npm run build
npm run start
```

Available project checks:

```bash
npm run test:integration
npm run test:explorer
```

## Repository documentation

- [DATA_SOURCES.md](DATA_SOURCES.md) — NASA and other data sources, endpoints, attribution and use in the application.
- [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) — dependency licences, fonts, models, imagery and unresolved provenance items.
- [AI_USAGE.md](AI_USAGE.md) — AI/SI tool disclosure.
- [LICENSE](LICENSE) — Apache License 2.0 for original LUNEX project code and documentation that the team is authorized to license.

## Licence scope

The Apache 2.0 licence in this repository applies only to original LUNEX work for which the project contributors have the right to grant that licence. It does **not** relicense NASA datasets, NASA/JPL imagery, LROC materials, external 3D models, fonts, third-party libraries, or any other separately licensed material. Their respective source terms and notices continue to apply.

Before final public submission, resolve every item marked **PROVENANCE / LICENCE REVIEW REQUIRED** in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). NASA Space Apps requires citations for all sources, including material that is free or open source, and requires applicable third-party licences to be identified.
