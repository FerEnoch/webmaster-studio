"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Parámetros del edificio                                             */
/* ------------------------------------------------------------------ */

export const FLOORS = 14;
const H = 1; // altura de piso
const W = 10; // frente (x)
const D = 7; // fondo (z)
const SLAB = 0.2;

// Ventanas de progreso (0..1 del scroll) de cada etapa.
const DIG = [0.0, 0.07] as const;
const FOUNDATION = [0.05, 0.13] as const;
const STRUCT = [0.13, 0.6] as const;
const GLASS = [0.5, 0.82] as const;
const DUSK = [0.8, 0.96] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const floorStep = (STRUCT[1] - STRUCT[0]) / (FLOORS + 1);
const slabT = (p: number, i: number) => easeOut(remap(p, STRUCT[0] + i * floorStep, STRUCT[0] + i * floorStep + floorStep * 0.55));
const colT = (p: number, i: number) =>
  easeOut(remap(p, STRUCT[0] + i * floorStep + floorStep * 0.4, STRUCT[0] + (i + 1) * floorStep + floorStep * 0.1));
const glassStep = (GLASS[1] - GLASS[0]) / FLOORS;
const glassT = (p: number, i: number) => easeOut(remap(p, GLASS[0] + i * glassStep, GLASS[0] + i * glassStep + glassStep * 2.2));

/** Altura construida (techo de lo que ya existe) para grúa, andamio y cámara. */
function builtHeight(p: number) {
  let h = 0;
  for (let i = 0; i <= FLOORS; i++) {
    const s = slabT(p, i);
    if (s > 0) h = i * H + SLAB;
    if (i < FLOORS) {
      const c = colT(p, i);
      if (c > 0) h = Math.max(h, i * H + SLAB + (H - SLAB) * c);
    }
  }
  return h;
}

/* ------------------------------------------------------------------ */
/* Materiales (render vs. planos)                                      */
/* ------------------------------------------------------------------ */

type Mats = ReturnType<typeof makeMats>;

function makeMats(plano: boolean) {
  const line = (color: string, opacity = 0.9) =>
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
  if (plano) {
    const blue = "#8fb0ff";
    return {
      concrete: line(blue),
      concreteDark: line("#c9d7ff"),
      ground: new THREE.MeshBasicMaterial({ color: "#0b1d55" }),
      pit: line("#5b7dff", 0.6),
      glass: line("#c9d7ff", 0.55),
      lights: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, toneMapped: false }),
      steel: line("#ffb21a"),
      scaffold: line("#ff5a1f", 0.7),
      city: line("#3f5fcf", 0.35),
      tree: line("#7fe0b0", 0.7),
      plano,
    };
  }
  return {
    concrete: new THREE.MeshStandardMaterial({ color: "#d8d3ca", roughness: 0.92 }),
    concreteDark: new THREE.MeshStandardMaterial({ color: "#a9a49b", roughness: 0.95 }),
    ground: new THREE.MeshStandardMaterial({ color: "#cfc9bf", roughness: 1 }),
    pit: new THREE.MeshStandardMaterial({ color: "#6b5d4f", roughness: 1 }),
    glass: new THREE.MeshStandardMaterial({
      color: "#9fb6c6",
      metalness: 0.85,
      roughness: 0.08,
      transparent: true,
      opacity: 0.82,
      envMapIntensity: 1.4,
    }),
    lights: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, toneMapped: false }),
    steel: new THREE.MeshStandardMaterial({ color: "#f2a516", roughness: 0.5, metalness: 0.4 }),
    scaffold: new THREE.MeshBasicMaterial({ color: "#ff5a1f", wireframe: true, transparent: true, opacity: 0.55 }),
    city: new THREE.MeshStandardMaterial({ color: "#e3ded5", roughness: 1 }),
    tree: new THREE.MeshStandardMaterial({ color: "#6f8f5a", roughness: 1 }),
    plano,
  };
}

/* ------------------------------------------------------------------ */
/* Escena                                                              */
/* ------------------------------------------------------------------ */

type Props = {
  progress: MutableRefObject<number>;
  smooth: MutableRefObject<number>;
  plano: boolean;
};

