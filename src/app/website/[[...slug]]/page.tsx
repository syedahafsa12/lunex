"use client";
import { usePathname } from "next/navigation";
import styles from "./lunex.module.css";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function disposeNodeTree(root: THREE.Object3D): void {
  root.traverse((object: THREE.Object3D) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material: THREE.Material) => {
      Object.values(material).forEach((value: unknown) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
}

function createPreviewMoon(): THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial> {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("A 2D canvas is unavailable for the Moon preview.");

  context.fillStyle = "#aeb4bb";
  context.fillRect(0, 0, canvas.width, canvas.height);

  let seed = 14959;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let index = 0; index < 520; index += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const radius = 5 + random() * 35;
    const gradient = context.createRadialGradient(
      x - radius * 0.22,
      y - radius * 0.22,
      radius * 0.08,
      x,
      y,
      radius
    );
    gradient.addColorStop(0, "rgba(76,82,91,.18)");
    gradient.addColorStop(.58, "rgba(115,122,132,.1)");
    gradient.addColorStop(.83, "rgba(225,228,232,.22)");
    gradient.addColorStop(1, "rgba(78,85,94,.05)");
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
  }

  for (let index = 0; index < 190; index += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const radius = 2 + random() * 11;
    context.beginPath();
    context.ellipse(x, y, radius * 1.35, radius, random() * Math.PI, 0, Math.PI * 2);
    context.strokeStyle = "rgba(72,78,87," + (0.07 + random() * 0.12) + ")";
    context.lineWidth = 1 + random() * 2;
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.16, 56, 40),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 1, metalness: 0 })
  );
  mesh.rotation.set(0.018, 0.16, -0.018);
  mesh.userData.isPreview = true;
  return mesh;
}

type SceneStatus = "checking" | "loading" | "ready" | "missing" | "load-error" | "webgl-error";
type MoonSceneProps = { compact?: boolean; modelUrl: string };

