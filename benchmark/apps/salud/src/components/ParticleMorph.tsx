"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

const N = 6000;

/* ------------------------------------------------------------------ */
/* Generadores de formas (todas ~4 unidades de alto, centradas)        */
/* ------------------------------------------------------------------ */

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

type V3 = [number, number, number];
type Sampler = (r: () => number) => V3;

/** Punto en la superficie de un elipsoide. */
const ellipsoid = (c: V3, rad: V3): Sampler => (r) => {
  const u = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [c[0] + rad[0] * s * Math.cos(t), c[1] + rad[1] * u, c[2] + rad[2] * s * Math.sin(t)];
};

/** Punto en la superficie de una cápsula entre a y b (radio puede afinarse de ra a rb). */
const capsule = (a: V3, b: V3, ra: number, rb = ra): Sampler => {
  const ab = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const len = ab.length();
  const dir = ab.clone().normalize();
  const tmp = Math.abs(dir.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const n1 = new THREE.Vector3().crossVectors(dir, tmp).normalize();
  const n2 = new THREE.Vector3().crossVectors(dir, n1).normalize();
  return (r) => {
    const t = r();
    const ang = r() * Math.PI * 2;
    const rad = ra + (rb - ra) * t;
    const p = new THREE.Vector3(a[0], a[1], a[2])
      .addScaledVector(dir, t * len)
      .addScaledVector(n1, Math.cos(ang) * rad)
      .addScaledVector(n2, Math.sin(ang) * rad);
    return [p.x, p.y, p.z];
  };
};

/** Mezcla de partes con peso (≈ área), para repartir los N puntos. */
function compose(parts: [Sampler, number][], seed: number, post?: (p: V3, r: () => number) => V3) {
  const r = rng(seed);
  const total = parts.reduce((a, [, w]) => a + w, 0);
  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    let pick = r() * total;
    let s = parts[0][0];
    for (const [fn, w] of parts) {
      if ((pick -= w) <= 0) {
        s = fn;
        break;
      }
    }
    let p = s(r);
    if (post) p = post(p, r);
    out.set(p, i * 3);
  }
  return out;
}

function bodyShape() {
  const parts: [Sampler, number][] = [
    [ellipsoid([0, 1.62, 0], [0.27, 0.33, 0.29]), 7],
    [capsule([0, 1.18, 0], [0, 1.34, 0], 0.11), 1.2],
    [ellipsoid([0, 0.74, 0], [0.4, 0.55, 0.2]), 14],
    [ellipsoid([0, 0.14, 0], [0.33, 0.22, 0.18]), 6],
  ];
  for (const s of [-1, 1]) {
    parts.push(
      [ellipsoid([s * 0.44, 1.1, 0], [0.13, 0.12, 0.13]), 1.2],
      [capsule([s * 0.47, 1.08, 0], [s * 0.6, 0.45, 0.02], 0.095, 0.075), 3],
      [capsule([s * 0.6, 0.45, 0.02], [s * 0.68, -0.12, 0.08], 0.075, 0.055), 2.4],
      [ellipsoid([s * 0.7, -0.26, 0.09], [0.06, 0.11, 0.04]), 0.8],
      [capsule([s * 0.17, 0.02, 0], [s * 0.2, -0.86, 0.02], 0.15, 0.1), 5],
      [capsule([s * 0.2, -0.86, 0.02], [s * 0.21, -1.74, -0.02], 0.095, 0.06), 3.6],
      [ellipsoid([s * 0.22, -1.84, 0.08], [0.07, 0.05, 0.15]), 0.8],
    );
  }
  return compose(parts, 1, (p) => [p[0] * 1.05, p[1] * 1.02 - 0.05, p[2]]);
}

/** Profundidad de la cara (frente del elipsoide) para dibujar rasgos sobre la superficie. */
const faceZ = (x: number, y: number) => 1.25 * Math.sqrt(Math.max(0, 1 - (x / 1.2) ** 2 - ((y - 0.2) / 1.55) ** 2));

/** Trazo sobre la cara: curva paramétrica u∈[0,1] → (x, y), con un relieve extra. */
const stroke = (fn: (u: number) => [number, number], lift = 0.03, jitter = 0.02): Sampler => (r) => {
  const [x, y] = fn(r());
  return [x + (r() - 0.5) * jitter, y + (r() - 0.5) * jitter, faceZ(x, y) + lift];
};

