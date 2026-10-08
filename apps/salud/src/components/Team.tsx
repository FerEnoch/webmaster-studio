"use client";

import { AnimatePresence, animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { coverage, faqs, img, photos, pros, specialties, testimonials, type SpecialtyId } from "@/lib/content";
import { useBooking } from "./Booking";

const ease = [0.16, 1, 0.3, 1] as const;

export function Team() {
  const [filter, setFilter] = useState<SpecialtyId | "todos">("todos");
  const list = pros.filter((p) => filter === "todos" || p.specialty === filter);
  return (
    <section id="equipo" className="px-4 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2 className="font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
            Profesionales que
            <br />
            <span className="italic text-deep/60">te explican todo.</span>
          </h2>
          <div className="flex flex-wrap gap-1 rounded-full bg-mist p-1">
            {[{ id: "todos", short: "Todos" } as const, ...specialties].map((s) => (
              <button key={s.id} onClick={() => setFilter(s.id)} className="relative rounded-full px-4 py-2 text-sm">
                {filter === s.id && <motion.span layoutId="team-pill" className="absolute inset-0 rounded-full bg-deep" />}
                <span className={`relative ${filter === s.id ? "text-porcelain" : "text-ink/70"}`}>{s.short}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
              >
                <ProCard p={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProCard({ p }: { p: (typeof pros)[number] }) {
  const [flip, setFlip] = useState(false);
  const { open } = useBooking();
  const sp = specialties.find((s) => s.id === p.specialty)!;
  return (
    <div className="h-[460px] [perspective:1400px]" onMouseEnter={() => setFlip(true)} onMouseLeave={() => setFlip(false)} onClick={() => setFlip((v) => !v)}>
      <motion.div animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.8, ease }} className="relative h-full w-full [transform-style:preserve-3d]">
        {/* Frente */}
        <div className="absolute inset-0 overflow-hidden rounded-[28px] [backface-visibility:hidden]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(p.photo, 700, 920)} alt={p.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/10 to-transparent" />
          <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-porcelain/90 px-3 py-1.5 text-xs backdrop-blur">
            <span className="h-2 w-2 rounded-full" style={{ background: sp.color }} />
            {sp.name}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-6 text-porcelain">
            <p className="font-serif text-3xl leading-tight">{p.name}</p>
            <p className="text-sm text-porcelain/75">
              {p.title} · ★ {p.rating} ({p.reviews})
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1 text-xs text-deep">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-deep" />
              Próximo turno: {p.next}
            </p>
          </div>
        </div>
        {/* Dorso */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-[28px] bg-deep p-7 text-porcelain [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <p className="text-xs tracking-[0.2em] text-mint uppercase">{p.mn}</p>
            <p className="mt-3 font-serif text-3xl leading-tight">{p.name}</p>
            <p className="mt-4 text-porcelain/75">{p.bio}</p>
          </div>
          <div>
            <div className="mb-5 flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < Math.round(p.rating) ? "text-mint" : "text-porcelain/20"}>
                  ★
                </span>
              ))}
              <span className="ml-2 text-sm text-porcelain/60">{p.reviews} opiniones verificadas</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                open({ pro: p.id });
              }}
              className="w-full rounded-full bg-mint py-3.5 text-deep"
            >
              Reservar con {p.name.split(" ")[1]}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(n) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {to % 1 ? v.toFixed(1) : Math.round(v).toLocaleString("es-AR")}
      {suffix}
    </span>
  );
}

export function Trust() {
  const stats = [
    { to: 18000, suffix: "+", label: "Pacientes atendidos" },
    { to: 4.9, suffix: "★", label: "Puntaje promedio" },
    { to: 22, suffix: "", label: "Profesionales" },
    { to: 15, suffix: " años", label: "Cuidando personas" },
  ];
  return (
    <section className="px-4 pb-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-ink/10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-porcelain p-8">
              <p className="font-serif text-6xl">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-ink/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.8, ease }}
              className="flex flex-col justify-between rounded-[28px] bg-mist p-7"
            >
              <blockquote className="font-serif text-2xl leading-snug">“{t.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(t.photo, 120, 120)} alt="" className="h-11 w-11 rounded-full object-cover" />
                <span>
                  <span className="block">{t.name}</span>
                  <span className="text-sm text-ink/60">{t.detail}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="relative mt-20 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="marquee flex w-max gap-3">
            {[...coverage, ...coverage, ...coverage, ...coverage].map((c, i) => (
              <span key={i} className="rounded-full border border-ink/15 px-6 py-3 whitespace-nowrap">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-4 pb-28 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.9]">
          Preguntas
          <br />
          <span className="italic text-deep/60">frecuentes</span>
        </h2>
        <div>
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-ink/10">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left text-xl">
                {f.q}
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-xl">
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden pr-12 text-ink/70">
                    <span className="block pb-6">{f.a}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Location() {
  const { open } = useBooking();
  return (
    <section className="px-4 pb-16 sm:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-deep text-porcelain">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(photos.clinic, 1800, 900)} alt="Recepción de la clínica" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="relative grid gap-10 p-8 sm:p-14 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
              Te esperamos
              <br />
              <span className="italic text-mint">en Palermo.</span>
            </h2>
            <button onClick={() => open()} className="mt-8 rounded-full bg-mint px-7 py-4 text-deep">
              Reservar turno online
            </button>
          </div>
          <div className="grid gap-6 self-end sm:grid-cols-2">
            {[
              ["Dirección", "Av. Santa Fe 4200, piso 3\nCABA"],
              ["Horarios", "Lun a vie 8 a 20 h\nSábados 9 a 14 h"],
              ["WhatsApp", "+54 11 6000 0000"],
              ["Estacionamiento", "2 h sin cargo con tu turno"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs tracking-[0.2em] text-mint uppercase">{k}</p>
                <p className="mt-2 whitespace-pre-line">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="mx-auto mt-16 flex max-w-7xl flex-col justify-between gap-4 border-t border-ink/10 pt-8 text-sm text-ink/50 sm:flex-row">
        <span className="font-serif text-2xl text-ink">Alba</span>
        <span>Director médico: Dr. Julián Pereyra · MN 120.115 · Plantilla de demostración</span>
        <span>© 2026</span>
      </footer>
    </section>
  );
}