function MoonScene({ compact = false, modelUrl }: MoonSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<SceneStatus>("checking");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let resizeObserver: ResizeObserver;
    let intersectionObserver: IntersectionObserver;
    let disposed = false;
    let visible = true;
    let modelRoot: THREE.Group | null = null;
    let previewMoon: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial> | null = null;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 4.45);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        premultipliedAlpha: true
      });
    } catch {
      setStatus("webgl-error");
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.45));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "lunex-moon-canvas";
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute("aria-label", "Interactive three-dimensional Moon preview, upgraded to the NASA LRO and LOLA global Moon model when it finishes loading. Drag to rotate and use the scroll wheel or pinch to zoom. The global model is for orientation, not a local landing-site elevation model.");
    renderer.domElement.setAttribute("tabindex", "0");
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x0B3D91, 1.08));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.05);
    keyLight.position.set(-4.3, 2.8, 4.5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x0B3D91, 0.24);
    fillLight.position.set(3.2, -1.8, -3.7);
    scene.add(fillLight);

    try {
      previewMoon = createPreviewMoon();
      scene.add(previewMoon);
    } catch {
      // The detailed model can still load if the lightweight preview cannot be created.
    }

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.045;
    controls.enablePan = false;
    controls.minDistance = 3.1;
    controls.maxDistance = 6;
    controls.rotateSpeed = 0.42;
    controls.zoomSpeed = 0.42;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.18;

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const draw = () => {
      if (disposed || !visible || document.visibilityState === "hidden") return;
      controls.update();
      renderer.render(scene, camera);
    };
    const resume = () => renderer.setAnimationLoop(draw);
    const pause = () => renderer.setAnimationLoop(null);
    intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && document.visibilityState === "visible") resume();
      else pause();
    }, { threshold: 0.01 });
    intersectionObserver.observe(host);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      controls.autoRotate = !reducedMotion;
    };
    motionQuery.addEventListener?.("change", onMotionChange);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") pause();
      else if (visible) resume();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    resume();

    async function loadModel() {
      try {
        setStatus("loading");
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(modelUrl, (event: ProgressEvent) => {
          if (!disposed && event.total > 0) setProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
        });
        if (disposed) { disposeNodeTree(gltf.scene); return; }
        modelRoot = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(modelRoot);
        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        modelRoot.position.sub(center);
        modelRoot.scale.setScalar(2.32 / maxAxis);
        modelRoot.rotation.set(0.018, 0.16, -0.018);
        modelRoot.traverse((object: THREE.Object3D) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.frustumCulled = true;
          object.castShadow = false;
          object.receiveShadow = false;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material: THREE.Material) => {
            const surface = material as THREE.Material & { roughness?: number; metalness?: number };
            if (typeof surface.roughness === "number") surface.roughness = Math.max(surface.roughness, 0.84);
            if (typeof surface.metalness === "number") surface.metalness = 0;
            material.needsUpdate = true;
          });
        });
        scene.add(modelRoot);
        if (previewMoon) {
          scene.remove(previewMoon);
          previewMoon.geometry.dispose();
          previewMoon.material.map?.dispose();
          previewMoon.material.dispose();
          previewMoon = null;
        }
        setProgress(100);
        setStatus("ready");
      } catch (error) {
        if (!disposed) {
          setMessage(error instanceof Error
            ? "The detailed NASA Moon model could not be loaded. Check the model URL: " + modelUrl
            : "The browser could not load the NASA GLB. The lightweight preview remains available.");
          setStatus("missing");
        }
      }
    }
    loadModel();

    return () => {
      disposed = true;
      pause();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      motionQuery.removeEventListener?.("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      controls?.dispose();
      disposeNodeTree(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [compact, modelUrl]);

  const hasError = status === "missing" || status === "load-error" || status === "webgl-error";
  const isLoading = status === "checking" || status === "loading";

  return (
    <div className={compact ? "lunex-moon-scene moon-scene-compact" : "lunex-moon-scene"} ref={hostRef}>
      {isLoading && (
        <div className="lunex-moon-load-indicator" role="status" aria-live="polite">
          <span className="lunex-scene-spinner" />
          <span className="lunex-moon-load-copy">
            <b>{status === "checking" ? "Moon preview ready" : "Loading NASA LRO / LOLA"}</b>
            <small>{status === "checking" ? "Preparing detailed surface data" : progress > 0 ? progress + "% transferred" : "Refining the global surface"}</small>
          </span>
          {status === "loading" && <span className="lunex-moon-load-progress"><i style={{ width: progress + "%" }} /></span>}
        </div>
      )}
      {hasError && (
        <div className={"lunex-moon-scene-state lunex-state-" + status} role="status">
          {status === "missing" ? (
            <>
              <b>Preview mode</b>
              <p>{message}</p>
              <code>public/models/Moon_NASA_LRO_8k_Topo_Small.glb</code>
            </>
          ) : (
            <>
              <b>3D scene unavailable</b>
              <p>{message}</p>
              <small>Check WebGL support and the local NASA GLB file.</small>
            </>
          )}
        </div>
      )}
    </div>
  );
}

type MoonPortalProps = { compact?: boolean; label?: string; modelUrl: string };

function MoonPortal({ compact = false, label, modelUrl }: MoonPortalProps) {
  return (
    <div className={compact ? "lunex-moon-portal lunex-moon-portal-compact" : "lunex-moon-portal"}>
      {label && <span className="lunex-moon-portal-label">{label}</span>}
      <MoonScene compact={compact} modelUrl={modelUrl} />
    </div>
  );
}

const steps = [
  { number: "01", title: "Explore a region", description: "Inspect lunar south-polar locations and the coordinates that identify them." },
  { number: "02", title: "Set the observation time", description: "Choose a date and UTC hour to define the mission scenario you want to examine." },
  { number: "03", title: "Compare the conditions", description: "Review different places and times, and understand the factors a mission team must evaluate." },
];

function MissionSchematic() {
  return (
    <div className="lunex-mission-visual" role="img" aria-label="Illustrative lunar mission planning diagram showing a south-polar site in relation to the Sun, Earth, terrain and observation time.">
      <div className="lunex-mission-visual-top">
        <span><i aria-hidden="true" /> LUNEX / MISSION CONTEXT</span>
        <span>FIELD VIEW 01</span>
      </div>
      <div className="lunex-mission-visual-heading">
        <div><span>THE LUNAR SOUTH POLE</span><h3>One location. Many mission factors.</h3></div>
        <span className="lunex-mission-visual-index">01 — 03</span>
      </div>
      <svg className="lunex-mission-schematic" viewBox="0 0 720 430" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="lunex-moon-fill" x1="360" y1="210" x2="360" y2="430" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity=".2" /><stop offset="1" stopColor="#FFFFFF" stopOpacity=".035" />
          </linearGradient>
          <radialGradient id="lunex-earth-glow" cx="0" cy="0" r="1" gradientTransform="translate(552 112) rotate(90) scale(70)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity=".2" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <clipPath id="lunex-moon-clip"><circle cx="360" cy="432" r="205" /></clipPath>
        </defs>
        <g className="lunex-schematic-stars">
          <circle cx="76" cy="82" r="2.3" /><circle cx="200" cy="46" r="1.4" /><circle cx="310" cy="104" r="1.8" />
          <circle cx="440" cy="53" r="1.4" /><circle cx="640" cy="72" r="2" /><circle cx="674" cy="214" r="1.4" />
          <circle cx="106" cy="220" r="1.3" /><circle cx="237" cy="179" r="1.2" /><circle cx="596" cy="268" r="1.2" /><circle cx="493" cy="185" r="1.5" />
        </g>
        <path className="lunex-schematic-orbit lunex-schematic-orbit-white" d="M74 252C158 45 505 18 647 183C707 252 620 316 533 320" />
        <path className="lunex-schematic-orbit lunex-schematic-orbit-red" d="M112 290C159 117 443 46 592 174C650 225 600 282 538 306" />
        <path className="lunex-schematic-orbit-dash" d="M104 168C220 25 490 25 622 148" />
        <g className="lunex-schematic-sun" transform="translate(142 130)">
          <circle r="32" fill="#FC3D21" fillOpacity=".08" stroke="#FC3D21" strokeOpacity=".75" />
          <circle r="15" fill="#FC3D21" />
          <path d="M0 -26V-40M0 26V40M-26 0H-40M26 0H40M-18.4 -18.4L-28 -28M18.4 18.4L28 28M18.4 -18.4L28 -28M-18.4 18.4L-28 28" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <text x="142" y="190" textAnchor="middle" className="lunex-schematic-label">SUNLIGHT</text>
        <g className="lunex-schematic-earth" transform="translate(552 112)">
          <circle r="68" fill="url(#lunex-earth-glow)" />
          <circle r="39" fill="#0B3D91" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="1.5" />
          <path d="M-23 -11L-11 -28L2 -24L7 -12L20 -9L25 5L13 12L7 27L-9 25L-17 10L-28 4L-23 -11Z" fill="#FFFFFF" fillOpacity=".72" />
          <path d="M-31 -22C-15 -43 15 -48 33 -32M-35 17C-19 38 13 47 35 28" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="1" />
          <circle r="50" stroke="#FFFFFF" strokeOpacity=".2" strokeDasharray="2 7" />
        </g>
        <text x="552" y="173" textAnchor="middle" className="lunex-schematic-label">EARTH VIEW</text>
        <g clipPath="url(#lunex-moon-clip)">
          <circle cx="360" cy="432" r="205" fill="url(#lunex-moon-fill)" stroke="#FFFFFF" strokeOpacity=".88" strokeWidth="1.5" />
          <path d="M143 350L182 335L216 345L250 313L287 329L319 300L354 316L388 291L425 309L461 295L500 321L536 309L574 338" stroke="#FFFFFF" strokeOpacity=".34" strokeWidth="1.3" />
          <path d="M142 366L180 351L216 362L251 331L287 345L319 320L354 333L388 310L425 326L461 312L500 337L536 327L575 353V500H142V366Z" fill="#FFFFFF" fillOpacity=".09" />
          <path d="M145 366L183 351L218 362L252 331L288 345L320 320L354 333L389 310L425 326L461 312L500 337L536 327L575 353" stroke="#FFFFFF" strokeOpacity=".76" strokeWidth="1.7" />
          <path d="M210 391C274 366 434 364 510 394" stroke="#FC3D21" strokeOpacity=".8" strokeWidth="1.2" strokeDasharray="4 7" />
          <path d="M277 356L302 341L323 348L343 331M412 365L431 349L452 355L475 339" stroke="#FFFFFF" strokeOpacity=".3" strokeWidth="1" />
        </g>
        <path d="M360 270V309" stroke="#FC3D21" strokeWidth="1.4" strokeDasharray="3 5" />
        <circle cx="360" cy="315" r="7" fill="#FC3D21" stroke="#FFFFFF" strokeWidth="2" className="lunex-schematic-site-pulse" />
        <circle cx="360" cy="315" r="18" stroke="#FC3D21" strokeOpacity=".7" className="lunex-schematic-site-ring" />
        <path d="M371 309L414 286H488" stroke="#FC3D21" strokeWidth="1.2" />
        <text x="420" y="277" className="lunex-schematic-site-label">CANDIDATE SITE</text>
        <text x="420" y="294" className="lunex-schematic-small-label">SOUTH-POLAR REGION</text>
        <text x="360" y="417" textAnchor="middle" className="lunex-schematic-moon-label">LUNAR SURFACE</text>
      </svg>
      <div className="lunex-mission-factor-row">
        <div><span>01 / LOCATION</span><b>Site coordinates</b></div>
        <div><span>02 / TIME</span><b>Observation window</b></div>
        <div><span>03 / ENVIRONMENT</span><b>Terrain · Sun · Earth</b></div>
      </div>
      <div className="lunex-mission-visual-foot">
        <span>EXPLORE THE VARIABLES BEHIND A MISSION</span>
        <span>ILLUSTRATIVE CONTEXT · NOT A LANDING VERDICT</span>
      </div>
    </div>
  );
}

function ProjectOverview({ basePath }: { basePath: string }) {
  return (
    <section className="lunex-overview-section" id="lunex-project-overview" aria-labelledby="lunex-overview-title">
      <div className="lunex-overview-shell">
        <div className="lunex-overview-copy" data-lunex-reveal="left">
          <p className="lunex-section-eyebrow"><span aria-hidden="true" />WHAT IS LUNEX?</p>
          <h2 id="lunex-overview-title">A clearer view of<br /><em>lunar mission planning.</em></h2>
          <p className="lunex-overview-lede">
            Lunex is an interactive mission-planning platform focused on the Moon’s south pole. It brings a 3D view of the lunar surface together with location data and observation-time controls, helping researchers and space explorers examine how place, terrain, sunlight and Earth visibility shape a mission scenario.
          </p>
          <p className="lunex-overview-supporting">
            Explore a region, set a time, and compare different scenarios. Lunex helps teams organize the questions behind a landing plan; mission decisions still depend on validated scientific and engineering analysis.
          </p>
          <div className="lunex-overview-steps">
            {steps.map((step, index) => (
              <article className="lunex-overview-step" key={step.number} data-lunex-reveal="up" style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}>
                <span className="lunex-overview-step-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </article>
            ))}
          </div>
          <a className="lunex-overview-link" href={basePath + "/explorer"}><span>Open Mission Explorer</span><span aria-hidden="true">↗</span></a>
        </div>
        <div data-lunex-reveal="scale"><MissionSchematic /></div>
      </div>
    </section>
  );
}

