import { test, expect } from './browser.mjs';
import { inventory, owner } from './inventory.mjs';

const scope = inventory();
const demos = scope.apps.filter((app) => app.base.startsWith('/demos/'));
const studio = scope.apps.find((app) => app.base === '/');
const returnLink = (page) => page.locator('[data-wm-header]').getByRole('link', { name: 'Ir a Webmaster Studio', exact: true });
const studioHeading = (page) => page.getByRole('heading', { level: 1, name: /Estudio de\s+Desarrollo\s+de Software/i });
const skipUnchanged = (app) => test.skip(!scope.selected.includes(app), `Unchanged ${app.name}: ${scope.reason}`);

async function visibleReturn(page) {
  const link = returnLink(page);
  await expect(link).toBeVisible();
  await expect(link).toBeInViewport({ ratio: 1 });
  await expect(link).toHaveText(/^Ir a Webmaster Studio\s*↗$/);
  await expect(link.locator('[aria-hidden="true"]')).toHaveText('↗');
  expect(await link.evaluate((node) => node.closest('nav'))).toBeNull();
  const typography = await link.evaluate((node) => {
    const style = getComputedStyle(node);
    const brand = document.querySelector('[data-wm-header] a.wm-display');
    return { family: style.fontFamily, display: getComputedStyle(brand).fontFamily,
      height: node.getBoundingClientRect().height };
  });
  expect(typography.family).toBe(typography.display);
  expect(typography.height).toBeGreaterThanOrEqual(44);
  await expect(link).toHaveAttribute('href', '/');
  await expect(link).toHaveAttribute('data-astro-reload', '');
  await expect(page.locator('[data-wm-menu-panel]')).toHaveAttribute('data-open', 'false');
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  return link;
}

async function returnHome(page) {
  const link = await visibleReturn(page);
  // Start at the brand and traverse the real tab order, without programmatic focus on the action.
  await page.locator('[data-wm-header] a').first().focus();
  for (let i = 0; i < 20 && !(await link.evaluate((node) => node === document.activeElement)); i++) {
    await page.keyboard.press('Tab');
  }
  await expect(link).toBeFocused();
  expect(await link.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
  await page.evaluate(() => { window.__studioReturnDocument = true; });
  await link.click();
  await expect(page).toHaveURL('/');
  await expect(studioHeading(page)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ir a Webmaster Studio', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.__studioReturnDocument)).toBeUndefined();
}

for (const app of demos) {
  test(`${app.name}: top action returns to the real studio with a full reload`, async ({ page }) => {
    skipUnchanged(app);
    expect((await page.goto(app.base)).status()).toBe(200);
    await returnHome(page);
  });

  test(`${app.name}: small widths keep brand, return and menu/CTA usable`, async ({ page }) => {
    skipUnchanged(app);
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(app.base);
    const link = await visibleReturn(page);
    const brand = page.locator('[data-wm-header] a').first();
    const menu = page.getByRole('button', { name: 'Abrir menu', exact: true });
    for (const control of [brand, menu]) {
      await expect(control).toBeVisible();
      await expect(control).toBeInViewport({ ratio: 1 });
      const a = await link.boundingBox(), b = await control.boundingBox();
      expect(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y,
        'return action must not overlap brand or menu').toBe(true);
    }
    expect(await link.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    await menu.click();
    await expect(page.getByRole('navigation', { name: 'Menu mobile', exact: true })
      .getByRole('link').first()).toBeVisible();
    await expect(page.locator('[data-wm-menu-panel]').getByRole('link', { name: 'Escribir por WhatsApp', exact: true })).toBeVisible();
  });

  test(`${app.name}: original navigation, active state, brand and contact remain intact`, async ({ page, isMobile }) => {
    skipUnchanged(app);
    await page.goto(app.base);
    const header = page.locator('[data-wm-header]');
    const brand = header.getByRole('link').first();
    await expect(brand).toHaveAttribute('href', app.base);
    const nav = page.getByRole('navigation', { name: isMobile ? 'Menu mobile' : 'Principal', exact: true });
    if (isMobile) await header.getByRole('button', { name: 'Abrir menu', exact: true }).click();
    else await expect(header.getByRole('link', { name: 'WhatsApp', exact: true })).toBeVisible();
    const internal = nav.getByRole('link').filter({ hasNotText: /^Inicio$/ }).first();
    const href = await internal.getAttribute('href');
    expect(owner(href)).toBe(app);
    await internal.click();
    await expect(page).toHaveURL(href);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(header.getByRole('navigation', { name: 'Principal', exact: true, includeHidden: true })
      .locator('a[aria-current="page"]')).toHaveAttribute('href', href);
    if (isMobile) await expect(page.locator('[data-wm-menu-panel]')).toHaveAttribute('data-open', 'false');
    await brand.click();
    await expect(page).toHaveURL(app.base);
  });
}

test('return remains available after exploring an internal demo page', async ({ page }) => {
  const app = demos.find((app) => app.name === 'wm-concesionario');
  skipUnchanged(app);
  const route = app.base + 'financiacion/';
  expect(scope.routes).toContain(route);
  await page.goto(route);
  await expect(page.getByRole('heading', { level: 1, name: 'La cuota, calculada antes de que vengas' })).toBeVisible();
  await returnHome(page);
});

test('studio home and its existing navigation have no self-return action', async ({ page, isMobile }) => {
  skipUnchanged(studio);
  await page.goto('/');
  await expect(studioHeading(page)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ir a Webmaster Studio', exact: true })).toHaveCount(0);
  const header = page.locator('[data-wm-header]');
  const brand = header.getByRole('link').first();
  await expect(brand).toHaveAttribute('href', '/');
  if (isMobile) await header.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  const nav = page.getByRole('navigation', { name: isMobile ? 'Menu mobile' : 'Principal', exact: true });
  const services = nav.locator('a[href="/servicios/"]');
  await services.click();
  await expect(page).toHaveURL('/servicios/');
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await brand.click();
  await expect(page).toHaveURL('/');
  await expect(studioHeading(page)).toBeVisible();
});
