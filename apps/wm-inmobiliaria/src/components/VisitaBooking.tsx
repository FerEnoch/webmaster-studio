/**
 * VISITA — la conversion principal de CLAVE, en cuatro pasos.
 *
 *   1) Que propiedad te interesa
 *   2) Dia y hora
 *   3) Tus datos
 *   4) Confirmacion -> <Ticket/> (la firma del kit)
 *
 * Sin backend: el submit SIMULA y deja TODO el estado visible en el panel de
 * resumen. El aviso "Demo: no se envian datos" esta siempre a la vista.
 *
 * Es una isla React: `client:visible`.
 */

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import Ticket from "./ui/Ticket";
import { rubroWhatsapp } from "@lib/whatsapp";
import type { Slot } from "@lib/types";
import type { Propiedad } from "../content/inmobiliaria";

export interface VisitaBookingProps {
  brand: string;
  title: string;
  kicker?: string;
  body?: string;
  /** Nombres de los pasos (4). */
  steps: string[];
  /** Paso 1: las propiedades. */
  options: Propiedad[];
  /** Paso 2: los horarios. */
  slots: Slot[];
  /** Aviso de demo. */
  demoNotice: string;
  /** Texto del boton final. */
  confirmLabel?: string;
}

type Form = { name: string; phone: string; email: string; notes: string };

const EMPTY: Form = { name: "", phone: "", email: "", notes: "" };

/** Codigo de pase a partir de la seleccion: mismo pase, mismo codigo. */
function makeCode(brand: string, seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  const prefix =
    brand
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.replace(/[^A-Za-z]/g, "").slice(0, 3))
      .join("")
      .slice(0, 3)
      .toUpperCase() || "WM";
  return `${prefix}-${String(hash).padStart(5, "0")}`;
}

