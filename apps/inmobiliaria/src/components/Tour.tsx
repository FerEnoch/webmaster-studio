"use client";

import { AnimatePresence, animate, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { photo, type PlanRoom, type TourRoom } from "@/lib/properties";
import PlanMini from "./PlanMini";

const ease = [0.65, 0, 0.35, 1] as const;
const GUIDE_MS = 5500;

/**
 * Recorrido virtual hecho con fotos:
 * - Puertas (hotspots): al tocarlas, la foto hace zoom hacia ese punto y "entrás" al ambiente siguiente.
 * - Mirar alrededor: la foto es más ancha que la ventana y se arrastra con inercia.
 * - Recorrido guiado automático, plano con "estás acá", pantalla completa y teclado.
 */
export default function Tour({ rooms, plan, title }: { rooms: TourRoom[]; plan?: PlanRoom[]; title: string }) {
  const [current, setCurrent] = useState(rooms[0].id);
  const [previous, setPrevious] = useState<string | undefined>();
  const [origin, setOrigin] = useState<[number, number]>([50, 50]);
  const [full, setFull] = useState(false);
  const [guided, setGuided] = useState(false);
  const [showPlan, setShowPlan] = useState(true);
  const box = useRef<HTMLDivElement>(null);

  const room = rooms.find((r) => r.id === current)!;
  const index = rooms.findIndex((r) => r.id === current);

  const go = useCallback(
    (to: string, from: [number, number] = [50, 50]) => {
      if (to === current) return;
      setOrigin(from);
      setPrevious(current);
      setCurrent(to);
    },
    [current],
  );

  // Recorrido guiado: avanza en orden.
  const guideBar = useMotionValue(0);
  useEffect(() => {
    if (!guided) return;
    guideBar.set(0);
    const c = animate(guideBar, 1, {
      duration: GUIDE_MS / 1000,
      ease: "linear",
      onComplete: () => {
        const next = rooms[(index + 1) % rooms.length];
        const door = room.hotspots.find((h) => h.to === next.id);
        go(next.id, door ? [door.x, door.y] : [50, 50]);
      },
    });
    return () => c.stop();
  }, [guided, current, index, rooms, room, go, guideBar]);

  // Teclado en pantalla completa.
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") go(rooms[(index + 1) % rooms.length].id);
      if (e.key === "ArrowLeft") go(rooms[(index - 1 + rooms.length) % rooms.length].id);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [full, index, rooms, go]);

  // Leve inclinación con el mouse: sensación de estar parado ahí.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 60, damping: 18 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [-1.5, 1.5]), { stiffness: 60, damping: 18 });

  return (
    <div
      ref={box}
      data-lenis-prevent={full ? "" : undefined}
      className={
        full
          ? "fixed inset-0 z-[80] bg-ink"
          : "relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-ink sm:aspect-[16/9]"
      }
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ perspective: 1400 }}>
        <motion.div style={{ rotateY: rotY, rotateX: rotX }} className="absolute inset-0">
          <AnimatePresence initial={false}>
            <RoomView key={room.id} room={room} origin={origin} onDoor={go} />
          </AnimatePresence>
        </motion.div>
      </div>

      {/* degradés para legibilidad */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/75 to-transparent" />

      {/* Nombre del ambiente */}
      <div className="pointer-events-none absolute top-5 left-5 text-ivory sm:top-7 sm:left-7">
        <p className="text-[11px] tracking-[0.25em] uppercase opacity-75">
          {title} · {String(index + 1).padStart(2, "0")}/{String(rooms.length).padStart(2, "0")}
        </p>
        <AnimatePresence mode="wait">
          <motion.h3
            key={room.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-1 font-serif text-4xl sm:text-5xl"
          >
            {room.name}
          </motion.h3>
        </AnimatePresence>
      </div>

      {/* Plano */}
      {plan && (
        <AnimatePresence>
          {showPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute top-5 right-5 hidden w-56 rounded-2xl border border-white/15 bg-black/35 p-3 backdrop-blur-md sm:top-7 sm:right-7 sm:block lg:w-64"
            >
              <p className="mb-1.5 flex justify-between text-[10px] tracking-[0.2em] text-ivory/70 uppercase">
                <span>Plano</span>
                <span className="text-brass">● Estás acá</span>
              </p>
              <PlanMini plan={plan} current={current} previous={previous} onSelect={(id) => rooms.some((r) => r.id === id) && go(id)} dark />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Barra inferior */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {rooms.map((r) => (
            <button
              key={r.id}
              onClick={() => go(r.id)}
              className={`group relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 sm:h-16 sm:w-24 ${
                r.id === current ? "border-brass" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo(r.img, 240, 160)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-1 py-0.5 text-[9px] text-ivory">{r.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Ctrl onClick={() => setGuided((v) => !v)} active={guided} label={guided ? "Pausar recorrido" : "Recorrido guiado"}>
            {guided ? (
              <path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" stroke="none" />
            ) : (
              <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />
            )}
          </Ctrl>
          {plan && (
            <Ctrl onClick={() => setShowPlan((v) => !v)} active={showPlan} label="Plano">
              <path d="M3 4h18v16H3zM3 12h8M11 4v16M15 12h6" />
            </Ctrl>
          )}
          <Ctrl onClick={() => setFull((v) => !v)} active={full} label={full ? "Salir" : "Pantalla completa"}>
            {full ? <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" /> : <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />}
          </Ctrl>
        </div>
      </div>

      {guided && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
          <motion.div style={{ scaleX: guideBar }} className="h-full origin-left bg-brass" />
        </div>
      )}

      <motion.p
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 px-4 py-2 text-xs text-ivory backdrop-blur"
      >
        ← Arrastrá para mirar alrededor →
      </motion.p>
    </div>
  );
}

function RoomView({ room, origin, onDoor }: { room: TourRoom; origin: [number, number]; onDoor: (to: string, from: [number, number]) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      const w = wrap.current?.offsetWidth ?? 0;
      setLimit(w * 0.2); // la foto mide 140%: 20% para cada lado
    };
    measure();
    window.addEventListener("resize", measure);
    // Deriva lenta tipo "mirar alrededor" mientras no tocás nada.
    const drift = animate(x, [0, -40, 30, 0], { duration: 18, repeat: Infinity, ease: "easeInOut" });
    return () => {
      window.removeEventListener("resize", measure);
      drift.stop();
    };
  }, [x]);

  return (
    <motion.div
      ref={wrap}
      className="absolute inset-0"
      style={{ transformOrigin: `${origin[0]}% ${origin[1]}%` }}
      initial={{ scale: 1.35, opacity: 0, filter: "blur(8px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)", transition: { duration: 1.1, ease } }}
      exit={{ scale: 2.4, opacity: 0, filter: "blur(10px)", transition: { duration: 0.9, ease } }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: -limit, right: limit }}
        dragElastic={0.08}
        dragTransition={{ power: 0.25, timeConstant: 320 }}
        onDragStart={() => x.stop()}
        style={{ x }}
        className="absolute top-0 bottom-0 left-[-20%] w-[140%] cursor-grab active:cursor-grabbing"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(room.img, 2600)} alt={room.name} draggable={false} className="h-full w-full object-cover select-none" />

        {room.hotspots.map((h, i) => (
          <motion.button
            key={h.to + i}
            onClick={() => onDoor(h.to, [h.x, h.y])}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.12 }}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 items-center"
            style={{ left: `${(20 + h.x) / 1.4}%`, top: `${h.y}%` }}
          >
            <span className="relative flex h-11 w-11 items-center justify-center">
              <span className="pulse-ring absolute inset-0 rounded-full bg-white/50" />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/25 text-ivory backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-brass">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </span>
            </span>
            <span className="ml-2 max-w-0 overflow-hidden rounded-full bg-black/55 text-sm whitespace-nowrap text-ivory backdrop-blur transition-all duration-500 group-hover:max-w-48 group-hover:px-3 group-hover:py-1.5 sm:max-w-48 sm:px-3 sm:py-1.5">
              {h.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Ctrl({ children, onClick, active, label }: { children: React.ReactNode; onClick: () => void; active: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-11 items-center gap-2 rounded-full px-3.5 text-sm backdrop-blur-md transition-colors ${
        active ? "bg-ivory text-ink" : "bg-white/15 text-ivory hover:bg-white/25"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        {children}
      </svg>
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
