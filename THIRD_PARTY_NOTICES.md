# Third-Party Notices and Licence Inventory

This file records the third-party software and assets identified from the current `package.json`, `package-lock.json`, application source and repository file tree. It is a project attribution register, not a legal opinion or a substitute for checking each upstream licence before redistribution.

**Do not apply the repository's Apache 2.0 licence to third-party packages, NASA data, third-party imagery, fonts or external 3D assets.** Their original licence terms and attribution notices remain in force.

## 1. Direct software dependencies

Versions and SPDX identifiers below are taken from the repository's current lockfile.

| Package | Locked version | Licence |
|---|---:|---|
| `@react-three/drei` | 10.7.9 | MIT |
| `@react-three/fiber` | 9.8.2 | MIT |
| `geotiff` | 3.0.5 | MIT |
| `lint` | 1.2.2 | Apache-2.0 |
| `next` | 16.4.5 | MIT |
| `ol` (OpenLayers) | 10.11.0 | BSD-2-Clause |
| `proj4` | 2.22.0 | MIT |
| `react` | 19.3.0 | MIT |
| `react-dom` | 19.3.0 | MIT |
| `three` | 0.187.0 | MIT |

### Direct development dependencies

| Package | Locked version | Licence |
|---|---:|---|
| `@tailwindcss/turbopack` | 4.3.5 | MIT |
| `@types/node` | 20.19.43 | MIT |
| `@types/react` | 19.3.0 | MIT |
| `@types/react-dom` | 19.3.0 | MIT |
| `@types/three` | 0.187.0 | MIT |
| `eslint` | 9.39.5 | MIT |
| `eslint-config-next` | 16.4.5 | MIT |
| `tailwindcss` | 4.3.5 | MIT |
| `typescript` | 5.9.3 | Apache-2.0 |

The exact dependency graph is recorded in `package-lock.json`. The lockfile currently contains 558 installed package entries, including transitive and optional platform-specific packages; it is not correct to assume all transitive packages are MIT.

## 2. Notable transitive and optional dependency licences

The lockfile's licence metadata includes the following licence families. The package list can change when dependencies are upgraded; re-audit `package-lock.json` after any dependency update.

| Package / group | Locked version | Licence / note |
|---|---:|---|
| `sharp` | 0.35.5 | Apache-2.0 |
| `@img/sharp-libvips-*` optional platform binaries | 1.3.4 | LGPL-3.0-or-later |
| `@img/sharp-wasm32` | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later AND MIT |
| `lightningcss` and platform packages | 1.33.0 | MPL-2.0 |
| `axe-core` | 4.14.0 | MPL-2.0 |
| `caniuse-lite` | 1.0.30001823 | CC-BY-4.0 |
| `minimatch` (nested under TypeScript ESLint) | 10.2.6 | BlueOak-1.0.0 |
| `argparse` | 2.0.1 | Python-2.0 |
| `ol` | 10.11.0 | BSD-2-Clause |
| Other transitive packages | See lockfile | Includes Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD, CC0-1.0, Zlib and combined SPDX expressions |

Some `sharp`/libvips entries are optional binaries for different operating systems and architectures. Their presence in the lockfile does not mean every platform binary is installed in the Render deployment, but the licence records must be retained for the packages that are actually distributed.

### Lockfile exception: webgl-constants

