import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve NASA's official 8k LRO/LOLA Moon model through this origin.
  // This keeps the GLTF request same-origin and avoids browser CORS failures.
  async rewrites() {
    const nasaMoonModel = "https://svs.gsfc.nasa.gov/vis/a010000/a014900/a014959/Moon_NASA_LRO_8k_Topo_Small.glb";
    return {
      beforeFiles: [
        {
          source: "/models/Moon_NASA_LRO_8k_Topo_Small.glb",
          destination: nasaMoonModel,
        },
        {
          source: "/website/models/Moon_NASA_LRO_8k_Topo_Small.glb",
          destination: nasaMoonModel,
        },
      ],
    };
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: {
    "/api/horizons": [
      "./public/data/site04_shackleton_rim/metadata.json",
      "./public/data/site04_shackleton_rim/elevation.bin",
      "./public/data/site11_de_gerlache_rim/metadata.json",
      "./public/data/site11_de_gerlache_rim/elevation.bin",
      "./public/data/site23_malapert_massif/metadata.json",
      "./public/data/site23_malapert_massif/elevation.bin",
    ],
    "/api/horizons/selected-location": [
      "./public/data/site04_shackleton_rim/metadata.json",
      "./public/data/site04_shackleton_rim/elevation.bin",
      "./public/data/site11_de_gerlache_rim/metadata.json",
      "./public/data/site11_de_gerlache_rim/elevation.bin",
      "./public/data/site23_malapert_massif/metadata.json",
      "./public/data/site23_malapert_massif/elevation.bin",
    ],

    "/api/horizons/mission-analysis": [
      "./public/data/site04_shackleton_rim/metadata.json",
      "./public/data/site04_shackleton_rim/elevation.bin",
      "./public/data/site11_de_gerlache_rim/metadata.json",
      "./public/data/site11_de_gerlache_rim/elevation.bin",
      "./public/data/site23_malapert_massif/metadata.json",
      "./public/data/site23_malapert_massif/elevation.bin",
    ],
    "/api/product78/science-sample": [
      "./public/data/site04_shackleton_rim/science-metadata.json",
      "./public/data/site04_shackleton_rim/elevation.bin",
      "./public/data/site04_shackleton_rim/slope.bin",
      "./public/data/site04_shackleton_rim/slope-uncertainty.bin",
      "./public/data/site04_shackleton_rim/elevation-uncertainty.bin",
      "./public/data/site04_shackleton_rim/observation-count.bin",
    ],
    "/api/product78/sites": [
      "./public/data/site04_shackleton_rim/metadata.json",
      "./public/data/site04_shackleton_rim/elevation.bin",
      "./public/data/site11_de_gerlache_rim/metadata.json",
      "./public/data/site11_de_gerlache_rim/elevation.bin",
      "./public/data/site23_malapert_massif/metadata.json",
      "./public/data/site23_malapert_massif/elevation.bin",
    ],
    "/api/product78/terrain-preview": [
      "./public/data/site04_shackleton_rim/metadata.json",
      "./public/data/site04_shackleton_rim/elevation.bin",
      "./public/data/site11_de_gerlache_rim/metadata.json",
      "./public/data/site11_de_gerlache_rim/elevation.bin",
      "./public/data/site23_malapert_massif/metadata.json",
      "./public/data/site23_malapert_massif/elevation.bin",
    ],
    "/api/lunar-imagery/nac-south-pole": [
      "./public/data/site04_shackleton_rim/metadata.json",
      "./public/data/site11_de_gerlache_rim/metadata.json",
      "./public/data/site23_malapert_massif/metadata.json",
    ],
    "/api/test/multi-resolution": [
      "./public/data/site04_shackleton_rim/metadata.json",
      "./public/data/site04_shackleton_rim/elevation.bin",
    ],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],

      },
    },
  },
};

export default nextConfig;
