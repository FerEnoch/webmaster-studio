# Webmaster Studio

Portfolio freelance y **demos de rubro** con Astro, React y Tailwind. Un sitio
estático reúne el portfolio en `/`, el catálogo en `/demos/` y cada demo en
`/demos/<slug>/`, sin cambiar de dominio.

Actualmente hay doce apps independientes: once demos agrupadas en siete familias
y el portfolio madre. El catálogo deriva del registro, no de una cantidad fija:

| Familia | Demos actuales |
| --- | --- |
| Concesionario | Autos nuevos y usados |
| Lavadero + bar | Lavadero y premium Gloss & Glass |
| Estética | Estética y yoga |
| Educación | Universidad privada |
| Inmobiliaria | Propiedades y Estudio Real State, con tour fotográfico y asoleamiento 3D |
| Arquitectura | Estudio y edición premium con 3D/tour |
| Locales y tiendas | Catalogo online (Telar) en `/demos/locales-catalogo/` y Ecommerce (TRAMA) en `/demos/tiendas-ecommerce/` |

## Empezar en local

Usá **Node 22.22.0** (`.node-version` / `.nvmrc`) y **pnpm 12.11.2**
(`packageManager`). Instalá todas las dependencias una vez desde la raíz:

```sh
pnpm install --frozen-lockfile
pnpm dev                           # portfolio: http://localhost:3027
pnpm run dev:concesionario         # app de referencia: http://localhost:3021
```

| App | Puerto | Alias local |
| --- | --- | --- |
| `wm-concesionario` | 3021 | `pnpm run dev:concesionario` |
| `wm-lavadero` | 3022 | `pnpm run dev:lavadero` |
| `wm-lavadero-premium` | 3031 | `pnpm run dev:lavadero-premium` |
| `wm-estetica` | 3023 | `pnpm run dev:estetica` |
| `wm-universidad` | 3024 | `pnpm run dev:universidad` |
| `wm-inmobiliaria` | 3025 | `pnpm run dev:inmobiliaria` |
| `wm-inmobiliaria-premium` | 3033 | `pnpm run dev:inmobiliaria-premium` |
| `wm-arquitectura` | 3026 | `pnpm run dev:arquitectura` |
| `wm-arquitectura-premium` | 3032 | `pnpm run dev:arquitectura-premium` |
| `wm-locales-catalogo` | 3028 | `pnpm run dev:locales-catalogo` |
| `wm-tiendas-ecommerce` | 3029 | `pnpm run dev:tiendas-ecommerce` |
| `wm-portfolio` | 3027 | `pnpm run dev:portfolio` |

Cada alias `dev:<id>` conserva su equivalente `build:<id>` para compilar una app
independiente. `pnpm build:apps` conserva el build recursivo del workspace;
ninguno de esos comandos prepara por sí solo la publicación integrada.
Estudio Real State se abre en `http://127.0.0.1:3033/demos/inmobiliaria-premium/`.
Para compilarla sola: `pnpm run build:inmobiliaria-premium`.

## Compilar y recorrer todo el sitio

```sh
node --test scripts/*.test.mjs
pnpm test:e2e:selection
pnpm build --check
pnpm check:site
pnpm preview                       # http://127.0.0.1:4321
```

`pnpm build` siempre ensambla un **`dist/` completo**, pero compila solo las apps
cuyos inputs cambiaron o cuyos outputs verificados faltan. `--check` agrega el
Astro check de las apps afectadas. Una caché fría/corrupta compila lo necesario;
una caché válida sin cambios reutiliza todo. Cambiar una demo no compila las
otras; agregar una demo actualiza también el catálogo. Cambios de dependencias,
configuración compartida u origen canónico invalidan sus consumidores.

`PUBLIC_SITE_URL` vale por defecto `https://webmaster-studio.pages.dev`. Para un
dominio propio, usá el mismo origen HTTP(S), sin ruta, en build, checker y CI.
Cambiarlo requiere un nuevo build: los outputs del origen anterior no se reutilizan.
El script raíz no carga archivos de entorno. Más detalles en [builds](docs/builds.md).