function faceShape() {
  const eye = (cx: number): Sampler =>
    stroke((u) => [cx + Math.cos(u * Math.PI * 2) * 0.2, 0.42 + Math.sin(u * Math.PI * 2) * 0.09], 0.02);
  const brow = (cx: number): Sampler => stroke((u) => [cx + (u - 0.5) * 0.48, 0.66 + Math.sin(u * Math.PI) * 0.08], 0.05);
  const parts: [Sampler, number][] = [
    [ellipsoid([0, 0.2, 0], [1.2, 1.55, 1.25]), 16],
    // Rasgos dibujados con más densidad, como un boceto de luz.
    [eye(-0.45), 2.2],
    [eye(0.45), 2.2],
    [stroke((u) => [-0.45 + Math.cos(u * 6.28) * 0.06, 0.42 + Math.sin(u * 6.28) * 0.06], 0.01, 0.01), 1],
    [stroke((u) => [0.45 + Math.cos(u * 6.28) * 0.06, 0.42 + Math.sin(u * 6.28) * 0.06], 0.01, 0.01), 1],
    [brow(-0.45), 1.6],
    [brow(0.45), 1.6],
    // Tabique y aletas de la nariz
    [stroke((u) => [0.02 * Math.sin(u * 3), 0.35 - u * 0.45], 0.25 * 1, 0.02), 1.8],
    [stroke((u) => [(u - 0.5) * 0.36, -0.12 + Math.abs(u - 0.5) * 0.12], 0.2, 0.02), 1.2],
    // Labios
    [stroke((u) => [(u - 0.5) * 0.62, -0.52 + Math.sin(u * Math.PI) * 0.07 - Math.abs(Math.sin(u * Math.PI * 2)) * 0.02], 0.1), 1.8],
    [stroke((u) => [(u - 0.5) * 0.58, -0.6 - Math.sin(u * Math.PI) * 0.08], 0.09), 1.6],
    // Mandíbula
    [stroke((u) => [Math.cos(Math.PI * (0.15 + u * 0.7)) * 0.95, -0.55 - Math.sin(Math.PI * (0.15 + u * 0.7)) * 0.72], -0.05, 0.03), 2.2],
    [ellipsoid([-1.2, 0.15, -0.05], [0.12, 0.35, 0.22]), 1],
    [ellipsoid([1.2, 0.15, -0.05], [0.12, 0.35, 0.22]), 1],
    [capsule([0, -1.2, -0.1], [0, -2.1, -0.15], 0.62), 6],
  ];
  return compose(parts, 2, ([x, y, z]) => {
    if (z > 0) {
      // Cuencas de los ojos
      for (const ex of [-0.45, 0.45]) {
        const d = Math.hypot(x - ex, y - 0.42);
        if (d < 0.26) z *= 0.82 + 0.18 * (d / 0.26);
      }
      // Nariz
      const dn = Math.hypot(x, (y - 0.02) * 0.7);
      if (dn < 0.3) z += 0.38 * Math.pow(1 - dn / 0.3, 1.5);
      // Labios
      const dl = Math.hypot(x * 0.7, (y + 0.58) * 2.2);
      if (dl < 0.3) z += 0.12 * (1 - dl / 0.3);
      // Mentón y pómulos
      if (y < -0.9) z *= 0.92;
    }
    return [x, y, z];
  });
}

function toothShape() {
  const crown: Sampler = (r) => {
    // Superelipsoide redondeado + cúspides en la cara oclusal.
    const u = r() * 2 - 1;
    const t = r() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const sgn = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);
    let x = 0.95 * sgn(s * Math.cos(t), 0.55);
    let z = 0.82 * sgn(s * Math.sin(t), 0.55);
    let y = 0.62 * sgn(u, 0.6);
    if (y > 0.35) y += 0.16 * Math.cos(x * 3.3) * Math.cos(z * 3.6);
    y += 0.95;
    x *= 1.05;
    z *= 1.0;
    return [x, y, z];
  };
  const parts: [Sampler, number][] = [
    [crown, 14],
    [capsule([-0.5, 0.45, 0.25], [-0.68, -1.85, 0.4], 0.34, 0.08), 5],
    [capsule([0.5, 0.45, 0.25], [0.62, -1.8, 0.35], 0.34, 0.08), 5],
    [capsule([0, 0.45, -0.35], [0.05, -1.6, -0.55], 0.32, 0.08), 4.5],
  ];
  return compose(parts, 3, ([x, y, z]) => [x * 1.1, y * 1.05, z]);
}

