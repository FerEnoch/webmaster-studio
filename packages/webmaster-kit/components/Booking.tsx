/**
 * BOOKING — la conversion principal, en pasos.
 *
 * 1) Que queres + tus datos
 * 2) Horario disponible
 * 3) Confirmacion con <Ticket/>
 *
 * Sin backend: el submit SIMULA y deja TODO el estado visible (panel de
 * resumen). El aviso "Demo: no se envian datos" esta siempre a la vista.
 *
 * Es una isla React. La conversion principal la monta el sitio con
 * `client:load` (NO `client:visible`): antes de hidratar hay una ventana en la
 * que el submit nativo hace GET a la misma URL y borra lo que el usuario
 * escribio.
 */

import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import Ticket from "./Ticket";
import { waLink } from "@lib/whatsapp";
import type { CatalogItem, Slot } from "@lib/types";

export interface BookingProps {
  brand: string;
  title: string;
  kicker?: string;
  body?: string;
  /** Nombres de los pasos (3). */
  steps: string[];
  /** Paso 1: que se agenda. */
  options: CatalogItem[];
  /** Paso 2: horarios. */
  slots: Slot[];
  /** Aviso de demo. */
  demoNotice: string;
  /** WhatsApp para derivar la operacion. */
  whatsapp: { phone: string; template: string };
  /** Titulo del bloque de preparacion del paso 1. */
  preparationTitle?: string;
  /** Texto del boton final. */
  confirmLabel?: string;
}

type Form = { name: string; phone: string; email: string; notes: string };

const EMPTY: Form = { name: "", phone: "", email: "", notes: "" };

/** Codigo de ticket a partir del hash de la seleccion. */
function makeCode(brand: string, seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  // Prefijo con la inicial de cada palabra: "CLINICA AURA" -> "CA".
  const prefix =
    brand
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.replace(/[^A-Za-z]/g, "").charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "WM";
  return `${prefix}-${String(hash).padStart(5, "0")}`;
}

