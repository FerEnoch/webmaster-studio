"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import Button from "./Button";
import { ArrowDown, ArrowRight, LogoMark } from "./Icons";
import HeroDashboard from "./HeroDashboard";
import { WordsReveal } from "./Reveal";

/**
 * Hero del original:
 *  - pill / h1 / p / botones con "heroRevealUp" escalonado (0, 100, 200, 300ms)
 *  - 3 capas de montañas con parallax (back, mid detrás del producto, front delante)
 *  - el producto arranca 120px abajo y sube al scrollear
 * Mejoras: título palabra por palabra, inclinación 3D del producto (scroll + mouse),
 * partículas flotando y spring en todos los parallax.
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const backY = useTransform(p, [0, 1], ["0%", "24%"]);
  const midY = useTransform(p, [0, 1], ["0%", "8%"]);
  const frontY = useTransform(p, [0, 1], ["0%", "-34%"]);
  const shotY = useTransform(p, [0, 0.45], ["22%", "0%"]);
  const shotRotate = useTransform(p, [0, 0.45], [22, 0]);
  const shotScale = useTransform(p, [0, 0.45], [0.9, 1]);
  const textY = useTransform(p, [0, 0.5], [0, -80]);
  const textOpacity = useTransform(p, [0, 0.4], [1, 0]);

  // Inclinación con el mouse (sumada a la del scroll).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 80, damping: 18 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 80, damping: 18 });
  const rotateX = useTransform([shotRotate, tiltX], ([a, b]: number[]) => a + b);

  return (
    <section className="mx-auto max-w-[110rem] md:px-4 md:pt-4">
      <div
        ref={ref}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="relative isolate overflow-hidden rounded-b-2xl bg-[linear-gradient(to_bottom,#e8eeff_0%,#6172f3_49%,#000_100%)] pt-28 sm:pt-32 md:rounded-4xl"
      >
        <Particles />

        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-20 mx-auto flex max-w-6xl justify-center px-4 sm:px-8">
          <div className="flex w-full max-w-5xl flex-col items-center">
            <a
              href="#"
              className="group mb-5 flex w-fit animate-hero-reveal items-center gap-2 rounded-full border border-white/50 bg-white/30 py-1 pr-2.5 pl-1 backdrop-blur transition-colors hover:bg-white/60"
            >
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                <span className="absolute inset-0 animate-[pulse-ring_2s_ease-out_infinite] rounded-full bg-indigo-400" />
                <LogoMark className="relative h-4 w-4 text-zinc-950" />
              </span>
              <span className="text-xs text-zinc-800 sm:text-sm">
                InvGate named a <strong className="font-semibold">2025 Gartner® Peer Insights™ Customers’ Choice</strong>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </a>

            <h1 className="mb-4 max-w-3xl text-center text-4xl leading-[1.1] font-medium tracking-tight text-zinc-950 sm:text-5xl lg:text-[4rem]">
              <WordsReveal text="The IT Management platform for an AI-enabled world" delay={0.1} immediate />
            </h1>

            <p className="mb-8 max-w-3xl animate-hero-reveal text-center text-base leading-[1.7] font-medium text-zinc-950 [animation-delay:500ms]">
              IT Management is evolving. InvGate enables you and your organization to streamline service operations, optimize IT spend, and
              enhance Asset Lifecycle Management.
            </p>

            <div className="flex w-full animate-hero-reveal flex-col gap-3 [animation-delay:650ms] sm:w-auto sm:flex-row">
              <Button variant="dark" arrow>
                Talk to Sales
              </Button>
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                Evaluate the product
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5 group-hover:animate-float" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="relative mt-14 pb-16 sm:mt-10 sm:pb-20 md:pb-32" style={{ perspective: 1600 }}>
          <div className="relative">
            <motion.div style={{ y: backY }} className="pointer-events-none absolute inset-x-0 top-[18%] z-0 aspect-[1503/701] will-change-transform">
              <Mountains layer="back" />
            </motion.div>
            <motion.div style={{ y: midY }} className="pointer-events-none absolute inset-x-0 top-[50%] z-30 aspect-[1503/517] will-change-transform">
              <Mountains layer="mid" />
            </motion.div>

            <motion.div
              style={{ y: shotY, rotateX, rotateY: tiltY, scale: shotScale, transformOrigin: "50% 100%" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="relative z-40 mx-auto w-[92%] max-w-[1000px] md:w-[70%] lg:w-[66.5%]"
            >
              <HeroDashboard />
            </motion.div>

            <motion.div style={{ y: frontY }} className="pointer-events-none absolute inset-x-0 top-3/4 z-50 aspect-[1503/373] will-change-transform">
              <Mountains layer="front" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mountains({ layer }: { layer: "back" | "mid" | "front" }) {
  if (layer === "back")
    return (
      <svg viewBox="0 0 1503 701" preserveAspectRatio="none" className="h-full w-full opacity-60">
        <defs>
          <linearGradient id="mb" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#c7d2fe" />
            <stop offset="1" stopColor="#4f46e5" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          fill="url(#mb)"
          d="M0 420 120 300 210 360 330 190 450 330 560 240 700 110 830 280 930 210 1060 330 1180 170 1290 290 1400 230 1503 320V701H0Z"
        />
      </svg>
    );
  if (layer === "mid")
    return (
      <svg viewBox="0 0 1503 517" preserveAspectRatio="none" className="h-full w-full opacity-90">
        <defs>
          <linearGradient id="mm" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#4338ca" />
            <stop offset="1" stopColor="#1e1b4b" />
          </linearGradient>
        </defs>
        <path fill="url(#mm)" d="M0 260 160 140 300 230 420 120 560 250 760 170 940 260 1080 110 1230 230 1360 160 1503 240V517H0Z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 1503 373" preserveAspectRatio="none" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="mf" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#111127" />
          <stop offset="0.6" stopColor="#000" />
        </linearGradient>
      </defs>
      <path fill="url(#mf)" d="M0 150 140 90 260 170 380 120 470 210 1030 210 1120 110 1250 160 1380 70 1503 130V373H0Z" />
      <rect x="0" y="372" width="1503" height="600" fill="#000" />
    </svg>
  );
}

/** Puntitos que suben lento sobre el gradiente (extra, no está en el original). */
function Particles() {
  const dots = Array.from({ length: 22 }, (_, i) => ({
    left: (i * 47) % 100,
    top: 30 + ((i * 29) % 60),
    size: 2 + (i % 3),
    dur: 6 + (i % 5) * 1.5,
    delay: (i % 7) * 0.7,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -60], opacity: [0, 0.8, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