const dummy = new THREE.Object3D();
const DAY = new THREE.Color("#e8e4dc");
const DUSK_C = new THREE.Color("#1b2134");
const PLANO_BG = new THREE.Color("#0a1a4f");

function Scene({ progress, smooth, plano }: Props) {
  const mats = useMemo(() => makeMats(plano), [plano]);
  const { scene, camera, pointer, size } = useThree();
  const bg = useMemo(() => new THREE.Color(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);

  useLayoutEffect(() => {
    scene.fog = new THREE.Fog(DAY, 34, 95);
  }, [scene]);

  useFrame((_, dt) => {
    // Suavizado tipo "scrub": la escena persigue al scroll sin saltos.
    smooth.current += (progress.current - smooth.current) * Math.min(1, dt * 3.2);
    const p = smooth.current;

    const dusk = easeInOut(remap(p, DUSK[0], DUSK[1]));
    if (plano) bg.copy(PLANO_BG);
    else bg.copy(DAY).lerp(DUSK_C, dusk);
    scene.background = bg;
    (scene.fog as THREE.Fog).color.copy(bg);

    if (sun.current) sun.current.intensity = plano ? 0 : lerp(2.6, 0.35, dusk);
    if (hemi.current) hemi.current.intensity = plano ? 0 : lerp(1.1, 0.35, dusk);

    // Cámara: arranca cenital sobre el pozo, orbita mientras sube la estructura
    // y termina baja, mirando el edificio hacia arriba al atardecer.
    const top = builtHeight(p);
    const angle = lerp(-1.05, 0.75, easeInOut(p)) + pointer.x * 0.12;
    // En pantallas verticales (celular) la cámara se aleja para que entre el edificio completo.
    const narrow = size.width / size.height < 1 ? 1.75 : 1;
    const radius = lerp(36, 30, easeInOut(p)) * narrow;
    const camY = p < 0.5 ? lerp(24, 15, easeInOut(remap(p, 0, 0.5))) : lerp(15, 3.2, easeInOut(remap(p, 0.5, 1)));
    camTarget.set(Math.sin(angle) * radius, camY + pointer.y * 1.2, Math.cos(angle) * radius);
    camera.position.lerp(camTarget, Math.min(1, dt * 2.5));
    const lookY = lerp(0, Math.max(top * 0.55, 2), Math.min(1, p * 1.6));
    // En pantallas anchas el edificio va a la derecha para dejar lugar al texto de la etapa.
    const side = size.width > 900 ? -5.5 : 0;
    lookAt.set(Math.cos(angle) * side, lerp(lookY, FLOORS * H * 0.55, remap(p, 0.75, 1)), -Math.sin(angle) * side);
    camera.lookAt(lookAt);
  });

  return (
    <>
      {!plano && (
        <>
          <hemisphereLight ref={hemi} args={["#fff8ee", "#b8b0a2", 1.1]} />
          <directionalLight
            ref={sun}
            position={[18, 28, 14]}
            intensity={2.6}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-25}
            shadow-camera-right={25}
            shadow-camera-top={25}
            shadow-camera-bottom={-25}
            shadow-camera-near={1}
            shadow-camera-far={90}
            shadow-bias={-0.0002}
            shadow-normalBias={0.04}
          />
          {/* Reflejos del vidrio sin bajar HDR externos. */}
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 10, -20]} scale={[40, 10, 1]} color="#ffffff" />
            <Lightformer intensity={1.2} position={[-20, 5, 0]} rotation-y={Math.PI / 2} scale={[30, 8, 1]} color="#ffe2c4" />
            <Lightformer intensity={0.8} position={[20, 3, 10]} rotation-y={-Math.PI / 2} scale={[30, 6, 1]} color="#c9dcff" />
          </Environment>
        </>
      )}

      <Ground mats={mats} smooth={smooth} />
      <City mats={mats} />
      <Foundation mats={mats} smooth={smooth} />
      <Structure mats={mats} smooth={smooth} />
      <Facade mats={mats} smooth={smooth} />
      <Scaffold mats={mats} smooth={smooth} />
      <Sparks smooth={smooth} />
      <Crane mats={mats} smooth={smooth} />
      <Landscape mats={mats} smooth={smooth} />
    </>
  );
}

type Part = { mats: Mats; smooth: MutableRefObject<number> };