function spineShape() {
  const parts: [Sampler, number][] = [];
  const curve = (y: number) => 0.28 * Math.sin(y * 1.1 + 0.6);
  for (let k = 0; k < 20; k++) {
    const y = -1.9 + k * 0.19;
    const zc = curve(y);
    // Cuerpo vertebral (disco) + apófisis espinosa hacia atrás
    parts.push([capsule([-0.22, y, zc], [0.22, y, zc], 0.075), 1.6]);
    parts.push([capsule([0, y, zc - 0.05], [0, y - 0.05, zc - 0.42], 0.035), 0.7]);
    parts.push([capsule([-0.28, y, zc - 0.12], [0.28, y, zc - 0.12], 0.03), 0.5]);
  }
  // Costillas: arcos hacia adelante en la zona torácica
  for (let k = 0; k < 10; k++) {
    const y = 0.15 + k * 0.15;
    const R = 0.75 + Math.sin((k / 9) * Math.PI) * 0.35;
    const zc = curve(y);
    for (const s of [-1, 1]) {
      parts.push([
        (r) => {
          const a = r() * Math.PI * 0.85;
          return [s * R * Math.sin(a), y - a * 0.12, zc - 0.1 + R * 0.75 * (1 - Math.cos(a))];
        },
        1.4,
      ]);
    }
  }
  // Pelvis
  parts.push([
    (r) => {
      const a = r() * Math.PI * 2;
      const t = r();
      return [Math.cos(a) * (0.75 + t * 0.15), -2.05 + Math.sin(a * 2) * 0.12 - t * 0.2, Math.sin(a) * 0.45 + 0.15];
    },
    6,
  ]);
  return compose(parts, 4);
}

/** Piel: superficie ondulada + folículos y vellos (marcados con `hair`). */
function skinShape() {
  const r = rng(5);
  const out = new Float32Array(N * 3);
  const hair = new Float32Array(N);
  const follicles: [number, number][] = [];
  for (let gx = 0; gx < 10; gx++)
    for (let gz = 0; gz < 5; gz++) follicles.push([-2.0 + gx * 0.44 + (r() - 0.5) * 0.2, -1.1 + gz * 0.55 + (r() - 0.5) * 0.2]);
  const surf = (x: number, z: number) => 0.12 * Math.sin(x * 2) * Math.cos(z * 1.7) - 0.2;
  const STEP = 0.22;
  for (let i = 0; i < N; i++) {
    const kind = r();
    if (kind < 0.55) {
      // Epidermis como malla de líneas: se lee como superficie.
      let x = (r() - 0.5) * 4.6;
      let z = (r() - 0.5) * 3;
      if (r() < 0.5) x = Math.round(x / STEP) * STEP + (r() - 0.5) * 0.01;
      else z = Math.round(z / STEP) * STEP + (r() - 0.5) * 0.01;
      out.set([x, surf(x, z), z], i * 3);
    } else if (kind < 0.62) {
      // Dermis difusa por debajo
      const x = (r() - 0.5) * 4.6;
      const z = (r() - 0.5) * 3;
      out.set([x, surf(x, z) - 0.15 - r() * 0.5, z], i * 3);
    } else {
      const [fx, fz] = follicles[Math.floor(r() * follicles.length)];
      const base = surf(fx, fz);
      const k = r();
      if (k < 0.25) {
        // Bulbo en la raíz
        const u = r() * 2 - 1;
        const t = r() * Math.PI * 2;
        const sq = Math.sqrt(1 - u * u);
        out.set([fx + sq * Math.cos(t) * 0.06, base - 0.5 + u * 0.06, fz + sq * Math.sin(t) * 0.06], i * 3);
      } else if (k < 0.45) {
        // Tallo bajo la piel
        out.set([fx, base - r() * 0.5, fz], i * 3);
      } else {
        // Vello visible, levemente inclinado
        const t = r();
        out.set([fx + t * 0.12, base + t * 0.85, fz + t * 0.04], i * 3);
        hair[i] = t;
      }
    }
  }
  return { pos: out, hair };
}

/* ------------------------------------------------------------------ */

const PALETTES: [string, string][] = [
  ["#6fd3c2", "#d8fff6"],
  ["#f3a78c", "#ffe3d6"],
  ["#bff5ec", "#ffffff"],
  ["#9db8ff", "#e6edff"],
  ["#f6c76f", "#fff1cf"],
];

type Props = { progress: MutableRefObject<number> };

