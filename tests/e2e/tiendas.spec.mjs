import { test, expect, hydrate } from './browser.mjs';
import { inventory } from './inventory.mjs';
import { readFile } from 'node:fs/promises';

const scope = inventory();
const family = 'locales-y-tiendas';
const telar = '/demos/locales-catalogo/';
const trama = '/demos/tiendas-ecommerce/';
const selected = (name) => scope.selected.some((app) => app.name === name);

function studioLink(page) {
  return page.getByRole('link', { name: 'Ir a Webmaster Studio', exact: true });
}

async function checkDemo(page, base, path = '') {
  const route = `${base}${path}`;
  expect((await page.goto(route)).status()).toBe(200);
  await expect(studioLink(page)).toHaveCount(1);
  await expect(studioLink(page)).toBeVisible();
  await expect(studioLink(page)).toHaveAttribute('href', '/');
  await expect(studioLink(page)).toHaveAttribute('data-astro-reload', '');
  await expect(page.locator('body')).not.toContainText(/marca ficticia|esta demo/i);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => innerWidth),
  );
}

function onlyLocalGets(page, baseURL) {
  const unexpected = [];
  const origin = new URL(baseURL).origin;
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== origin || request.method() !== 'GET') {
      unexpected.push(`${request.method()} ${request.url()}`);
    }
  });
  return unexpected;
}

