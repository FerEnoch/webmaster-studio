/**
 * RESERVA — la conversión principal de LUMEN.
 *
 * Un solo funnel con dos ramas (tratamiento / clase) que termina en el
 * TICKET del kit. Cuatro pasos:
 *
 *   1 · Qué querés   (estética o yoga)
 *   2 · Turno        (día, hora y lugares)
 *   3 · Tus datos y seña
 *   4 · Confirmación (pase animado)
 *
 * Sin backend: el submit SIMULA y deja TODO el estado visible en el panel de
 * resumen. El aviso "demo" está siempre a la vista.
 *
 * Es una isla React: `client:visible`.
 */

import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import Ticket from "./ui/Ticket";
import { rubroWhatsapp } from "@lib/whatsapp";
import type { CatalogItem, Slot } from "@lib/types";

export interface ReservaFlowProps {
  brand: string;
  title: string;
  kicker?: string;
  body?: string;
  /** Nombres de los pasos (4). */
  steps: string[];
  /** Paso 1: tratamientos + clases. */
  options: CatalogItem[];
  /** Paso 2: horarios. */
  slots: Slot[];
  /** Ids que pertenecen a la rama de yoga. */
  idsClases: string[];
  /** Turnos que corresponden a cada clase de yoga (id de clase -> turnos). */
  slotsPorClase: Record<string, string[]>;
  /** Aviso de demo. */
  demoNotice: string;
  /** Datos de la seña. */
  sena: { monto: string; nota: string };
}

type Rama = "estetica" | "yoga";
type Form = { nombre: string; telefono: string; email: string; nota: string };

const EMPTY: Form = { nombre: "", telefono: "", email: "", nota: "" };

const METODOS = [
  {
    id: "transferencia",
    label: "Transferencia (CBU que te enviamos por WhatsApp)",
    corto: "Transferencia",
  },
  { id: "efectivo", label: "Efectivo en el estudio al llegar", corto: "Efectivo" },
];

/** Código de pase a partir del hash de la selección. */
function makeCode(brand: string, seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  const prefix =
    brand
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.replace(/[^A-Za-z]/g, "").charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "LU";
  return `${prefix}-${String(hash).padStart(5, "0")}`;
}

