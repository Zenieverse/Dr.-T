import * as THREE from 'three';
import { BOTANICAL_SPECIES, TOTAL_STEPS, stepToAngleRadians } from './musicTheory';
import { SkyMoodId, SoundOrb, SoundSpeciesId } from './types';

// Reusable scratch objects (zero per-frame GC allocations)
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

/**
 * Deterministic undulating meadow & sanctuary heightfield.
 * - r <= 7.0: gentle crowned mossy sanctuary terrace (ideal flat clearing for planting & VR locomotion)
 * - 7.0 < r < 9.2: shallow reflective garden brook ring
 * - r >= 9.2: rolling surrounding hills fading gracefully into the wooded horizon
 */
export function groundHeightAt(x: number, z: number): number {
  const r = Math.hypot(x, z);
  const microWave =
    Math.sin(x * 0.42) * Math.cos(z * 0.38) * 0.055 +
    Math.sin(x * 0.19 + z * 0.23) * 0.04;

  if (r <= 6.8) {
    // Gently crowned inner sanctuary (smoothly meets zero at stone ring)
    const dome = (1 - (r / 6.8) * (r / 6.8)) * 0.14;
    return dome + microWave * 0.45;
  }

  if (r < 9.4) {
    // Shallow sunken brook ring around r = 8.1
    const t = (r - 6.8) / 2.6;
    const basin = -Math.sin(t * Math.PI) * 0.42;
    return basin + microWave * 0.35;
  }

  const hillT = Math.min(1, (r - 9.4) / 36);
  const rollingHills =
    hillT * hillT * 5.8 +
    Math.sin(x * 0.09 + 0.6) * Math.cos(z * 0.08 - 0.3) * 1.9 * hillT +
    Math.sin(x * 0.18 - z * 0.14) * 0.65 * hillT;
  return rollingHills + microWave;
}

export interface SkyPalette {
  skyTop: string;
  skyHorizon: string;
  fogColor: string;
  fogDensity: number;
  sunColor: string;
  sunIntensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  rimColor: string;
  rimIntensity: number;
  waterColor: string;
  waterEmissive: string;
}

export const SKY_PALETTES: Record<SkyMoodId, SkyPalette> = {
  'golden-dawn': {
    skyTop: '#233642',
    skyHorizon: '#b9936d',
    fogColor: '#8d7968',
    fogDensity: 0.017,
    sunColor: '#ffdfa8',
    sunIntensity: 2.35,
    hemiSky: '#a8cbe0',
    hemiGround: '#3d4f38',
    hemiIntensity: 0.85,
    rimColor: '#f6c27b',
    rimIntensity: 0.9,
    waterColor: '#2d4b52',
    waterEmissive: '#4d3e2c',
  },
  'sunlit-meadow': {
    skyTop: '#3e7396',
    skyHorizon: '#d9e3d5',
    fogColor: '#b7cabf',
    fogDensity: 0.014,
    sunColor: '#fff3d6',
    sunIntensity: 2.55,
    hemiSky: '#c4e4f5',
    hemiGround: '#4a6240',
    hemiIntensity: 1.0,
    rimColor: '#a6dfc5',
    rimIntensity: 0.72,
    waterColor: '#376a6c',
    waterEmissive: '#1d4042',
  },
  'twilight-glow': {
    skyTop: '#101829',
    skyHorizon: '#3c4d63',
    fogColor: '#212d3d',
    fogDensity: 0.02,
    sunColor: '#a9c7f2',
    sunIntensity: 1.55,
    hemiSky: '#5878a3',
    hemiGround: '#1c2b26',
    hemiIntensity: 0.78,
    rimColor: '#e6b87a',
    rimIntensity: 1.05,
    waterColor: '#192b38',
    waterEmissive: '#22384c',
  },
};

function createCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  maxAnisotropy: number,
  repeat = 1
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    draw(ctx, width, height);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  if (repeat > 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
  }
  tex.needsUpdate = true;
  return tex;
}

export function createMeadowTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    512,
    512,
    (ctx, w, h) => {
      ctx.fillStyle = '#3c5539';
      ctx.fillRect(0, 0, w, h);

      // Soft botanical moss patches
      for (let i = 0; i < 240; i++) {
        const x = (Math.sin(i * 12.9898) * 0.5 + 0.5) * w;
        const y = (Math.cos(i * 78.233) * 0.5 + 0.5) * h;
        const r = 12 + (i % 34);
        const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
        const hue = i % 3 === 0 ? 'rgba(84,118,68,0.28)' : i % 3 === 1 ? 'rgba(42,67,43,0.3)' : 'rgba(110,126,74,0.2)';
        grad.addColorStop(0, hue);
        grad.addColorStop(1, 'rgba(60,85,57,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fine organic clover & grass grain
      for (let i = 0; i < 2600; i++) {
        const x = ((i * 97) % w);
        const y = ((i * 193) % h);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(148,176,112,0.14)' : 'rgba(28,44,29,0.18)';
        ctx.fillRect(x, y, 2, 5);
      }
    },
    maxAnisotropy,
    18
  );
}

export function createStoneSanctuaryTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    512,
    512,
    (ctx, w, h) => {
      const cx = w / 2;
      const cy = h / 2;
      ctx.fillStyle = '#5c5b52';
      ctx.fillRect(0, 0, w, h);

      // Subtle limestone radial rings
      for (let r = 24; r < w * 0.5; r += 36) {
        ctx.strokeStyle = 'rgba(220,208,180,0.18)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 16 subtle harmonic radial spokes
      for (let s = 0; s < TOTAL_STEPS; s++) {
        const a = (s / TOTAL_STEPS) * Math.PI * 2 - Math.PI / 2;
        ctx.strokeStyle = s % 4 === 0 ? 'rgba(235,205,138,0.34)' : 'rgba(220,210,188,0.14)';
        ctx.lineWidth = s % 4 === 0 ? 3 : 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 58, cy + Math.sin(a) * 58);
        ctx.lineTo(cx + Math.cos(a) * 246, cy + Math.sin(a) * 246);
        ctx.stroke();
      }

      // Natural stone grain speckles
      for (let i = 0; i < 3500; i++) {
        const x = ((i * 131 + 17) % w);
        const y = ((i * 257 + 31) % h);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(235,228,210,0.11)' : 'rgba(34,36,30,0.12)';
        ctx.fillRect(x, y, 2, 2);
      }
    },
    maxAnisotropy,
    1
  );
}

