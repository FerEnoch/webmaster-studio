"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Lot } from "@/lib/properties";

/* ------------------------------------------------------------------ */
/* Sol (aprox. Buenos Aires, 34.6° S: el sol pasa por el norte)        */
/* ------------------------------------------------------------------ */

type Season = "verano" | "invierno";
const SUN = {
  verano: { rise: 5.9, set: 20.1, maxElev: 78, azRise: 118 },
  invierno: { rise: 8.0, set: 17.9, maxElev: 32, azRise: 62 },
};

/** Azimut desde el norte (positivo hacia el este) y elevación en grados. */
function sunAt(hour: number, season: Season) {
  const s = SUN[season];
  const t = (hour - s.rise) / (s.set - s.rise);
  const elev = t <= 0 || t >= 1 ? -5 : s.maxElev * Math.sin(Math.PI * t);
  const az = s.azRise - t * 2 * s.azRise; // de este (+) por el norte (0) a oeste (-)
  return { elev, az, up: t > 0 && t < 1 };
}

/** Dirección del sol en el mundo. El frente del lote mira a +z y apunta a `orientacion`. */
function sunVector(hour: number, season: Season, orientacion: number, out = new THREE.Vector3()) {
  const { elev, az } = sunAt(hour, season);
  const theta = THREE.MathUtils.degToRad(az - orientacion);
  const e = THREE.MathUtils.degToRad(Math.max(elev, -4));
  return out.set(Math.sin(theta) * Math.cos(e), Math.sin(e), Math.cos(theta) * Math.cos(e));
}

const fmtHour = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */

export type House = { w: number; d: number; h: number };