export default function ReservaFlow({
  brand,
  title,
  kicker,
  body,
  steps,
  options,
  slots,
  idsClases,
  slotsPorClase,
  demoNotice,
  sena,
}: ReservaFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [rama, setRama] = useState<Rama>("estetica");
  const [optionId, setOptionId] = useState<string>("");
  const [slotId, setSlotId] = useState<string>("");
  const [metodo, setMetodo] = useState<string>(METODOS[0].id);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string>("");

  const esClase = useMemo(() => new Set(idsClases), [idsClases]);
  const visibles = useMemo(
    () => options.filter((o) => (rama === "yoga" ? esClase.has(o.id) : !esClase.has(o.id))),
    [options, rama, esClase],
  );

  const option = useMemo(() => options.find((o) => o.id === optionId), [options, optionId]);
  const slot = useMemo(() => slots.find((s) => s.id === slotId), [slots, slotId]);

  /**
   * Turnos que se pueden elegir: los de la clase de yoga elegida, o la
   * agenda de estética si lo que reservás es un tratamiento. Sin esto se
   * podía reservar "Descanso (sábado 10:00)" en un turno del lunes.
   */
  const slotsVisibles = useMemo(() => {
    if (!option) return slots;
    const propios = slotsPorClase[option.id];
    if (propios) {
      const permitidos = new Set(propios);
      return slots.filter((s) => permitidos.has(s.id));
    }
    const usados = new Set(Object.values(slotsPorClase).flat());
    return slots.filter((s) => !usados.has(s.id));
  }, [slots, option, slotsPorClase]);

  const horarioOpcion = useMemo(
    () => option?.meta?.find((m) => m.label === "Horario")?.value ?? "",
    [option],
  );

  const set =
    (key: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const cambiarRama = (nueva: Rama) => {
    setRama(nueva);
    setOptionId("");
    setError("");
  };

  const irAlTurno = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!optionId) {
      setError("Elegí un tratamiento o una clase para continuar.");
      return;
    }
    setError("");
    setSlotId("");
    setStep(2);
  };

  const irADatos = () => {
    if (!slot) {
      setError("Elegí un horario para continuar.");
      return;
    }
    setError("");
    setStep(3);
  };

  const confirmar = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError("Completá tu nombre y tu teléfono para confirmar.");
      return;
    }
    setError("");
    setStep(4);
  };

  const reiniciar = () => {
    setStep(1);
    setOptionId("");
    setSlotId("");
    setForm(EMPTY);
    setError("");
  };

  const code = makeCode(brand, `${optionId}|${slotId}|${form.telefono}`);
  const metodoCorto = METODOS.find((m) => m.id === metodo)?.corto ?? metodo;
  const whatsappHref = rubroWhatsapp("estetica", {
    servicio: option?.title ?? "",
    dia: slot ? `${slot.day} ${slot.time}` : "",
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      {/* ── Columna principal: los pasos ───────────────────────── */}
      <div className="wm-card">
        {kicker ? <p className="wm-kicker">{kicker}</p> : null}
        <h3 className="wm-display mt-4 text-2xl leading-tight">{title}</h3>
        {body ? <p className="mt-3 text-sm text-muted">{body}</p> : null}

        <ol className="mb-8 mt-8 flex flex-wrap gap-2">
          {steps.map((name, i) => {
            const n = (i + 1) as 1 | 2 | 3 | 4;
            const state = step === n ? "current" : step > n ? "done" : "todo";
            return (
              <li
                key={name}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                  state === "todo" ? "border-line text-muted" : "border-accent text-accent"
                }`}
              >
                <span className="tabular-nums font-bold">{n}</span>
                <span>{name}</span>
              </li>
            );
          })}
        </ol>

        {error ? (
          <p role="alert" className="mb-5 rounded-wm border border-accent px-4 py-3 text-sm text-accent">
            {error}
          </p>
        ) : null}

        {/* ── Paso 1: qué querés + rama ───────────────────────── */}
        {step === 1 ? (
          <form onSubmit={irAlTurno}>
            <fieldset>
              <legend className="wm-kicker mb-4">1 · Qué querés reservar</legend>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { id: "estetica" as Rama, label: "Un tratamiento", sub: "Estética facial, corporales y láser" },
                    { id: "yoga" as Rama, label: "Una clase", sub: "Por resultado: descanso, movilidad, fuerza o ansiedad" },
                  ]
                ).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => cambiarRama(r.id)}
                    aria-pressed={rama === r.id}
                    className={`rounded-wm border p-4 text-left transition-colors ${
                      rama === r.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                    }`}
                  >
                    <span className="wm-display block text-xl leading-tight">{r.label}</span>
                    <span className="mt-1 block text-sm text-muted">{r.sub}</span>
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {visibles.map((o) => (
                  <label
                    key={o.id}
                    className={`cursor-pointer rounded-wm border p-4 transition-colors ${
                      optionId === o.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={o.id}
                      checked={optionId === o.id}
                      onChange={() => {
                        setOptionId(o.id);
                        setSlotId("");
                      }}
                      className="sr-only"
                    />
                    <span className="flex items-start justify-between gap-3">
                      <span className="wm-display text-lg leading-tight">{o.title}</span>
                      {o.badge ? <span className="wm-chip shrink-0">{o.badge}</span> : null}
                    </span>
                    <span className="mt-2 block text-sm text-muted">{o.body}</span>
                    {o.meta?.length ? (
                      <span className="mt-3 block text-xs uppercase tracking-[0.14em] text-muted">
                        {o.meta.map((m) => `${m.label}: ${m.value}`).join(" · ")}
                      </span>
                    ) : null}
                    {o.price ? (
                      <span className="mt-3 block text-sm font-semibold text-accent">
                        {o.price.amount}
                        {o.price.note ? <span className="ml-1 font-normal text-muted">{o.price.note}</span> : null}
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </fieldset>

            {option?.points?.length ? (
              <div className="mt-6 rounded-wm border border-line p-4">
                <p className="wm-kicker mb-3">Antes de venir</p>
                <ul className="space-y-1.5 text-sm text-muted">
                  {option.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true" className="text-accent">→</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <button type="submit" className="wm-btn mt-8 w-full">
              {steps[1] ?? "Ver horarios"}
            </button>
          </form>
        ) : null}

        {/* ── Paso 2: turno ────────────────────────────────────── */}
        {step === 2 ? (
          <div>
            <p className="wm-kicker mb-4">2 · {steps[1] ?? "Elegí un horario"}</p>
            {option ? (
              <p className="mb-4 text-sm text-muted">
                {horarioOpcion ? (
                  <>
                    <strong className="text-fg">{option.title}</strong> · {horarioOpcion}.
                  </>
                ) : (
                  <strong className="text-fg">{option.title}</strong>
                )}{" "}
                Elegí el turno.
              </p>
            ) : null}
            <ul className="grid gap-3 sm:grid-cols-2">
              {slotsVisibles.map((s) => {
                const selected = slotId === s.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSlotId(s.id)}
                      className={`flex w-full items-center justify-between gap-4 rounded-wm border px-4 py-3 text-left transition-colors ${
                        selected ? "border-accent bg-soft" : "border-line hover:border-accent"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">{s.day}</span>
                        <span className="wm-display block text-xl">{s.time}</span>
                      </span>
                      <span className={`text-xs ${s.places <= 2 ? "text-accent" : "text-muted"}`}>
                        {s.places <= 2 ? `Quedan ${s.places}` : `${s.places} libres`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(1)} className="wm-btn wm-btn--ghost w-full sm:w-auto">
                Volver
              </button>
              <button type="button" onClick={irADatos} className="wm-btn w-full sm:w-auto">
                {steps[2] ?? "Tus datos"}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Paso 3: datos + seña ─────────────────────────────── */}
        {step === 3 ? (
          <form onSubmit={confirmar}>
            <p className="wm-kicker mb-4">3 · {steps[2] ?? "Tus datos y seña"}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-muted">Nombre y apellido</span>
                <input
                  required
                  value={form.nombre}
                  onChange={set("nombre")}
                  placeholder="Ana Gómez"
                  className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Teléfono</span>
                <input
                  required
                  type="tel"
                  value={form.telefono}
                  onChange={set("telefono")}
                  placeholder="11 1234 5678"
                  className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="ana@email.com"
                  className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Nota para el equipo (opcional)</span>
                <input
                  value={form.nota}
                  onChange={set("nota")}
                  placeholder="Lo que te interesa"
                  className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                />
              </label>
            </div>

            <fieldset className="mt-8 rounded-wm border border-line p-4">
              <legend className="wm-kicker px-2">Seña · {sena.monto}</legend>
              <p className="text-sm text-muted">{sena.nota}</p>
              <div className="mt-4 grid gap-2">
                {METODOS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-wm border p-3 text-sm transition-colors ${
                      metodo === m.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodo"
                      value={m.id}
                      checked={metodo === m.id}
                      onChange={() => setMetodo(m.id)}
                      className="mt-1 accent-[var(--wm-accent)]"
                    />
                    <span className="text-muted">{m.label}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">
                Demo: no se procesa ningún pago ni se pide datos bancarios. En producción se conecta a un medio de pago y a un backend.
              </p>
            </fieldset>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(2)} className="wm-btn wm-btn--ghost w-full sm:w-auto">
                Volver
              </button>
              <button type="submit" className="wm-btn w-full sm:w-auto">
                {steps[3] ?? "Confirmar"}
              </button>
            </div>
          </form>
        ) : null}

        {/* ── Paso 4: ticket ──────────────────────────────────── */}
        {step === 4 && option && slot ? (
          <div className="text-center">
            <p className="wm-display text-4xl">Listo</p>
            <p className="mt-3 text-muted">
              Te guardamos el lugar. Llevá este pase y el DNI.
            </p>

            <div className="mt-8">
              <Ticket
                brand={brand}
                title="Pase de reserva"
                subtitle={option.title}
                code={code}
                stamp="RESERVADO"
                rows={[
                  { label: "Nombre", value: form.nombre },
                  { label: "Teléfono", value: form.telefono },
                  { label: "Día", value: slot.day },
                  { label: "Horario", value: slot.time },
                  { label: "Reservaste", value: option.title },
                  { label: "Seña", value: `${sena.monto} (demo)` },
                  { label: "Forma de pago", value: metodoCorto },
                ]}
                note={option.points?.length ? `Traé: ${option.points[0]}` : undefined}
                demoNotice={demoNotice}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a href={whatsappHref} className="wm-btn">
                Mandar por WhatsApp
              </a>
              <button type="button" onClick={reiniciar} className="wm-btn wm-btn--ghost">
                Reservar otra cosa
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Resumen: TODO el estado visible ───────────────────── */}
      <aside className="wm-card h-fit">
        <p className="wm-kicker">Resumen de la simulación</p>
        <dl className="mt-5 grid gap-3 text-sm">
          {[
            ["Estado", step === 4 ? "Reservado (demo)" : `Paso ${step} de 4`],
            ["Rama", rama === "yoga" ? "Clase de yoga" : "Tratamiento de estética"],
            ["Qué reservaste", option?.title ?? "-"],
            ["Requisitos", option?.points?.length ? `${option.points.length} requisito(s)` : "-"],
            ["Nombre", form.nombre || "-"],
            ["Teléfono", form.telefono || "-"],
            ["Email", form.email || "-"],
            ["Nota", form.nota || "-"],
            ["Día", slot?.day ?? "-"],
            ["Horario", slot?.time ?? "-"],
            ["Seña", sena.monto],
            ["Forma de pago", metodoCorto],
            ["Código", step === 4 ? code : "-"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <a href={whatsappHref} className="wm-btn mt-6 w-full">
          Continuar por WhatsApp
        </a>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          {demoNotice} Esta pantalla muestra exactamente lo que se guardaría; en
          producción se conecta a un backend y la reserva llega por email y
          WhatsApp.
        </p>
      </aside>
    </div>
  );
}