function LunexHome({ basePath, modelUrl }: { basePath: string; modelUrl: string }) {
  return (
    <main id="lunex-main-content" className="lunex-home-page">
      <section className="lunex-hero-main" aria-labelledby="hero-title">
        <div className="lunex-hero-layout">
          <div className="lunex-hero-copy" data-lunex-reveal="left">
            <p className="lunex-hero-eyebrow">
              <span className="lunex-eyebrow-mark" aria-hidden="true" />
              LUNAR LANDING SITE NAVIGATOR
            </p>
            <h1 id="hero-title">
              Explore the Moon.
              <br />
              <span>Think beyond the landing.</span>
            </h1>
            <p className="lunex-hero-description">
              Lunex helps you explore places near the Moon’s south pole.
              Look around the Moon in 3D, choose a place and a time, and compare
              the details that matter when planning a mission.
            </p>

            <div className="lunex-hero-actions">
              <a className="lunex-action-button lunex-action-button-primary" href={basePath + "/explorer"}>
                <span>Open Mission Explorer</span>
                <span className="lunex-button-arrow" aria-hidden="true">↗</span>
              </a>
              <a className="lunex-action-button lunex-action-button-secondary" href={basePath + "/presentation"}>
                <span className="lunex-button-play" aria-hidden="true">▶</span>
                <span>Watch 30 Seconds</span>
              </a>
            </div>

            <div className="lunex-hero-proofline" aria-label="What Lunex brings together">
              <span>MOON IN 3D</span>
              <i aria-hidden="true" />
              <span>PLACE & TIME</span>
              <i aria-hidden="true" />
              <span>SCENARIO COMPARISON</span>
            </div>
            <p className="lunex-hero-footnote">
              One place to explore the surface, the sunlight and the view of Earth.
            </p>
          </div>

          <div className="lunex-moon-column" data-lunex-reveal="scale" aria-label="Interactive three-dimensional Moon model">
            <div className="lunex-moon-aura" aria-hidden="true" />
            <div className="lunex-moon-orbit lunex-moon-orbit-one" aria-hidden="true" />
            <div className="lunex-moon-orbit lunex-moon-orbit-two" aria-hidden="true" />
            <div className="lunex-moon-object">
              <MoonPortal compact modelUrl={modelUrl} />
            </div>
            <div className="lunex-moon-caption">
              <span>NASA LRO / LOLA</span>
              <i aria-hidden="true" />
              <span>GLOBAL MOON MODEL</span>
            </div>
          </div>
        </div>

        <a className="lunex-hero-scroll-cue" href="#lunex-project-overview">
          <span>DISCOVER LUNEX</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <ProjectOverview basePath={basePath} />
    </main>
  );
}