function Ground({ mats, smooth }: Part) {
  const pit = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const t = easeOut(remap(smooth.current, DIG[0], DIG[1]));
    if (pit.current) {
      pit.current.scale.set(Math.max(t, 0.001), 1, Math.max(t, 0.001));
      pit.current.visible = smooth.current < 0.2;
    }
  });
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow material={mats.ground}>
        <planeGeometry args={[220, 220, mats.plano ? 44 : 1, mats.plano ? 44 : 1]} />
      </mesh>
      {/* Pozo de excavación */}
      <mesh ref={pit} position={[0, 0.01, 0]} rotation-x={-Math.PI / 2} material={mats.pit} receiveShadow>
        <planeGeometry args={[W + 2, D + 2, 6, 4]} />
      </mesh>
      {/* Vereda / límite del lote */}
      <mesh position={[0, 0.02, D / 2 + 3]} rotation-x={-Math.PI / 2} material={mats.concreteDark} receiveShadow>
        <planeGeometry args={[W + 10, 2.4]} />
      </mesh>
    </group>
  );
}

function City({ mats }: { mats: Mats }) {
  const blocks = useMemo(() => {
    const out: { p: [number, number, number]; s: [number, number, number] }[] = [];
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * Math.PI * 2 + rnd() * 0.3;
      let r = 17 + rnd() * 26;
      // La cámara orbita del lado +z (ángulos -1.1..0.8): ahí solo dejamos manzanas lejanas y bajas.
      const inCameraArc = a > Math.PI * 2 - 1.3 || a < 1.0;
      if (inCameraArc) r = 44 + rnd() * 10;
      const h = inCameraArc ? 2 + rnd() * 4 : 2 + rnd() * (r < 28 ? 9 : 20);
      out.push({ p: [Math.sin(a) * r, h / 2, Math.cos(a) * r], s: [4 + rnd() * 6, h, 4 + rnd() * 6] });
    }
    return out;
  }, []);
  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.p} material={mats.city} castShadow receiveShadow>
          <boxGeometry args={[...b.s, 1, mats.plano ? Math.ceil(b.s[1]) : 1, 1]} />
        </mesh>
      ))}
    </group>
  );
}

function Foundation({ mats, smooth }: Part) {
  const slab = useRef<THREE.Mesh>(null);
  const piles = useRef<THREE.InstancedMesh>(null);
  const pilePos = useMemo(() => {
    const out: [number, number][] = [];
    for (let x = 0; x < 5; x++) for (let z = 0; z < 4; z++) out.push([-W / 2 + 0.8 + x * ((W - 1.6) / 4), -D / 2 + 0.8 + z * ((D - 1.6) / 3)]);
    return out;
  }, []);
  useFrame(() => {
    const p = smooth.current;
    const pt = remap(p, FOUNDATION[0], FOUNDATION[0] + 0.04);
    pilePos.forEach(([x, z], i) => {
      const t = easeOut(clamp01(pt * 1.6 - (i / pilePos.length) * 0.6));
      dummy.position.set(x, 0.3 * t - 0.3 + 0.05, z);
      dummy.scale.set(t || 0.0001, Math.max(t, 0.0001), t || 0.0001);
      dummy.updateMatrix();
      piles.current?.setMatrixAt(i, dummy.matrix);
    });
    if (piles.current) piles.current.instanceMatrix.needsUpdate = true;
    const st = easeOut(remap(p, FOUNDATION[0] + 0.03, FOUNDATION[1]));
    if (slab.current) {
      slab.current.scale.set(Math.max(st, 0.001), 1, Math.max(st, 0.001));
      slab.current.position.y = -0.25 + 0.25 * st;
    }
  });
  return (
    <group>
      <instancedMesh ref={piles} args={[undefined, undefined, pilePos.length]} material={mats.concreteDark} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.6, 12]} />
      </instancedMesh>
      <mesh ref={slab} material={mats.concreteDark} receiveShadow castShadow>
        <boxGeometry args={[W + 1, 0.5, D + 1, 8, 1, 6]} />
      </mesh>
    </group>
  );
}

const COLS: [number, number][] = (() => {
  const xs = [-W / 2 + 0.35, -W / 6, W / 6, W / 2 - 0.35];
  const zs = [-D / 2 + 0.35, 0, D / 2 - 0.35];
  return xs.flatMap((x) => zs.map((z) => [x, z] as [number, number]));
})();

