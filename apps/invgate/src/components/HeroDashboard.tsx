"use client";

import { AnimatePresence, animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LogoMark, Sparkle } from "./Icons";

/**
 * Reemplaza el video del hero original por una UI viva hecha en código:
 * tickets que entran, KPIs que cuentan y el asistente de IA escribiendo.
 */
const pool = [
  { t: "VPN not connecting from home office", who: "Lucía M.", pr: "High", c: "#f87171" },
  { t: "Request: new laptop for onboarding", who: "Tom R.", pr: "Medium", c: "#fbbf24" },
  { t: "Outlook keeps asking for password", who: "Ana P.", pr: "Low", c: "#4ade80" },
  { t: "Printer on 3rd floor offline", who: "Diego S.", pr: "Medium", c: "#fbbf24" },
  { t: "Access to Salesforce sandbox", who: "Mia K.", pr: "Low", c: "#4ade80" },
  { t: "Server room temperature alert", who: "Monitor", pr: "High", c: "#f87171" },
  { t: "Software license renewal: Adobe", who: "Finance", pr: "Medium", c: "#fbbf24" },
];

const atlasText = "Detected 12 similar VPN tickets in the last hour. Suggest grouping them as a major incident?";

export default function HeroDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const [head, setHead] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setHead((h) => h + 1), 2400);
    return () => clearInterval(id);
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    setTyped(0);
    const id = setInterval(() => setTyped((n) => (n >= atlasText.length + 40 ? 0 : n + 1)), 45);
    return () => clearInterval(id);
  }, [inView]);

  const rows = Array.from({ length: 5 }, (_, i) => ({ ...pool[(head + pool.length * 10 - i) % pool.length], key: head - i }));

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 shadow-[0_5px_20px_10px_rgba(9,9,11,0.1),0_30px_80px_-10px_rgba(30,27,75,0.6)] sm:aspect-video sm:rounded-2xl"
    >
      {/* reflejo que barre la pantalla */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 z-20 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        animate={{ left: ["-40%", "140%"] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
      />

      <div className="flex h-full text-[8px] sm:text-[10px] md:text-[11px]">
        {/* sidebar */}
        <div className="flex w-[7%] flex-col items-center gap-[6%] border-r border-zinc-800 bg-zinc-950 py-[2%]">
          <LogoMark className="h-[6%] w-[60%] text-white" />
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`aspect-square w-[45%] rounded-md ${i === 1 ? "bg-indigo-500" : "bg-zinc-800"}`} />
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* topbar */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-[2.5%] py-[1.6%]">
            <span className="font-semibold text-white">Service Desk · Incidents</span>
            <span className="flex w-[34%] items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-zinc-400">
              <Sparkle className="h-2.5 w-2.5 text-violet-300" /> Ask Atlas anything…
            </span>
          </div>

          <div className="flex min-h-0 flex-1 gap-[2%] p-[2.5%]">
            <div className="flex min-w-0 flex-1 flex-col gap-[3%]">
              {/* KPIs */}
              <div className="grid grid-cols-3 gap-[3%]">
                <Kpi label="Open tickets" to={128} active={inView} accent="#818cf8" />
                <Kpi label="Resolved today" to={342} active={inView} accent="#4ade80" />
                <Kpi label="SLA compliance" to={98} suffix="%" active={inView} accent="#38bdf8" />
              </div>

              {/* lista */}
              <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/60">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-zinc-800 px-[3%] py-[1.8%] text-zinc-500">
                  <span>Subject</span>
                  <span className="hidden sm:inline">Requester</span>
                  <span>Priority</span>
                </div>
                <motion.ul layout className="relative">
                  <AnimatePresence initial={false} mode="popLayout">
                    {rows.map((r, i) => (
                      <motion.li
                        layout
                        key={r.key}
                        initial={{ opacity: 0, y: -16, backgroundColor: "rgba(99,102,241,0.25)" }}
                        animate={{ opacity: 1, y: 0, backgroundColor: "rgba(99,102,241,0)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], backgroundColor: { duration: 1.6 } }}
                        className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-zinc-800/70 px-[3%] py-[1.8%]"
                      >
                        <span className="flex min-w-0 items-center gap-1.5">
                          {i === 0 && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />}
                          <span className="truncate text-zinc-200">{r.t}</span>
                        </span>
                        <span className="hidden text-zinc-400 sm:inline">{r.who}</span>
                        <span className="rounded-full px-1.5 py-0.5" style={{ color: r.c, background: `${r.c}22` }}>
                          {r.pr}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              </div>
            </div>

            {/* panel Atlas */}
            <div className="hidden w-[30%] flex-col gap-[4%] rounded-lg border border-zinc-800 bg-gradient-to-b from-indigo-950/70 to-zinc-950 p-[2.5%] md:flex">
              <span className="flex items-center gap-1 font-semibold text-violet-200">
                <Sparkle className="h-3 w-3" /> Atlas AI
              </span>
              <div className="rounded-md bg-zinc-800/80 p-2 leading-snug text-zinc-200">
                {atlasText.slice(0, typed)}
                {typed < atlasText.length && <span className="ml-0.5 inline-block h-2.5 w-[2px] animate-pulse bg-violet-300 align-middle" />}
              </div>
              <AnimatePresence>
                {typed >= atlasText.length && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-1.5">
                    <span className="rounded-md bg-indigo-500 px-2 py-1 font-semibold text-white">Group tickets</span>
                    <span className="rounded-md bg-zinc-800 px-2 py-1">Dismiss</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-auto">
                <span className="text-zinc-500">Resolution trend</span>
                <svg viewBox="0 0 100 40" className="mt-1 w-full">
                  <motion.path
                    d="M0 34 L12 30 L24 32 L36 22 L48 25 L60 15 L72 18 L84 8 L100 5"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, to, suffix = "", active, accent }: { label: string; to: number; suffix?: string; active: boolean; accent: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", delay: 0.6, onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [active, to]);
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-[6%]">
      <span className="block text-zinc-500">{label}</span>
      <span className="mt-0.5 block text-[1.6em] font-semibold text-white">
        {v}
        {suffix}
      </span>
      <span className="mt-1 block h-1 overflow-hidden rounded-full bg-zinc-800">
        <motion.span
          className="block h-full rounded-full"
          style={{ background: accent }}
          initial={{ width: 0 }}
          animate={active ? { width: `${Math.min(100, (to / (suffix ? 100 : 400)) * 100)}%` } : {}}
          transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
        />
      </span>
    </div>
  );
}
