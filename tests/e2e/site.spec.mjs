import { test, expect, hydrate } from './browser.mjs';
import { inventory, owner } from './inventory.mjs';
import { RUBROS, getRubroGroups } from '../../packages/webmaster-kit/rubros.ts';

const scope = inventory();
const groups = getRubroGroups();
const selected = (id) => scope.selected.some((app) => app.name === `wm-${id}`);

// Always runs, even when a valid warm no-op explicitly skips all app tests.
test('scope inventory is explicit', async ({}, info) => {
  const summary = { mode: process.env.E2E_SCOPE ?? 'all', reason: scope.reason,
    selectedApps: scope.selected.map((app) => app.name), skippedApps: scope.skipped.map((app) => app.name),
    selectedRoutes: scope.selectedRoutes, totalRoutes: scope.routes.length,
    externalScope: 'External media and Google Fonts are blocked, non-gating; local scripts/styles and uncaught JS gate.' };
  console.log(JSON.stringify(summary));
  await info.attach('route-inventory', { body: JSON.stringify(summary, null, 2), contentType: 'application/json' });
  expect(scope.routes.length).toBeGreaterThan(0);
});

for (const route of scope.routes) {
  const app = owner(route);
  test(`render and reload ${app.name} ${route}`, async ({ page }) => {
    test.skip(!scope.selected.includes(app), `Unchanged ${app.name}: ${scope.reason}`);
    for (const navigate of [() => page.goto(route), () => page.reload()]) {
      const response = await navigate();
      expect(response.status(), route).toBe(200);
      expect(response.headers()['content-type']).toContain('text/html');
      expect(new URL(page.url()).pathname).toBe(route);
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(/\S/);
      // Exercise viewport-triggered islands too, not just static SSR content.
      for (const island of await page.locator('astro-island[client="visible"]').all()) {
        await island.scrollIntoViewIfNeeded();
        await expect(island).not.toHaveAttribute('ssr');
      }
      const assets = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name));
      for (const asset of assets) {
        const url = new URL(asset);
        if (url.origin === new URL(page.url()).origin && url.pathname.includes('/_astro/')) {
          expect(url.pathname.startsWith(app.base + '_astro/'), `asset outside ${app.base}: ${url.pathname}`).toBe(true);
        }
      }
      const links = await page.locator('a[href]').evaluateAll((nodes) => nodes.map((node) => ({ href: node.href, reload: node.hasAttribute('data-astro-reload') })));
      for (const link of links) {
        const url = new URL(link.href);
        if (url.origin === new URL(page.url()).origin && owner(url.pathname) !== app) {
          expect(link.reload, `cross-app link must reload: ${route} -> ${url.pathname}`).toBe(true);
        }
      }
    }
  });
}

for (const app of scope.apps) {
  test(`real missing-page 404 ${app.name}`, async ({ page, request }) => {
    test.skip(!scope.selected.includes(app), `Unchanged ${app.name}`);
    const missing = app.base + '__e2e_missing__/';
    expect((await page.goto(missing)).status()).toBe(404);
    expect(new URL(page.url()).pathname).toBe(missing);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    expect((await request.get(app.base + '_astro/__e2e_missing__.js')).status()).toBe(404);
  });
}

async function catalogue(page, query = '') {
  expect((await page.goto('/demos/' + query)).status()).toBe(200);
  const group = page.getByRole('group', { name: 'Filtrar soluciones por industria' });
  await hydrate(group.getByRole('button').first());
  await expect(page.locator('[data-wm-filter-live]')).not.toBeEmpty();
  return group;
}

async function results(page, demos, filter = 'todos', name) {
  const ids = demos.map((demo) => demo.id);
  const cards = page.locator('[data-wm-rubro-card]');
  await expect(cards.filter({ visible: true })).toHaveCount(ids.length);
  for (const demo of RUBROS) {
    const card = page.locator(`[data-wm-rubro-card="${demo.id}"]`);
    await expect(card).toHaveAttribute('aria-hidden', String(!ids.includes(demo.id)));
    if (ids.includes(demo.id)) {
      await expect(card).toBeVisible();
      await expect(card.locator(`a[href="${demo.demoUrl}"]`).first()).toHaveAttribute('data-astro-reload', '');
    } else await expect(card).toBeHidden();
  }
  const count = ids.length;
  const announcement = filter === 'todos' ? `Mostrando las ${count} soluciones por industria.`
    : `Mostrando ${count} ${count === 1 ? 'solución' : 'soluciones'}: ${name}.`;
  await expect(page.locator('[data-wm-filter-live]')).toHaveText(announcement);
  await expect.poll(() => new URL(page.url()).searchParams.get('rubro')).toBe(filter === 'todos' ? null : filter);
}

