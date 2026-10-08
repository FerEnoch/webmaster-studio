"use client";

import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cars, img, showcase } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;
const swatch = (hue: number) => `hsl(${(hue + 360) % 360} 75% 48%)`;

function Count({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 1.2, ease, onUpdate: setV });
    return () => c.stop();
  }, [to]);
  return <span className="tabular-nums">{v.toFixed(decimals)}</span>;
}

/** Selector de modelos: el auto entra "a toda velocidad" (desenfoque de movimiento) y se puede cambiar de color. */
export default function Showcase() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [color, setColor] = useState(0);
  const item = showcase[i];
  const car = cars.find((c) => c.id === item.carId)!;
  const tint = item.colors[color];

  const go = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI(n);
    setColor(0);
  };

  return (
    <section id="modelos" className="relative overflow-hidden px-5 py-28 sm:px-10">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-bold">
          Elegí tu
          <br />
          <span className="outline-text">próximo auto.</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {showcase.map((s, k) => {
            const c = cars.find((x) => x.id === s.carId)!;
            return (
              <button key={s.carId} onClick={() => go(k)} className="relative rounded-full px-5 py-2.5 text-sm">
                {k === i && <motion.span layoutId="model-pill" className="absolute inset-0 rounded-full bg-chalk" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className={`relative ${k === i ? "text-night" : "text-chalk/70"}`}>
                  {c.brand} {c.model.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Texto gigante de fondo */}
        <AnimatePresence mode="popLayout">
          <motion.p
            key={car.id}
            initial={{ x: dir * 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir * -200, opacity: 0 }}
            transition={{ duration: 0.9, ease }}
            className="pointer-events-none absolute -top-10 left-0 font-display text-[18vw] leading-none font-extrabold whitespace-nowrap text-white/[0.04] select-none"
          >
            {car.brand.toUpperCase()}
          </motion.p>
        </AnimatePresence>

        <div className="relative aspect-[16/10] overflow-hidden rounded-[32px] bg-carbon">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={car.id}
              custom={dir}
              initial={{ x: `${dir * 60}%`, opacity: 0, filter: "blur(24px)", skewX: dir * -8 }}
              animate={{ x: "0%", opacity: 1, filter: "blur(0px)", skewX: 0 }}
              exit={{ x: `${dir * -60}%`, opacity: 0, filter: "blur(24px)", skewX: dir * 8 }}
              transition={{ duration: 0.85, ease }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img(car.img, 1800, 1125)}
                alt={`${car.brand} ${car.model}`}
                className="h-full w-full object-cover"
              />
              {/* Simulación de color: capa en modo "color" concentrada sobre el auto. */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{ opacity: color === 0 ? 0 : 0.6, backgroundColor: swatch(tint.hue) }}
                transition={{ duration: 0.7 }}
                style={{
                  mixBlendMode: "color",
                  maskImage: "radial-gradient(ellipse 48% 38% at 50% 58%, #000 55%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(ellipse 48% 38% at 50% 58%, #000 55%, transparent 100%)",
                }}
              />
            </motion.div>
          </AnimatePresence>
          {/* Líneas de velocidad al cambiar */}
          <AnimatePresence>
            <motion.div key={car.id + "-lines"} className="pointer-events-none absolute inset-0">
              {Array.from({ length: 7 }, (_, k) => (
                <motion.span
                  key={k}
                  className="absolute h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
                  style={{ top: `${15 + k * 11}%`, width: "40%" }}
                  initial={{ left: dir > 0 ? "100%" : "-40%", opacity: 0.9 }}
                  animate={{ left: dir > 0 ? "-40%" : "100%", opacity: 0 }}
                  transition={{ duration: 0.6, delay: k * 0.03, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-night/80 to-transparent p-6">
            <div>
              <p className="text-xs tracking-[0.25em] text-chalk/60 uppercase">{car.year} · {car.km ? `${car.km.toLocaleString("es-AR")} km` : "0 km"}</p>
              <AnimatePresence mode="wait">
                <motion.p key={car.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="font-display text-3xl font-bold sm:text-4xl">
                  {car.brand} {car.model}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="font-display text-2xl text-volt">US$ {car.price.toLocaleString("es-AR")}</p>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.p key={item.headline} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-display text-3xl font-semibold">
              {item.headline}
            </motion.p>
          </AnimatePresence>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              [car.hp, "CV", 0],
              [car.zeroTo100, "0-100 s", 1],
              [car.topSpeed, "km/h", 0],
            ].map(([v, l, d]) => (
              <div key={String(l)} className="rounded-2xl border border-white/10 p-4">
                <p className="font-display text-3xl font-bold">
                  <Count key={car.id + String(l)} to={Number(v)} decimals={Number(d)} />
                </p>
                <p className="mt-1 text-xs text-chalk/50">{l}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 mb-3 text-sm text-chalk/60">
            Color: <span className="text-chalk">{tint.name}</span>
          </p>
          <div className="flex gap-3">
            {item.colors.map((c, k) => (
              <button
                key={c.name}
                onClick={() => setColor(k)}
                aria-label={c.name}
                className={`h-11 w-11 rounded-full border-2 transition-transform ${k === color ? "scale-110 border-volt" : "border-transparent"}`}
                style={{ background: k === 0 ? "linear-gradient(135deg,#888,#333)" : swatch(c.hue) }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-chalk/40">Simulación de color sobre la foto.</p>
          <a href="#test-drive" className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 transition-colors hover:bg-chalk hover:text-night">
            Probarlo en ruta →
          </a>
        </div>
      </div>
    </section>
  );
}
