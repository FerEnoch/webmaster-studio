"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { stages } from "@/lib/content";
import { FLOORS } from "./Building3D";

const Building3D = dynamic(() => import("./Building3D"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;
const M2_TOTAL = 9800;

/**
 * Hero "construcción en vivo": la sección mide 600vh y el canvas queda fijo;
 * el progreso del scroll (0..1) maneja toda la obra en 3D.
 */
export default function BuildSection() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const smooth = useRef(0);
  const [stage, setStage] = useState(0);
  const [plano, setPlano] = useState(false);
  const [started, setStarted] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  // HUD (se actualiza fuera de React para no re-renderizar en cada frame).
  const level = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const m2 = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      progress.current = p;
      let s = 0;
      stages.forEach((st, i) => {
        if (p >= st.at) s = i;
      });
      setStage(s);
      setStarted(p > 0.035);
    };
    onScroll();
    // Fuera de pantalla el canvas deja de renderizar (ahorra GPU y batería).
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let raf = requestAnimationFrame(function loop() {
      const p = smooth.current;
      const structure = Math.min(1, Math.max(0, (p - 0.13) / 0.47));
      const lv = Math.round(structure * FLOORS);
      if (level.current) level.current.textContent = String(lv).padStart(2, "0");
      if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
      if (m2.current) m2.current.textContent = Math.round(structure * M2_TOTAL).toLocaleString("es-AR");
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (ruler.current) ruler.current.style.transform = `scaleY(${structure})`;
      if (intro.current) {
        const o = 1 - Math.min(1, p / 0.05);
        intro.current.style.opacity = String(o);
        intro.current.style.transform = `translate3d(0, ${-p * 900}px, 0)`;
        intro.current.style.pointerEvents = o < 0.1 ? "none" : "auto";
      }
      if (hint.current) hint.current.style.opacity = String(1 - Math.min(1, p / 0.02));
      raf = requestAnimationFrame(loop);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const goTo = (at: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * (at + 0.02);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const st = stages[stage];
  const dark = plano || stage === 3;

  return (
    <section ref={section} id="obra" className="relative h-[600vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <Building3D progress={progress} smooth={smooth} plano={plano} active={onScreen} />
        </div>

        {/* Viñeta para legibilidad */}
        <div
          className={`pointer-events-none absolute inset-0 transition-colors duration-1000 ${
            dark
              ? "bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,8,20,0.55))]"
              : "bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(237,234,228,0.65))]"
          }`}
        />

        {/* Intro */}
        <div ref={intro} className="absolute inset-x-0 bottom-0 z-10 px-5 pb-28 sm:px-10 sm:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="mb-4 font-mono text-xs tracking-[0.2em] text-ink/60 uppercase"
          >
            Constructora · Desarrolladora · Buenos Aires
          </motion.p>
          <h1 className="max-w-6xl text-[clamp(3rem,9vw,9.5rem)] leading-[0.88] font-semibold tracking-[-0.05em] text-ink">
            {["Construimos", "lo que imaginás."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.2, ease, delay: 2 + i * 0.12 }}
                >
                  {i === 1 ? (
                    <>
                      lo que <span className="text-safety italic">imaginás.</span>
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        {/* Hint de scroll */}
        <div ref={hint} className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
          <span className="font-mono text-[10px] tracking-[0.25em] text-ink/60 uppercase">Scrolleá para construir</span>
          <span className="flex h-9 w-5 justify-center rounded-full border border-ink/40 pt-1.5">
            <motion.span
              className="h-2 w-0.5 rounded-full bg-ink"
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </span>
        </div>

        {/* Selector Render / Planos */}
        <div className="absolute top-24 right-5 z-20 sm:right-10">
          <div
            className={`relative flex rounded-full border p-1 font-mono text-[11px] tracking-widest uppercase backdrop-blur-md transition-colors duration-700 ${
              dark ? "border-white/20 bg-white/10 text-white" : "border-ink/15 bg-white/50 text-ink"
            }`}
          >
            {(["Render", "Planos"] as const).map((m) => {
              const active = (m === "Planos") === plano;
              return (
                <button
                  key={m}
                  onClick={() => setPlano(m === "Planos")}
                  className="relative z-10 rounded-full px-4 py-2"
                >
                  {active && (
                    <motion.span
                      layoutId="mode-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-safety"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={active ? "text-white" : ""}>{m}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Etapa actual */}
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 px-5 sm:top-1/2 sm:bottom-auto sm:left-10 sm:w-[min(420px,38vw)] sm:-translate-y-1/2 sm:px-0">
          <AnimatePresence mode="wait">
            {started ? (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease }}
                className={`rounded-2xl border p-6 backdrop-blur-xl transition-colors duration-700 sm:p-7 ${
                  dark ? "border-white/15 bg-black/30 text-white" : "border-ink/10 bg-white/55 text-ink"
                }`}
              >
                <div className="mb-5 flex items-baseline justify-between font-mono text-[11px] tracking-[0.2em] uppercase opacity-70">
                  <span>Etapa {st.n} / 04</span>
                  <span className="text-safety">● En vivo</span>
                </div>
                <h2 className="text-3xl leading-none font-semibold tracking-tight sm:text-4xl">{st.title}</h2>
                <p className="mt-4 text-[15px] leading-relaxed opacity-80">{st.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {st.data.map((d, i) => (
                    <motion.li
                      key={d}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      className={`rounded-full border px-3 py-1 font-mono text-[11px] ${
                        dark ? "border-white/20" : "border-ink/15"
                      }`}
                    >
                      {d}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* HUD derecha */}
        <div
          className={`absolute top-1/2 right-5 z-10 hidden -translate-y-1/2 items-stretch gap-4 font-mono transition-colors duration-700 sm:right-10 md:flex ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          <div className="flex flex-col justify-between py-1 text-right">
            <Hud label="Nivel" refEl={level} suffix={` / ${FLOORS}`} />
            <Hud label="Avance" refEl={pct} suffix="%" />
            <Hud label="m² construidos" refEl={m2} />
          </div>
          <div className="relative h-72 w-2">
            <div className="absolute inset-0 rounded-full bg-current opacity-15" />
            <div ref={ruler} className="absolute inset-0 origin-bottom rounded-full bg-safety" style={{ transform: "scaleY(0)" }} />
            {Array.from({ length: FLOORS + 1 }, (_, i) => (
              <span
                key={i}
                className="absolute -left-2 h-px w-1.5 bg-current opacity-40"
                style={{ bottom: `${(i / FLOORS) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Barra de etapas */}
        <div className="absolute inset-x-5 bottom-8 z-20 sm:inset-x-10">
          <div className={`relative h-px transition-colors duration-700 ${dark ? "bg-white/25" : "bg-ink/20"}`}>
            <div ref={bar} className="absolute inset-0 origin-left bg-safety" style={{ transform: "scaleX(0)" }} />
          </div>
          <div className="relative mt-3 hidden h-5 sm:block">
            {stages.map((s, i) => (
              <button
                key={s.n}
                onClick={() => goTo(s.at)}
                className={`absolute top-0 -translate-x-0 font-mono text-[10px] tracking-[0.18em] uppercase transition-all duration-500 hover:text-safety ${
                  i === stage ? "text-safety" : dark ? "text-white/60" : "text-ink/50"
                }`}
                style={{ left: `${s.at * 100}%` }}
              >
                {s.n} {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Hud({ label, refEl, suffix = "" }: { label: string; refEl: React.RefObject<HTMLSpanElement | null>; suffix?: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.2em] uppercase opacity-60">{label}</div>
      <div className="text-2xl tabular-nums">
        <span ref={refEl}>00</span>
        <span className="text-sm opacity-60">{suffix}</span>
      </div>
    </div>
  );
}
