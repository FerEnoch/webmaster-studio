# 07 — Astro vs Next + Vercel gratis (T7 2026-10-20)

## Veredicto

Astro + islas para tus 7 vidrieras. Next solo si el rubro exige app con estado compartido, login o tiempo real.

Evidencia 2026: Astro 0-12KB JS vs Next 39-187KB; LCP 1.2s vs 1.8s en portfolio 10 páginas; Lighthouse 95-100 vs 85-95; build 8s vs 17s; 71% orígenes Astro con buenas Core Web Vitals vs 35% Next (HTTP Archive/CrUX ago-2026). Vercel docs 2026-06: Astro = static HTML por defecto, hidrata solo con `client:load/visible`; Next = Server/Client Components.

## Cuándo Astro

Contenido + 1-3 islas (Booking, VDP filtros, mapa, form). Reusás React actual como islas (`client:visible`) sin reescribir todo. Contenido en collections, `content.ts` → `src/content`. SEO limpio, `llms.txt`, JSON-LD directo.

## Cuándo Next

Turnera multi-paso con estado global, carrito/checkout, dashboard, auth. Si lo necesitás, mantené esa app en Next y el resto en Astro (híbrido).

## Vercel Hobby 2026 (gratis, pero ojo)

Incluye: 100GB Fast Data Transfer, 1M edge requests, 1M invocaciones, 4 CPU-hrs, 360GB-hrs memoria, 6.000 build-min, 200 proyectos, 100 deploys/día. Si excedés, se pausa 30 días (no factura). Funciones: 300s máx, 2GB/1vCPU, 1 región.

Restricción clave: Hobby = uso personal no comercial (fair use). Tu portfolio para conseguir clientes roza comercial: sirve para demos, pero sitios de clientes en prod deberían ir a Pro ($20/mes + overages $0.15/GB, $0.60/M invocaciones) o Cloudflare/Netlify si el margen es fino. No vendas “hosting gratis ilimitado”.

## Migración propuesta

1 sitio Astro con 7 colecciones (1 por rubro), layout + `Transition`, `PageHero`, `Booking`, `Ticket`, `LiveNow`, `grade` como islas. Medios propios en `public/`. Form → Vercel Function adyacente (sin adapter) o Formspree/Resend. Por rubro: `client:visible` solo donde hay interacción. Mantener `content.ts` como fuente.

Fuentes: vercel.com/docs (limits, hobby, astro-vs-next 2026-06-04), tech-insider, muszarski 2026-10-05, johal benchmark.
