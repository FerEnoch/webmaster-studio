import { test, expect } from './browser.mjs';

const ROUTE = '/demos/arquitectura-premium/';
const STAGES = [
  { id: 'plano', label: 'Plano' },
  { id: 'volumen', label: 'Volumen' },
  { id: 'materiales', label: 'Materiales' },
  { id: 'entrega', label: 'Entrega' },
];

test('veta hero keeps the editorial contract and offers four house stages', async ({ page }) => {
  expect((await page.goto(ROUTE)).status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(/Recorré.*la obra.*antes de firmarla/s);
  await expect(page.getByRole('link', { name: 'Cotizar mi proyecto' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ver las obras' }).first()).toBeVisible();

  const group = page.locator('[data-veta-stages]');
  await expect(group).toBeVisible();
  for (const stage of STAGES) {
    await expect(group.getByRole('button', { name: new RegExp(stage.label, 'i') })).toBeVisible();
  }
  await expect(group.getByRole('button')).toHaveCount(4);
  await expect(group.getByRole('button', { name: /plano/i })).toHaveAttribute('aria-pressed', 'true');

  await expect(page.locator('[data-veta-status]')).toContainText(/plano/i);
  // Static SSR fallback: poster diagram + one panel per stage survive with content.
  await expect(page.locator('[data-veta-poster]')).toBeAttached();
  await expect(page.locator('[data-veta-panel]')).toHaveCount(4);
  for (const stage of STAGES) {
    await expect(page.locator(`[data-veta-panel="${stage.id}"]`)).toContainText(/\S/);
  }
  // Single deferred 3D canvas slot (enhances the poster, never a second canvas).
  await expect(page.locator('[data-veta-canvas]')).toBeAttached();
  expect(await page.locator('canvas[data-veta-canvas]').count()).toBeLessThanOrEqual(1);
});

test('veta stage buttons switch the house by pointer and keyboard', async ({ page }) => {
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const group = page.locator('[data-veta-stages]');
  await expect(group).toBeVisible();

  await group.getByRole('button', { name: /volumen/i }).click();
  await expect(group.getByRole('button', { name: /volumen/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-veta-status]')).toContainText(/volumen/i);

  // Keyboard: Tab to Materiales and activate with Enter.
  await group.getByRole('button', { name: /materiales/i }).focus();
  await page.keyboard.press('Enter');
  await expect(group.getByRole('button', { name: /materiales/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-veta-status]')).toContainText(/materiales/i);

  // Arrow-key roving across the stage group.
  await page.keyboard.press('ArrowRight');
  await expect(group.getByRole('button', { name: /entrega/i })).toBeFocused();
  await page.keyboard.press(' ');
  await expect(group.getByRole('button', { name: /entrega/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-veta-status]')).toContainText(/entrega/i);

  // Visible focus for keyboard users.
  const outline = await group.getByRole('button', { name: /entrega/i }).evaluate((node) => {
    node.focus();
    return getComputedStyle(node).outlineStyle;
  });
  expect(outline, 'stage buttons keep a visible focus ring').not.toBe('none');
});

test('veta static fallback endures without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-ignore — test-only WebGL kill switch.
    window.__vetaNoWebGL = true;
    const fail = () => null;
    try {
      // @ts-ignore
      HTMLCanvasElement.prototype.getContext = function () { return fail(); };
    } catch { /* keep DOM usable */ }
  });
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const group = page.locator('[data-veta-stages]');
  await expect(group).toBeVisible();
  // Poster/static views stay meaningful even though the 3D never boots.
  await expect(page.locator('[data-veta-poster]')).toBeVisible();
  await expect(page.locator('[data-veta-panel="plano"]')).toBeVisible();
  const canvasState = await page.locator('[data-veta-canvas]').evaluate((node) => ({
    hidden: node.hasAttribute('hidden') || getComputedStyle(node).display === 'none',
    label: node.getAttribute('aria-label') ?? '',
  }));
  expect(canvasState.hidden || /no disponible|demostraci/i.test(canvasState.label), 'canvas hides or labels its fallback').toBe(true);

  await group.getByRole('button', { name: /entrega/i }).click();
  await expect(group.getByRole('button', { name: /entrega/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-veta-status]')).toContainText(/entrega/i);
  await expect(page.locator('[data-veta-panel="entrega"]')).toBeVisible();
});

test('veta reduced motion keeps stages without camera takeover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const group = page.locator('[data-veta-stages]');
  await expect(group).toBeVisible();
  const startY = await page.evaluate(() => window.scrollY);
  await group.getByRole('button', { name: /materiales/i }).click();
  await expect(page.locator('[data-veta-status]')).toContainText(/materiales/i);
  expect(await page.evaluate(() => window.scrollY), 'no animated scroll takeover').toBe(startY);
  // No perpetual WebGL loop is forced under reduced motion.
  const spinning = await page.evaluate(() => Boolean(document.querySelector('[data-veta-canvas][data-veta-spinning="true"]')));
  expect(spinning).toBe(false);
});

test('veta desktop scroll advances stages without fighting explicit buttons', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Short scrub section is a desktop enhancement');
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const group = page.locator('[data-veta-stages]');
  await expect(group).toBeVisible();
  const scroller = page.locator('[data-veta-scroll]');
  if (!(await scroller.count())) test.skip(true, 'No scroll enhancement on this viewport');
  await page.locator('[data-veta-panel="materiales"]').scrollIntoViewIfNeeded();
  await expect(group.getByRole('button', { name: /materiales/i })).toHaveAttribute('aria-pressed', 'true', { timeout: 8000 });
  // An explicit click wins over the scroll observer afterwards.
  await group.getByRole('button', { name: /plano/i }).click();
  await expect(group.getByRole('button', { name: /plano/i })).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(1200);
  await expect(group.getByRole('button', { name: /plano/i })).toHaveAttribute('aria-pressed', 'true');
});

test('veta prominent narrative follows the selected stage at rest', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Adjacency to the sticky visual is a desktop layout');
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const group = page.locator('[data-veta-stages]');
  await expect(group).toBeVisible();
  const lead = () => page.locator('.veta-hero__panels > li:first-child [data-veta-panel]');

  // Rest state agrees on Plano before any interaction.
  await expect(lead()).toHaveAttribute('data-veta-panel', 'plano');
  await expect(lead().locator('.veta-panel__title')).toHaveText('La planta, antes del ladrillo');

  // Explicit pointer selection moves the Entrega narrative beside the model.
  await group.getByRole('button', { name: /entrega/i }).click();
  await expect(lead()).toHaveAttribute('data-veta-panel', 'entrega');
  await expect(lead().locator('.veta-panel__title')).toHaveText('La casa, a la altura de tus ojos');
  expect(await page.evaluate(() => window.scrollY), 'explicit selection never moves the document').toBe(0);

  // The lead narrative and the finished model share the viewport at rest.
  const vh = (await page.viewportSize()).height;
  const [panelBox, frameBox] = await Promise.all([lead().boundingBox(), page.locator('[data-veta-frame]').boundingBox()]);
  for (const box of [panelBox, frameBox]) {
    expect(box, 'model and lead narrative share the viewport').not.toBeNull();
    expect(box.y, 'starts inside the viewport').toBeLessThan(vh);
    expect(box.y + box.height, 'is not pushed out').toBeGreaterThan(0);
  }

  // Keyboard selection agrees too, without moving focus away or scrolling.
  await group.getByRole('button', { name: /entrega/i }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(group.getByRole('button', { name: /materiales/i })).toBeFocused();
  await expect(lead()).toHaveAttribute('data-veta-panel', 'materiales');
  await expect(lead().locator('.veta-panel__title')).toHaveText('El corte que muestra cómo se termina');
  expect(await page.evaluate(() => window.scrollY), 'keyboard selection never moves the document').toBe(0);
});

test('veta keeps the conversion and catalogue contract on the shared markup', async ({ page }) => {
  expect((await page.goto(ROUTE)).status()).toBe(200);
  await expect(page.getByRole('link', { name: 'Cotizar mi proyecto' }).first()).toHaveAttribute('href', /cotizar\/$/);
  await expect(page.getByRole('link', { name: 'Ver las obras' }).first()).toHaveAttribute('href', /obras\/$/);
  // Room-derived price strip still renders from the same ambientes data.
  const plans = page.locator('[data-vt-plan]');
  await expect(plans).toHaveCount(4);
  await expect(page.locator('[data-vt-plan="estar"]')).toContainText(/Estar/);
  await expect(page.getByRole('link', { name: 'Ir al cotizador' })).toHaveAttribute('href', /cotizar\/$/);
});