test('Locales y tiendas shows one family chip, with distinct covers and real links to both demos', async ({ page }, info) => {
  test.skip(!selected('wm-portfolio'), 'Portfolio unchanged');
  expect((await page.goto('/demos/')).status()).toBe(200);
  const chip = page.getByRole('button', { name: /^Locales y tiendas\b/ });
  await hydrate(chip);
  await expect(chip).toHaveCount(1);
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(new RegExp(`\\?rubro=${family}$`));
  const cards = page.locator('[data-wm-rubro-card]:visible');
  await expect(cards).toHaveCount(2);
  const telarCard = cards.filter({ has: page.getByText('Catalogo online', { exact: true }) });
  const tramaCard = cards.filter({ has: page.getByText('Ecommerce', { exact: true }) });
  // Real, distinct, locally hosted cover photos (no SVG data URIs).
  const coverSrcs = [];
  for (const [cover, file] of [[telarCard.locator('img'), 'locales-catalogo-cover'], [tramaCard.locator('img'), 'tiendas-ecommerce-cover']]) {
    await cover.scrollIntoViewIfNeeded();
    await expect.poll(() => cover.evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
    const src = await cover.getAttribute('src');
    expect(src).toMatch(new RegExp(`^/media/${file}-\\d+\\.webp$`));
    expect(await cover.getAttribute('width')).toBeTruthy();
    expect(await cover.getAttribute('height')).toBeTruthy();
    coverSrcs.push(src);
  }
  expect(coverSrcs[0]).not.toEqual(coverSrcs[1]);
  await page.screenshot({ path: info.outputPath('locales-y-tiendas-cards.png'), fullPage: true, animations: 'disabled' });

  for (const [card, base, title] of [[telarCard, telar, /^Telar ·/], [tramaCard, trama, /^Trama ·/]]) {
    const cta = card.getByRole('link', { name: 'Explorar solución' });
    await expect(cta).toHaveAttribute('href', base);
    await expect(cta).toHaveAttribute('data-astro-reload', '');
    await cta.click();
    await expect(page).toHaveURL(new RegExp(`${base}$`));
    await expect(page).toHaveTitle(title);
    await expect(studioLink(page)).toHaveCount(1);
    await studioLink(page).click();
    await expect(page).toHaveURL(new URL('/', page.url()).href);
    await page.goto(`/demos/?rubro=${family}`);
  }
});

test('Telar combines variant filters and shows the garment, collections and sizes without a purchase funnel', async ({ page, baseURL }) => {
  test.skip(!selected('wm-locales-catalogo'), 'Telar unchanged');
  const unexpected = onlyLocalGets(page, baseURL);
  await checkDemo(page, telar, 'catalogo/');
  const status = page.getByRole('status');
  await expect(status).toHaveText('8 de 8 prendas');
  await page.getByLabel('Categoría').selectOption('Camisas');
  await page.getByLabel('Talle').selectOption('M');
  await page.getByLabel('Color').selectOption('arena');
  await page.getByLabel('Disponibilidad').selectOption('en-stock');
  await expect(status).toHaveText('0 de 8 prendas');
  await expect(page.getByText('Ninguna prenda coincide', { exact: false })).toBeVisible();
  await page.getByLabel('Disponibilidad').selectOption('agotado');
  await expect(status).toHaveText('1 de 8 prendas');
  await page.getByRole('link', { name: /Ver ficha completa/ }).click();
  await expect(page).toHaveURL(`${baseURL}${telar}producto/camisa-lino/`);
  await expect(studioLink(page)).toHaveCount(1);
  await page.getByRole('radio', { name: 'Arena' }).check();
  await page.getByRole('radio', { name: 'M', exact: true }).check();
  await expect(status).toContainText('Agotada en esta variante');
  await expect(page.getByRole('button', { name: /comprar|agregar|carrito/i })).toHaveCount(0);
  await page.getByRole('link', { name: 'ver guía', exact: true }).click();
  await expect(page.getByRole('table')).toHaveCount(2);
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Colecciones' }).click();
  await expect(page.getByRole('region', { name: 'Lino de verano' })).toBeVisible();
  expect(unexpected).toEqual([]);
});

for (const method of ['Mercado Pago', 'MODO']) {
  test(`TRAMA ${method}: stock, editable cart, guest checkout and local receipt`, async ({ page, baseURL }, info) => {
    test.skip(!selected('wm-tiendas-ecommerce'), 'TRAMA unchanged');
    const unexpected = onlyLocalGets(page, baseURL);
    const storage = () => page.evaluate(() => ({
      local: Object.keys(localStorage), session: Object.keys(sessionStorage),
      cart: JSON.parse(localStorage.getItem('trama-cart-v1') ?? 'null'),
    }));
    const empty = { local: [], session: [], cart: null };
    await checkDemo(page, trama, 'checkout/');
    await expect(page.getByText('Tu carrito está vacío.', { exact: true })).toBeVisible();
    await checkDemo(page, trama, 'catalogo/');
    await expect(page.getByRole('status')).toHaveText('6 de 6 prendas');
    await checkDemo(page, trama, 'producto/remera-pesada/');
    const add = page.getByRole('button', { name: 'Agregar al carrito' });
    await page.getByRole('radio', { name: 'Verde', exact: true }).check();
    await page.getByRole('radio', { name: 'XL', exact: true }).check();
    await expect(add).toBeDisabled();
    expect(await storage()).toEqual(empty);
    await page.getByRole('radio', { name: 'L', exact: true }).check();
    await add.click();
    await expect(add).toBeDisabled();
    // Add feedback: truthful header count, polite live confirmation, actions, dismiss.
    await expect(page.locator('[data-wm-cartcount]')).toHaveText('1');
    const toast = page.getByRole('status', { name: 'Agregado a tu carrito' });
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Remera pesada 220');
    await expect(toast).toContainText('Verde / L');
    await expect(page.getByRole('link', { name: 'Ver tu carrito' })).toHaveAttribute('href', /\/carrito\/$/);
    await expect(page.getByRole('link', { name: 'Seguir explorando' })).toHaveAttribute('href', /\/catalogo\/$/);
    await toast.getByRole('button', { name: 'Cerrar aviso de carrito' }).click();
    await expect(toast).toBeHidden();
    await page.getByRole('radio', { name: 'Negro', exact: true }).check();
    await page.getByRole('radio', { name: 'M', exact: true }).check();
    await add.click();
    await expect(page.locator('[data-wm-cartcount]')).toHaveText('2');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Negro / M');
    await page.reload();
    expect(await storage()).toEqual({
      local: ['trama-cart-v1'], session: [], cart: [
        { producto: 'remera-pesada', color: 'verde', size: 'L', qty: 1 },
        { producto: 'remera-pesada', color: 'negro', size: 'M', qty: 1 },
      ],
    });
    await page.getByRole('link', { name: 'Ver mi carrito' }).click();
    const rows = page.locator('.wm-line');
    await expect(rows).toHaveCount(2);
    const more = 'Agregar uno de Remera pesada 220';
    await expect(rows.filter({ hasText: 'Verde' }).getByRole('button', { name: more })).toBeDisabled();
    await rows.filter({ hasText: 'Negro' }).getByRole('button', { name: more }).click();
    await expect(page.locator('[data-subtotal]')).toHaveText('$ 96.000');
    await rows.filter({ hasText: 'Verde' }).getByRole('button', { name: 'Quitar', exact: true }).click();
    await expect(page.locator('[data-subtotal]')).toHaveText('$ 64.000');
    await page.getByRole('link', { name: 'Seguir al checkout' }).click();
    await expect(studioLink(page)).toHaveCount(1);
    await expect(page.locator('[data-total]')).toHaveText('$ 64.000');
    await page.getByRole('radio', { name: /Envío al interior/ }).check();
    await expect(page.locator('[data-total]')).toHaveText('$ 73.900');
    const mp = method === 'Mercado Pago';
    await page.getByRole('radio', { name: mp ? /Envío CABA/ : /Retiro por el local/ }).check();
    const payment = page.getByRole('radio', { name: new RegExp(method) });
    await payment.check();
    const total = mp ? '$ 68.900' : '$ 64.000';
    await expect(page.locator('[data-total]')).toHaveText(total);
    const checkoutURL = `${baseURL}${trama}checkout/`;
    await page.waitForLoadState('load');
    const checkoutRequests = [];
    const record = (request) => checkoutRequests.push(`${request.method()} ${request.url()}`);
    page.on('request', record);
    const before = await storage();
    const email = page.getByRole('textbox', { name: 'Correo electrónico de prueba' });
    const error = page.getByRole('alert');
    const continueButton = page.getByRole('button', { name: `Continuar con ${method}` });
    const preview = page.getByRole('heading', { name: mp ? 'Revisá el pago' : 'Aprobación en la billetera' });
    await continueButton.click();
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Ingresá un correo electrónico de prueba.');
    await expect(email).toBeFocused();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(preview).toBeHidden();
    expect(await storage()).toEqual(before);
    await expect(page).toHaveURL(checkoutURL);

    await email.fill('correo-invalido');
    await email.press('Enter');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Ingresá un correo válido, por ejemplo compra@example.com.');
    await expect(preview).toBeHidden();
    expect(await storage()).toEqual(before);
    await expect(page).toHaveURL(checkoutURL);

    await email.fill('primero@example.org');
    await email.press('Enter');
    await expect(preview).toBeFocused();
    await page.getByRole('button', { name: 'Volver a entrega y pago' }).click();
    expect(await storage()).toEqual(before);
    await expect(payment).toBeChecked();
    await expect(email).toBeFocused();
    await expect(email).toHaveValue('primero@example.org');
    await email.fill('segundo@example.com');
    await continueButton.click();
    await expect(preview).toBeFocused();
    expect(await storage()).toEqual(before);
    if (mp) await page.getByLabel('Tarjeta de prueba').check();
    await expect(page.locator('main input:not([type=radio])')).toHaveCount(1);
    await expect(email).toBeHidden();
    await page.screenshot({ path: info.outputPath('checkout-preview.png'), fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: mp ? 'Confirmar con Mercado Pago' : 'Simular aprobación con MODO' }).click();
    await expect(page.getByRole('heading', { name: 'Simulación completada' })).toBeFocused();
    const receipt = page.getByRole('region', { name: 'Comprobante del pedido' });
    const reference = receipt.locator('[data-reference]');
    await expect(reference).toHaveText(/^TR-[A-F0-9]{16}$/);
    const number = await reference.innerText();
    await expect(receipt).toContainText('2 × Remera pesada 220 · Negro / M · $ 64.000');
    await expect(receipt).toContainText(method);
    await expect(receipt).toContainText(total);
    await expect(receipt).toContainText(mp ? 'Tarjeta de prueba' : 'aprobación local');
    await expect(receipt).toContainText(mp ? 'Envío CABA' : 'Retiro por el local');
    await expect(receipt).toContainText(mp ? 'recibirías un enlace de seguimiento' : 'recibirías un aviso cuando el pedido esté listo');
    await page.getByText('Ver correo simulado', { exact: true }).click();
    await expect(page.getByText('s•••@example.com', { exact: true })).toBeVisible();
    await expect(page.getByText('No se envió ningún correo.', { exact: false })).toBeVisible();
    await expect(page.locator('[data-email-message]')).toContainText(number);
    await expect(page.locator('main')).not.toContainText(/primero@example\.org|segundo@example\.com/);
    await expect(page.locator('input[type=email]')).toHaveValue('');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Descargar comprobante' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(`Trama-${number}.txt`);
    const file = await readFile(await download.path(), 'utf8');
    expect(file).toContain(number);
    expect(file).toContain(total);
    expect(file).not.toMatch(/@example\.|segundo|primero/);
    await expect(reference).toHaveText(number);
    await expect(page.getByText('No se hizo ningún cargo ni se generó un envío.', { exact: false })).toBeVisible();
    await expect(page.locator('[data-wm-cartcount]')).toHaveText('0');
    expect(await storage()).toEqual(empty);
    expect(await page.context().cookies()).toEqual([]);
    await expect(page).toHaveURL(checkoutURL);
    expect(checkoutRequests).toEqual([]);
    page.off('request', record);
    await page.getByRole('link', { name: 'Ver mi carrito' }).click();
    await expect(page.getByText('Tu carrito está vacío.', { exact: false })).toBeVisible();
    await page.getByRole('link', { name: 'Ver el catálogo' }).click();
    await expect(page).toHaveURL(`${baseURL}${trama}catalogo/`);
    expect(unexpected).toEqual([]);
  });
}