- Package: `webgl-constants@1.1.1`
- The LUNEX `package-lock.json` does not contain a `license` property for this package.
- The [upstream GitHub repository](https://github.com/TimvanScherpenzeel/webgl-constants) declares MIT in its repository metadata, and its README states that the work is released under the MIT licence.
- The npm package page currently displays no licence identifier in its package sidebar, so this is an upstream-source verification rather than lockfile metadata.
- Licence recorded here: **MIT**, with the metadata discrepancy disclosed.

## 3. Fonts

The homepage loads DM Mono, Inter and Public Sans through Google Fonts. The font families are licensed under SIL Open Font License 1.1 (OFL-1.1):
- [DM Mono source and licence](https://github.com/googlefonts/dm-mono)
- [Inter source and licence](https://github.com/rsms/inter)
- [Public Sans source and licence](https://github.com/uswds/public-sans)

The OFL allows fonts to be used and bundled with software subject to the licence conditions. The font software must remain under OFL; it is not relicensed under Apache 2.0.

## 4. NASA and mission imagery / models

The full data source, role and attribution record is in [DATA_SOURCES.md](DATA_SOURCES.md). Confirmed/cited sources include:

- **NASA PGDA LOLA Product 78:** NASA Goddard Space Flight Center / Planetary Geology, Geophysics and Geochemistry Laboratory.
- **NASA Moon Trek LRO WAC South Pole mosaic:** retain the in-app attribution “Imagery: NASA / JPL / LRO Wide Angle Camera.”
- **LROC NAC controlled South Pole average mosaic via Lunaserv WMS:** required credit is “NASA/GSFC/Arizona State University (ASU), Lunar Reconnaissance Orbiter Camera (LROC).” The LROC Terms page distinguishes public-domain PDS products from copyrighted curated/non-PDS imagery; its educational-use permission requires proper citation. This WMS use is not an Apache- or MIT-licensed asset.
- **NASA SVS global Moon model, item 14959:** source and direct download URL are documented in [DATA_SOURCES.md](DATA_SOURCES.md). NASA SVS credits NASA Goddard Space Flight Center, producer Dan Gallagher (eMITS), data provider Ernie Wright (USRA), data analysts Tuomas Kankola and Josh Klint, and technical support Aaron E. Lepsch. NASA SVS says content is public domain unless otherwise noted.
- **NASA Blue Marble Earth texture loaded from the three-globe example directory:** cite NASA and follow NASA media usage guidelines. The image is not covered automatically by the three-globe software licence.
- **Solar System Scope Earth Day Map:** the source page publishes the texture pack under CC BY 4.0, but the previously bundled file was removed because its binary origin was not confirmed and the image was not referenced by application source. Do not claim that historical binary is an exact Solar System Scope download.

### NASA / LROC WMS terms qualification

The LROC SOC terms page states that PDS-delivered LROC data products are public domain, but curated/non-PDS imagery served through LROC website interfaces remains copyrighted; educational use is permitted with proper credit. NASA Space Apps' 2026 terms require third-party Solution Materials to be freely and publicly available without restriction or, at minimum, under an OSI-defined open-source licence. The current Lunaserv WMS layer is a NASA/ASU mission data service with educational-use terms, not an OSI licence. Because this is a NASA partner source but the precise terms still limit use, retain the attribution and obtain confirmation from the LROC SOC / Space Apps organisers that this particular WMS layer is acceptable for public submission. The lowest-risk alternative is to replace the curated WMS image with the equivalent LROC PDS-archived product and cite its PDS product identifier.

## 5. Provenance / licence status of 3D model paths

| Path referenced by code | Repository evidence | Source / licence status |
|---|---|---|
| `/models/Moon_NASA_LRO_8k_Topo_Small.glb` | Homepage references this exact filename as its default local model path. The original project setup instructions identify NASA SVS item 14959 and the exact NASA download URL. The binary is not tracked because `.gitignore` excludes `*.glb`. | **Source identified:** NASA SVS item 14959. NASA SVS says content is public domain unless otherwise noted. Retain NASA SVS credits and confirm the deployed `NEXT_PUBLIC_LUNEX_MOON_MODEL_URL` (if set) points to this exact asset. See [DATA_SOURCES.md](DATA_SOURCES.md). |
| `/models/earth.glb` | Referenced in `Lunar360Explorer.tsx`; binary absent from the GitHub `main` tree. | **Unverified:** no file, checksum, creator, source URL or specific licence available. NASA publishes possible replacement models (Earth with Clouds, NASA VTAD; and an Earth 3D printable model), but there is no evidence that either is the current `earth.glb`. Do not attribute the current file to NASA without matching the exact downloaded file. |
| `/models/sun.glb` | Referenced in `Lunar360Explorer.tsx`; binary absent from the GitHub `main` tree. | **Unverified:** no file, checksum, creator, source URL or specific licence available. NASA publishes a Sun 3D Model Interactive with a glTF download, but there is no evidence that it is the current `sun.glb`. Do not attribute the current file to NASA without matching the exact downloaded file. |
| `/models/moon-optimized.glb` | Referenced only by the legacy `MoonViewer.tsx` component found in the source audit; binary absent from `main`. The active homepage uses a differently named NASA SVS model path. | **Unverified legacy reference:** no source, creator, binary or licence recorded. Do not include or serve this binary. Remove the legacy component/reference if it is not part of the submitted application, or document the exact source and licence before use. |

The repository-wide `.gitignore` rule `*.glb` excludes all GLB files from Git. Therefore, a file present only on a developer's machine is not part of the public GitHub `main` snapshot. If the Render deployment serves an external model URL, record the full URL, asset name, creator, source page and licence here. NASA's official replacement candidates are:
- [NASA Sun 3D Model Interactive](https://science.nasa.gov/learn/heat/resource/sun-3d-model/)
- [NASA Earth with Clouds 3D Model (NASA VTAD)](https://science.nasa.gov/resource/earth-with-clouds-3d-model/)
- [NASA SVS Moon model, item 14959](https://svs.gsfc.nasa.gov/14959/)

These are source candidates, not proof of the identity of any untracked GLB.

## 6. Unused local image files removed from the current submission tree

The following image files were not referenced by the application source inspected for this audit and were removed from the current `main` branch because file-level provenance was missing:
- `public/textures/earth_daymap.jpg`
- `public/textures/nasa-lunar-crater.webp`
- `public/textures/quickmap-lroc.png`
- `nasa-south-pole-test.png`

The local file `nasa-lunar-crater.webp` had JPEG file-signature bytes despite its `.webp` extension. No source/creator/licence was embedded in the tracked file metadata inspected. The QuickMap-named image could not be tied to an exact LROC PDS product from its pixels or repository history. The Earth Day Map name resembles Solar System Scope's CC BY 4.0 download name, but the original local binary was not proven to be the same asset. If you reintroduce any of these files, first obtain the original download or PDS product and record exact file-specific attribution and terms.

**Git history caveat:** file deletion from `main` removes assets from the current submission snapshot, but the deleted blobs remain available from prior Git commits. Complete removal from the public repository history requires a separate history rewrite and force-push; do not do that without coordinating the team because it changes commit IDs and may disrupt collaborators.

## 7. NASA Space Apps compliance note

NASA's [2026 Participant Terms](https://www.spaceappschallenge.org/legal/) state that original team-created content must be freely available without restriction or licensed under an OSI-approved open-source licence. For non-NASA third-party Solution Materials, NASA requires that the materials be freely and publicly available without restriction or, at minimum, licensed as OSI-defined open source. The terms also require citations for every source and applicable third-party licences in the submitted documentation. NASA may reject Solutions lacking appropriate licence documentation.

The Apache 2.0 licence in this repository applies only to original LUNEX work that the team is authorized to license. It does not override NASA data usage terms, third-party image/model rights, fonts or npm dependency licences.

**Current audit status:** the three named unused texture images and the root test image are removed from the current `main` tree. The NASA Moon model source is identified. The exact `earth.glb` and `sun.glb` binaries remain unverified and are not present in the GitHub tree. The LROC curated WMS image remains an educational-use source whose compatibility with NASA's strict third-party-material wording should be confirmed or replaced with a PDS-archived product. See [DATA_SOURCES.md](DATA_SOURCES.md) for the full source register.

## 6. NASA Space Apps compliance note

NASA's 2026 Participant Terms require participants to cite every resource used in the project, even if it is open source or free, and to identify applicable third-party licences in the submitted documentation. NASA also requires the team to have sufficient rights to authorize publication and use of the solution materials.

The Apache 2.0 licence in this repository applies only to original LUNEX work that the team is authorized to license. It does not override the terms of NASA data, LROC imagery, fonts, models, external images or npm dependencies.

**Submission status:** Source documentation has been added, but the project is not fully asset-cleared until all items in Section 5 are confirmed, removed, or replaced with documented alternatives.