function PresentationVisual() {
  return (
    <div className="lunex-destination-art lunex-destination-art-presentation" aria-hidden="true">
      <div className="lunex-destination-planet" />
      <div className="lunex-destination-orbit lunex-destination-orbit-one" />
      <div className="lunex-destination-orbit lunex-destination-orbit-two" />
      <div className="lunex-destination-orbit lunex-destination-orbit-three" />
      <span className="lunex-destination-star lunex-destination-star-one" />
      <span className="lunex-destination-star lunex-destination-star-two" />
      <span className="lunex-destination-star lunex-destination-star-three" />
      <span className="lunex-destination-art-caption">LUNEX / 30 SECOND OVERVIEW</span>
    </div>
  );
}

function ExplorerVisual() {
  return (
    <div className="lunex-destination-art lunex-destination-art-explorer" aria-hidden="true">
      <div className="lunex-polar-visual-heading">
        <span>MISSION EXPLORER / 01</span>
        <span>POLAR REFERENCE GRID</span>
      </div>
      <div className="lunex-polar-radar">
        <div className="lunex-polar-radar-ring lunex-polar-radar-ring-outer" />
        <div className="lunex-polar-radar-ring lunex-polar-radar-ring-middle" />
        <div className="lunex-polar-radar-ring lunex-polar-radar-ring-inner" />
        <div className="lunex-polar-radar-cross lunex-polar-radar-cross-horizontal" />
        <div className="lunex-polar-radar-cross lunex-polar-radar-cross-vertical" />
        <div className="lunex-polar-radar-sweep" />
        <svg className="lunex-polar-terrain-lines" viewBox="0 0 420 420" fill="none">
          <path d="M37 219C66 168 84 172 111 190C132 204 145 155 181 162C218 170 227 120 262 128C296 137 315 179 342 164C364 152 381 164 394 188" />
          <path d="M28 244C59 201 83 202 111 215C143 229 154 183 185 188C221 194 232 145 269 152C302 158 317 199 349 184C368 175 384 185 397 204" />
          <path d="M49 274C81 241 93 236 124 245C151 253 166 218 194 222C227 226 244 184 273 187C306 190 327 221 350 210C369 201 384 210 392 225" />
          <path d="M73 302C99 275 125 270 145 278C171 287 183 257 207 259C240 261 252 228 282 229C308 230 328 249 348 240" />
          <path d="M105 329C127 310 145 304 163 310C189 319 201 290 226 290C249 290 270 268 291 271C313 274 327 286 342 280" />
          <path d="M38 145C69 125 89 126 111 139C139 156 154 122 184 122C216 122 226 91 260 95C286 98 301 126 328 117C352 109 374 119 391 139" />
        </svg>
        <div className="lunex-polar-site-marker"><span /><i /></div>
        <div className="lunex-polar-coordinate lunex-polar-coordinate-north">90° N</div>
        <div className="lunex-polar-coordinate lunex-polar-coordinate-west">90° W</div>
        <div className="lunex-polar-coordinate lunex-polar-coordinate-east">90° E</div>
        <div className="lunex-polar-coordinate lunex-polar-coordinate-south">90° S</div>
      </div>
      <div className="lunex-polar-visual-readout">
        <div><span>REFERENCE REGION</span><b>LUNAR SOUTH POLE</b></div>
        <div><span>LOCATION INPUT</span><b>LAT / LON</b></div>
        <div><span>SCENARIO</span><b>PLACE + TIME</b></div>
      </div>
      <span className="lunex-destination-art-caption">SITE CONTEXT / NOT A LIVE MAP</span>
    </div>
  );
}

