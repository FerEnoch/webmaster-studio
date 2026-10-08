"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { integrations, teamImg } from "@/lib/content";
import Button from "./Button";
import Marquee from "./Marquee";
import { Reveal, WordsReveal } from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Bento() {
  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-8 lg:px-14 xl:px-16">
        <h2 className="mx-auto mb-8 max-w-3xl text-center text-3xl leading-tight font-medium tracking-tight text-balance text-zinc-950 sm:text-4xl md:mb-16 md:text-5xl">
          <WordsReveal text="Onboard your entire organization, and get the autonomy to create change" />
        </h2>

        <div className="grid w-full grid-cols-12 gap-6">
          <Reveal className="col-span-12 md:col-span-5 xl:col-span-4">
            <Card
              dark
              style={{ background: "linear-gradient(207deg, rgba(76,212,168,0) 25%, rgba(76,212,168,0.45) 85%), #052e26" }}
              title="A truly unified service catalog to support IT and beyond"
              text="People’s Bank aligned 24 departments to provide service through InvGate Service Management"
              cta="Read case study"
            >
              <Catalog />
            </Card>
          </Reveal>

          <Reveal className="col-span-12 md:col-span-7 xl:col-span-8" delay={0.1}>
            <Card
              style={{ background: "linear-gradient(180deg,#fff 0%,#eef2ff 100%)" }}
              title="Get the autonomy to implement new processes and changes"
              text="InvGate’s no-code workflow builder and its UX flexibility gives you the power to take action without the need of third parties."
              cta="Learn more"
            >
              <Workflow />
            </Card>
          </Reveal>

          <Reveal className="col-span-12 md:col-span-6 lg:col-span-7 xl:col-span-8">
            <Card
              style={{ background: "linear-gradient(180deg,#fff 0%,#f4f4f5 100%)" }}
              title="Build on top of your current tech stack"
              text="Native integrations ready to be used and a powerful API to connect your favorite tools."
              cta="See integrations"
              bleed
            >
              <div className="flex flex-col gap-3">
                {integrations.map((row, r) => (
                  <Marquee key={r} reverse={r % 2 === 1} duration={35 + r * 6} gap="gap-3">
                    {row.map((name) => (
                      <span
                        key={name}
                        className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white py-2 pr-4 pl-2 text-sm font-medium whitespace-nowrap text-zinc-800 shadow-sm transition-transform hover:scale-105"
                      >
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                          style={{ background: `hsl(${(name.length * 37 + r * 90) % 360} 70% 50%)` }}
                        >
                          {name[0]}
                        </span>
                        {name}
                      </span>
                    ))}
                  </Marquee>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4" delay={0.1}>
            <div className="group relative flex h-full min-h-[26rem] flex-col items-center overflow-hidden rounded-2xl border border-zinc-200 px-4 py-8 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={teamImg}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/30 to-zinc-950/10" />
              <div className="relative z-10 flex max-w-xl flex-col items-center">
                <h3 className="mb-4 text-2xl font-medium text-balance text-zinc-50">A team dedicated to your success</h3>
                <p className="mb-4 text-zinc-100">
                  From smooth implementation to ongoing training and 24/7 support, we help you get the most out of every InvGate solution.
                </p>
                <Button variant="linkLight" arrow>
                  Meet our team
                </Button>
              </div>
              <motion.span
                className="absolute bottom-5 left-5 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-900 backdrop-blur"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Support online 24/7
              </motion.span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  text,
  cta,
  children,
  dark = false,
  bleed = false,
  style,
}: {
  title: string;
  text: string;
  cta: string;
  children: React.ReactNode;
  dark?: boolean;
  bleed?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`group relative flex h-full flex-col items-center justify-between overflow-hidden rounded-2xl border px-4 py-8 text-center transition-shadow duration-500 hover:shadow-[0_20px_50px_-12px_rgba(16,24,40,0.25)] ${
        dark ? "border-emerald-900" : "border-zinc-200"
      }`}
    >
      <div className="relative z-10 mb-10 flex max-w-xl flex-col items-center lg:mb-12">
        <h3 className={`mb-4 text-2xl font-medium text-balance ${dark ? "text-white" : "text-zinc-950"}`}>{title}</h3>
        <p className={`mb-4 ${dark ? "text-zinc-100" : "text-zinc-700"}`}>{text}</p>
        <Button variant={dark ? "linkLight" : "link"} arrow>
          {cta}
        </Button>
      </div>
      <div className={bleed ? "-mx-4 w-[calc(100%+2rem)] min-w-0" : "w-full"}>{children}</div>
    </div>
  );
}

const depts = ["IT", "HR", "Finance", "Legal", "Facilities", "Marketing", "Security", "Sales", "Ops"];

/** Catálogo: los departamentos se encienden en cadena. */
function Catalog() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="mx-auto grid max-w-xs grid-cols-3 gap-2.5">
      {depts.map((d, i) => (
        <motion.div
          key={d}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
          className="relative flex aspect-square flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-white/15 bg-white/10 text-xs text-white backdrop-blur"
        >
          <motion.span
            className="h-6 w-6 rounded-md bg-emerald-300/80"
            animate={inView ? { opacity: [0.4, 1, 0.4] } : {}}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.25 }}
          />
          {d}
        </motion.div>
      ))}
    </div>
  );
}

/** Workflow builder: nodos que aparecen, conexiones que se dibujan y un "token" recorriendo el flujo. */
function Workflow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const nodes = [
    { x: 40, y: 90, label: "New request", c: "#6172f3" },
    { x: 250, y: 90, label: "Approval?", c: "#f59e0b" },
    { x: 460, y: 30, label: "Assign agent", c: "#10b981" },
    { x: 460, y: 150, label: "Notify user", c: "#ef4444" },
    { x: 660, y: 90, label: "Close ticket", c: "#09090b" },
  ];
  const edges = [
    "M150 110 C200 110 200 110 250 110",
    "M360 110 C410 110 410 50 460 50",
    "M360 110 C410 110 410 170 460 170",
    "M570 50 C615 50 615 110 660 110",
    "M570 170 C615 170 615 110 660 110",
  ];
  return (
    <div ref={ref} className="mx-auto w-full max-w-3xl">
      <svg viewBox="0 0 780 220" className="w-full overflow-visible">
        <defs>
          <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#c7d2fe" />
          </pattern>
        </defs>
        <rect width="780" height="220" fill="url(#dots)" rx="16" />
        {edges.map((d, i) => (
          <g key={i}>
            <motion.path
              d={d}
              fill="none"
              stroke="#a5b4fc"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.25, duration: 0.7, ease }}
            />
            {inView && (
              <circle r="4" fill="#6172f3">
                <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${1.8 + i * 0.3}s`} path={d} />
              </circle>
            )}
          </g>
        ))}
        {nodes.map((n, i) => (
          <motion.g
            key={n.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.2, duration: 0.6, ease }}
          >
            <rect x={n.x} y={n.y} width="110" height="40" rx="10" fill="#fff" stroke="#e4e4e7" />
            <rect x={n.x + 10} y={n.y + 12} width="16" height="16" rx="4" fill={n.c} />
            <text x={n.x + 34} y={n.y + 25} fontSize="12" fontWeight="600" fill="#27272a">
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
