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

The complete source list and purpose are in [DATA_SOURCES.md](DATA_SOURCES.md). Key attributions:
- NASA PGDA LOLA Product 78 — NASA Goddard Space Flight Center / PGDA.
- NASA Moon Trek LRO WAC South Pole mosaic — “Imagery: NASA / JPL / LRO Wide Angle Camera.”
- LROC NAC controlled South Pole average mosaic through Lunaserv — credit “NASA/GSFC/Arizona State University (ASU), Lunar Reconnaissance Orbiter Camera (LROC).” The LROC terms page permits educational use with proper citation but says curated/non-PDS imagery is copyrighted. Do not relicense this content under Apache 2.0.
- NASA SVS Moon model item 14959 — credit NASA's Goddard Space Flight Center; the SVS page lists producer/data/analysis/technical credits.
- Earth Blue Marble texture served from the three-globe example directory — cite NASA as the image source and observe NASA's media usage guidelines; the image is separate from the three-globe package's software licence.

## 5. PROVENANCE / LICENCE REVIEW REQUIRED

These items are present or referenced in the repository but their exact source or licence is not established by the current repository evidence. Do not describe them as Apache-licensed, MIT-licensed, public domain or NASA material until the source and licence are verified.

| File or reference | Current evidence | Required action before final public release |
|---|---|---|
| `public/textures/earth_daymap.jpg` | File is tracked; no reliable source/creator/licence is recorded in the repository. | Identify original source and terms, or remove if unused. |
| `public/textures/nasa-lunar-crater.webp` | Filename suggests NASA but is not evidence of origin or licence. | Identify original NASA asset/page and check for third-party credits, or remove if unused. |
| `public/textures/quickmap-lroc.png` | File is tracked; filename suggests a QuickMap/LROC origin but the exact image/product and terms are not recorded. | Identify source, layer/product and licence/educational-use terms, or remove if unused. |
| `nasa-south-pole-test.png` | File is tracked; no original source or licence is recorded. | Identify creator and source, or remove if unused. |
| `/models/earth.glb` | Referenced by explorer code; the file was not present in the inspected GitHub `main` tree. | Locate the actual deployment asset, record its creator/source/licence, or remove the reference. |
| `/models/sun.glb` | Referenced by explorer code; the file was not present in the inspected GitHub `main` tree. | Locate the actual deployment asset, record its creator/source/licence, or remove the reference. |
| `/models/moon-optimized.glb` | Referenced in `MoonViewer.tsx`; the file was not present in the inspected GitHub `main` tree. | Locate the actual deployment asset, record its creator/source/licence, or remove the reference. |
| `/models/Moon_NASA_LRO_8k_Topo_Small.glb` | Code references NASA SVS item 14959, but the actual GLB was not present in the inspected GitHub `main` tree. A public environment variable may override its URL. | Confirm the exact deployed URL and that it serves the NASA SVS 14959 file; add the file or deployment URL to the project asset register. |

The four local image files above did not have source references in the principal application files inspected while preparing this notice. That is not proof that they are unused; search the full application and deployment configuration before deleting them.

The `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg` and `public/window.svg` files also look like framework/starter assets. Verify whether any are used and either retain their correct upstream attribution/licence or remove unused boilerplate.

## 6. NASA Space Apps compliance note

NASA's 2026 Participant Terms require participants to cite every resource used in the project, even if it is open source or free, and to identify applicable third-party licences in the submitted documentation. NASA also requires the team to have sufficient rights to authorize publication and use of the solution materials.

The Apache 2.0 licence in this repository applies only to original LUNEX work that the team is authorized to license. It does not override the terms of NASA data, LROC imagery, fonts, models, external images or npm dependencies.

**Submission status:** Source documentation has been added, but the project is not fully asset-cleared until all items in Section 5 are confirmed, removed, or replaced with documented alternatives.
