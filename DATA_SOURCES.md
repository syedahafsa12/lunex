# Data Sources and Attribution

This document records the data sources and external data services found in the current LUNEX source code and prepared assets. NASA Space Apps requires sources to be cited even when data or materials are free or open source. Keep this file aligned with the actual assets and environment variables used by the final deployment.

## 1. NASA PGDA — LOLA Product 78 south-pole landing-site elevation models

**Source:** [High-Resolution LOLA Topography for Lunar South Pole Sites — NASA PGDA Product 78](https://pgda.gsfc.nasa.gov/products/78)  
**Direct data catalogue:** [NASA PGDA South Pole Landing Site LOLA DEMs](https://pgda.gsfc.nasa.gov/data/LOLA_5mpp/)

**Data used in LUNEX:** locally prepared elevation rasters and metadata for:
- Site 04 — Shackleton Rim
- Site 11 — de Gerlache Rim
- Site 23 — Malapert Massif

**How it contributes:** Product 78 elevation values are used to render the high-resolution local terrain map, convert between raster pixels and geographic coordinates, sample the observer's elevation, and calculate a directional terrain-horizon profile used in the Sun/Earth screening.

**Local derived files:**
- `public/data/site04_shackleton_rim/metadata.json`
- `public/data/site04_shackleton_rim/elevation.bin`
- `public/data/site11_de_gerlache_rim/metadata.json`
- `public/data/site11_de_gerlache_rim/elevation.bin`
- `public/data/site23_malapert_massif/metadata.json`
- `public/data/site23_malapert_massif/elevation.bin`

The binary elevation files are application-ready derivatives of the NASA elevation rasters, not the original GeoTIFF distribution files. Their metadata records Float32, little-endian values, a 5 m pixel spacing, south-polar stereographic coordinates, MOON_ME reference frame and DE421 ephemeris.

**Scientific qualification:** NASA PGDA describes the polar DEMs as 5 m/pixel products and notes that approximately 90% of their 5 m pixels are interpolated because LOLA's cross-track and inter-spot spacing is sparse. The 5 m figure is pixel spacing, not a claim that every elevation is accurate to 5 m. The PGDA page also describes height and slope uncertainty. LUNEX currently uses the elevation rasters for sampled local horizon screening; it does not claim a globally complete horizon.

**Suggested attribution:** “Elevation data: NASA Goddard Space Flight Center, Planetary Geology, Geophysics and Geochemistry Laboratory (PGDA), LOLA Product 78 — High-Resolution LOLA Topography for Lunar South Pole Sites.”

## 2. NASA/JPL Horizons — Sun and Earth ephemerides

**API endpoint:** [https://ssd.jpl.nasa.gov/api/horizons.api](https://ssd.jpl.nasa.gov/api/horizons.api)  
**API documentation:** [JPL Horizons API documentation](https://ssd-api.jpl.nasa.gov/doc/horizons.html)  
**Horizons system:** [https://ssd.jpl.nasa.gov/horizons/](https://ssd.jpl.nasa.gov/horizons/)

**How it contributes:** The mission APIs request time-specific Sun and Earth observations for the selected lunar observer location. The returned observations provide celestial direction and apparent-position information used by the mission dashboard and terrain-relative visibility calculations. The application sends UTC mission epochs to the API; the front end does not invent or linearly interpolate celestial positions.

**Suggested attribution:** “Ephemerides: NASA/JPL Solar System Dynamics, Horizons System.”

## 3. NASA Moon Trek — LRO Wide Angle Camera South Pole mosaic

**Viewer:** [NASA Moon Trek](https://trek.nasa.gov/moon/)  
**Tile service used by the application:**

`https://trek.nasa.gov/tiles/Moon/SP/LRO_WAC_Mosaic_SPole60_100mp/1.0.0/default/default028mm/{z}/{y}/{x}.png`

**How it contributes:** The tile layer provides regional lunar south-pole context in the landing planner. It is a regional orientation layer; the high-resolution clickable local elevation map uses the Product 78 raster assets described above.

**Attribution present in source code:** “Imagery: NASA / JPL / LRO Wide Angle Camera.”

NASA Moon Trek identifies map data providers including NASA, JPL, Dawn, USGS and DLR. The specific layer used by LUNEX is identified in the URL as the LRO WAC South Pole mosaic.

## 4. LROC Narrow Angle Camera South Pole mosaic via Lunaserv WMS

**Service:** [Lunaserv WMS](https://wms.im-ldi.com/)  
**LROC Science Operations Center terms and citation policy:** [https://www.lroc.im-ldi.com/about/terms](https://www.lroc.im-ldi.com/about/terms)

**WMS layer used by the application:** `luna_nac_pole_control_south`  
**WMS coordinate reference:** `IAU2000:30120`  
**WMS operation:** `GetMap` (WMS 1.1.1, PNG response)

**How it contributes:** The 360-degree explorer requests a controlled LROC South Pole Narrow Angle Camera average mosaic to provide image context over the LOLA-derived elevation geometry. If this imagery is unavailable, the explorer can fall back to LOLA-only shaded terrain.

**Required credit for educational use:** “NASA/GSFC/Arizona State University (ASU), Lunar Reconnaissance Orbiter Camera (LROC).”

**Terms qualification:** The LROC SOC terms state that PDS-delivered LROC data products are public domain. They also state that images served through the LROC website, including curated products and non-PDS interfaces, are copyrighted; educational use is permitted without prior permission when properly cited, while commercial use of images not downloaded from the LROC PDS archive requires prior permission. LUNEX accesses the controlled mosaic through the Lunaserv WMS. Do not describe this WMS mosaic as an Apache-licensed asset or assume that the PDS public-domain statement automatically covers every curated WMS layer.

For Lunaserv-delivered imagery used in research, the LROC SOC requests citation of the Lunaserv WMS paper by Estes et al. (2013), the LROC EDR citation by Robinson (2010), and the LROC instrument overview by Robinson et al. (2010); see the LROC terms page for full reference details.

## 5. NASA Goddard Scientific Visualization Studio — lunar 3D model

**Source:** [Moon 3D Models for Web, AR, and Animation — NASA SVS item 14959](https://svs.gsfc.nasa.gov/14959)  
**Model filename referenced by the homepage:** `Moon_NASA_LRO_8k_Topo_Small.glb`

**How it contributes:** The homepage source references this NASA LRO/LOLA topographic Moon model for the global 3D orientation preview. The SVS item credits NASA's Goddard Space Flight Center; producer Dan Gallagher (eMITS); data provider Ernie Wright (USRA); data analysts Tuomas Kankola and Josh Klint; and technical support Aaron E. Lepsch.

**Important repository check:** The model file itself was not present in the GitHub `main` file tree inspected for this notice. The code can also load a URL supplied through `NEXT_PUBLIC_LUNEX_MOON_MODEL_URL`. Confirm the actual URL configured in the final deployment and ensure it points to the cited NASA SVS asset or another separately documented source. The NASA SVS help page states that its content is public domain unless an item is otherwise noted; NASA media usage rules and credit requirements still apply.

## 6. Earth Blue Marble texture served from the three-globe example assets

**Asset URL used in source code:**
[https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg](https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg)

**Upstream asset directory:** [vasturiano/three-globe — example/img](https://github.com/vasturiano/three-globe/tree/master/example/img)

**How it contributes:** This image is used as an Earth surface texture in the 3D explorer. The image is an asset distributed in the three-globe example directory; the package's software licence does not automatically replace the image's own source and usage terms. The file is identified as a NASA Blue Marble texture; follow NASA media usage guidance and credit NASA. Do not treat the image as licensed under the LUNEX Apache 2.0 licence.

## 7. Fonts loaded from Google Fonts

The homepage requests the following font families from Google Fonts:
- DM Mono — [upstream project](https://github.com/googlefonts/dm-mono)
- Inter — [upstream project](https://github.com/rsms/inter)
- Public Sans — [upstream project](https://github.com/uswds/public-sans)

These font families are distributed under the SIL Open Font License 1.1 (OFL-1.1). The fonts are separate third-party works and are not relicensed by the LUNEX Apache 2.0 licence. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## 8. Locally bundled image files awaiting source confirmation

The repository contains these additional image files:
- `public/textures/earth_daymap.jpg`
- `public/textures/nasa-lunar-crater.webp`
- `public/textures/quickmap-lroc.png`
- `nasa-south-pole-test.png`

The current source files inspected did not establish a reliable original source, creator, download URL or licence for these files. Their filenames alone are not adequate provenance. Before final public distribution, identify the exact original source and applicable terms for each file, or remove files that are unused and whose provenance cannot be established.

## References

- [NASA 2026 Space Apps Participant Terms and Conditions](https://www.spaceappschallenge.org/legal/)
- [NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/)
- [NASA PGDA Product 78](https://pgda.gsfc.nasa.gov/products/78)
- [NASA Moon Trek](https://trek.nasa.gov/moon/)
- [LROC Terms of Use and Citation Policy](https://www.lroc.im-ldi.com/about/terms)
- [NASA SVS Moon 3D Models, item 14959](https://svs.gsfc.nasa.gov/14959)
- [JPL Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html)