type ComingSoonPageProps = { eyebrow: string; title: string; description: string; basePath: string; variant?: "presentation" | "explorer" };

function ComingSoonPage({ eyebrow, title, description, basePath, variant = "presentation" }: ComingSoonPageProps) {
  const isExplorer = variant === "explorer";
  return (
    <main id="lunex-main-content" className="lunex-destination-page">
      <section className={isExplorer ? "lunex-destination-card lunex-destination-card-explorer" : "lunex-destination-card"} aria-labelledby="lunex-destination-title">
        <div className="lunex-destination-copy">
          <p className="lunex-destination-eyebrow"><span aria-hidden="true" />{eyebrow}</p>
          <div className="lunex-destination-status"><i aria-hidden="true" />COMING SOON</div>
          <h1 id="lunex-destination-title">{title}</h1>
          <p className="lunex-destination-description">{description}</p>
          <a className="lunex-destination-back" href={basePath || "/"}><span aria-hidden="true">←</span>Back to Project Information</a>
        </div>
        {isExplorer ? <ExplorerVisual /> : <PresentationVisual />}
      </section>
    </main>
  );
}


function SiteHeader({ basePath, isHome, iconUrl }: { basePath: string; isHome: boolean; iconUrl: string }) {
  return (
    <header className="lunex-site-header">
      <div className="lunex-site-nav">
        <a className="lunex-brand" href={basePath || "/"} aria-label="Lunex — Back to project information">
          <img className="lunex-brand-logo" src={iconUrl} alt="" width={44} height={44} onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
          <span className="lunex-brand-name">LUNEX</span>
        </a>
        <nav className="lunex-nav-actions" aria-label="Main navigation">
          {isHome ? (
            <>
              <a className="lunex-nav-button lunex-nav-button-secondary" href={basePath + "/presentation"}>
                <span className="lunex-nav-play" aria-hidden="true">▶</span><span>Watch 30 Seconds</span>
              </a>
              <a className="lunex-nav-button lunex-nav-button-primary" href={basePath + "/explorer"}>
                <span>Open Mission Explorer</span><span className="lunex-nav-arrow" aria-hidden="true">↗</span>
              </a>
            </>
          ) : (
            <a className="lunex-nav-button lunex-nav-button-return" href={basePath || "/"}>
              <span className="lunex-nav-return-arrow" aria-hidden="true">←</span><span>Back to Project Information</span>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

function SiteFooter({ basePath, iconUrl }: { basePath: string; iconUrl: string }) {
  return (
    <footer className="lunex-site-footer">
      <div className="lunex-footer-inner">
        <div className="lunex-footer-identity">
          <a className="lunex-footer-brand" href={basePath || "/"} aria-label="Lunex home">
            <img src={iconUrl} alt="" width={36} height={36} onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
            <span>LUNEX</span>
          </a>
          <p className="lunex-footer-credit">An interactive lunar mission-planning experience focused on the Moon’s south pole.</p>
        </div>
        <div className="lunex-footer-project-note">
          <span>NASA SPACE APPS CHALLENGE · 2026</span><b>Built by AI Family, inspired by lunar exploration.</b>
        </div>
        <nav className="lunex-footer-links" aria-label="Footer navigation">
          <a href={basePath + "/presentation"}>Watch 30 Seconds</a>
          <a href={basePath + "/explorer"}>Mission Explorer</a>
          <a href="https://github.com/ProMBZ/Lunex" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        </nav>
        <span className="lunex-footer-copyright">© 2026 LUNEX</span>
      </div>
    </footer>
  );
}

type Star = { x: number; y: number; radius: number; alpha: number; depth: number; phase: number; twinkle: number; bright: boolean; accent: boolean; cross: boolean };
type Meteor = { x: number; y: number; vx: number; vy: number; age: number; duration: number };

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, pixelRatio = 1, frame = 0, lastFrame = 0;
    let running = false, mouseX = 0.5, mouseY = 0.5;
    let stars: Star[] = [], meteors: Meteor[] = [];
    let nextMeteorAt = 5000;

    const randomSource = (initialSeed: number) => {
      let seed = initialSeed;
      return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    };

    const makeStars = () => {
      const random = randomSource(481516);
      const count = window.innerWidth < 680 ? 230 : 460;
      stars = Array.from({ length: count }, () => {
        const bright = random() > 0.975;
        return {
          x: random() * width, y: random() * height,
          radius: bright ? 0.9 + random() * 1.25 : 0.25 + random() * 0.72,
          alpha: bright ? 0.46 + random() * 0.42 : 0.12 + random() * 0.48,
          depth: 0.08 + random() * 0.92,
          phase: random() * Math.PI * 2, twinkle: 0.3 + random() * 0.9,
          bright, accent: random() > 0.982, cross: bright && random() > 0.68,
        };
      });
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const parallaxX = motionQuery.matches ? 0 : (mouseX - 0.5) * star.depth * 17;
        const parallaxY = motionQuery.matches ? 0 : (mouseY - 0.5) * star.depth * 12;
        const shimmer = motionQuery.matches ? 0 : Math.sin(time * 0.001 * star.twinkle + star.phase) * (star.bright ? 0.2 : 0.11);
        const opacity = Math.max(0.05, Math.min(0.95, star.alpha + shimmer));
        const x = star.x - parallaxX, y = star.y - parallaxY;
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fillStyle = star.accent ? "rgba(252,61,33," + opacity + ")" : "rgba(255,255,255," + opacity + ")";
        if (star.bright) {
          context.save();
          context.shadowColor = star.accent ? "rgba(252,61,33," + opacity * 0.58 + ")" : "rgba(255,255,255," + opacity * 0.58 + ")";
          context.shadowBlur = star.cross ? 10 : 6;
          context.fill();
          context.restore();
          if (star.cross) {
            context.beginPath();
            context.moveTo(x - 3.5, y); context.lineTo(x + 3.5, y);
            context.moveTo(x, y - 3.5); context.lineTo(x, y + 3.5);
            context.strokeStyle = "rgba(255,255,255," + opacity * 0.5 + ")";
            context.lineWidth = 0.55; context.stroke();
          }
        } else context.fill();
      }

      if (!motionQuery.matches && width > 680) {
        const elapsed = Math.max(0, Math.min(48, time - lastFrame));
        if (time > nextMeteorAt && meteors.length < 2) {
          meteors.push({
            x: Math.random() * width * 0.75 + width * 0.12,
            y: Math.random() * height * 0.3,
            vx: 7 + Math.random() * 3, vy: 2.8 + Math.random() * 1.7,
            age: 0, duration: 42 + Math.random() * 18,
          });
          nextMeteorAt = time + 8500 + Math.random() * 9000;
        }
        meteors = meteors.filter((meteor) => meteor.age < meteor.duration);
        for (const meteor of meteors) {
          meteor.x += meteor.vx * elapsed * 0.06;
          meteor.y += meteor.vy * elapsed * 0.06;
          meteor.age += elapsed * 0.06;
          const alpha = Math.max(0, 1 - meteor.age / meteor.duration);
          const tail = 54;
          const gradient = context.createLinearGradient(meteor.x - tail, meteor.y - tail * 0.34, meteor.x, meteor.y);
          gradient.addColorStop(0, "rgba(255,255,255,0)");
          gradient.addColorStop(0.72, "rgba(255,255,255," + alpha * 0.16 + ")");
          gradient.addColorStop(1, "rgba(252,61,33," + alpha * 0.78 + ")");
          context.beginPath();
          context.moveTo(meteor.x - tail, meteor.y - tail * 0.34);
          context.lineTo(meteor.x, meteor.y);
          context.strokeStyle = gradient; context.lineWidth = 1.25; context.stroke();
        }
      }
    };

    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = width + "px"; canvas.style.height = height + "px";
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      makeStars(); meteors = []; nextMeteorAt = 5000; draw(0);
    };
    const animate = (time: number) => {
      if (!running) return;
      frame = window.requestAnimationFrame(animate);
      if (time - lastFrame < 32) return;
      draw(time); lastFrame = time;
    };
    const start = () => {
      if (running || motionQuery.matches || document.visibilityState === "hidden") return;
      running = true; frame = window.requestAnimationFrame(animate);
    };
    const stop = () => { running = false; window.cancelAnimationFrame(frame); };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mouseX = event.clientX / Math.max(width, 1); mouseY = event.clientY / Math.max(height, 1);
    };
    const onPointerLeave = () => { mouseX = 0.5; mouseY = 0.5; };
    const onMotionChange = () => {
      if (motionQuery.matches) { stop(); meteors = []; draw(0); } else start();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") stop(); else start();
    };

    resize();
    if (!motionQuery.matches) start();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener?.("change", onMotionChange);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener?.("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="lunex-starfield" aria-hidden="true" />;
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return undefined;

    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!pointerQuery.matches || motionQuery.matches) return undefined;

    let frame = 0;
    let lastX = -100;
    let lastY = -100;
    const interactiveSelector = "a, button, input, select, textarea, [role='button']";

    const leave = () => cursor.classList.remove("lunex-is-visible", "lunex-is-interactive", "lunex-is-pressed");
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("[data-lunex-root]")) { leave(); return; }
      lastX = event.clientX;
      lastY = event.clientY;
      const interactive = target instanceof Element && Boolean(target.closest(interactiveSelector));
      cursor.classList.toggle("lunex-is-interactive", interactive);
      cursor.classList.add("lunex-is-visible");
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = "translate3d(" + lastX + "px," + lastY + "px,0) translate(-50%,-50%)";
      });
    };

    const down = (event: PointerEvent) => { if (event.pointerType === "mouse") cursor.classList.add("lunex-is-pressed"); };
    const up = () => cursor.classList.remove("lunex-is-pressed");
    const motionChanged = () => { if (motionQuery.matches) leave(); };
    const visibilityChanged = () => { if (document.visibilityState === "hidden") leave(); };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibilityChanged);
    motionQuery.addEventListener?.("change", motionChanged);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibilityChanged);
      motionQuery.removeEventListener?.("change", motionChanged);
    };
  }, []);

  return <div ref={cursorRef} className="lunex-custom-cursor" aria-hidden="true"><span className="lunex-custom-cursor-ring" /><span className="lunex-custom-cursor-point" /></div>;
}

