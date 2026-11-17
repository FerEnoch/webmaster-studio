/**
 * TEST DRIVE — la conversion principal, en pasos.
 *
 * 1) La unidad que queres probar + tus datos
 * 2) El turno (dia y hora)
 * 3) El pase: <Ticket/> del kit + CTA a WhatsApp con el mensaje prearmado
 *    del rubro (`rubroWhatsapp` de `@lib/whatsapp`).
 *
 * Sin backend: el submit SIMULA y deja TODO el estado visible en el panel de
 * resumen. El aviso "Demo: no se envian datos" esta siempre a la vista.
 *
 * Es una isla React: `client:visible`.
 */

import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import Ticket from "./ui/Ticket";
import { rubroWhatsapp } from "@lib/whatsapp";
import { ars, km, type Auto } from "../content/concesionario";
import type { Slot } from "@lib/types";

export interface TestDriveBookingProps {
  brand: string;
  title: string;
  kicker?: string;
  body?: string;
  /** Nombres de los pasos (3). */
  steps: string[];
  /** Stock: lo que se puede probar. */
  autos: Auto[];
  /** Turnos disponibles. */
  slots: Slot[];
  /** Aviso de demo. */
  demoNotice: string;
  /** Texto del boton final. */
  confirmLabel?: string;
  /**
   * La unidad ya viene elegida (ficha de un auto): se muestra confirmada en
   * vez de una lista para elegir.
   */
  lockUnit?: boolean;
}

type Form = { name: string; phone: string; email: string; notes: string };

const EMPTY: Form = { name: "", phone: "", email: "", notes: "" };

/** Codigo de pase a partir de la seleccion (deterministico). */
function makeCode(brand: string, seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  const palabras = brand
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.replace(/[^A-Za-z]/g, ""));
  // "AUTOPISTA" -> "AU" · "CLINICA AURA" -> "CA"
  const prefix =
    (palabras.length > 1
      ? palabras.map((word) => word.charAt(0)).join("")
      : (palabras[0] ?? "").slice(0, 2))
      .slice(0, 2)
      .toUpperCase() || "WM";
  return `${prefix}-${String(hash).padStart(5, "0")}`;
}