export function createBarkTexture(maxAnisotropy: number): THREE.CanvasTexture {
  return createCanvasTexture(
    256,
    256,
    (ctx, w, h) => {
      ctx.fillStyle = '#4a3a2d';
      ctx.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 6) {
        ctx.fillStyle = x % 12 === 0 ? 'rgba(34,24,18,0.45)' : 'rgba(98,79,62,0.3)';
        ctx.fillRect(x, 0, 3, h);
      }
      for (let i = 0; i < 900; i++) {
        const x = (i * 53) % w;
        const y = (i * 113) % h;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(72,88,58,0.18)' : 'rgba(26,18,14,0.22)';
        ctx.fillRect(x, y, 2, 12);
      }
    },
    maxAnisotropy,
    2
  );
}

export function createSkyDomeMaterial(palette: SkyPalette): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTopColor: { value: new THREE.Color(palette.skyTop) },
      uHorizonColor: { value: new THREE.Color(palette.skyHorizon) },
      uBloomGlow: { value: 0 },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform vec3 uTopColor;
      uniform vec3 uHorizonColor;
      uniform float uBloomGlow;
      varying vec3 vWorldPos;
      void main() {
        float h = normalize(vWorldPos).y;
        float t = pow(max(0.0, h), 0.55);
        vec3 warmGold = vec3(0.96, 0.78, 0.45);
        vec3 horizon = mix(uHorizonColor, warmGold, uBloomGlow * 0.42);
        vec3 top = mix(uTopColor, uTopColor + vec3(0.08, 0.06, 0.02), uBloomGlow);
        vec3 col = mix(horizon, top, t);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}

function buildCurvedPetalGeometry(
  width: number,
  length: number,
  cupCurve: number
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.85, length * 0.25, width * 0.95, length * 0.78, 0, length);
  shape.bezierCurveTo(-width * 0.95, length * 0.78, -width * 0.85, length * 0.25, 0, 0);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
    curveSegments: 10,
  });

  // Gently arch petal outward along its Y length for lifelike botanical cupping
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const py = pos.getY(i);
    const px = pos.getX(i);
    const normY = Math.min(1, Math.max(0, py / Math.max(0.01, length)));
    const archZ = Math.sin(normY * Math.PI) * cupCurve + (px * px) * 0.4;
    pos.setZ(i, pos.getZ(i) + archZ);
  }
  geo.computeVertexNormals();
  return geo;
}

function buildLeafGeometry(width: number, length: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(width, length * 0.35, 0, length);
  shape.quadraticCurveTo(-width, length * 0.35, 0, 0);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.005,
    bevelSegments: 1,
    curveSegments: 8,
  });

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const py = pos.getY(i);
    const t = py / Math.max(0.01, length);
    pos.setZ(i, pos.getZ(i) + Math.sin(t * Math.PI * 0.85) * 0.11);
  }
  geo.computeVertexNormals();
  return geo;
}

export interface SoundOrbPlantHandle {
  id: string;
  species: SoundSpeciesId;
  group: THREE.Group;
  orbHitMesh: THREE.Mesh;
  headGroup: THREE.Group;
  update: (params: {
    dt: number;
    time: number;
    elevation: number;
    globalBloom: number;
    pulse: number;
    sustain: number;
    selected: boolean;
    hovered: boolean;
    muted: boolean;
    sproutProgress: number;
    reducedMotion?: boolean;
  }) => void;
  getOrbWorldPosition: (target: THREE.Vector3) => THREE.Vector3;
  dispose: () => void;
}

/**
 * Constructs a composite 9–11 part botanical Sound Orb sculpture (`THREE.Group`)
 * with bottom-center ground pivot (`y = 0`), hinged animated petals, metallic calyx collar,
 * glowing core orb, and ground acoustic ripple ring.
 */