/** Adds restrained, one-time scroll reveals to marked sections. Content remains visible without JS. */
function RevealObserver({ routeKey }: { routeKey: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-lunex-root]");
    if (!root) return undefined;
    root.classList.add("lunex-reveal-enabled");
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-lunex-reveal]"));
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("lunex-is-visible"));
      return () => root.classList.remove("lunex-reveal-enabled");
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("lunex-is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => { observer.disconnect(); root.classList.remove("lunex-reveal-enabled"); };
  }, [routeKey]);
  return null;
}

export default function PortableLunexPage() {
  const pathname = usePathname() || "/";
  const isWebsiteRoute = pathname === "/website" || pathname.startsWith("/website/");
  const basePath = isWebsiteRoute ? "/website" : "";
  const pathWithoutBase = basePath ? (pathname.slice(basePath.length) || "/") : pathname;
  const route = pathWithoutBase.replace(/\/+$/, "") || "/";
  const iconUrl = basePath + "/favicon.png";
  const modelUrl = process.env.NEXT_PUBLIC_LUNEX_MOON_MODEL_URL || (basePath + "/models/Moon_NASA_LRO_8k_Topo_Small.glb");

  useEffect(() => {
    document.title = route === "/presentation" ? "Watch 30 Seconds | Lunex" : route === "/explorer" ? "Mission Explorer | Lunex" : "Lunex — Explore the Moon";
    let favicon = document.head.querySelector<HTMLLinkElement>('link[data-lunex-favicon="true"]');
    const madeFavicon = !favicon;
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.dataset.lunexFavicon = "true";
      document.head.appendChild(favicon);
    }
    const priorIcon = favicon.href;
    favicon.href = iconUrl;

    let fonts = document.head.querySelector<HTMLLinkElement>('link[data-lunex-fonts="true"]');
    const madeFonts = !fonts;
    if (!fonts) {
      fonts = document.createElement("link");
      fonts.rel = "stylesheet";
      fonts.dataset.lunexFonts = "true";
      document.head.appendChild(fonts);
    }
    const priorFonts = fonts.href;
    fonts.href = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&family=Public+Sans:wght@400;500;600;700;800&display=swap";
    return () => {
      if (madeFavicon) favicon?.remove(); else if (favicon) favicon.href = priorIcon;
      if (madeFonts) fonts?.remove(); else if (fonts) fonts.href = priorFonts;
    };
  }, [iconUrl, route]);

  const isHome = route === "/";
  return (
    <div className={styles.root} data-lunex-root>
      <Starfield />
      <CustomCursor />
      <RevealObserver routeKey={route} />
      <a className="lunex-skip-link" href="#lunex-main-content">Skip to content</a>
      <SiteHeader basePath={basePath} isHome={isHome} iconUrl={iconUrl} />
      {route === "/presentation" ? (
        <ComingSoonPage basePath={basePath} eyebrow="LUNEX / QUICK INTRODUCTION" title="See the idea in 30 seconds."
          description="The short walkthrough is coming soon. It will show how Lunex brings lunar places, observation times and mission questions together." />
      ) : route === "/explorer" ? (
        <ComingSoonPage basePath={basePath} eyebrow="LUNEX / MISSION EXPLORER" title="Your next stop: the Moon."
          description="Explore lunar south-polar locations, define an observation scenario and compare the factors that mission teams need to study."
          variant="explorer" />
      ) : (
        <LunexHome basePath={basePath} modelUrl={modelUrl} />
      )}
      <SiteFooter basePath={basePath} iconUrl={iconUrl} />
    </div>
  );
}