export default function TestDriveBooking({
  brand,
  title,
  kicker,
  body,
  steps,
  autos,
  slots,
  demoNotice,
  confirmLabel = "Confirmar",
  lockUnit = false,
}: TestDriveBookingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [autoId, setAutoId] = useState<string>(autos[0]?.id ?? "");
  const [slotId, setSlotId] = useState<string>("");
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string>("");

  const auto = useMemo(() => autos.find((a) => a.id === autoId), [autos, autoId]);
  const slot = useMemo(() => slots.find((s) => s.id === slotId), [slots, slotId]);

  const set =
    (key: keyof Form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  /** WhatsApp: mensaje prearmado del rubro con la unidad y el turno. */
  const whatsappHref = rubroWhatsapp("concesionario", {
    modelo: auto
      ? `${auto.marca} ${auto.modelo} ${auto.version} ${auto.anio}${slot ? ` · test drive ${slot.day} ${slot.time}` : ""}`
      : "",
  });

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
      setError("Elegi un turno para continuar.");
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

  const code = makeCode(brand, `${autoId}|${slotId}|${form.phone}`);

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

        {/* ── Paso 1: unidad + datos ───────────────────────────── */}
        {step === 1 ? (
          <form onSubmit={goToSlot}>
            {lockUnit && auto ? (
              <div className="rounded-wm border border-accent bg-soft p-5">
                <p className="wm-kicker">La unidad que vas a probar</p>
                <p className="wm-display mt-3 text-lg leading-tight">
                  {auto.marca} {auto.modelo} {auto.version}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {auto.anio} · {auto.estado === "Nuevo" ? "0 km" : km(auto.km)} · {auto.caja} ·{" "}
                  {auto.sucursal}
                </p>
                <p className="mt-3 text-sm font-semibold text-accent">
                  {ars(auto.precio)}
                  <span className="ml-1 font-normal text-muted">final, IVA incluido</span>
                </p>
              </div>
            ) : (
              <fieldset>
                <legend className="wm-kicker mb-4">1 · Que auto queres probar</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {autos.map((a) => (
                    <label
                      key={a.id}
                      className={`cursor-pointer rounded-wm border p-4 transition-colors ${
                        autoId === a.id ? "border-accent bg-soft" : "border-line hover:border-accent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="auto"
                        value={a.id}
                        checked={autoId === a.id}
                        onChange={() => setAutoId(a.id)}
                        className="sr-only"
                      />
                      <span className="flex items-start justify-between gap-3">
                        <span className="wm-display text-lg leading-tight">
                          {a.marca} {a.modelo}
                        </span>
                        {a.badge ? <span className="wm-chip shrink-0">{a.badge}</span> : null}
                      </span>
                      <span className="mt-2 block text-sm text-muted">
                        {a.anio} · {a.estado === "Nuevo" ? "0 km" : km(a.km)} · {a.caja}
                      </span>
                      <span className="mt-3 block text-sm font-semibold text-accent">
                        {ars(a.precio)}
                        <span className="ml-1 font-normal text-muted">
                          final, IVA incluido
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {auto?.highlights.length ? (
              <div className="mt-6 rounded-wm border border-line p-4">
                <p className="wm-kicker mb-3">Lo que vas a probar</p>
                <ul className="space-y-1.5 text-sm text-muted">
                  {auto.highlights.map((p) => (
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
                  <span className="text-muted">Modelo que buscabas (opcional)</span>
                  <input
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Lo que te interesa comparar"
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

        {/* ── Paso 2: turno ─────────────────────────────────────── */}
        {step === 2 ? (
          <div>
            <p className="wm-kicker mb-4">2 · {steps[1] ?? "Elegi un turno"}</p>
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
                      <span className={`text-xs ${s.places <= 2 ? "text-accent" : "text-muted"}`}>
                        {s.places <= 2 ? `Quedan ${s.places}` : `${s.places} libres`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-5 text-xs text-muted">
              Los turnos son de 45 minutos y se toman en {auto?.sucursal ?? "la sucursal"}. Si
              no llegás a confirmar, el turno se libera.
            </p>

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

        {/* ── Paso 3: el pase ───────────────────────────────────── */}
        {step === 3 && auto && slot ? (
          <div className="text-center">
            <p className="wm-display text-4xl">Listo</p>
            <p className="mt-3 text-muted">
              Te guardamos el lugar. Mostrá este pase en el mostrador y te dan la
              llave del auto.
            </p>

            <div className="mt-8">
              <Ticket
                brand={brand}
                title="Pase de test drive"
                subtitle={`${auto.marca} ${auto.modelo} ${auto.version}`}
                code={code}
                stamp="RESERVADO"
                rows={[
                  { label: "Nombre", value: form.name },
                  { label: "Telefono", value: form.phone },
                  { label: "Auto", value: `${auto.marca} ${auto.modelo} ${auto.anio}` },
                  { label: "Dia", value: slot.day },
                  { label: "Horario", value: slot.time },
                  { label: "Sucursal", value: auto.sucursal },
                ]}
                note={
                  auto.estado === "Nuevo"
                    ? "Unidad 0 km: la prueba se hace con un acompañante de la casa."
                    : "Traé tu DNI y la licencia de conducir para la prueba."
                }
                demoNotice={demoNotice}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a href={whatsappHref} className="wm-btn">
                Mandar por WhatsApp
              </a>
              <button type="button" onClick={reset} className="wm-btn wm-btn--ghost">
                Reservar otro turno
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
            ["Auto", auto ? `${auto.marca} ${auto.modelo}` : "-"],
            ["Estado del auto", auto?.estado ?? "-"],
            ["Precio", auto ? ars(auto.precio) : "-"],
            ["Cuota estimada", auto ? `${ars(auto.cuota)}/mes` : "-"],
            ["Nombre", form.name || "-"],
            ["Telefono", form.phone || "-"],
            ["Email", form.email || "-"],
            ["Nota", form.notes || "-"],
            ["Dia", slot?.day ?? "-"],
            ["Horario", slot?.time ?? "-"],
            ["Sucursal", auto?.sucursal ?? "-"],
            ["Codigo", step === 3 ? code : "-"],
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
          {demoNotice} Esta pantalla muestra exactamente lo que se guardaria; en
          produccion se conecta a un backend y se envia la reserva por email y
          WhatsApp.
        </p>
      </aside>
    </div>
  );
}
