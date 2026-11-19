import { test, expect } from './browser.mjs';
import { inventory } from './inventory.mjs';

const scope = inventory();

// Check recognizable capabilities, not a second copy of the catalogue's prose.
const capabilities = [
  { id: 'concesionario', highlights: [/nuevos.*usados/i, /cuotas|financiación/i, /prueba de manejo/i] },
  { id: 'lavadero', highlights: [/servicios.*precios/i, /bar/i, /reserva.*simulad/i] },
  { id: 'lavadero-premium', highlights: [/cotiz[aá].*tamaño/i, /entrada.*desplaz/i, /reserva.*simulad/i] },
  { id: 'estetica', highlights: [/tratamientos/i, /yoga/i, /antes.*después/i] },
  { id: 'universidad', highlights: [/compar.*tres/i, /becas/i, /preinscripción.*simulad/i] },
  { id: 'inmobiliaria', highlights: [/zona.*tipo.*precio.*ambientes/i, /fichas/i, /visita.*simulad/i] },
  { id: 'arquitectura', highlights: [/proyectos/i, /antes.*después/i, /presupuesto/i] },
  { id: 'arquitectura-premium', highlights: [/3D.*interactiv/i, /cotiz[aá].*(dinámic|en vivo)/i, /visita.*simulad/i] },
];

test('every solution explains what to try before its usable demo CTA, including premium differences', async ({ page, request }) => {
  test.skip(!scope.selected.some((app) => app.name === 'wm-portfolio'), 'Portfolio unchanged');
  expect((await page.goto('/demos/')).status()).toBe(200);
  await expect(page.locator('[data-wm-rubro-card]')).toHaveCount(8);

  for (const { id, highlights } of capabilities) {
    const card = page.locator(`[data-wm-rubro-card="${id}"]`);
    const list = card.getByRole('list', { name: /^Qué podés probar/ });
    await expect(list, `${id}: visible capabilities before entering the demo`).toBeVisible();
    const items = list.getByRole('listitem');
    const count = await items.count();
    expect(count, `${id}: compact list`).toBeGreaterThanOrEqual(3);
    expect(count, `${id}: compact list`).toBeLessThanOrEqual(5);
    for (const item of await items.all()) {
      await expect(item).toBeVisible();
      await expect(item).not.toBeEmpty();
    }
    for (const highlight of highlights) await expect(list).toContainText(highlight);

    // Premium experiences must be discoverable here, not attributed to the base card.
    if (id === 'lavadero') await expect(list).not.toContainText(/cotiz[aá].*tamaño|entrada.*desplaz/i);
    if (id === 'arquitectura') await expect(list).not.toContainText(/3D|cotiz[aá].*(dinámic|en vivo)/i);

    const cta = card.getByRole('link', { name: 'Explorar solución', exact: true });
    await expect(cta).toHaveAttribute('href', `/demos/${id}/`);
    await expect(cta).toHaveAttribute('data-astro-reload', '');
    await expect(cta).toBeVisible();
    expect(await list.evaluate((node) => Boolean(
      node.compareDocumentPosition(node.closest('article').querySelector('a')) & Node.DOCUMENT_POSITION_FOLLOWING
    )), `${id}: list precedes CTA in reading order`).toBe(true);
    await cta.scrollIntoViewIfNeeded();
    const listBox = await list.boundingBox();
    const ctaBox = await cta.boundingBox();
    expect(listBox.y + listBox.height, `${id}: list precedes CTA visually`).toBeLessThanOrEqual(ctaBox.y);

    await cta.click({ trial: true });
    expect((await request.get(`/demos/${id}/`)).status()).toBe(200);
  }
});