export default function Lot3D({ lot, house, compact = false }: { lot: Lot; house?: House; compact?: boolean }) {
  const [hour, setHour] = useState(15.5);
  const [season, setSeason] = useState<Season>("invierno");
  const [volume, setVolume] = useState(!house);

  const { elev, az, up } = sunAt(hour, season);
  const theta = az - lot.orientacion;
  const onBack = Math.cos(THREE.MathUtils.degToRad(theta)) < 0;
  const buildW = lot.frente - lot.retiroLateral * 2;
  const buildD = Math.min(lot.fondo - lot.retiroFrente - 4, (lot.fos * lot.frente * lot.fondo) / buildW);
  const buildable = Math.round(buildW * buildD * Math.max(1, Math.floor(lot.alturaMax / 3)));

  // Horas de sol en el contrafrente (paso de 15 min).
  const backHours = useMemo(() => {
    let n = 0;
    for (let h = 5; h < 21; h += 0.25) {
      const s = sunAt(h, season);
      if (s.up && Math.cos(THREE.MathUtils.degToRad(s.az - lot.orientacion)) < 0) n += 0.25;
    }
    return n;
  }, [season, lot.orientacion]);

  return (
    <div className={`relative w-full overflow-hidden rounded-[28px] bg-sand ${compact ? "aspect-[4/3]" : "aspect-[4/5] sm:aspect-[16/9]"}`}>
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: [lot.frente * 1.1, lot.fondo * 0.75, lot.fondo * 1.15], fov: 38 }}>
        <Scene lot={lot} hour={hour} season={season} volume={volume} house={house} buildW={buildW} buildD={buildD} />
      </Canvas>

      {/* Panel de control */}
      <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-ivory/90 p-4 shadow-xl backdrop-blur sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[340px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-ink/50 uppercase">Asoleamiento</p>
            <p className="font-serif text-3xl leading-none tabular-nums">{fmtHour(hour)}</p>
          </div>
          <div className="flex rounded-full bg-sand p-1 text-xs">
            {(["verano", "invierno"] as const).map((s) => (
              <button key={s} onClick={() => setSeason(s)} className="relative rounded-full px-3 py-1.5 capitalize">
                {season === s && <motion.span layoutId={`season-${compact}`} className="absolute inset-0 rounded-full bg-ink" />}
                <span className={`relative ${season === s ? "text-ivory" : ""}`}>{s}</span>
              </button>
            ))}
          </div>
        </div>
        <input
          type="range"
          min={6}
          max={20.5}
          step={0.25}
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="mt-3 w-full"
          aria-label="Hora del día"
        />
        <p className="mt-1 text-xs text-ink/70">
          {!up
            ? "Sin sol a esta hora."
            : `Sol a ${Math.round(elev)}° de altura, iluminando el ${onBack ? "contrafrente" : "frente"}.`}{" "}
          <span className="text-brass">{backHours.toFixed(1)} h de sol en el contrafrente.</span>
        </p>
        {!compact && (
          <label className="mt-3 flex cursor-pointer items-center justify-between border-t border-ink/10 pt-3 text-sm">
            <span>
              {house ? "Ver volumen edificable" : "Volumen edificable"}
              <span className="block text-xs text-ink/60">
                FOS {lot.fos} · altura máx. {lot.alturaMax} m · ≈ {buildable.toLocaleString("es-AR")} m²
              </span>
            </span>
            <button
              onClick={() => setVolume((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition-colors ${volume ? "bg-brass" : "bg-ink/20"}`}
              aria-pressed={volume}
            >
              <motion.span layout className={`absolute top-1 h-4 w-4 rounded-full bg-white ${volume ? "right-1" : "left-1"}`} />
            </button>
          </label>
        )}
      </div>

      <div className="pointer-events-none absolute top-4 left-4 rounded-full bg-ivory/85 px-3 py-1.5 text-xs backdrop-blur">
        Lote {lot.frente} × {lot.fondo} m · arrastrá para girar
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Scene({
  lot,
  hour,
  season,
  volume,
  house,
  buildW,
  buildD,
}: {
  lot: Lot;
  hour: number;
  season: Season;
  volume: boolean;
  house?: House;
  buildW: number;
  buildD: number;
}) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const sunBall = useRef<THREE.Mesh>(null);
  const vol = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const sky = useMemo(() => new THREE.Color(), []);
  const span = Math.max(lot.frente, lot.fondo);
  const slope = Math.atan(lot.pendiente / 100);
  const volScale = useRef(volume ? 1 : 0);

  // Arco del sol del día elegido.
  const arc = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const s = SUN[season];
    for (let h = s.rise; h <= s.set; h += 0.25) pts.push(sunVector(h, season, lot.orientacion).multiplyScalar(span * 1.3));
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: "#ffcf70", transparent: true, opacity: 0.8 }),
    );
  }, [season, lot.orientacion, span]);

  useFrame(({ scene }, dt) => {
    sunVector(hour, season, lot.orientacion, target);
    dir.lerp(target, Math.min(1, dt * 6));
    const pos = dir.clone().multiplyScalar(span * 1.3);
    sun.current?.position.copy(pos);
    sunBall.current?.position.copy(pos);
    const e = Math.max(0, dir.y);
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.smoothstep(e, 0, 0.25) * 3;
      sun.current.color.setHSL(0.09, 0.9, THREE.MathUtils.lerp(0.6, 0.97, Math.min(1, e * 2.5)));
    }
    sky.setHSL(0.58, 0.45, THREE.MathUtils.lerp(0.25, 0.82, Math.min(1, e * 2.2)));
    sky.lerp(new THREE.Color("#f0b48a"), Math.max(0, 0.35 - e) * 1.2);
    scene.background = sky;

    volScale.current += ((volume ? 1 : 0) - volScale.current) * Math.min(1, dt * 4);
    if (vol.current) {
      vol.current.scale.y = Math.max(0.001, volScale.current);
      vol.current.visible = volScale.current > 0.01;
    }
  });

  const trees = useMemo(() => {
    const out: [number, number, number][] = [];
    let seed = 11;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const n = lot.entorno === "barrio" ? 14 : 70;
    for (let i = 0; i < n; i++) {
      const x = (rnd() - 0.5) * span * 3;
      const z = (rnd() - 0.5) * span * 3;
      const inside = Math.abs(x) < lot.frente / 2 + 2 && Math.abs(z) < lot.fondo / 2 + 2;
      const onStreet = z > lot.fondo / 2 && z < lot.fondo / 2 + 14;
      if (inside || onStreet) continue;
      out.push([x, z, 0.7 + rnd() * 0.8]);
    }
    return out;
  }, [lot, span]);

  return (
    <>
      <hemisphereLight args={["#dfe8ff", "#8a7a5a", 0.65]} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-span * 1.2}
        shadow-camera-right={span * 1.2}
        shadow-camera-top={span * 1.2}
        shadow-camera-bottom={-span * 1.2}
        shadow-camera-near={1}
        shadow-camera-far={span * 4}
        shadow-normalBias={0.05}
      />
      <mesh ref={sunBall}>
        <sphereGeometry args={[span * 0.04, 16, 16]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} />
      </mesh>
      <primitive object={arc} />

      <OrbitControls
        enableDamping
        autoRotate
        autoRotateSpeed={0.35}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={span * 0.6}
        maxDistance={span * 3}
        target={[0, 0, 0]}
      />

      <group rotation-x={slope}>
        {/* Suelo */}
        <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
          <planeGeometry args={[span * 6, span * 6]} />
          <meshStandardMaterial color={lot.entorno === "lago" ? "#7d8f5c" : "#9aa874"} roughness={1} />
        </mesh>
        {/* Lote */}
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[lot.frente, lot.fondo]} />
          <meshStandardMaterial color="#b8c58d" roughness={1} />
        </mesh>
        <LotOutline w={lot.frente} d={lot.fondo} />

        {/* Retiros */}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, lot.fondo / 2 - lot.retiroFrente / 2]}>
          <planeGeometry args={[lot.frente, lot.retiroFrente]} />
          <meshBasicMaterial color="#a8834b" transparent opacity={0.18} />
        </mesh>

        {/* Calle y vereda */}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, lot.fondo / 2 + 6]} receiveShadow>
          <planeGeometry args={[span * 6, 8]} />
          <meshStandardMaterial color="#5b5a55" roughness={0.9} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, lot.fondo / 2 + 1.2]} receiveShadow>
          <planeGeometry args={[span * 6, 2.4]} />
          <meshStandardMaterial color="#d6d0c4" roughness={1} />
        </mesh>

        {/* Cotas */}
        <Label text={`${lot.frente} m de frente`} position={[0, 1.2, lot.fondo / 2 + 0.6]} size={span} />
        <Label text={`${lot.fondo} m de fondo`} position={[lot.frente / 2 + 0.6, 1.2, 0]} size={span} />
        <Label text="Calle" position={[0, 1.2, lot.fondo / 2 + 6]} size={span} dark />

        {/* Norte */}
        <North orientacion={lot.orientacion} at={[-lot.frente / 2 - 4, 0.05, lot.fondo / 2 - 4]} />

        {/* Volumen edificable */}
        <group ref={vol} position={[0, 0, lot.fondo / 2 - lot.retiroFrente - buildD / 2]}>
          <mesh position-y={lot.alturaMax / 2} castShadow>
            <boxGeometry args={[buildW, lot.alturaMax, buildD]} />
            <meshStandardMaterial color="#a8834b" transparent opacity={0.28} />
          </mesh>
          <lineSegments position-y={lot.alturaMax / 2}>
            <edgesGeometry args={[new THREE.BoxGeometry(buildW, lot.alturaMax, buildD)]} />
            <lineBasicMaterial color="#7a5c2c" />
          </lineSegments>
        </group>

        {/* Casa existente */}
        {house && (
          <group position={[0, 0, lot.fondo / 2 - lot.retiroFrente - house.d / 2]}>
            <mesh position-y={house.h / 2} castShadow receiveShadow>
              <boxGeometry args={[house.w, house.h, house.d]} />
              <meshStandardMaterial color="#efeae0" roughness={0.8} />
            </mesh>
            <mesh position={[0, house.h + 0.15, 0]} castShadow>
              <boxGeometry args={[house.w + 0.8, 0.3, house.d + 0.8]} />
              <meshStandardMaterial color="#3a3a36" />
            </mesh>
            <mesh position={[0, house.h * 0.45, house.d / 2 + 0.01]}>
              <planeGeometry args={[house.w * 0.7, house.h * 0.55]} />
              <meshStandardMaterial color="#6d8796" metalness={0.6} roughness={0.15} />
            </mesh>
          </group>
        )}

        {/* Vecinos */}
        {lot.entorno === "barrio" &&
          [-1, 1].map((side) => (
            <mesh key={side} position={[side * (lot.frente + 4), 3, lot.fondo / 2 - 12]} castShadow receiveShadow>
              <boxGeometry args={[12, 6, 14]} />
              <meshStandardMaterial color="#e6e0d4" />
            </mesh>
          ))}

        <Trees spots={trees} />

        {lot.entorno === "lago" && (
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, -lot.fondo / 2 - span * 1.2]}>
            <planeGeometry args={[span * 6, span * 2]} />
            <meshStandardMaterial color="#4f7f9e" metalness={0.3} roughness={0.15} />
          </mesh>
        )}
      </group>
    </>
  );
}

function LotOutline({ w, d }: { w: number; d: number }) {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector3(-w / 2, 0.05, -d / 2),
      new THREE.Vector3(w / 2, 0.05, -d / 2),
      new THREE.Vector3(w / 2, 0.05, d / 2),
      new THREE.Vector3(-w / 2, 0.05, d / 2),
      new THREE.Vector3(-w / 2, 0.05, -d / 2),
    ];
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: "#ffffff" }));
  }, [w, d]);
  const posts = [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [w / 2, d / 2],
    [-w / 2, d / 2],
  ];
  return (
    <group>
      <primitive object={geo} />
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.6, z]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 1.2, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function Trees({ spots }: { spots: [number, number, number][] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const crown = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!ref.current || !crown.current || ref.current.userData.done) return;
    spots.forEach(([x, z, s], i) => {
      dummy.position.set(x, 1.2 * s, z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 3.6 * s, z);
      dummy.updateMatrix();
      crown.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    crown.current.instanceMatrix.needsUpdate = true;
    ref.current.userData.done = true;
  });
  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, spots.length]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 2.4, 6]} />
        <meshStandardMaterial color="#6b5137" />
      </instancedMesh>
      <instancedMesh ref={crown} args={[undefined, undefined, spots.length]} castShadow>
        <coneGeometry args={[1.6, 4, 7]} />
        <meshStandardMaterial color="#4e6b3c" roughness={1} />
      </instancedMesh>
    </group>
  );
}

function North({ orientacion, at }: { orientacion: number; at: [number, number, number] }) {
  // El norte está a -orientacion respecto del frente (+z).
  const rot = THREE.MathUtils.degToRad(-orientacion);
  return (
    <group position={at} rotation-y={rot}>
      <mesh rotation-x={Math.PI / 2} position={[0, 0.05, 1.2]}>
        <coneGeometry args={[0.9, 2.4, 3]} />
        <meshBasicMaterial color="#a8834b" />
      </mesh>
      <Label text="N" position={[0, 1, 3.2]} size={24} dark />
    </group>
  );
}

/** Etiqueta 3D dibujada en un canvas (sprite que siempre mira a cámara). */
function Label({ text, position, size, dark = false }: { text: string; position: [number, number, number]; size: number; dark?: boolean }) {
  const { texture, aspect } = useMemo(() => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    const font = "600 44px Inter Tight, system-ui, sans-serif";
    ctx.font = font;
    const w = Math.ceil(ctx.measureText(text).width) + 56;
    c.width = w;
    c.height = 84;
    ctx.font = font;
    ctx.fillStyle = dark ? "rgba(20,19,15,0.88)" : "rgba(244,241,234,0.96)";
    ctx.beginPath();
    ctx.roundRect(0, 0, w, 84, 42);
    ctx.fill();
    ctx.fillStyle = dark ? "#f4f1ea" : "#14130f";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 28, 44);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { texture: t, aspect: w / 84 };
  }, [text, dark]);
  const h = Math.max(1.4, size * 0.045);
  return (
    <sprite position={position} scale={[h * aspect, h, 1]} renderOrder={10}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  );
}