function Particles({ progress }: Props) {
  const { pointer, viewport, size } = useThree();
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  const { targets, hair, delay, grad, sprite } = useMemo(() => {
    const skin = skinShape();
    const targets = [bodyShape(), faceShape(), toothShape(), spineShape(), skin.pos];
    const r = rng(9);
    const delay = new Float32Array(N).map(() => r());
    const grad = new Float32Array(N).map(() => r());
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return { targets, hair: skin.hair, delay, grad, sprite: new THREE.CanvasTexture(c) };
  }, []);

  const positions = useMemo(() => {
    // Arranca disperso, como polvo, y converge al cuerpo.
    const r = rng(21);
    return new Float32Array(N * 3).map(() => (r() - 0.5) * 14);
  }, []);
  const colors = useMemo(() => new Float32Array(N * 3), []);
  const offsets = useMemo(() => new Float32Array(N * 3), []);
  const pal = useMemo(() => PALETTES.map(([a, b]) => [new THREE.Color(a), new THREE.Color(b)]), []);
  const ca = useMemo(() => new THREE.Color(), []);
  const cb = useMemo(() => new THREE.Color(), []);
  const hot = useMemo(() => new THREE.Color("#ff6b4a"), []);
  const smooth = useRef(0);
  const intro = useRef(0);

  useFrame(({ clock }, dt) => {
    const time = clock.elapsedTime;
    smooth.current += (progress.current - smooth.current) * Math.min(1, dt * 4);
    intro.current = Math.min(1, intro.current + dt * 0.45);
    const s = smooth.current * (targets.length - 1);
    const k = Math.min(targets.length - 2, Math.floor(s));
    const t = s - k;
    const A = targets[k];
    const B = targets[k + 1];

    // Barrido del láser en la etapa de piel.
    const skinW = Math.max(0, 1 - Math.abs(s - 4) * 2);
    const laserX = ((time * 0.6) % 2.4) * 2.2 - 2.6;

    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.35) * 0.65 + pointer.x * 0.4;
      group.current.rotation.x = pointer.y * -0.12 + skinW * 0.55;
      // En celular la forma va más chica y arriba, para no tapar el texto.
      const narrow = size.width < 768;
      group.current.scale.setScalar(narrow ? 0.55 : 1);
      group.current.position.y = narrow ? 0.85 : 0;
    }
    const rotY = group.current?.rotation.y ?? 0;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const px = (pointer.x * viewport.width) / 2;
    const py = (pointer.y * viewport.height) / 2;

    const [a0, a1] = pal[k];
    const [b0, b1] = pal[k + 1];

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      // Cada partícula viaja con su propio retraso: la forma "se arma" en oleadas.
      let tt = Math.min(1, Math.max(0, (t - delay[i] * 0.45) / 0.55));
      tt = tt * tt * (3 - 2 * tt);
      let x = A[i3] + (B[i3] - A[i3]) * tt;
      let y = A[i3 + 1] + (B[i3 + 1] - A[i3 + 1]) * tt;
      let z = A[i3 + 2] + (B[i3 + 2] - A[i3 + 2]) * tt;

      // Vellos que el láser va "apagando".
      if (skinW > 0 && hair[i] > 0) {
        const passed = x < laserX ? 0.15 : 1;
        const base = y - hair[i] * 0.85;
        y = base + (y - base) * (1 - skinW + skinW * passed);
      }

      // Respiración sutil
      const n = Math.sin(time * 1.3 + i * 0.37) * 0.012;
      x += n;
      y += Math.cos(time * 1.1 + i * 0.21) * 0.012;

      // Repulsión del mouse (en espacio de pantalla, deshaciendo la rotación en Y).
      const wx = x * cosY + z * sinY;
      const dx = wx - px;
      const dy = y - py;
      const d2 = dx * dx + dy * dy;
      let ox = 0;
      let oy = 0;
      if (d2 < 0.55) {
        const f = (0.55 - d2) * 0.9;
        const inv = 1 / Math.sqrt(d2 + 0.0001);
        ox = dx * inv * f;
        oy = dy * inv * f;
      }
      offsets[i3] += (ox - offsets[i3]) * 0.12;
      offsets[i3 + 1] += (oy - offsets[i3 + 1]) * 0.12;
      x += offsets[i3] * cosY;
      z += offsets[i3] * sinY;
      y += offsets[i3 + 1];

      // Intro: del polvo disperso a la forma.
      const it = intro.current;
      positions[i3] = positions[i3] + (x - positions[i3]) * (it < 1 ? 0.06 : 1);
      positions[i3 + 1] = positions[i3 + 1] + (y - positions[i3 + 1]) * (it < 1 ? 0.06 : 1);
      positions[i3 + 2] = positions[i3 + 2] + (z - positions[i3 + 2]) * (it < 1 ? 0.06 : 1);

      // Color: degradé de la paleta de cada etapa; el láser tiñe la franja que barre.
      ca.copy(a0).lerp(a1, grad[i]);
      cb.copy(b0).lerp(b1, grad[i]);
      ca.lerp(cb, tt);
      if (skinW > 0 && Math.abs(x - laserX) < 0.18) ca.lerp(hot, skinW);
      colors[i3] = ca.r;
      colors[i3 + 1] = ca.g;
      colors[i3 + 2] = ca.b;
    }
    const geo = points.current?.geometry;
    if (geo) {
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          map={sprite}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function ParticleMorph({ progress, active = true }: Props & { active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: false, alpha: true }}
    >
      <Particles progress={progress} />
    </Canvas>
  );
}
