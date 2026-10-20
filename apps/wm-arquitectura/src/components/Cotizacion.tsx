/**
 * COTIZACION — la conversion principal de ESTUDIO TRAZO.
 *
 * Cuatro pasos punta a punta:
 *   1) Tipo de proyecto
 *   2) Superficie y alcance
 *   3) Tus datos
 *   4) Confirmacion -> <Ticket/> (el componente del kit)
 *
 * Sin backend: el submit SIMULA y deja TODO el estado visible en el panel de
 * resumen. El aviso "Demo: no se envían datos" esta siempre a la vista.
 *
 * Es una isla React: `client:visible`.
 */

import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import Ticket from "./ui/Ticket";
import { rubroWhatsapp } from "@lib/whatsapp";
import type { CatalogItem } from "@lib/types";
import type { ConversionArq } from "../content/arquitectura";

export interface CotizacionProps {
  brand: string;
  conversion: ConversionArq;
  /** Id del rubro para el mensaje de WhatsApp. */
  rubroId: string;
}

/** Código de consulta a partir del hash de la selección. */
function makeCode(brand: string, seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  // Prefijo con la inicial de cada palabra: "ESTUDIO TRAZO" -> "ET".
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

type Form = { name: string; phone: string; email: string; zona: string; notes: string };

const EMPTY: Form = { name: "", phone: "", email: "", zona: "", notes: "" };

export default function Cotizacion({ brand, conversion, rubroId }: CotizacionProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [optionId, setOptionId] = useState<string>(conversion.options[0]?.id ?? "");
  const [alcanceId, setAlcanceId] = useState<string>(conversion.slots[0]?.id ?? "");
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string>("");

  const option = useMemo(
    () => conversion.options.find((o) => o.id === optionId),
    [conversion.options, optionId],
  );
  const alcance = useMemo(
    () => conversion.alcances.find((a) => a.id === alcanceId),
    [conversion.alcances, alcanceId],
  );
  const slot = useMemo(
    () => conversion.slots.find((s) => s.id === alcanceId),
    [conversion.slots, alcanceId],
  );

  const set =
    (key: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const whatsappHref = rubroWhatsapp(rubroId, { tipo: option?.title ?? "un proyecto" });

  const goToAlcance = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!option) {
      setError("Elegí un tipo de proyecto para continuar.");
      return;
    }
    setError("");
    setStep(2);
  };

  const goToDatos = () => {
    if (!alcance) {
      setError("Elegí una escala de proyecto para continuar.");
      return;
    }
    setError("");
    setStep(3);
  };

  const confirm = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Completa tu nombre y tu teléfono para continuar.");
      return;
    }
    setError("");
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setForm(EMPTY);
    setError("");
  };

  const code = makeCode(brand, `${optionId}|${alcanceId}|${form.phone}`);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      {/* ── Columna principal: los pasos ───────────────────────── */}
      <div className="wm-card">
        <ol className="mb-8 flex flex-wrap gap-2">
          {conversion.steps.map((name, i) => {
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

        {/* ── Paso 1: tipo de proyecto ────────────────────────── */}
        {step === 1 ? (
          <form onSubmit={goToAlcance}>
            <fieldset>
              <legend className="wm-kicker mb-4">1 · Qué tipo de proyecto es</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {conversion.options.map((o: CatalogItem) => (
                  <label
                    key={o.id}
                    className={`cursor-pointer rounded-wm border p-4 transition-colors ${
                      optionId === o.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo"
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
                        {o.price.note ? (
                          <span className="ml-1 font-normal text-muted">{o.price.note}</span>
                        ) : null}
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </fieldset>

            {option?.points?.length ? (
              <div className="mt-6 rounded-wm border border-line p-4">
                <p className="wm-kicker mb-3">Qué incluye</p>
                <ul className="space-y-1.5 text-sm text-muted">
                  {option.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true" className="text-accent">
                        →
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <button type="submit" className="wm-btn mt-8 w-full">
              {conversion.steps[1] ?? "Ver alcances"}
            </button>
          </form>
        ) : null}

        {/* ── Paso 2: superficie y alcance ─────────────────────── */}
        {step === 2 ? (
          <div>
            <p className="wm-kicker mb-4">2 · {conversion.steps[1] ?? "Superficie y alcance"}</p>
            <ul className="grid gap-3">
              {conversion.slots.map((s) => {
                const a = conversion.alcances.find((x) => x.id === s.id);
                const selected = alcanceId === s.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setAlcanceId(s.id)}
                      className={`w-full rounded-wm border p-4 text-left transition-colors ${
                        selected ? "border-accent bg-soft" : "border-line hover:border-accent"
                      }`}
                    >
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="wm-display text-xl">{s.day}</span>
                        <span className="text-xs text-muted">{s.time}</span>
                      </span>
                      {a ? <span className="mt-2 block text-sm text-muted">{a.body}</span> : null}
                    </button>
                  </li>
                );
              })}
            </ul>

            {alcance ? (
              <div className="mt-6 rounded-wm border border-line p-4">
                <p className="wm-kicker mb-3">Qué incluye en esta escala</p>
                <ul className="space-y-1.5 text-sm text-muted">
                  {alcance.incluye.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true" className="text-accent">
                        →
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(1)} className="wm-btn w-full sm:w-auto">
                Volver
              </button>
              <button type="button" onClick={goToDatos} className="wm-btn w-full sm:w-auto">
                {conversion.steps[2] ?? "Cargar mis datos"}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Paso 3: tus datos ────────────────────────────────── */}
        {step === 3 ? (
          <form onSubmit={confirm}>
            <fieldset>
              <legend className="wm-kicker mb-4">3 · {conversion.steps[2] ?? "Tus datos"}</legend>
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
                  <span className="text-muted">Zona del proyecto</span>
                  <input
                    value={form.zona}
                    onChange={set("zona")}
                    placeholder="Palermo"
                    className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="text-muted">Que tenes en mente (opcional)</span>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Un terreno, una reforma, una fecha..."
                    className="mt-1 w-full rounded-wm border border-line bg-bg px-4 py-3 outline-none placeholder:text-muted focus:border-accent"
                  ></textarea>
                </label>
              </div>
            </fieldset>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(2)} className="wm-btn w-full sm:w-auto">
                Volver
              </button>
              <button type="submit" className="wm-btn w-full sm:w-auto">
                {conversion.steps[3] ?? "Confirmar"}
              </button>
            </div>
          </form>
        ) : null}

        {/* ── Paso 4: ticket ──────────────────────────────────── */}
        {step === 4 && option && alcance ? (
          <div className="text-center">
            <p className="wm-display text-4xl">Listo</p>
            <p className="mt-3 text-muted">
              Tu consulta quedó registrada con un número. Guardalo: es el que usa el estudio
              para ordenar el encargo.
            </p>

            <div className="mt-8">
              <Ticket
                brand={brand}
                title="Consulta de proyecto"
                subtitle={option.title}
                code={code}
                stamp="COTIZACIÓN"
                rows={[
                  { label: "Tipo", value: option.title },
                  { label: "Escala", value: alcance.title },
                  { label: "Plazo estimado", value: slot?.time ?? alcance.semanas },
                  { label: "Nombre", value: form.name },
                  { label: "Teléfono", value: form.phone },
                  { label: "Zona", value: form.zona || "A definir" },
                ]}
                note={
                  form.notes
                    ? `Nota: ${form.notes}`
                    : "El estudio responde dentro de las 48 h hábiles de tu consulta."
                }
                demoNotice={conversion.demoNotice}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a href={whatsappHref} className="wm-btn">
                Mandar por WhatsApp
              </a>
              <button type="button" onClick={reset} className="wm-btn wm-btn--ghost">
                Cotizar otro proyecto
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
            ["Estado", step === 4 ? "Consultado (demo)" : `Paso ${step} de 4`],
            ["Tipo de proyecto", option?.title ?? "-"],
            ["Escala", alcance?.title ?? "-"],
            ["Plazo estimado", slot?.time ?? "-"],
            ["Nombre", form.name || "-"],
            ["Teléfono", form.phone || "-"],
            ["Email", form.email || "-"],
            ["Zona", form.zona || "-"],
            ["Nota", form.notes || "-"],
            ["Código", step === 4 ? code : "-"],
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
          {conversion.demoNotice} Esta pantalla muestra exactamente lo que se guardaría; en
          producción se conecta a un backend y la consulta llega por email y WhatsApp.
        </p>
      </aside>
    </div>
  );
}
