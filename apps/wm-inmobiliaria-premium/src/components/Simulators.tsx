import { useState } from "react";
import { alquilerSugerido, cuotaMensual, estimarValuacion } from "../lib/experiences";
import { formatPrice, type Property } from "../lib/properties";

/**
 * Simulaciones locales: tasación, cuota y visita. No piden datos personales,
 * no hacen red, no guardan ni envían nada. Todo cálculo ocurre en el navegador.
 */
export default function Simulators({ property }: { property: Property }) {
  const [m2, setM2] = useState(property.m2);
  const [entrada, setEntrada] = useState(30);
  const [tasa, setTasa] = useState(8);
  const [anos, setAnos] = useState(20);
  const [dia, setDia] = useState("Sábado");
  const [turno, setTurno] = useState("11:00");
  const [resultadoVisita, setResultadoVisita] = useState<string | null>(null);

  const valuacion = estimarValuacion(m2, property.type, property.barrio);
  const precioUSD = property.currency === "USD" ? property.price : Math.round(property.price / 1200);
  const cuota = cuotaMensual(precioUSD, entrada, tasa, anos);
  const alquiler = alquilerSugerido(precioUSD, property.currency);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <form
        data-simulator-valuacion
        aria-label="Simulador de valuación"
        onSubmit={(e) => e.preventDefault()}
        className="rounded-[24px] bg-sand p-6"
      >
        <p className="text-xs tracking-[0.2em] text-ink/50 uppercase">Tasación orientativa</p>
        <h3 className="mt-2 font-serif text-2xl">¿Cuánto vale una así?</h3>
        <label className="mt-4 block text-sm">
          Superficie (m²)
          <input
            type="number"
            min={20}
            max={10000}
            value={m2}
            data-valuacion-m2
            onChange={(e) => setM2(Math.max(20, Number(e.target.value) || 20))}
            className="mt-2 w-full rounded-2xl border border-ink/15 bg-white/80 px-4 py-3"
          />
        </label>
        <p data-valuacion-resultado className="mt-4 rounded-2xl bg-ink p-4 text-sm text-ivory" aria-live="polite">
          Estimación sintética: USD {valuacion.toLocaleString("es-AR")} para {m2} m² en {property.barrio}. No reemplaza una tasación profesional.
        </p>
        <p className="mt-3 text-xs text-ink/55">Simulación local. No se guarda ni se envía nada.</p>
      </form>

      <form
        data-simulator-credito
        aria-label={property.op === "Alquiler" ? "Simulador de alquiler" : "Simulador de crédito"}
        onSubmit={(e) => e.preventDefault()}
        className="rounded-[24px] bg-sand p-6"
      >
        <p className="text-xs tracking-[0.2em] text-ink/50 uppercase">
          {property.op === "Alquiler" ? "Alquiler sugerido" : "Cuota hipotecaria"}
        </p>
        <h3 className="mt-2 font-serif text-2xl">
          {property.op === "Alquiler" ? "¿Cuánto saldría alquilarla?" : "¿Cuánto pagarías por mes?"}
        </h3>
        {property.op === "Alquiler" ? (
          <p data-credito-resultado className="mt-4 rounded-2xl bg-ink p-4 text-sm text-ivory" aria-live="polite">
            Alquiler sintético sugerido: {property.currency} {alquiler.toLocaleString("es-AR")} por mes. Precio publicado: {formatPrice(property)}.
          </p>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <label>
                Entrada %
                <input type="number" min={0} max={90} value={entrada} data-credito-entrada onChange={(e) => setEntrada(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-ink/15 bg-white/80 px-3 py-2" />
              </label>
              <label>
                Tasa %
                <input type="number" min={0} max={30} step={0.5} value={tasa} data-credito-tasa onChange={(e) => setTasa(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-ink/15 bg-white/80 px-3 py-2" />
              </label>
              <label>
                Años
                <input type="number" min={5} max={30} value={anos} data-credito-anos onChange={(e) => setAnos(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-ink/15 bg-white/80 px-3 py-2" />
              </label>
            </div>
            <p data-credito-resultado className="mt-4 rounded-2xl bg-ink p-4 text-sm text-ivory" aria-live="polite">
              Cuota sintética: USD {cuota.toLocaleString("es-AR")}/mes con {entrada}% de entrada a {anos} años. Solo una guía, sin bancos ni datos reales.
            </p>
          </>
        )}
        <p className="mt-3 text-xs text-ink/55">Cálculo en tu navegador. Sin red, sin cuentas, sin historial.</p>
      </form>

      <form
        data-simulator-visita
        aria-label="Simulador de visita"
        onSubmit={(e) => {
          e.preventDefault();
          setResultadoVisita(`Listo: tu visita simulada quedó para el ${dia} a las ${turno}. No agendamos nada real ni pedimos tus datos.`);
        }}
        className="rounded-[24px] bg-ink p-6 text-ivory"
      >
        <p className="text-xs tracking-[0.2em] text-ivory/50 uppercase">Coordinar visita (demo)</p>
        <h3 className="mt-2 font-serif text-2xl">Probá el flujo completo</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <label>
            Día
            <select value={dia} onChange={(e) => setDia(e.target.value)} data-visita-dia className="mt-2 w-full rounded-2xl border border-ivory/20 bg-transparent px-3 py-2">
              {["Sábado", "Domingo", "Lunes", "Martes"].map((d) => <option key={d} className="text-black">{d}</option>)}
            </select>
          </label>
          <label>
            Turno
            <select value={turno} onChange={(e) => setTurno(e.target.value)} data-visita-turno className="mt-2 w-full rounded-2xl border border-ivory/20 bg-transparent px-3 py-2">
              {["10:00", "11:00", "15:30", "17:00"].map((t) => <option key={t} className="text-black">{t}</option>)}
            </select>
          </label>
        </div>
        <button type="submit" data-visita-confirmar className="mt-4 w-full rounded-full bg-brass px-4 py-3 text-sm text-white">
          Simular reserva
        </button>
        {resultadoVisita && (
          <p data-visita-resultado className="mt-4 rounded-2xl bg-ivory/10 p-4 text-sm" aria-live="polite">
            {resultadoVisita}
          </p>
        )}
        <p className="mt-3 text-xs text-ivory/55">Aviso de demo: no hay atención comercial ni envío de datos.</p>
      </form>
    </div>
  );
}