function Structure({ mats, smooth }: Part) {
  const slabs = useRef<THREE.InstancedMesh>(null);
  const cols = useRef<THREE.InstancedMesh>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = smooth.current;
    for (let i = 0; i <= FLOORS; i++) {
      const t = slabT(p, i);
      // La losa "llega" desde arriba y se asienta (encofrado + hormigonado).
      dummy.position.set(0, i * H + SLAB / 2 + (1 - t) * 1.2, 0);
      const s = t === 0 ? 0.0001 : lerp(0.7, 1, t);
      dummy.scale.set(s, t === 0 ? 0.0001 : 1, s);
      dummy.updateMatrix();
      slabs.current?.setMatrixAt(i, dummy.matrix);
    }
    let k = 0;
    for (let i = 0; i < FLOORS; i++) {
      const t = colT(p, i);
      const h = (H - SLAB) * t;
      for (const [x, z] of COLS) {
        dummy.position.set(x, i * H + SLAB + h / 2, z);
        dummy.scale.set(1, Math.max(h, 0.0001), 1);
        dummy.updateMatrix();
        cols.current?.setMatrixAt(k++, dummy.matrix);
      }
    }
    if (slabs.current) slabs.current.instanceMatrix.needsUpdate = true;
    if (cols.current) cols.current.instanceMatrix.needsUpdate = true;

    // El núcleo de ascensores va siempre un piso y medio adelante.
    const top = builtHeight(p);
    const coreH = top > 0 ? Math.min(top + 1.5, FLOORS * H + 1.4) : 0.0001;
    if (core.current) {
      core.current.scale.y = coreH;
      core.current.position.y = coreH / 2;
    }
  });

  return (
    <group>
      <instancedMesh ref={slabs} args={[undefined, undefined, FLOORS + 1]} material={mats.concrete} castShadow receiveShadow>
        <boxGeometry args={[W + 0.6, SLAB, D + 0.6, mats.plano ? 10 : 1, 1, mats.plano ? 7 : 1]} />
      </instancedMesh>
      <instancedMesh ref={cols} args={[undefined, undefined, FLOORS * COLS.length]} material={mats.concrete} castShadow>
        <boxGeometry args={[0.38, 1, 0.38]} />
      </instancedMesh>
      <mesh ref={core} position={[-1.2, 0, -0.8]} material={mats.concreteDark} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1, 2.2, 1, mats.plano ? 16 : 1, 1]} />
      </mesh>
    </group>
  );
}

/** Paneles del muro cortina + "luces" de cada unidad detrás del vidrio. */
function Facade({ mats, smooth }: Part) {
  const glass = useRef<THREE.InstancedMesh>(null);
  const lights = useRef<THREE.InstancedMesh>(null);

  const panels = useMemo(() => {
    const out: { x: number; z: number; ry: number; w: number; floor: number }[] = [];
    const nx = 8;
    const nz = 5;
    for (let f = 0; f < FLOORS; f++) {
      for (let i = 0; i < nx; i++) {
        const x = -W / 2 + (W / nx) * (i + 0.5);
        out.push({ x, z: D / 2, ry: 0, w: W / nx - 0.06, floor: f });
        out.push({ x, z: -D / 2, ry: Math.PI, w: W / nx - 0.06, floor: f });
      }
      for (let i = 0; i < nz; i++) {
        const z = -D / 2 + (D / nz) * (i + 0.5);
        out.push({ x: W / 2, z, ry: Math.PI / 2, w: D / nz - 0.06, floor: f });
        out.push({ x: -W / 2, z, ry: -Math.PI / 2, w: D / nz - 0.06, floor: f });
      }
    }
    return out;
  }, []);

  useLayoutEffect(() => {
    // Cada ventana tiene su luz: cálida y encendida en ~60% de las unidades.
    const c = new THREE.Color();
    let seed = 3;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    panels.forEach((_, i) => {
      const on = rnd() < 0.62;
      c.set(on ? (rnd() < 0.7 ? "#ffcf8a" : "#fff1d6") : "#20232c");
      lights.current?.setColorAt(i, c);
    });
    if (lights.current?.instanceColor) lights.current.instanceColor.needsUpdate = true;
  }, [panels]);

  useFrame(() => {
    const p = smooth.current;
    const ph = H - SLAB - 0.04;
    panels.forEach((pn, i) => {
      const t = glassT(p, pn.floor);
      const h = ph * t;
      const y = pn.floor * H + SLAB + h / 2;
      dummy.position.set(pn.x, y, pn.z);
      dummy.rotation.set(0, pn.ry, 0);
      dummy.scale.set(t ? pn.w : 0.0001, Math.max(h, 0.0001), 1);
      dummy.updateMatrix();
      glass.current?.setMatrixAt(i, dummy.matrix);
      // La luz va 12cm adentro del vidrio.
      dummy.translateZ(-0.12);
      dummy.updateMatrix();
      lights.current?.setMatrixAt(i, dummy.matrix);
    });
    if (glass.current) glass.current.instanceMatrix.needsUpdate = true;
    if (lights.current) lights.current.instanceMatrix.needsUpdate = true;
    mats.lights.opacity = mats.plano ? 0 : easeInOut(remap(p, DUSK[0] + 0.02, DUSK[1]));
  });

  return (
    <group>
      <instancedMesh ref={lights} args={[undefined, undefined, panels.length]} material={mats.lights}>
        <planeGeometry args={[1, 1]} />
      </instancedMesh>
      <instancedMesh ref={glass} args={[undefined, undefined, panels.length]} material={mats.glass} castShadow>
        <boxGeometry args={[1, 1, 0.05]} />
      </instancedMesh>
    </group>
  );
}