export function createSoundOrbPlant(
  orb: SoundOrb,
  isSoftwareGl: boolean
): SoundOrbPlantHandle {
  const spec = BOTANICAL_SPECIES[orb.species];
  const group = new THREE.Group();
  group.name = `sound-orb-plant-${orb.id}`;
  group.userData = { orbId: orb.id };

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  // 1. Mossy root mound (LatheGeometry, matte organic roughness 0.90)
  const moundProfile = [
    new THREE.Vector2(0.01, 0.12),
    new THREE.Vector2(0.14, 0.11),
    new THREE.Vector2(0.26, 0.05),
    new THREE.Vector2(0.32, 0.0),
  ];
  const moundGeo = new THREE.LatheGeometry(moundProfile, 14);
  const moundMat = new THREE.MeshStandardMaterial({
    color: '#344c34',
    roughness: 0.91,
    metalness: 0.02,
  });
  geometries.push(moundGeo);
  materials.push(moundMat);
  const moundMesh = new THREE.Mesh(moundGeo, moundMat);
  moundMesh.receiveShadow = true;
  moundMesh.castShadow = true;
  group.add(moundMesh);

  // 2. Carved bronze-stone sanctuary collar ring (roughness 0.30, metalness 0.65 — distinct material contrast)
  const collarGeo = new THREE.TorusGeometry(0.24, 0.028, 10, 24);
  const collarMat = new THREE.MeshStandardMaterial({
    color: '#b89a66',
    roughness: 0.3,
    metalness: 0.68,
    emissive: new THREE.Color(spec.emissiveColor),
    emissiveIntensity: 0.08,
  });
  geometries.push(collarGeo);
  materials.push(collarMat);
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.rotation.x = Math.PI / 2;
  collarMesh.position.y = 0.045;
  collarMesh.castShadow = true;
  group.add(collarMesh);

  // 3. Sculpted curved botanical stem (`TubeGeometry`, scaled dynamically to match orb elevation)
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.04, 0),
    new THREE.Vector3(0.06, 0.38, 0.03),
    new THREE.Vector3(-0.04, 0.74, -0.02),
    new THREE.Vector3(0, 1.0, 0),
  ]);
  const stemRadius = orb.species === 'reed' ? 0.044 : orb.species === 'lotus' ? 0.038 : 0.03;
  const stemGeo = new THREE.TubeGeometry(stemCurve, 18, stemRadius, 8, false);
  const stemMat = new THREE.MeshStandardMaterial({
    color: spec.stemColor,
    roughness: 0.74,
    metalness: 0.04,
  });
  geometries.push(stemGeo);
  materials.push(stemMat);
  const stemMesh = new THREE.Mesh(stemGeo, stemMat);
  stemMesh.castShadow = true;
  stemMesh.receiveShadow = true;
  group.add(stemMesh);

  // 4 & 5. Pair of beveled basal leaves
  const leafGeo = buildLeafGeometry(0.14, 0.44);
  const leafMat = new THREE.MeshStandardMaterial({
    color: '#4f7a53',
    roughness: 0.66,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  geometries.push(leafGeo);
  materials.push(leafMat);

  for (let i = 0; i < 2; i++) {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.y = 0.14 + i * 0.06;
    leaf.rotation.y = i * Math.PI + 0.55;
    leaf.rotation.x = 0.65;
    leaf.castShadow = true;
    group.add(leaf);
  }

  // Head assembly that rides gracefully atop the stem at `y = elevation`
  const headGroup = new THREE.Group();
  headGroup.position.y = orb.elevation;
  group.add(headGroup);

  // 6. Upper sepal chalice (`LatheGeometry`)
  const sepalProfile = [
    new THREE.Vector2(0.035, -0.14),
    new THREE.Vector2(0.11, -0.05),
    new THREE.Vector2(0.17, 0.02),
    new THREE.Vector2(0.14, 0.04),
  ];
  const sepalGeo = new THREE.LatheGeometry(sepalProfile, 12);
  const sepalMat = new THREE.MeshStandardMaterial({
    color: spec.stemColor,
    roughness: 0.68,
    metalness: 0.06,
  });
  geometries.push(sepalGeo);
  materials.push(sepalMat);
  const sepalMesh = new THREE.Mesh(sepalGeo, sepalMat);
  sepalMesh.castShadow = true;
  headGroup.add(sepalMesh);

  // 7. Metallic harmonic stamen halo around the core orb (roughness 0.22, metalness 0.78)
  const haloGeo = new THREE.TorusGeometry(0.24, 0.014, 8, 28);
  const haloMat = new THREE.MeshStandardMaterial({
    color: spec.accentColor,
    roughness: 0.22,
    metalness: 0.78,
    emissive: new THREE.Color(spec.emissiveColor),
    emissiveIntensity: 0.32,
  });
  geometries.push(haloGeo);
  materials.push(haloMat);
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.rotation.x = Math.PI / 2;
  haloMesh.position.y = 0.12;
  headGroup.add(haloMesh);

  // 8. Hinged botanical petals (species-specific count, shape & resting bud angle)
  const petalConfig: Record<
    SoundSpeciesId,
    { count: number; w: number; len: number; cup: number; closedTilt: number; openTilt: number }
  > = {
    bellflower: { count: 6, w: 0.13, len: 0.42, cup: 0.09, closedTilt: 0.32, openTilt: 1.18 },
    lotus: { count: 8, w: 0.17, len: 0.44, cup: 0.11, closedTilt: 0.48, openTilt: 1.32 },
    reed: { count: 5, w: 0.09, len: 0.54, cup: 0.06, closedTilt: 0.18, openTilt: 0.88 },
    fern: { count: 7, w: 0.11, len: 0.48, cup: 0.08, closedTilt: 0.36, openTilt: 1.24 },
    lily: { count: 6, w: 0.16, len: 0.39, cup: 0.12, closedTilt: 0.42, openTilt: 1.22 },
  };
  const cfg = petalConfig[orb.species];
  const petalGeo = buildCurvedPetalGeometry(cfg.w, cfg.len, cfg.cup);
  const petalMat = new THREE.MeshStandardMaterial({
    color: spec.petalColor,
    roughness: 0.42,
    metalness: 0.06,
    emissive: new THREE.Color(spec.emissiveColor),
    emissiveIntensity: 0.12,
    side: THREE.DoubleSide,
  });
  geometries.push(petalGeo);
  materials.push(petalMat);

  const petalPivots: THREE.Group[] = [];
  for (let i = 0; i < cfg.count; i++) {
    const angle = (i / cfg.count) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.rotation.y = angle;
    pivot.position.set(Math.sin(angle) * 0.11, 0.02, Math.cos(angle) * 0.11);

    const mesh = new THREE.Mesh(petalGeo, petalMat);
    mesh.castShadow = true;
    mesh.rotation.x = cfg.closedTilt;
    pivot.add(mesh);
    headGroup.add(pivot);
    petalPivots.push(pivot);
  }

  // 9. Core Luminous Sound Orb (`MeshPhysicalMaterial` with clearcoat; skips extra transmission pass on software WebGL)
  const orbRadius = orb.species === 'lotus' ? 0.19 : orb.species === 'reed' ? 0.165 : 0.175;
  const orbGeo = new THREE.IcosahedronGeometry(orbRadius, isSoftwareGl ? 2 : 4);
  const orbMat = new THREE.MeshPhysicalMaterial({
    color: spec.orbColor,
    roughness: 0.14,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    emissive: new THREE.Color(spec.emissiveColor),
    emissiveIntensity: 0.42,
    ...(isSoftwareGl ? {} : { sheen: 0.6, sheenColor: new THREE.Color(spec.accentColor) }),
  });
  geometries.push(orbGeo);
  materials.push(orbMat);
  const orbMesh = new THREE.Mesh(orbGeo, orbMat);
  orbMesh.position.y = 0.16;
  orbMesh.castShadow = true;
  orbMesh.userData = { orbId: orb.id, isOrbHitTarget: true };
  headGroup.add(orbMesh);

  // Generous invisible touch/raycast collider so desktop & VR pinching/grabbing feels effortless
  const hitGeo = new THREE.SphereGeometry(0.42, 10, 10);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  geometries.push(hitGeo);
  materials.push(hitMat);
  const orbHitMesh = new THREE.Mesh(hitGeo, hitMat);
  orbHitMesh.position.y = 0.16;
  orbHitMesh.userData = { orbId: orb.id, isOrbHitTarget: true };
  headGroup.add(orbHitMesh);

  // 10. Ground acoustic ripple ring (expands outward on beat strike)
  const rippleGeo = new THREE.RingGeometry(0.28, 0.36, 32);
  const rippleMat = new THREE.MeshBasicMaterial({
    color: spec.accentColor,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  geometries.push(rippleGeo);
  materials.push(rippleMat);
  const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
  rippleMesh.rotation.x = -Math.PI / 2;
  rippleMesh.position.y = 0.04;
  group.add(rippleMesh);

  // 11. Subtle selection/sculpting vertical guide aura
  const selectRingGeo = new THREE.RingGeometry(0.32, 0.37, 28);
  const selectRingMat = new THREE.MeshBasicMaterial({
    color: '#f8e3a8',
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  geometries.push(selectRingGeo);
  materials.push(selectRingMat);
  const selectRing = new THREE.Mesh(selectRingGeo, selectRingMat);
  selectRing.rotation.x = -Math.PI / 2;
  selectRing.position.y = 0.06;
  group.add(selectRing);

  // Local animated state
  let currentElevation = orb.elevation;
  let currentBloom = 0.2;
  let rippleAge = 1.0;

  return {
    id: orb.id,
    species: orb.species,
    group,
    orbHitMesh,
    headGroup,
    update: ({
      dt,
      time,
      elevation,
      globalBloom,
      pulse,
      sustain,
      selected,
      hovered,
      muted,
      sproutProgress,
      reducedMotion = false,
    }) => {
      const motionScale = reducedMotion ? 0.25 : 1.0;

      // Smooth sprout entrance + damped elevation morphing
      const sproutEase = 1 - Math.pow(1 - Math.min(1, sproutProgress), 3);
      currentElevation = THREE.MathUtils.damp(currentElevation, elevation, 9, dt);
      const effectiveHeight = Math.max(0.18, currentElevation * sproutEase);

      // Gentle botanical wind sway proportional to stem height
      const swayPhase = time * 1.45 + orb.x * 0.7 + orb.z * 0.5;
      const swayAmp = (0.025 + globalBloom * 0.02) * (effectiveHeight / 2.2) * motionScale;
      group.rotation.z = Math.sin(swayPhase) * swayAmp;
      group.rotation.x = Math.cos(swayPhase * 0.85) * swayAmp * 0.75;

      // Scale stem cleanly from ground mound up to head
      stemMesh.scale.set(
        sproutEase,
        Math.max(0.08, effectiveHeight),
        sproutEase
      );
      headGroup.position.y = effectiveHeight;
      headGroup.scale.setScalar(0.12 + 0.88 * sproutEase);

      // Petal openness driven by sustain, active musical pulse, and signature conducting bloom
      const targetBloom = muted
        ? 0.04
        : Math.min(1, 0.14 + sustain * 0.22 + globalBloom * 0.68 + pulse * 0.52);
      currentBloom = THREE.MathUtils.damp(currentBloom, targetBloom, 7.5, dt);

      const tilt = THREE.MathUtils.lerp(cfg.closedTilt, cfg.openTilt, currentBloom);
      for (let i = 0; i < petalPivots.length; i++) {
        const petalMesh = petalPivots[i].children[0];
        if (petalMesh) {
          petalMesh.rotation.x = tilt + Math.sin(time * 2.2 + i) * 0.025 * motionScale;
        }
      }

      // Orb breathing & luminous pulse
      const orbScale = 1 + (pulse * 0.3 + globalBloom * 0.18) * (reducedMotion ? 0.5 : 1) + (hovered ? 0.12 : 0);
      orbMesh.scale.setScalar(orbScale);
      orbMesh.position.y = 0.16 + (globalBloom * 0.1 + pulse * 0.08) * (reducedMotion ? 0.45 : 1);
      orbMesh.rotation.y += dt * (0.45 + pulse * 2.2 + globalBloom * 1.1) * motionScale;

      haloMesh.rotation.z = time * (0.6 + globalBloom * 1.4) * motionScale;
      haloMesh.scale.setScalar(1 + currentBloom * 0.34 + pulse * 0.22);

      // Emissive luminance responds vibrantly to note trigger & bloom
      const muteDim = muted ? 0.15 : 1.0;
      orbMat.emissiveIntensity =
        (0.32 + pulse * 1.65 + globalBloom * 0.88 + (hovered || selected ? 0.35 : 0)) * muteDim;
      petalMat.emissiveIntensity = (0.08 + pulse * 0.55 + globalBloom * 0.44) * muteDim;
      haloMat.emissiveIntensity = (0.25 + pulse * 1.1 + globalBloom * 0.72) * muteDim;
      collarMat.emissiveIntensity = (0.06 + pulse * 0.75 + globalBloom * 0.4) * muteDim;

      // Trigger expanding ripple ring on fresh beat strike
      if (pulse > 0.85) {
        rippleAge = 0;
      }
      if (rippleAge < 1.0) {
        rippleAge = Math.min(1.0, rippleAge + dt * 1.35);
        const s = 1 + rippleAge * (3.2 + globalBloom * 1.8);
        rippleMesh.scale.setScalar(s);
        rippleMat.opacity = (1 - rippleAge) * (0.58 + globalBloom * 0.24) * muteDim;
      } else {
        rippleMat.opacity = 0;
      }

      // Selection / hover sanctuary ring
      const showSelect = selected || hovered;
      selectRingMat.opacity = THREE.MathUtils.damp(
        selectRingMat.opacity,
        selected ? 0.72 : hovered ? 0.42 : 0,
        10,
        dt
      );
      if (showSelect) {
        selectRing.scale.setScalar(1.08 + Math.sin(time * 4) * 0.05);
      }
    },
    getOrbWorldPosition: (target: THREE.Vector3) => {
      return orbMesh.getWorldPosition(target);
    },
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}

export interface GardenEnvironmentHandle {
  group: THREE.Group;
  groundCollider: THREE.Mesh;
  skyMaterial: THREE.ShaderMaterial;
  waterMaterial: THREE.MeshStandardMaterial;
  playheadBeam: THREE.Group;
  update: (params: {
    dt: number;
    time: number;
    bloomLevel: number;
    playheadAngle: number;
    activeStep: number;
    isPlaying: boolean;
    reducedMotion?: boolean;
  }) => void;
  dispose: () => void;
}

/**
 * Builds the natural outdoor sanctuary clearing, rolling wooded hills, reflecting brook,
 * inlaid 16-step radial stone sequencer ring, instanced swaying meadow grass,
 * 18 composite perimeter cypress & willow trees, mossy boulders, and luminous pollen motes.
 */
export function createGardenEnvironment(
  initialSkyMood: SkyMoodId,
  maxAnisotropy: number,
  isSoftwareGl: boolean
): GardenEnvironmentHandle {
  const group = new THREE.Group();
  group.name = 'living-sound-garden-environment';

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const palette = SKY_PALETTES[initialSkyMood];

  // 1. Atmospheric gradient sky dome
  const skyGeo = new THREE.SphereGeometry(95, 24, 16);
  const skyMaterial = createSkyDomeMaterial(palette);
  geometries.push(skyGeo);
  materials.push(skyMaterial);
  const skyDome = new THREE.Mesh(skyGeo, skyMaterial);
  group.add(skyDome);

  // 2. Undulating natural meadow terrain (140m x 140m, vertex-colored + canvas moss texture)
  const meadowTex = createMeadowTexture(maxAnisotropy);
  textures.push(meadowTex);
  const segs = isSoftwareGl ? 64 : 96;
  const terrainGeo = new THREE.PlaneGeometry(140, 140, segs, segs);
  terrainGeo.rotateX(-Math.PI / 2);

  const pos = terrainGeo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = groundHeightAt(x, z);
    pos.setY(i, y);

    const r = Math.hypot(x, z);
    if (r < 7.0) {
      // Sun-dappled mossy sanctuary clearing
      _color.setRGB(0.62, 0.74, 0.54);
    } else if (r < 9.4) {
      // Wet pebble brook bed
      _color.setRGB(0.32, 0.37, 0.34);
    } else {
      // Lush outer meadow darkening softly on rolling hills
      const hillTint = Math.max(0.45, 0.78 - y * 0.055);
      _color.setRGB(0.45 * hillTint, 0.64 * hillTint, 0.42 * hillTint);
    }
    colors[i * 3] = _color.r;
    colors[i * 3 + 1] = _color.g;
    colors[i * 3 + 2] = _color.b;
  }
  terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    map: meadowTex,
    vertexColors: true,
    roughness: 0.94,
    metalness: 0.02,
  });
  geometries.push(terrainGeo);
  materials.push(terrainMat);
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  terrainMesh.name = 'garden-meadow-terrain';
  group.add(terrainMesh);

  // 3. Central Sanctuary Stone Ring (carved radial limestone pavers)
  const stoneTex = createStoneSanctuaryTexture(maxAnisotropy);
  textures.push(stoneTex);
  const stoneDiscGeo = new THREE.CylinderGeometry(6.72, 6.92, 0.14, 48);
  const stoneDiscMat = new THREE.MeshStandardMaterial({
    map: stoneTex,
    color: '#959180',
    roughness: 0.84,
    metalness: 0.08,
    transparent: true,
    opacity: 0.86,
  });
  geometries.push(stoneDiscGeo);
  materials.push(stoneDiscMat);
  const stoneDisc = new THREE.Mesh(stoneDiscGeo, stoneDiscMat);
  stoneDisc.position.y = -0.025;
  stoneDisc.receiveShadow = true;
  group.add(stoneDisc);

  // Center bronze botanical compass medallion
  const centerMedallionGeo = new THREE.CylinderGeometry(0.95, 1.08, 0.11, 24);
  const centerMedallionMat = new THREE.MeshStandardMaterial({
    color: '#9e8458',
    roughness: 0.34,
    metalness: 0.64,
    emissive: new THREE.Color('#c89d54'),
    emissiveIntensity: 0.12,
  });
  geometries.push(centerMedallionGeo);
  materials.push(centerMedallionMat);
  const centerMedallion = new THREE.Mesh(centerMedallionGeo, centerMedallionMat);
  centerMedallion.position.y = 0.09;
  centerMedallion.receiveShadow = true;
  centerMedallion.castShadow = true;
  group.add(centerMedallion);

  // 4. 16 inlaid radial rhythm step stones (`InstancedMesh`)
  const stepStoneGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.08, 12);
  const stepStoneMat = new THREE.MeshStandardMaterial({
    color: '#d9c698',
    roughness: 0.36,
    metalness: 0.55,
    emissive: new THREE.Color('#f4c468'),
    emissiveIntensity: 0.22,
  });
  geometries.push(stepStoneGeo);
  materials.push(stepStoneMat);
  const stepMarkers = new THREE.InstancedMesh(stepStoneGeo, stepStoneMat, TOTAL_STEPS);
  stepMarkers.frustumCulled = false;
  for (let s = 0; s < TOTAL_STEPS; s++) {
    const a = stepToAngleRadians(s);
    const rad = 6.38;
    const x = Math.sin(a) * rad;
    const z = -Math.cos(a) * rad;
    _dummy.position.set(x, groundHeightAt(x, z) + 0.04, z);
    _dummy.rotation.set(0, -a, 0);
    _dummy.scale.setScalar(s % 4 === 0 ? 1.32 : 0.92);
    _dummy.updateMatrix();
    stepMarkers.setMatrixAt(s, _dummy.matrix);
    stepMarkers.setColorAt(s, _color.set(s % 4 === 0 ? '#e8c477' : '#9c957f'));
  }
  stepMarkers.instanceMatrix.needsUpdate = true;
  if (stepMarkers.instanceColor) stepMarkers.instanceColor.needsUpdate = true;
  stepMarkers.computeBoundingSphere();
  group.add(stepMarkers);

  // 5. Shimmering circular garden brook ring around the clearing
  const waterGeo = new THREE.RingGeometry(6.85, 9.45, 64);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: palette.waterColor,
    roughness: 0.14,
    metalness: 0.52,
    emissive: new THREE.Color(palette.waterEmissive),
    emissiveIntensity: 0.24,
    transparent: true,
    opacity: 0.88,
  });
  geometries.push(waterGeo);
  materials.push(waterMaterial);
  const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
  waterMesh.position.y = -0.14;
  waterMesh.receiveShadow = true;
  group.add(waterMesh);

  // 6. Rotating radial conductor light beam
  const playheadBeam = new THREE.Group();
  const beamGeo = new THREE.PlaneGeometry(0.18, 6.2);
  beamGeo.rotateX(-Math.PI / 2);
  beamGeo.translate(0, 0.09, -3.55);
  const beamMat = new THREE.MeshBasicMaterial({
    color: '#ffe099',
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  geometries.push(beamGeo);
  materials.push(beamMat);
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  playheadBeam.add(beamMesh);

  const beamTipGeo = new THREE.SphereGeometry(0.13, 12, 12);
  const beamTipMat = new THREE.MeshBasicMaterial({
    color: '#fff1c1',
    transparent: true,
    opacity: 0.85,
  });
  geometries.push(beamTipGeo);
  materials.push(beamTipMat);
  const beamTip = new THREE.Mesh(beamTipGeo, beamTipMat);
  beamTip.position.set(0, 0.24, -6.38);
  playheadBeam.add(beamTip);
  group.add(playheadBeam);

  // 7. Instanced Swaying Meadow Grass Blades (460 GPU / 220 SoftwareGL)
  const grassCount = isSoftwareGl ? 220 : 460;
  const bladeGeo = new THREE.ConeGeometry(0.036, 0.56, 3);
  bladeGeo.translate(0, 0.28, 0);
  const bladeMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.82,
    metalness: 0.02,
  });
  geometries.push(bladeGeo);
  materials.push(bladeMat);
  const grassMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, grassCount);
  grassMesh.frustumCulled = false;

  const grassData: Array<{
    x: number;
    y: number;
    z: number;
    rotY: number;
    scaleY: number;
    scaleXZ: number;
    phase: number;
  }> = [];

  for (let i = 0; i < grassCount; i++) {
    // Deterministic phyllotaxis ring distribution outside inner stone patio & outside brook
    const goldenAngle = i * 2.3999632;
    const isOuter = i % 5 !== 0;
    const radius = isOuter
      ? 9.6 + ((i * 73) % 100) * 0.22
      : 5.5 + ((i * 41) % 100) * 0.013;
    const x = Math.cos(goldenAngle) * radius;
    const z = Math.sin(goldenAngle) * radius;
    const y = groundHeightAt(x, z) - 0.03;
    const scaleY = 0.72 + ((i * 19) % 100) * 0.0085;
    const scaleXZ = 0.82 + ((i * 29) % 100) * 0.004;
    const rotY = (i * 1.13) % (Math.PI * 2);

    grassData.push({ x, y, z, rotY, scaleY, scaleXZ, phase: i * 0.37 });
    _dummy.position.set(x, y, z);
    _dummy.rotation.set(0.08, rotY, 0);
    _dummy.scale.set(scaleXZ, scaleY, scaleXZ);
    _dummy.updateMatrix();
    grassMesh.setMatrixAt(i, _dummy.matrix);

    const gHue = 0.26 + ((i * 13) % 20) * 0.0045;
    const gSat = 0.32 + ((i * 7) % 15) * 0.012;
    const gLight = 0.28 + ((i * 11) % 20) * 0.009;
    grassMesh.setColorAt(i, _color.setHSL(gHue, gSat, gLight));
  }
  grassMesh.instanceMatrix.needsUpdate = true;
  if (grassMesh.instanceColor) grassMesh.instanceColor.needsUpdate = true;
  grassMesh.computeBoundingSphere();
  group.add(grassMesh);

  // 8. Composite Perimeter Cypress & Willow Groves (18 multi-part trees, zero floating roots)
  const barkTex = createBarkTexture(maxAnisotropy);
  textures.push(barkTex);
  const trunkMat = new THREE.MeshStandardMaterial({
    map: barkTex,
    color: '#6b5645',
    roughness: 0.92,
    metalness: 0.02,
  });
  const canopyDeepMat = new THREE.MeshStandardMaterial({
    color: '#2d4e38',
    roughness: 0.84,
    metalness: 0.02,
  });
  const canopyWarmMat = new THREE.MeshStandardMaterial({
    color: '#436943',
    roughness: 0.8,
    metalness: 0.02,
  });
  const blossomTipMat = new THREE.MeshStandardMaterial({
    color: '#7fa169',
    roughness: 0.72,
    metalness: 0.04,
    emissive: new THREE.Color('#7ca355'),
    emissiveIntensity: 0.05,
  });
  materials.push(trunkMat, canopyDeepMat, canopyWarmMat, blossomTipMat);

  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.38, 3.6, 8);
  trunkGeo.translate(0, 1.8, 0);
  const limbGeo = new THREE.CylinderGeometry(0.07, 0.14, 1.8, 6);
  limbGeo.translate(0, 0.9, 0);
  const crownGeo = new THREE.DodecahedronGeometry(1.45, 1);
  const spireGeo = new THREE.ConeGeometry(1.25, 4.2, 8);
  geometries.push(trunkGeo, limbGeo, crownGeo, spireGeo);

  const treeCount = 18;
  for (let t = 0; t < treeCount; t++) {
    const angle = (t / treeCount) * Math.PI * 2 + (t % 2) * 0.16;
    const radius = 12.2 + (t % 3) * 4.8 + Math.sin(t * 2.1) * 1.4;
    const tx = Math.cos(angle) * radius;
    const tz = Math.sin(angle) * radius;
    const ty = groundHeightAt(tx, tz) - 0.18;

    const tree = new THREE.Group();
    tree.position.set(tx, ty, tz);
    const scale = 0.88 + (t % 4) * 0.24;
    tree.scale.setScalar(scale);
    tree.rotation.y = t * 1.3;

    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    if (t % 2 === 0) {
      // Sculpted layered garden willow / oak (6 parts)
      for (let b = 0; b < 2; b++) {
        const limb = new THREE.Mesh(limbGeo, trunkMat);
        limb.position.y = 2.25;
        limb.rotation.z = b === 0 ? 0.55 : -0.5;
        limb.rotation.y = b * 2.2;
        tree.add(limb);
      }
      const c1 = new THREE.Mesh(crownGeo, canopyDeepMat);
      c1.position.set(0, 4.1, 0);
      c1.scale.set(1.25, 0.88, 1.2);
      c1.castShadow = true;
      tree.add(c1);

      const c2 = new THREE.Mesh(crownGeo, canopyWarmMat);
      c2.position.set(0.85, 3.55, 0.45);
      c2.scale.set(0.95, 0.72, 0.9);
      c2.castShadow = true;
      tree.add(c2);

      const c3 = new THREE.Mesh(crownGeo, blossomTipMat);
      c3.position.set(-0.72, 3.85, -0.45);
      c3.scale.set(0.88, 0.75, 0.85);
      c3.castShadow = true;
      tree.add(c3);
    } else {
      // Layered botanical cypress spire (5 parts)
      const s1 = new THREE.Mesh(spireGeo, canopyDeepMat);
      s1.position.y = 3.5;
      s1.scale.set(1.15, 0.95, 1.15);
      s1.castShadow = true;
      tree.add(s1);

      const s2 = new THREE.Mesh(spireGeo, canopyWarmMat);
      s2.position.y = 5.0;
      s2.scale.set(0.85, 0.92, 0.85);
      s2.castShadow = true;
      tree.add(s2);

      const s3 = new THREE.Mesh(spireGeo, blossomTipMat);
      s3.position.y = 6.35;
      s3.scale.set(0.55, 0.72, 0.55);
      s3.castShadow = true;
      tree.add(s3);
    }

    group.add(tree);
  }

  // 9. Mossy Granite Sanctuary Boulders ringing the brook bank
  const boulderGeo = new THREE.DodecahedronGeometry(0.65, 1);
  const boulderMat = new THREE.MeshStandardMaterial({
    color: '#696e66',
    roughness: 0.9,
    metalness: 0.05,
  });
  geometries.push(boulderGeo);
  materials.push(boulderMat);

  for (let b = 0; b < 14; b++) {
    const a = (b / 14) * Math.PI * 2 + 0.22;
    const rad = b % 2 === 0 ? 9.7 + (b % 3) * 0.45 : 7.05;
    const bx = Math.cos(a) * rad;
    const bz = Math.sin(a) * rad;
    const boulder = new THREE.Mesh(boulderGeo, boulderMat);
    boulder.position.set(bx, groundHeightAt(bx, bz) + 0.08, bz);
    boulder.scale.set(
      0.7 + (b % 3) * 0.38,
      0.42 + (b % 2) * 0.22,
      0.65 + ((b + 1) % 3) * 0.34
    );
    boulder.rotation.set(b * 0.4, b * 1.1, b * 0.25);
    boulder.castShadow = true;
    boulder.receiveShadow = true;
    group.add(boulder);
  }

  // 10. Luminous Floating Pollen & Firefly Motes (`InstancedMesh`)
  const pollenCount = isSoftwareGl ? 110 : 220;
  const pollenGeo = new THREE.IcosahedronGeometry(0.042, 1);
  const pollenMat = new THREE.MeshBasicMaterial({
    color: '#fff0be',
    transparent: true,
    opacity: 0.85,
  });
  geometries.push(pollenGeo);
  materials.push(pollenMat);
  const pollenMesh = new THREE.InstancedMesh(pollenGeo, pollenMat, pollenCount);
  pollenMesh.frustumCulled = false;

  const pollenSeeds = Array.from({ length: pollenCount }, (_, i) => ({
    angle: i * 2.39996,
    radius: 1.2 + ((i * 59) % 100) * 0.085,
    baseHeight: 0.45 + ((i * 37) % 100) * 0.036,
    speed: 0.22 + ((i * 17) % 100) * 0.004,
    phase: i * 0.61,
  }));
  for (let i = 0; i < pollenCount; i++) {
    pollenMesh.setColorAt(
      i,
      _color.set(i % 3 === 0 ? '#ffe59e' : i % 3 === 1 ? '#b8f2de' : '#ffcaa6')
    );
  }
  if (pollenMesh.instanceColor) pollenMesh.instanceColor.needsUpdate = true;
  pollenMesh.computeBoundingSphere();
  group.add(pollenMesh);

  let lastHighlightedStep = -1;
  let lastPlayingState: boolean | null = null;

  return {
    group,
    groundCollider: terrainMesh,
    skyMaterial,
    waterMaterial,
    playheadBeam,
    update: ({
      time,
      bloomLevel,
      playheadAngle,
      activeStep,
      isPlaying,
      reducedMotion = false,
    }) => {
      const motionScale = reducedMotion ? 0.25 : 1.0;

      skyMaterial.uniforms.uBloomGlow.value = bloomLevel;
      centerMedallionMat.emissiveIntensity = 0.1 + bloomLevel * 0.58;
      blossomTipMat.emissiveIntensity = 0.04 + bloomLevel * 0.34;

      // Rotate radial conductor light beam
      playheadBeam.rotation.y = -playheadAngle;
      beamMat.opacity = isPlaying ? 0.28 + bloomLevel * 0.34 : 0.14;
      beamTipMat.opacity = isPlaying ? 0.85 : 0.35;

      // Dirty-checked GPU color upload: only update instanced step markers when step or playback changes
      if (activeStep !== lastHighlightedStep || isPlaying !== lastPlayingState) {
        lastHighlightedStep = activeStep;
        lastPlayingState = isPlaying;
        for (let s = 0; s < TOTAL_STEPS; s++) {
          const isCurrent = isPlaying && s === activeStep;
          if (isCurrent) {
            stepMarkers.setColorAt(s, _color.set('#fff3c4'));
          } else {
            stepMarkers.setColorAt(s, _color.set(s % 4 === 0 ? '#e0bc72' : '#8d8874'));
          }
        }
        if (stepMarkers.instanceColor) stepMarkers.instanceColor.needsUpdate = true;
      }

      // Subtle living brook shimmer
      waterMaterial.emissiveIntensity =
        0.22 + bloomLevel * 0.36 + Math.sin(time * 1.6) * 0.05 * motionScale;

      // Sway meadow grass gently with wind + harmonic bloom waves
      const windAmp = (0.12 + bloomLevel * 0.12) * motionScale;
      for (let i = 0; i < grassCount; i++) {
        const g = grassData[i];
        const leanX = Math.sin(time * 1.4 + g.phase) * windAmp;
        const leanZ = Math.cos(time * 1.15 + g.phase) * windAmp * 0.6;
        _dummy.position.set(g.x, g.y, g.z);
        _dummy.rotation.set(leanX, g.rotY, leanZ);
        _dummy.scale.set(g.scaleXZ, g.scaleY * (1 + bloomLevel * 0.16), g.scaleXZ);
        _dummy.updateMatrix();
        grassMesh.setMatrixAt(i, _dummy.matrix);
      }
      grassMesh.instanceMatrix.needsUpdate = true;

      // Floating pollen motes spiral skyward when conducting the garden into full bloom
      const spiralBoost = (1 + bloomLevel * 2.4) * (reducedMotion ? 0.35 : 1);
      for (let i = 0; i < pollenCount; i++) {
        const p = pollenSeeds[i];
        const a = p.angle + time * p.speed * spiralBoost * 0.25;
        const rad = p.radius * (1 - bloomLevel * 0.18) + Math.sin(time + p.phase) * 0.25 * motionScale;
        const lift = ((p.baseHeight + time * (0.12 + bloomLevel * 0.85) * (reducedMotion ? 0.3 : 1)) % 5.4) + 0.32;
        _dummy.position.set(Math.cos(a) * rad, lift, Math.sin(a) * rad);
        const s = (0.65 + bloomLevel * 0.95) * (0.75 + Math.sin(time * 3 + p.phase) * 0.25 * motionScale);
        _dummy.scale.setScalar(s);
        _dummy.rotation.set(0, a, 0);
        _dummy.updateMatrix();
        pollenMesh.setMatrixAt(i, _dummy.matrix);
      }
      pollenMesh.instanceMatrix.needsUpdate = true;
    },
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}