export default function VisitaBooking({
  brand,
  title,
  kicker,
  body,
  steps,
  options,
  slots,
  demoNotice,
  confirmLabel = "Confirmar la visita",
}: VisitaBookingProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [optionId, setOptionId] = useState<string>(options[0]?.id ?? "");
  const [slotId, setSlotId] = useState<string>("");
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string>("");

  // Preseleccion por query (?prop=<id>) para llegar desde una ficha.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prop = params.get("prop");
    if (prop && options.some((o) => o.id === prop)) setOptionId(prop);
  }, [options]);

  const option = useMemo(() => options.find((o) => o.id === optionId), [options, optionId]);
  const slot = useMemo(() => slots.find((s) => s.id === slotId), [slots, slotId]);

  // Los horarios agrupados por dia.
  const porDia = useMemo(() => {
    const map = new Map<string, Slot[]>();
    slots.forEach((s) => {
      const list = map.get(s.day) ?? [];
      list.push(s);
      map.set(s.day, list);
    });
    return Array.from(map.entries());
  }, [slots]);

  const set =
    (key: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  // WhatsApp prearmado por rubro (plantilla del kit):Property con zona,
  // nombre y turno, para que la conversacion empiece con los datos.
  const whatsappHref = rubroWhatsapp("inmobiliaria", {
    zona: option
      ? `${option.zona}, ${option.title}${slot ? `, ${slot.day} ${slot.time}` : ""}`
      : "",
  });

  const irAlTurno = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!option) {
      setError("Elegí una propiedad para continuar.");
      return;
    }
    setError("");
    setStep(2);
  };

  const irADatos = () => {
    if (!slot) {
      setError("Elegí un día y una hora para continuar.");
      return;
    }
    setError("");
    setStep(3);
  };

  const confirmar = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Completa tu nombre y tu teléfono para confirmar.");
      return;
    }
    setError("");
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setSlotId("");
    setForm(EMPTY);
    setError("");
  };

  const code = makeCode(brand, `${optionId}|${slotId}|${form.phone}`);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
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
          <p
            role="alert"
            className="mb-5 rounded-wm border border-accent px-4 py-3 text-sm text-accent"
          >
            {error}
          </p>
        ) : null}

        {/* ── Paso 1: que propiedad ─────────────────────────── */}
        {step === 1 ? (
          <form onSubmit={irAlTurno}>
            <fieldset>
              <legend className="wm-kicker mb-4">1 · Que propiedad te interesa</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {options.map((o) => (
                  <label
                    key={o.id}
                    className={`cursor-pointer rounded-wm border p-4 transition-colors ${
                      optionId === o.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="propiedad"
                      value={o.id}
                      checked={optionId === o.id}
                      onChange={() => setOptionId(o.id)}
                      className="sr-only"
                    />
                    <span className="flex items-start justify-between gap-3">
                      <span className="wm-display text-lg leading-tight">{o.title}</span>
                      {o.badge ? <span className="wm-chip shrink-0">{o.badge}</span> : null}
                    </span>
                    <span className="mt-2 block text-xs uppercase tracking-[0.14em] text-muted">
                      {o.zona} · {o.tipo} · {o.m2} m² · {o.ambientes} amb.
                    </span>
                    {o.price ? (
                      <span className="mt-3 block text-sm font-semibold text-accent">
                        {o.price.amount}
                        {o.price.note ? (
                          <span className="ml-1 font-normal text-muted">{o.price.note}</span>
                        ) : null}
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </fieldset>

            {option?.imperfecciones?.length ? (
              <div className="mt-6 rounded-wm border border-line p-4">
                <p className="wm-kicker mb-3">Imperfecciones publicadas</p>
                <ul className="space-y-1.5 text-sm text-muted">
                  {option.imperfecciones.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span aria-hidden="true" className="text-accent">
                        →
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <button type="submit" className="wm-btn mt-8 w-full">
              Ver horarios
            </button>
          </form>
        ) : null}

        {/* ── Paso 2: dia y hora ────────────────────────────── */}
        {step === 2 ? (
          <div>
            <p className="wm-kicker mb-4">2 · {steps[1] ?? "Elegí día y hora"}</p>

            <div className="grid gap-6">
              {porDia.map(([dia, lista]) => (
                <div key={dia}>
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">{dia}</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {lista.map((s) => {
                      const selected = slotId === s.id;
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => setSlotId(s.id)}
                            aria-pressed={selected}
                            className={`flex w-full items-center justify-between gap-4 rounded-wm border px-4 py-3 text-left transition-colors ${
                              selected
                                ? "border-accent bg-soft"
                                : "border-line hover:border-accent"
                            }`}
                          >
                            <span>
                              <span className="block text-sm font-semibold">{s.day}</span>
                              <span className="wm-display block text-xl">{s.time}</span>
                            </span>
                            <span className={`text-xs ${s.places <= 3 ? "text-accent" : "text-muted"}`}>
                              {s.places <= 3 ? `Quedan ${s.places}` : `${s.places} libres`}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(1)} className="wm-btn wm-btn--ghost w-full sm:w-auto">
                Volver
              </button>
              <button type="button" onClick={irADatos} className="wm-btn w-full sm:w-auto">
                Cargar mis datos
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Paso 3: tus datos ─────────────────────────────── */}
        {step === 3 ? (
          <form onSubmit={confirmar}>
            <fieldset>
              <legend className="wm-kicker mb-4">3 · {steps[2] ?? "Tus datos"}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-muted">Nombre y apellido</span>
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Ana Gomez"
                    className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-muted">Teléfono</span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
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
                  <span className="text-muted">Nota para el asesor (opcional)</span>
                  <input
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Lo que te interesa de la propiedad"
                    className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                  />
                </label>
              </div>
            </fieldset>

            <p className="mt-6 rounded-wm border border-line p-4 text-sm text-muted">
              {demoNotice} Vas a ver un pase con un código: es lo que se vería en producción.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(2)} className="wm-btn wm-btn--ghost w-full sm:w-auto">
                Volver
              </button>
              <button type="submit" className="wm-btn w-full sm:w-auto">
                {confirmLabel}
              </button>
            </div>
          </form>
        ) : null}

        {/* ── Paso 4: el pase ───────────────────────────────── */}
        {step === 4 && option && slot ? (
          <div className="text-center">
            <p className="wm-display text-4xl">Listo</p>
            <p className="mt-3 text-muted">
              Tu visita quedó agendada. Llevá este pase: con el código no te hacen esperar en
              la puerta.
            </p>

            <div className="mt-8">
              <Ticket
                brand={brand}
                title="Pase de visita"
                subtitle={option.title}
                code={code}
                stamp="AGENDADA"
                rows={[
                  { label: "Propiedad", value: option.title },
                  { label: "Zona", value: option.zona },
                  { label: "Dia", value: slot.day },
                  { label: "Horario", value: slot.time },
                  { label: "Nombre", value: form.name },
                  { label: "Telefono", value: form.phone },
                ]}
                note={
                  option.imperfecciones?.length
                    ? `Imperfecciones publicadas: ${option.imperfecciones.length}. Pedí el informe en la visita.`
                    : undefined
                }
                demoNotice={demoNotice}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a href={whatsappHref} className="wm-btn">
                Mandar por WhatsApp
              </a>
              <button type="button" onClick={reset} className="wm-btn wm-btn--ghost">
                Agendar otra visita
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Resumen: TODO el estado visible ───────────────────── */}
      <aside className="wm-card h-fit lg:sticky lg:top-28">
        <p className="wm-kicker">Resumen de la simulacion</p>
        <dl className="mt-5 grid gap-3 text-sm">
          {[
            ["Estado", step === 4 ? "Confirmado (demo)" : `Paso ${step} de 4`],
            ["Propiedad", option?.title ?? "-"],
            ["Zona", option?.zona ?? "-"],
            ["Tipo", option?.tipo ?? "-"],
            ["Dia", slot?.day ?? "-"],
            ["Horario", slot?.time ?? "-"],
            ["Nombre", form.name || "-"],
            ["Telefono", form.phone || "-"],
            ["Email", form.email || "-"],
            ["Nota", form.notes || "-"],
            ["Codigo", step === 4 ? code : "-"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4 border-b border-line pb-2"
            >
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <a href={whatsappHref} className="wm-btn mt-6 w-full">
          Continuar por WhatsApp
        </a>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          {demoNotice} Esta pantalla muestra exactamente lo que se guardaría; en producción se
          conecta a un backend y la visita se envía por email y WhatsApp.
        </p>
      </aside>
    </div>
  );
}