test('hydrated family chips, counts, and all-results reset', async ({ page }) => {
  test.skip(!selected('portfolio'), 'Portfolio unchanged');
  const chips = await catalogue(page, '?source=e2e#catalogue');
  await expect(chips.getByRole('button')).toHaveCount(groups.length + 1);
  for (const name of ['Concesionarios', 'Multiservicios', 'Estética', 'Institucional y educativo', 'Inmobiliaria', 'Estudios profesionales']) {
    await expect(chips.getByRole('button', { name, exact: true })).toBeVisible();
  }
  await results(page, RUBROS);
  for (const group of groups) {
    const chip = chips.getByRole('button', { name: group.nombre, exact: true });
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await expect(chips.locator('[aria-pressed="true"]')).toHaveCount(1);
    await results(page, group.demos, group.id, group.nombre);
  }
  await chips.getByRole('button', { name: /^Todas/ }).click();
  await results(page, RUBROS);
  expect(new URL(page.url()).search).toBe('?source=e2e');
  expect(new URL(page.url()).hash).toBe('#catalogue');
});

for (const group of groups.filter((group) => ['lavadero', 'arquitectura'].includes(group.id))) {
  test(`family and premium deep links ${group.id}`, async ({ page }) => {
    test.skip(!selected('portfolio'), 'Portfolio unchanged');
    await catalogue(page, `?rubro=${group.id}`);
    await results(page, group.demos, group.id, group.nombre);
    for (const demo of group.demos.filter((demo) => demo.id !== group.id)) {
      const chips = await catalogue(page, `?rubro=${demo.id}&source=e2e#catalogue`);
      const family = chips.getByRole('button', { name: group.nombre, exact: true });
      await expect(family).toHaveAttribute('aria-pressed', 'true');
      await results(page, [demo], demo.id, demo.nombre);
      await page.reload();
      await hydrate(family);
      await results(page, [demo], demo.id, demo.nombre);
      await family.click();
      await results(page, group.demos, group.id, group.nombre);
      expect(new URL(page.url()).searchParams.get('source')).toBe('e2e');
      expect(new URL(page.url()).hash).toBe('#catalogue');
      await page.locator(`[data-wm-rubro-card="${demo.id}"] a[href="${demo.demoUrl}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`${demo.demoUrl}$`));
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    }
  });
}

test('studio home CTAs link directly to slash-terminated pages', async ({ page, request }) => {
  test.skip(!selected('portfolio'), 'Portfolio unchanged');
  expect((await page.goto('/')).status()).toBe(200);
  const destinations = {
    'Soluciones a medida': '/demos/',
    'Ver todas las demos': '/demos/',
    'Explorar soluciones a medida': '/demos/',
    'Ver el detalle de los servicios': '/servicios/',
    'Ver contacto': '/contacto/',
  };
  const main = page.getByRole('main');
  const hrefs = {};
  for (const name of Object.keys(destinations)) {
    hrefs[name] = await main.getByRole('link', { name, exact: true }).getAttribute('href');
  }
  expect(hrefs).toEqual(destinations);
  for (const href of new Set(Object.values(hrefs))) {
    const response = await request.get(href, { maxRedirects: 0 });
    expect(response.status(), href).toBe(200);
    expect(response.headers()['content-type'], href).toContain('text/html');
  }
});

test('studio home shows rubro tabs and opens the filtered catalogue', async ({ page }) => {
  test.skip(!selected('portfolio'), 'Portfolio unchanged');
  expect((await page.goto('/')).status()).toBe(200);
  const section = page.locator('#demos');
  await expect(section.getByRole('heading', { name: 'Soluciones a medida', exact: true })).toBeVisible();
  await expect(section).toContainText('Explorá las posibilidades de tu negocio o empresa a través de demos interactivas.');
  const tabs = section.getByRole('tab');
  await expect(tabs).toHaveCount(groups.length);
  for (const group of groups) {
    await expect(tabs.filter({ hasText: group.nombre }).first()).toBeVisible();
  }
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await expect(section.locator('[role="tabpanel"]')).toHaveCount(groups.length);
  const panels = section.getByRole('tabpanel');
  await expect(panels).toHaveCount(1);
  const visible = panels.first();
  await expect(visible.getByRole('heading', { name: 'Stock y fichas de vehículos', exact: true })).toBeVisible();
  await expect(visible.locator('img')).toHaveAttribute('src', /\S/);
  await expect(visible.getByRole('link', { name: 'Solicitar cotización', exact: true })).toHaveAttribute('href', '#demo');
  await expect(visible.getByRole('link', { name: 'Ver este ejemplo', exact: true })).toHaveAttribute('href', '/demos/?rubro=concesionario');
  await expect(section.getByRole('link', { name: 'Ver todas las demos', exact: true })).toHaveAttribute('href', '/demos/');
  const group = groups.find((group) => group.id === 'lavadero');
  await tabs.filter({ hasText: group.nombre }).first().click();
  await expect(panels.first()).toContainText('Reservas de lavado + bar');
  await panels.first().getByRole('link', { name: 'Ver este ejemplo', exact: true }).click();
  await expect(page).toHaveURL(`/demos/?rubro=${group.id}`);
  await results(page, group.demos, group.id, group.nombre);
});

test('studio shows washing and the bar in the standard car wash cover', async ({ page }) => {
  test.skip(!selected('portfolio'), 'Portfolio unchanged');
  const cover = '/images/autolavado-con-bar.webp';
  expect((await page.goto('/')).status()).toBe(200);
  await expect(page.locator('#demos article:has(#rubro-lavadero) img')).toHaveAttribute('src', cover);
  expect((await page.goto('/demos/?rubro=lavadero')).status()).toBe(200);
  await expect(page.locator('[data-wm-rubro-card="lavadero"] img')).toHaveAttribute('src', cover);
  await expect(page.locator('[data-wm-rubro-card="lavadero-premium"] img')).toHaveAttribute('src', /photo-1626668893632-6f3a4466d22f\?/);
  const image = await page.request.get(cover);
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toBe('image/webp');
});

test('studio catalogue explains future growth with standard and premium service demos', async ({ page }) => {
  test.skip(!selected('portfolio'), 'Portfolio unchanged');
  await catalogue(page);
  await expect(page.getByText('Explorá ejemplos de sitios y aplicaciones adaptados a distintas actividades. Filtrá por industria para conocer sus funcionalidades y recorridos.', { exact: true })).toBeVisible();
  const note = page.getByText('Vamos a sumar demos a cada categoría para mostrar las opciones estándar y premium del servicio de Webmaster Studio.', { exact: true });
  await expect(note).toBeVisible();
  await expect(page.locator('[data-wm-rubro-card]')).toHaveCount(RUBROS.length);
});

test('studio services introduces the service cards only once', async ({ page }) => {
  test.skip(!selected('portfolio'), 'Portfolio unchanged');
  expect((await page.goto('/servicios/')).status()).toBe(200);
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { name: 'Servicios de desarrollo de software', level: 1 })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Desarrollo de software para tu organización', exact: true })).toHaveCount(0);
  const cards = main.locator('section').first().getByRole('article');
  await expect(cards.getByRole('heading')).toHaveText([
    'Análisis y cotización', 'Sitios web por industria', 'Aplicaciones e integraciones', 'Mantenimiento y soporte',
  ]);
});

test('studio contact reuses the home inquiry form and keeps the contact details', async ({ page }) => {
  test.skip(!selected('portfolio'), 'Portfolio unchanged');
  expect((await page.goto('/contacto/')).status()).toBe(200);
  const main = page.getByRole('main');
  await expect(main.getByText('Evaluación inicial', { exact: true })).toHaveCount(0);
  await expect(main.getByText('Datos de contacto ilustrativos', { exact: true })).toBeVisible();
  await expect(main.getByRole('link', { name: 'hola@webmasterstudio.demo', exact: true })).toHaveAttribute('href', 'mailto:hola@webmasterstudio.demo');
  const name = main.getByRole('textbox', { name: 'Tu nombre u organización', exact: true });
  await hydrate(name);
  await expect(main.getByRole('combobox', { name: 'Industria (opcional)', exact: true })).toBeVisible();
  const submit = main.getByRole('button', { name: 'Simular consulta de cotización', exact: true });
  await name.fill('Organización de ejemplo');
  await submit.click();
  await expect(main.getByRole('alert')).toHaveText('Ingresá un teléfono o un email de contacto.');
  await expect(main.getByText('Sin enviar', { exact: true })).toBeVisible();
  await expect(main.getByRole('status')).toHaveCount(0);
  await main.getByRole('textbox', { name: 'Email', exact: true }).fill('demo@example.com');
  await submit.click();
  await expect(main.getByRole('status')).toContainText('No se envió la consulta ni se generó una cotización.');
  await expect(main.getByText('Consulta simulada, no enviada', { exact: true })).toBeVisible();
  await main.getByRole('button', { name: 'Revisar datos', exact: true }).click();
  await expect(name).toHaveValue('Organización de ejemplo');
});

test('unknown query falls back without losing other URL state', async ({ page }) => {
  test.skip(!selected('portfolio'), 'Portfolio unchanged');
  const chips = await catalogue(page, '?rubro=__unknown__&source=e2e#catalogue');
  await results(page, RUBROS);
  await expect(chips.getByRole('button', { name: /^Todas/ })).toHaveAttribute('aria-pressed', 'true');
  expect(new URL(page.url()).search).toBe('?source=e2e');
  expect(new URL(page.url()).hash).toBe('#catalogue');
});

test('hydrated demo financing calculator updates and restores published payments', async ({ page }) => {
  test.skip(!selected('concesionario'), 'Concesionario unchanged');
  const demo = RUBROS.find((demo) => demo.id === 'concesionario');
  await page.goto(demo.demoUrl + 'financiacion/');
  const term = page.getByRole('combobox', { name: 'Plazo', exact: true });
  await hydrate(term);
  await expect(term).toHaveValue('36');
  const island = page.locator('astro-island').filter({ has: term });
  const payments = island.locator('li').filter({ hasText: 'por mes, IVA incluido' });
  const original = await payments.allTextContents();
  expect(original.length).toBeGreaterThan(0);
  await term.selectOption('12');
  await expect(island.getByText('30% de anticipo · 12 cuotas · tasa fija 42%', { exact: true })).toBeVisible();
  await expect.poll(() => payments.allTextContents()).not.toEqual(original);
  await term.selectOption('36');
  await expect.poll(() => payments.allTextContents()).toEqual(original);
});
