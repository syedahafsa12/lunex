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

## 5. NASA Goddard Scientific Visualization Studio — global lunar 3D model

**Exact model:** `Moon_NASA_LRO_8k_Topo_Small.glb` (77.7 MB)  
**NASA source:** [Moon 3D Models for Web, AR, and Animation — NASA SVS item 14959](https://svs.gsfc.nasa.gov/14959/)  
**Direct NASA asset URL used by the original project setup script:**  
`https://svs.gsfc.nasa.gov/vis/a010000/a014900/a014959/Moon_NASA_LRO_8k_Topo_Small.glb`

The original Lunex model setup instructions and download script identify this exact NASA SVS filename and download endpoint. NASA describes it as an LRO-derived global colour-and-height-map Moon model for web interactives, AR and animation. It is for global orientation/context only; it is not the local 5 m/pixel Product 78 south-pole DEM and must not be used as the terrain-horizon input.

**NASA SVS credits:**
- NASA's Goddard Space Flight Center
- Producer: Dan Gallagher (eMITS)
- Data provider: Ernie Wright (USRA)
- Data analysts: Tuomas Kankola and Josh Klint (Leadwerks Game Engine)
- Technical support: Aaron E. Lepsch (ADNET Systems, Inc.)

NASA SVS states that its content is public domain unless an item is otherwise noted. Follow [NASA's media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) and retain the credit above.

**Repository/deployment note:** `.gitignore` excludes all `.glb` files, so the binary is not present in the GitHub `main` tree. The homepage falls back to `/models/Moon_NASA_LRO_8k_Topo_Small.glb` unless `NEXT_PUBLIC_LUNEX_MOON_MODEL_URL` is configured. Confirm that the deployed URL resolves to the exact NASA SVS asset before submission. The source attribution is established; the actual production asset URL is not verifiable from this repository.

## 6. NASA 3D Resources — Earth and Sun model source candidates

The current explorer code contains references to `/models/earth.glb` and `/models/sun.glb`. Those binary files are not present in the GitHub `main` tree, and the repository-wide `.gitignore` excludes `*.glb`. No checksums, creator metadata, source URLs or original licences for those exact local filenames are recorded in the repository. Therefore, their actual source cannot be confirmed from the files available for this audit.

NASA publishes official 3D model resources that could be used as documented replacements:
- **Sun:** [Sun 3D Model Interactive — NASA Science](https://science.nasa.gov/learn/heat/resource/sun-3d-model/). NASA lists a downloadable glTF model (4.14 MB; published 9 September 2023).
- **Earth:** [Earth with Clouds 3D Model — NASA Science](https://science.nasa.gov/resource/earth-with-clouds-3d-model/). NASA identifies NASA Visualization Technology Applications and Development (VTAD) as the credit and lists a glTF model (18.05 MB).
- **Earth alternative:** [Earth 3D Model — NASA Science](https://science.nasa.gov/3d-resources/earth/). This page describes an Earth 3D-print model generated using NASA data and a custom texture.

These official NASA pages are candidate replacement sources only. **They are not evidence that the untracked `earth.glb` or `sun.glb` files in the deployed runtime are the same models.** Do not attribute the current runtime files to NASA unless the team verifies the actual files against the chosen NASA downloads or replaces them with those exact downloads.

NASA's 3D Resources collection describes its models as free to download and use; NASA media guidance still applies, including source credit and avoiding any implication of NASA endorsement.

## 7. Legacy Moon model path

`src/components/canvas/MoonViewer.tsx` contains a legacy path to `/models/moon-optimized.glb`. That file is not present in the GitHub `main` tree, and the component was not identified as being imported by the active application routes inspected for this notice. No original source or licence is recorded for that filename. Do not include or serve a `moon-optimized.glb` binary unless its exact creator, source and licence are first documented. The active homepage's separately named NASA SVS Moon model is documented in Section 5.

## 8. Earth Blue Marble texture loaded from three-globe example assets

**Asset URL used in source code:**  
[https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg](https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg)  
**Upstream example directory:** [vasturiano/three-globe — example/img](https://github.com/vasturiano/three-globe/tree/master/example/img)

The 360° explorer requests this image as an Earth surface texture. It is an example media file served through the three-globe package CDN; the three-globe software licence does not automatically determine the image's rights. The image is identified in the source as NASA Blue Marble imagery. Credit NASA and comply with [NASA's media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). Do not apply the LUNEX Apache 2.0 licence to the image.

## 9. Fonts loaded from Google Fonts

The homepage requests the following font families from Google Fonts:
- DM Mono — [upstream project](https://github.com/googlefonts/dm-mono)
- Inter — [upstream project](https://github.com/rsms/inter)
- Public Sans — [upstream project](https://github.com/uswds/public-sans)

These font families are distributed under the SIL Open Font License 1.1 (OFL-1.1). The fonts are separate third-party works and are not relicensed by the LUNEX Apache 2.0 licence.

## 10. Unused local images removed from the current submission tree

The following files were deleted from the current `main` branch because no references to their filenames were found in the application source inspected for this audit, and their original asset provenance was not established:
- `public/textures/earth_daymap.jpg`
- `public/textures/nasa-lunar-crater.webp`
- `public/textures/quickmap-lroc.png`
- `nasa-south-pole-test.png`

This is a source-tree cleanup, not a retrospective licence grant. The `earth_daymap.jpg` filename resembles the Earth Day Map texture offered by [Solar System Scope](https://www.solarsystemscope.com/textures/), whose texture pack is distributed under **CC BY 4.0**; however, the repository did not preserve source metadata or a binary match proving that the deleted file was that exact download. If an Earth Day Map texture is needed later, download the exact official Solar System Scope file and provide the required CC BY 4.0 attribution, or use a source with rights suitable for the NASA Space Apps terms. The deleted lunar crater and QuickMap-named images had no verifiable file-specific source/creator/licence; do not reintroduce them without provenance.

**Git history caveat:** deleting an asset from `main` removes it from the current project snapshot but does not erase the blob from earlier Git commits. The files remain retrievable from the historical commit unless repository history is rewritten.

## References

- [NASA 2026 Space Apps Participant Terms and Conditions](https://www.spaceappschallenge.org/legal/)
- [NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/)
- [NASA PGDA Product 78](https://pgda.gsfc.nasa.gov/products/78)
- [NASA Moon Trek](https://trek.nasa.gov/moon/)
- [LROC Terms of Use and Citation Policy](https://www.lroc.im-ldi.com/about/terms)
- [NASA SVS Moon 3D Models, item 14959](https://svs.gsfc.nasa.gov/14959)
- [JPL Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html)