function Scaffold({ mats, smooth }: Part) {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(() => mats.scaffold.clone(), [mats]);
  useFrame(() => {
    const p = smooth.current;
    const top = builtHeight(p);
    const on = remap(p, STRUCT[0] + 0.02, STRUCT[0] + 0.05) * (1 - remap(p, GLASS[1] - 0.06, GLASS[1]));
    if (!ref.current) return;
    ref.current.visible = on > 0.01;
    ref.current.position.y = Math.max(top - H * 0.6, H);
    ref.current.scale.setScalar(lerp(0.96, 1, on));
    material.opacity = (mats.plano ? 0.7 : 0.55) * on;
  });
  return (
    <mesh ref={ref} material={material}>
      <boxGeometry args={[W + 1.2, H * 2.2, D + 1.2, 14, 4, 10]} />
    </mesh>
  );
}

/** Chispas de soldadura en el borde de la última losa. */
function Sparks({ smooth }: { smooth: MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const count = 70;
  const base = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const side = i % 4;
      const u = Math.random() - 0.5;
      a[i * 3] = side < 2 ? u * W : (side === 2 ? 1 : -1) * (W / 2 + 0.2);
      a[i * 3 + 1] = Math.random() * 0.4;
      a[i * 3 + 2] = side < 2 ? (side === 0 ? 1 : -1) * (D / 2 + 0.2) : u * D;
    }
    return a;
  }, []);
  const pos = useMemo(() => new Float32Array(base), [base]);
  useFrame(({ clock }) => {
    const p = smooth.current;
    const on = remap(p, STRUCT[0] + 0.03, STRUCT[0] + 0.06) * (1 - remap(p, STRUCT[1] - 0.04, STRUCT[1]));
    if (!ref.current) return;
    ref.current.visible = on > 0.01;
    ref.current.position.y = builtHeight(p);
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const life = (t * 1.6 + i * 0.137) % 1;
      pos[i * 3] = base[i * 3] + Math.sin(i * 12.9) * life * 0.6;
      pos[i * 3 + 1] = base[i * 3 + 1] + life * 0.9 - life * life * 1.4;
      pos[i * 3 + 2] = base[i * 3 + 2] + Math.cos(i * 7.1) * life * 0.6;
    }
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    attr.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity = on * (0.6 + Math.sin(t * 40) * 0.4);
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffb347" size={0.09} transparent toneMapped={false} depthWrite={false} />
    </points>
  );
}