El preview integrado permite cruzar entre apps; las rutas desconocidas devuelven
404 real. Para acceso remoto local: `pnpm preview --host 0.0.0.0`. Los enlaces
entre apps fuerzan navegación completa; las transiciones de Astro quedan dentro
de cada app.

## Pruebas de navegador

Después del build integrado, descargá el Chromium fijado y ejecutá:

```sh
pnpm exec playwright install chromium
pnpm test:e2e
# Opt-in después del último build exitoso de la misma ejecución:
E2E_SCOPE=affected pnpm test:e2e
```

Por defecto se prueban todas las rutas en desktop y móvil. CI usa la selección
de apps afectadas; una caché fría o un reporte inválido activa todas. Un no-op
válido deja skips explícitos, no significa cobertura completa. El dispatch manual
de CI siempre ejecuta todas. Los medios y fuentes externos se bloquean para
pruebas deterministas: su disponibilidad no está verificada. Ver [E2E](docs/e2e.md)
para alcance, dependencias de Linux y reportes/trazas fuera del checkout.

## Agregar otra demo o familia

1. Consultá `node scripts/new-app.mjs --help`; creá una app con ID/puerto libres
   desde `packages/webmaster-kit/app-template/`, no copiando otra demo.
2. Escribí sus páginas y contenido; registrá su `rubroId` y `/demos/<slug>/` en
   `packages/webmaster-kit/rubros.ts`. Las variantes comparten familia, no app.
3. Agregá aliases locales y el importer al lockfile con el pnpm fijado. No
   sincronices las copias del kit de todas las demos existentes.
4. Ejecutá las verificaciones anteriores y revisá el preview integrado.

La [guía del catálogo](docs/catalogue.md) explica agrupación y deep links;
[builds](docs/builds.md) detalla el alta, invalidación y eliminación de apps.

## Publicar con GitHub Actions y Cloudflare Pages

**Actions compila y prueba; Wrangler sube exactamente ese `dist/`.** Desactivá
los builds automáticos de Git de Cloudflare: no hay una segunda compilación ni
se supone que Pages espere checks externos.

- [ ] Prepará el repositorio personal `ferenoch/webmaster-studio` y su rama `main`.
- [ ] Creá un proyecto Pages de Direct Upload, o desactivá builds de producción
      y previews de uno ya vinculado a Git.
- [ ] Configurá las variables de repositorio `PUBLIC_SITE_URL`,
      `CLOUDFLARE_PAGES_PROJECT` y `CLOUDFLARE_DEPLOY_ENABLED` (inicialmente `false`).
- [ ] Protegé `main` con el check **Build, routes and browsers** y configurá el
      environment `production` con aprobación y acceso solo desde `main`.
- [ ] Guardá `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` como secrets de ese
      environment. Nunca guardes tokens en archivos del repositorio.
- [ ] Solo después de conectar la cuenta, habilitá `CLOUDFLARE_DEPLOY_ENABLED=true`
      y verificá el primer upload y sus rutas reales.

Con deploy desactivado, CI funciona y el job de publicación queda **skipped**, no
publicado. La [guía de despliegue](docs/deployment.md) contiene los permisos,
checks exactos, retención, troubleshooting y rollback completo. Esta configuración
no crea por sí sola cuentas, proyectos, DNS ni publicaciones remotas.

## Kit, fuentes y contenido de demostración

El kit canónico en `packages/webmaster-kit/` aporta tipos, componentes, tokens,
helpers de WhatsApp y medios. Se copia a cada demo; el portfolio reexporta el
catálogo canónico. Se conservan como referencias la [guía del kit](packages/webmaster-kit/README.md),
el [esqueleto canónico](packages/webmaster-kit/app-template/) y el
[scaffolder](scripts/new-app.mjs). Los medios conservan sus hosts originales,
Mixkit y Unsplash; no se atribuye su autoría al proyecto.

Marcas, precios, profesionales y sedes son ficticios y deben identificarse como
demo. Formularios y reservas son simulaciones: no envían datos. Para contenido
argentino, conservá precios finales con impuestos, enlaces a Defensa del
Consumidor y botón de arrepentimiento/baja cuando corresponda.
