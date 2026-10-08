"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { aiRows } from "@/lib/content";
import Button from "./Button";
import { LogoMark, Sparkle } from "./Icons";
import Marquee from "./Marquee";
import { WordsReveal } from "./Reveal";

const chipColors = ["#DDD6FE", "#D0F8AB", "#BFDBFE"];

/**
 * Original ("group/color-change"): el bloque pasa de claro a negro cuando entra en
 * pantalla (data-state=active) y vuelve al salir. Cards de producto: al hover
 * aparece la foto de fondo y la captura cambia de light a dark.
 * Chips de IA: 3 filas en loop alternando dirección.
 */
export default function Products() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { amount: 0.25 });

  return (
    <section className="px-4">
      <div ref={ref} className="relative mx-auto w-full max-w-screen-2xl overflow-hidden rounded-4xl bg-zinc-100 py-16 sm:py-24">
        <motion.div
          className="absolute inset-0 bg-zinc-950"
          initial={false}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
        {/* auroras (extra) */}
        <motion.div
          className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(97,114,243,0.35),transparent)] blur-2xl"
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
          transition={{ duration: 1.4 }}
        />

        <div className="relative z-10 w-full overflow-hidden px-4 sm:px-8 lg:px-12 xl:px-16">
          <h2
            className={`mx-auto mb-10 max-w-3xl text-center text-4xl leading-tight font-medium tracking-tight transition-colors duration-700 sm:mb-16 sm:text-5xl ${
              active ? "title-gradient-dark" : "text-zinc-950"
            }`}
          >
            <WordsReveal text="Two stand-alone solutions that work best together" />
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
            <ProductCard
              name="Service Management"
              text="Best-in-class Service Management for IT and beyond — efficient, seamless, and highly scalable."
              from="#312e81"
              to="#6172f3"
              accent="#818cf8"
              active={active}
              kind="sm"
            />
            <ProductCard
              name="Asset Management"
              text="A unified platform to streamline and intelligently automate every stage of the asset lifecycle."
              from="#064e3b"
              to="#4cd4a8"
              accent="#4cd4a8"
              active={active}
              kind="am"
              delay={0.15}
            />
          </div>

          <div className="mx-auto mt-24 flex flex-col items-center sm:mb-10">
            <motion.span
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-300 via-indigo-500 to-sky-400 text-white shadow-[0_0_40px_rgba(129,140,248,0.6)]"
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkle className="h-7 w-7" />
            </motion.span>
            <div className="mb-12 flex max-w-3xl flex-col items-center md:mb-20">
              <h3
                className={`mb-6 text-center text-4xl font-medium tracking-tight transition-colors duration-700 sm:text-5xl ${
                  active ? "text-zinc-50" : "text-zinc-950"
                }`}
              >
                <WordsReveal text="Put AI at the service of your teams" />
              </h3>
              <p className={`mb-6 text-center text-lg transition-colors duration-700 ${active ? "text-zinc-300" : "text-zinc-800"}`}>
                Empower your teams with the tools to work smarter, not harder, helping them resolve issues and manage assets faster and more
                efficiently.
              </p>
              <Button variant={active ? "glass" : "dark"} arrow>
                Explore AI Hub
              </Button>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-y-4">
          {aiRows.map((row, r) => (
            <Marquee key={r} reverse={r % 2 === 1} duration={45 + r * 8}>
              {row.map((chip, i) => (
                <span
                  key={chip}
                  className="group flex items-center gap-2 rounded-lg border border-zinc-600 bg-black/90 px-4 py-3 text-base whitespace-nowrap text-zinc-50 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-[0_0_24px_rgba(167,139,250,0.35)]"
                >
                  <Sparkle className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" style={{ color: chipColors[i % 3] }} />
                  {chip}
                </span>
              ))}
            </Marquee>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  name,
  text,
  from,
  to,
  accent,
  active,
  kind,
  delay = 0,
}: {
  name: string;
  text: string;
  from: string;
  to: string;
  accent: string;
  active: boolean;
  kind: "sm" | "am";
  delay?: number;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 15 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry, ["--spin-color" as string]: accent }}
        className="spin-border group relative h-full overflow-hidden rounded-[20px] px-4 pt-12 sm:px-8"
      >
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${active ? "opacity-100" : "opacity-90"}`}
          style={{ background: `linear-gradient(160deg, ${from} 0%, ${to}cc 55%, ${from} 100%)` }}
        />
        {/* "foto" de fondo al hover → aurora animada */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <motion.div
            className="absolute -inset-1/2"
            style={{ background: `conic-gradient(from 0deg, ${from}, ${accent}, #09090b, ${to}, ${from})` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-2xl" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-center gap-2 text-white">
              <LogoMark className="h-8 w-8" />
              <span className="text-xl leading-tight">
                <span className="block text-xs font-semibold tracking-widest uppercase opacity-70">InvGate</span>
                <span className="font-semibold">{name}</span>
              </span>
            </div>
            <p className="mx-auto mb-6 max-w-md text-center text-zinc-100 sm:text-lg">{text}</p>
            <div className="flex justify-center">
              <Button variant="ghost" arrow>
                Explore
              </Button>
            </div>
          </div>
          <div className="relative mt-11 -mr-4 -mb-2 sm:-mr-8">
            <div className="transition-all duration-700 group-hover:-translate-y-2">
              <ProductMock kind={kind} accent={accent} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Captura de producto hecha en código; al hover cruza de light a dark. */
function ProductMock({ kind, accent }: { kind: "sm" | "am"; accent: string }) {
  const bars = kind === "sm" ? [60, 85, 45, 70, 95, 55, 80] : [40, 65, 90, 50, 75, 60, 85];
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-tl-3xl border border-white/20 shadow-2xl">
      {(["light", "dark"] as const).map((mode) => (
        <div
          key={mode}
          className={`absolute inset-0 flex text-[9px] transition-opacity duration-500 sm:text-[10px] ${
            mode === "light" ? "bg-white text-zinc-700 group-hover:opacity-0" : "bg-zinc-900 text-zinc-300 opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className={`w-[18%] space-y-2 border-r p-3 ${mode === "light" ? "border-zinc-100 bg-zinc-50" : "border-zinc-800 bg-zinc-950"}`}>
            {["Home", kind === "sm" ? "Tickets" : "Assets", "Reports", "Settings"].map((l, i) => (
              <span key={l} className={`block rounded px-1.5 py-1 ${i === 1 ? "text-white" : ""}`} style={i === 1 ? { background: accent } : {}}>
                {l}
              </span>
            ))}
          </div>
          <div className="flex-1 space-y-3 p-4">
            <span className="block text-[1.3em] font-semibold">{kind === "sm" ? "Requests overview" : "Hardware inventory"}</span>
            <div className="grid grid-cols-3 gap-2">
              {(kind === "sm" ? ["Open 128", "In progress 46", "Solved 342"] : ["Laptops 1,204", "Servers 86", "Expiring 23"]).map((k) => (
                <span key={k} className={`rounded-lg p-2 ${mode === "light" ? "bg-zinc-50" : "bg-zinc-800"}`}>
                  {k}
                </span>
              ))}
            </div>
            <div className="flex h-[40%] items-end gap-[4%]">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="flex-1 origin-bottom rounded-t transition-transform duration-700 group-hover:scale-y-110"
                  style={{ height: `${h}%`, background: accent, opacity: 0.35 + (i % 3) * 0.25, transitionDelay: `${i * 40}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