export default function Booking({
  brand,
  title,
  kicker,
  body,
  steps,
  options,
  slots,
  demoNotice,
  whatsapp,
  preparationTitle = "Como prepararte",
  confirmLabel = "Confirmar",
}: BookingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [optionId, setOptionId] = useState<string>(options[0]?.id ?? "");
  const [slotId, setSlotId] = useState<string>("");
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string>("");

  const option = useMemo(() => options.find((o) => o.id === optionId), [options, optionId]);
  const slot = useMemo(() => slots.find((s) => s.id === slotId), [slots, slotId]);

  const set =
    (key: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const whatsappText = whatsapp.template
    .replace("{estudio}", option?.title ?? "")
    .replace("{fecha}", slot ? `${slot.day} ${slot.time}` : "")
    .replace("{nombre}", form.name || "mi turno");
  const whatsappHref = waLink(whatsapp.phone, whatsappText);

  const goToSlot = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Completa tu nombre y tu telefono para continuar.");
      return;
    }
    setError("");
    setStep(2);
  };

  const confirm = () => {
    if (!slot) {
      setError("Elegi un horario para continuar.");
      return;
    }
    setError("");
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setSlotId("");
    setForm(EMPTY);
    setError("");
  };

  const code = makeCode(brand, `${optionId}|${slotId}|${form.phone}`);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      {/* ── Columna principal: los pasos ───────────────────────── */}
      <div className="wm-card">
        {kicker ? <p className="wm-kicker">{kicker}</p> : null}
        <h3 className="wm-display mt-4 text-2xl leading-tight">{title}</h3>
        {body ? <p className="mt-3 text-sm text-muted">{body}</p> : null}

        <ol className="mb-8 mt-8 flex flex-wrap gap-2">
          {steps.map((name, i) => {
            const n = (i + 1) as 1 | 2 | 3;
            const state = step === n ? "current" : step > n ? "done" : "todo";
            return (
              <li
                key={name}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                  state === "todo"
                    ? "border-line text-muted"
                    : "border-accent text-accent"
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

        {/* ── Paso 1: qué + datos ───────────────────────────── */}
        {step === 1 ? (
          <form onSubmit={goToSlot}>
            <fieldset>
              <legend className="wm-kicker mb-4">1 · Que queres agendar</legend>
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
                      name="option"
                      value={o.id}
                      checked={optionId === o.id}
                      onChange={() => setOptionId(o.id)}
                      className="sr-only"
                    />
                    <span className="flex items-start justify-between gap-3">
                      <span className="wm-display text-lg leading-tight">{o.title}</span>
                      {o.badge ? <span className="wm-chip shrink-0">{o.badge}</span> : null}
                    </span>
                    <span className="mt-2 block text-sm text-muted">{o.body}</span>
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
                <p className="wm-kicker mb-3">{preparationTitle}</p>
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

            <fieldset className="mt-8">
              <legend className="wm-kicker mb-4">Tus datos</legend>
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
                  <span className="text-muted">Telefono</span>
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
                  <span className="text-muted">Nota para el equipo (opcional)</span>
                  <input
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Lo que te interesa"
                    className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                  />
                </label>
              </div>
            </fieldset>

            <button type="submit" className="wm-btn mt-8 w-full">
              {steps[1] ?? "Ver horarios"}
            </button>
          </form>
        ) : null}

        {/* ── Paso 2: horario ───────────────────────────────── */}
        {step === 2 ? (
          <div>
            <p className="wm-kicker mb-4">2 · {steps[1] ?? "Elegi un horario"}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {slots.map((s) => {
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
                      <span className={`text-xs ${s.places <= 3 ? "text-accent" : "text-muted"}`}>
                        {s.places <= 3 ? `Quedan ${s.places}` : `${s.places} libres`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(1)} className="wm-btn w-full sm:w-auto">
                Volver
              </button>
              <button type="button" onClick={confirm} className="wm-btn w-full sm:w-auto">
                {confirmLabel}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Paso 3: ticket ────────────────────────────────── */}
        {step === 3 && option && slot ? (
          <div className="text-center">
            <p className="wm-display text-4xl">Listo</p>
            <p className="mt-3 text-muted">
              Te guardamos el lugar. Lleva este pase y el DNI.
            </p>

            <div className="mt-8">
              <Ticket
                brand={brand}
                title={steps[2] ?? "Turno confirmado"}
                subtitle={option.title}
                code={code}
                stamp="CONFIRMADO"
                rows={[
                  { label: "Nombre", value: form.name },
                  { label: "Telefono", value: form.phone },
                  { label: "Dia", value: slot.day },
                  { label: "Horario", value: slot.time },
                  { label: "Estudio", value: option.title },
                ]}
                note={option.points?.length ? `Preparacion: ${option.points[0]}` : undefined}
                demoNotice={demoNotice}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a href={whatsappHref} className="wm-btn">
                Mandar por WhatsApp
              </a>
              <button type="button" onClick={reset} className="wm-btn wm-btn--ghost">
                Sacar otro turno
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Resumen: TODO el estado visible ───────────────────── */}
      <aside className="wm-card h-fit">
        <p className="wm-kicker">Resumen de la simulacion</p>
        <dl className="mt-5 grid gap-3 text-sm">
          {[
            ["Estado", step === 3 ? "Confirmado (demo)" : `Paso ${step} de 3`],
            ["Que agendo", option?.title ?? "-"],
            ["Preparacion", option?.points?.length ? `${option.points.length} requisito(s)` : "-"],
            ["Nombre", form.name || "-"],
            ["Telefono", form.phone || "-"],
            ["Email", form.email || "-"],
            ["Nota", form.notes || "-"],
            ["Dia", slot?.day ?? "-"],
            ["Horario", slot?.time ?? "-"],
            ["Codigo", step === 3 ? code : "-"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <a
          href={whatsappHref}
          className="wm-btn mt-6 w-full"
        >
          Continuar por WhatsApp
        </a>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          {demoNotice} Esta pantalla muestra exactamente lo que se guardaria; en
          produccion se conecta a un backend y se envia el turno por email y
          WhatsApp.
        </p>
      </aside>
    </div>
  );
}
