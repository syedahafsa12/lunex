# LunaPath Backend

Initial backend foundation for lunar landing-site discovery.

## Current functionality

- Product78 lunar site registry.
- `GET /api/product78/sites` site discovery endpoint.
- Local metadata and elevation asset readiness checks.
- Basic raster metadata and binary-size validation.

## Data source

NASA PGDA LOLA Product78:
https://pgda.gsfc.nasa.gov/products/78

## Current scope

This initial backend slice does not include the frontend, JPL
Horizons calculations, terrain visualization, or large raster files.

Sites without local metadata and elevation assets are reported
as `not_prepared`.

## Development

```bash
npm install
npm run dev
```

API endpoint:

`http://localhost:3000/api/product78/sites`