export interface SpatialHandRigHandle {
  group: THREE.Group;
  update: (params: {
    dt: number;
    time: number;
    targetPos: THREE.Vector3;
    pinchAmount: number;
    openBloomAmount: number;
    visible: boolean;
    handedness: 'left' | 'right';
  }) => void;
  dispose: () => void;
}

/**
 * Articulated 8-part luminous botanical spatial hand (`THREE.Group`) used both for
 * hands-first desktop spatial sculpting/conducting AND as subtle visual feedback.
 */
export function createSpatialHandRig(handedness: 'left' | 'right'): SpatialHandRigHandle {
  const group = new THREE.Group();
  group.name = `spatial-hand-${handedness}`;
  const mirror = handedness === 'left' ? -1 : 1;

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const handMat = new THREE.MeshPhysicalMaterial({
    color: '#f5e8cc',
    roughness: 0.24,
    metalness: 0.14,
    clearcoat: 0.9,
    emissive: new THREE.Color('#e6b963'),
    emissiveIntensity: 0.34,
    transparent: true,
    opacity: 0.82,
  });
  const cuffMat = new THREE.MeshStandardMaterial({
    color: '#d4b06a',
    roughness: 0.26,
    metalness: 0.78,
    emissive: new THREE.Color('#f0c060'),
    emissiveIntensity: 0.28,
  });
  const auraMat = new THREE.MeshBasicMaterial({
    color: '#ffe39c',
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materials.push(handMat, cuffMat, auraMat);

  // 1. Sculpted translucent palm
  const palmGeo = new THREE.BoxGeometry(0.18, 0.048, 0.2);
  geometries.push(palmGeo);
  const palm = new THREE.Mesh(palmGeo, handMat);
  group.add(palm);

  // 2. Metallic conductor wrist cuff
  const cuffGeo = new THREE.TorusGeometry(0.088, 0.014, 8, 20);
  geometries.push(cuffGeo);
  const cuff = new THREE.Mesh(cuffGeo, cuffMat);
  cuff.position.set(0, 0, 0.125);
  group.add(cuff);

  // 3. Palm luminous aura orb
  const auraGeo = new THREE.SphereGeometry(0.11, 14, 14);
  geometries.push(auraGeo);
  const aura = new THREE.Mesh(auraGeo, auraMat);
  aura.position.set(0, 0.04, -0.02);
  group.add(aura);

  // 4-8. Articulated Thumb + 4 Fingers
  const fingerGeo = new THREE.CapsuleGeometry(0.017, 0.12, 4, 8);
  fingerGeo.rotateX(Math.PI / 2);
  fingerGeo.translate(0, 0, -0.075);
  geometries.push(fingerGeo);

  const fingers: THREE.Group[] = [];
  const xOffsets = [-0.068, -0.022, 0.024, 0.068];
  const scales = [0.95, 1.08, 1.0, 0.82];
  for (let i = 0; i < 4; i++) {
    const pivot = new THREE.Group();
    pivot.position.set(xOffsets[i] * mirror, 0.005, -0.095);
    const mesh = new THREE.Mesh(fingerGeo, handMat);
    mesh.scale.setScalar(scales[i]);
    pivot.add(mesh);
    group.add(pivot);
    fingers.push(pivot);
  }

  const thumbPivot = new THREE.Group();
  thumbPivot.position.set(-0.095 * mirror, -0.01, -0.015);
  thumbPivot.rotation.y = 0.55 * mirror;
  const thumbMesh = new THREE.Mesh(fingerGeo, handMat);
  thumbMesh.scale.setScalar(0.84);
  thumbPivot.add(thumbMesh);
  group.add(thumbPivot);

  return {
    group,
    update: ({ dt, time, targetPos, pinchAmount, openBloomAmount, visible }) => {
      group.visible = visible;
      if (!visible) return;

      group.position.x = THREE.MathUtils.damp(group.position.x, targetPos.x, 12, dt);
      group.position.y = THREE.MathUtils.damp(group.position.y, targetPos.y, 12, dt);
      group.position.z = THREE.MathUtils.damp(group.position.z, targetPos.z, 12, dt);

      // Expressive wrist tilt when lifting into bloom
      group.rotation.x = THREE.MathUtils.damp(
        group.rotation.x,
        -0.18 + openBloomAmount * 0.52 - pinchAmount * 0.22,
        10,
        dt
      );
      group.rotation.z = THREE.MathUtils.damp(
        group.rotation.z,
        (0.18 - openBloomAmount * 0.28) * mirror + Math.sin(time * 2.2) * 0.04,
        10,
        dt
      );

      // Curl fingers on pinch, fan fingers wide on bloom
      for (let i = 0; i < fingers.length; i++) {
        const curl = pinchAmount * (i === 0 ? 0.78 : 0.45) - openBloomAmount * 0.24;
        fingers[i].rotation.x = THREE.MathUtils.damp(fingers[i].rotation.x, -curl, 14, dt);
        fingers[i].rotation.y =
          ((i - 1.5) * 0.08 * (1 + openBloomAmount * 1.4)) * mirror;
      }
      thumbPivot.rotation.x = THREE.MathUtils.damp(
        thumbPivot.rotation.x,
        -pinchAmount * 0.55,
        14,
        dt
      );

      auraMat.opacity = 0.16 + openBloomAmount * 0.42 + pinchAmount * 0.2;
      aura.scale.setScalar(0.85 + openBloomAmount * 0.85 + Math.sin(time * 4) * 0.08);
      handMat.emissiveIntensity = 0.28 + openBloomAmount * 0.72 + pinchAmount * 0.35;
    },
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}

export interface SeedPreviewHandle {
  group: THREE.Group;
  update: (
    visible: boolean,
    x: number,
    z: number,
    elevation: number,
    species: SoundSpeciesId,
    time: number
  ) => void;
  dispose: () => void;
}

export function createSeedPreviewRing(): SeedPreviewHandle {
  const group = new THREE.Group();
  const ringGeo = new THREE.RingGeometry(0.26, 0.35, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: '#ffe099',
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.06;
  group.add(ring);

  const stemLineGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 6);
  stemLineGeo.translate(0, 0.5, 0);
  const stemLineMat = new THREE.MeshBasicMaterial({
    color: '#ffe8ad',
    transparent: true,
    opacity: 0.48,
  });
  const stemLine = new THREE.Mesh(stemLineGeo, stemLineMat);
  group.add(stemLine);

  const budGeo = new THREE.OctahedronGeometry(0.14, 1);
  const budMat = new THREE.MeshBasicMaterial({
    color: '#fff2cc',
    transparent: true,
    opacity: 0.78,
    wireframe: true,
  });
  const bud = new THREE.Mesh(budGeo, budMat);
  group.add(bud);

  group.visible = false;

  return {
    group,
    update: (visible, x, z, elevation, species, time) => {
      group.visible = visible;
      if (!visible) return;
      const spec = BOTANICAL_SPECIES[species];
      const gy = groundHeightAt(x, z);
      group.position.set(x, gy, z);
      ringMat.color.set(spec.accentColor);
      stemLineMat.color.set(spec.accentColor);
      budMat.color.set(spec.orbColor);

      stemLine.scale.set(1, elevation, 1);
      bud.position.y = elevation;
      bud.rotation.y = time * 1.8;
      ring.scale.setScalar(1 + Math.sin(time * 5) * 0.08);
    },
    dispose: () => {
      ringGeo.dispose();
      ringMat.dispose();
      stemLineGeo.dispose();
      stemLineMat.dispose();
      budGeo.dispose();
      budMat.dispose();
    },
  };
}