function Crane({ mats, smooth }: Part) {
  const root = useRef<THREE.Group>(null);
  const mast = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const trolley = useRef<THREE.Group>(null);
  const cable = useRef<THREE.Mesh>(null);
  const load = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const p = smooth.current;
    const t = clock.elapsedTime;
    const top = builtHeight(p);
    const mastH = Math.max(7, top + 5);
    const away = easeInOut(remap(p, GLASS[1] - 0.04, GLASS[1] + 0.06));
    if (root.current) {
      root.current.position.y = -away * (mastH + 4);
      root.current.visible = away < 0.999;
    }
    if (mast.current) {
      mast.current.scale.y = mastH;
      mast.current.position.y = mastH / 2;
    }
    if (head.current) {
      head.current.position.y = mastH;
      // La pluma va y viene entre el acopio y el edificio, más un giro lento con el scroll.
      head.current.rotation.y = 2.4 + Math.sin(t * 0.35) * 0.55 + p * 2.2;
    }
    const reach = 6 + Math.sin(t * 0.5) * 2.5;
    if (trolley.current) trolley.current.position.x = reach;
    const drop = Math.min(mastH - 1, 3.5 + Math.sin(t * 0.7) * 2.2 + 2);
    if (cable.current) {
      cable.current.scale.y = drop;
      cable.current.position.y = -drop / 2;
    }
    if (load.current) {
      load.current.position.y = -drop - 0.25;
      load.current.rotation.y = Math.sin(t * 0.9) * 0.3;
    }
  });

  return (
    <group ref={root} position={[W / 2 + 3.2, 0, -D / 2 - 1.4]}>
      <mesh ref={mast} material={mats.steel} castShadow>
        <boxGeometry args={[0.7, 1, 0.7, 1, 30, 1]} />
      </mesh>
      <group ref={head}>
        {/* Pluma */}
        <mesh position={[4.5, 0.5, 0]} material={mats.steel} castShadow>
          <boxGeometry args={[14, 0.5, 0.5, 28, 1, 1]} />
        </mesh>
        {/* Contrapluma + contrapeso */}
        <mesh position={[-3.2, 0.5, 0]} material={mats.steel}>
          <boxGeometry args={[4.4, 0.45, 0.6]} />
        </mesh>
        <mesh position={[-4.6, 0.1, 0]} material={mats.concreteDark} castShadow>
          <boxGeometry args={[1.2, 0.9, 0.9]} />
        </mesh>
        {/* Torreta y cabina */}
        <mesh position={[0, 1.6, 0]} material={mats.steel}>
          <coneGeometry args={[0.5, 2.2, 4]} />
        </mesh>
        <mesh position={[0.6, -0.1, 0.55]} material={mats.concrete}>
          <boxGeometry args={[0.8, 0.8, 0.6]} />
        </mesh>
        <group ref={trolley} position={[6, 0.2, 0]}>
          <mesh ref={cable} material={mats.concreteDark}>
            <cylinderGeometry args={[0.025, 0.025, 1, 4]} />
          </mesh>
          {/* Carga: paquete de vigas */}
          <mesh ref={load} material={mats.steel} castShadow>
            <boxGeometry args={[1.8, 0.35, 0.6, 3, 1, 1]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Landscape({ mats, smooth }: Part) {
  const trees = useRef<THREE.InstancedMesh>(null);
  const spots = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        return [(-W / 2 - 1.5 + (i / 13) * (W + 3)) * 1, D / 2 + 2 + (i % 3) * 0.2, side] as const;
      }),
    [],
  );
  useFrame(() => {
    const t0 = remap(smooth.current, DUSK[0] - 0.04, DUSK[1]);
    spots.forEach(([x, z], i) => {
      const t = easeOut(clamp01(t0 * 1.8 - i * 0.05));
      dummy.position.set(x, 0.9 * t, z + 1.6);
      dummy.rotation.set(0, i, 0);
      dummy.scale.setScalar(Math.max(t, 0.0001) * (0.75 + (i % 3) * 0.15));
      dummy.updateMatrix();
      trees.current?.setMatrixAt(i, dummy.matrix);
    });
    if (trees.current) trees.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={trees} args={[undefined, undefined, spots.length]} material={mats.tree} castShadow>
      <icosahedronGeometry args={[0.8, mats.plano ? 1 : 0]} />
    </instancedMesh>
  );
}

export default function Building3D({ active = true, ...props }: Props & { active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [-22, 24, 18], fov: 35, near: 0.1, far: 300 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
