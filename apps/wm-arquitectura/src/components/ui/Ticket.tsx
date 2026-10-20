/**
 * TICKET — la firma visual del portfolio.
 *
 * Un voucher/pase con codigo, datos, perforacion, codigo de barras y sello.
 * El mismo componente sirve para un turno de clinica, un test drive, una
 * seña de lavadero o una inscripcion: cambia el color de acento, no la forma.
 */

export interface TicketRow {
  label: string;
  value: string;
}

export interface TicketProps {
  /** Marca (arriba del ticket). */
  brand: string;
  /** Tipo de comprobante: "Pase de turno", "Reserva", "Voucher". */
  title: string;
  /** Bajada: estudio, servicio, modelo. */
  subtitle?: string;
  /** Datos que se imprimen. */
  rows: TicketRow[];
  /** Codigo alfanumerico (AUR-4821). */
  code: string;
  /** Texto del sello: "CONFIRMADO", "PAGO". */
  stamp?: string;
  /** Nota al pie. */
  note?: string;
  /** Aviso de demo (la app no manda datos). */
  demoNotice?: string;
}

/** Barras deterministas a partir del codigo: mismo ticket, mismo dibujo. */
function bars(code: string, count = 26): number[] {
  let seed = 0;
  for (let i = 0; i < code.length; i += 1) seed += code.charCodeAt(i);
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) {
    seed = (seed * 31 + i * 17) % 997;
    out.push(seed % 3 === 0 ? 3 : 1.5);
  }
  return out;
}

export default function Ticket({
  brand,
  title,
  subtitle,
  rows,
  code,
  stamp = "CONFIRMADO",
  note,
  demoNotice,
}: TicketProps) {
  return (
    <div className="wm-ticket relative mx-auto w-full max-w-sm">
      <div className="overflow-hidden rounded-wm-lg bg-fg text-bg">
        <div className="flex items-start justify-between gap-4 p-6">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent">{brand}</p>
            <p className="wm-display mt-2 text-4xl leading-none">{title}</p>
            {subtitle ? <p className="mt-3 text-lg opacity-80">{subtitle}</p> : null}
          </div>
          {stamp ? (
            <span
              className="wm-ticket-stamp flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-accent text-center text-[0.55rem] font-bold uppercase tracking-[0.16em] text-accent"
              aria-hidden="true"
            >
              {stamp}
            </span>
          ) : null}
        </div>

        <dl className="grid gap-3 px-6 pb-6">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-6 border-b border-black/20 pb-2">
              <dt className="text-xs uppercase tracking-[0.14em] opacity-60">{row.label}</dt>
              <dd className="text-right text-sm font-semibold">{row.value}</dd>
            </div>
          ))}
        </dl>

        {/* Perforacion + codigo de barras */}
        <div className="relative border-t border-dashed border-black/25 px-6 py-5">
          <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-bg" aria-hidden="true" />
          <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-bg" aria-hidden="true" />
          <div className="flex items-center justify-between gap-4">
            <div className="wm-ticket-bar flex items-end gap-[2px]" aria-hidden="true">
              {bars(code).map((w, i) => (
                <span key={i} style={{ width: w, height: 38 }} className="bg-bg" />
              ))}
            </div>
            <span className="font-mono text-sm tracking-[0.2em]">{code}</span>
          </div>
        </div>
      </div>

      {/* Sello */}
      {note ? <p className="mt-4 text-center text-sm opacity-70">{note}</p> : null}
      {demoNotice ? (
        <p className="mt-2 text-center text-xs opacity-50">{demoNotice}</p>
      ) : null}
    </div>
  );
}
