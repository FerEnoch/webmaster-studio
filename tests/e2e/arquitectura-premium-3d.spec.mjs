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
  // The driver brings the control into view first (narrow puts the stage
  // buttons below the drawing); the app itself must not scroll on select.
  await group.getByRole('button', { name: /materiales/i }).evaluate((node) => node.scrollIntoView({ block: 'center' }));
  const startY = await page.evaluate(() => window.scrollY);
  await group.getByRole('button', { name: /materiales/i }).click();
  await expect(page.locator('[data-veta-status]')).toContainText(/materiales/i);
  expect(await page.evaluate(() => window.scrollY), 'no animated scroll takeover').toBe(startY);
  // No perpetual WebGL loop is forced under reduced motion.
  const spinning = await page.evaluate(() => Boolean(document.querySelector('[data-veta-canvas][data-veta-spinning="true"]')));
  expect(spinning).toBe(false);
});

test('veta wheel changes stages only inside the model frame', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Wheel and trackpad input');
  await page.clock.install();
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const canvas = page.locator('[data-veta-canvas]');
  const group = page.getByRole('group', { name: 'Etapas de la casa' });
  const status = page.locator('[data-veta-status]');
  const expectStage = async (label) => {
    await expect(group.getByRole('button', { name: new RegExp(label, 'i') })).toHaveAttribute('aria-pressed', 'true');
    await expect(status).toContainText(label);
  };
  const scrollY = () => page.evaluate(() => window.scrollY);
  await canvas.hover();
  const initialY = await scrollY();
  // Freeze virtual time before driving stages: the hold window is measured in virtual
  // ms, so freezing makes it immune to machine slowness. The +5000ms jump is absorbed
  // because the hold is armed later, inside this frozen frame; only fastForwards advance it.
  const virtualNow = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(virtualNow + 5000);
  for (const { label } of STAGES.slice(1)) {
    await page.mouse.wheel(0, 240);
    await expectStage(label);
    expect(await scrollY(), 'the frame consumes a wheel step when another stage exists').toBe(initialY);
  }

  // A momentum wheel event after the camera settles still belongs to the final scene.
  await page.clock.fastForward(950);
  await page.mouse.wheel(0, 240);
  await page.clock.fastForward(180);
  expect(await scrollY(), 'Entrega stays in view beyond its camera transition').toBe(initialY);
  await expectStage('Entrega');

  await page.clock.fastForward(1250);
  await page.mouse.wheel(0, 240);
  await page.clock.resume();
  await expect.poll(scrollY).toBeGreaterThan(initialY);
  await expectStage('Entrega');

  await canvas.hover();
  const reverseY = await scrollY();
  for (const { label } of STAGES.slice(0, -1).reverse()) {
    await page.mouse.wheel(0, -240);
    await expectStage(label);
    expect(await scrollY()).toBe(reverseY);
  }

  await page.locator('[data-vt-plan="estar"]').scrollIntoViewIfNeeded();
  const beforeOutside = await scrollY();
  await page.mouse.move(5, 680);
  await page.mouse.wheel(0, 850);
  await expect.poll(scrollY).toBeGreaterThan(beforeOutside + 500);
  await expectStage('Plano');
});

test('veta camera orbits on drag and resets with the keyboard', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Mouse drag and keyboard');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const canvas = page.locator('[data-veta-canvas]');
  await expect(canvas).toBeVisible();
  await page.getByRole('button', { name: /volumen/i }).click();
  const box = await canvas.boundingBox();
  // Compare the rendered model, not the canvas's keyboard-focus outline.
  const clip = { x: box.x + 10, y: box.y + 10, width: box.width - 20, height: box.height * 0.65 };
  const captureModel = () => page.screenshot({ clip });
  const initial = await captureModel();
  const x = box.x + box.width * 0.47;
  const y = box.y + box.height * 0.38;
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 100, y + 24, { steps: 6 });
  await page.mouse.up();
  expect((await captureModel()).equals(initial), 'drag redraws the same stage from another angle').toBe(false);
  await expect(page.locator('[data-veta-status]')).toContainText('Volumen');
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);

  await canvas.focus();
  await canvas.press('Home');
  expect((await captureModel()).equals(initial), 'Home restores the authored view').toBe(true);
  await canvas.press('ArrowLeft');
  expect((await captureModel()).equals(initial), 'arrow keys also orbit the camera').toBe(false);
});

test('veta prominent narrative follows the selected stage at rest', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'The scene caption and model share the desktop fold');
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

  // The lead article follows below the full-bleed scene; its caption stays on the scene.
  const caption = page.locator('[data-veta-caption-title]');
  await expect(caption).toHaveText('La casa, a la altura de tus ojos');
  await expect(caption).toBeInViewport();

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

test('veta full-bleed 3D is the backdrop of the hero with readable foreground controls', async ({ page }) => {
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const hero = page.locator('#veta-modelo');
  const canvas = page.locator('[data-veta-canvas]');
  const headline = page.getByRole('heading', { level: 1 }).first();
  await expect(canvas).toBeVisible();
  await expect(headline).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Cotizar mi proyecto' }).first()).toBeInViewport();
  await expect(page.getByRole('button', { name: /entrega/i })).toBeInViewport();
  const viewport = page.viewportSize();
  const [heroBox, canvasBox, headlineBox] = await Promise.all([hero.boundingBox(), canvas.boundingBox(), headline.boundingBox()]);
  expect(heroBox.width).toBe(viewport.width);
  expect(canvasBox).toEqual(heroBox);
  expect(canvasBox.height).toBeGreaterThanOrEqual(viewport.height - 2);
  expect(headlineBox.y).toBeGreaterThan(canvasBox.y);
  expect(headlineBox.y + headlineBox.height).toBeLessThan(viewport.height);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('veta room selection names the space on the same house', async ({ page }) => {
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const rooms = page.locator('[data-veta-room-group]');
  await expect(rooms).toBeVisible();
  await expect(rooms.getByRole('button')).toHaveCount(4);
  for (const name of ['Estar', 'Cocina', 'Dormitorio', 'Patio']) {
    await expect(rooms.getByRole('button', { name: new RegExp(name, 'i') })).toBeVisible();
  }

  // Pointer: Cocina updates the single source of selection everywhere.
  await rooms.getByRole('button', { name: /cocina/i }).click();
  const hero = page.locator('[data-veta-hero]');
  await expect(hero).toHaveAttribute('data-veta-current-room', 'cocina');
  const detail = page.locator('[data-veta-room-detail]');
  await expect(detail).toContainText(/cocina/i);
  await expect(detail).toContainText(/16 m/);
  await expect(detail).toContainText(/Mármol Carrara/);
  await expect(detail).toContainText(/US\$/);
  await expect(detail.getByRole('link', { name: /plan/i })).toHaveAttribute('href', /#plan-cocina$/);
  // The same selection reads coherently on the existing plan strip.
  await expect(page.locator('[data-vt-plan="cocina"]')).toHaveAttribute('data-active', 'true');
  await expect(page.locator('[data-vt-plan="estar"]')).toHaveAttribute('data-active', 'false');
  // Still one canvas: rooms reuse the house, they never add a stage.
  expect(await page.locator('canvas[data-veta-canvas]').count()).toBeLessThanOrEqual(1);

  // Keyboard: arrows move and select, focus stays visible.
  await rooms.getByRole('button', { name: /cocina/i }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(rooms.getByRole('button', { name: /dormitorio/i })).toBeFocused();
  await expect(hero).toHaveAttribute('data-veta-current-room', 'dormitorio');
  await expect(detail).toContainText(/dormitorio/i);
  const outline = await rooms.getByRole('button', { name: /dormitorio/i }).evaluate((node) => {
    node.focus();
    return getComputedStyle(node).outlineStyle;
  });
  expect(outline, 'room buttons keep a visible focus ring').not.toBe('none');
});

test('veta hovering the living frame keeps the staged pose', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Fine-pointer parallax only exists on desktop');
  expect((await page.goto(ROUTE)).status()).toBe(200);
  const frame = page.locator('[data-veta-frame]');
  await expect(frame).toBeVisible();
  const box = (await frame.boundingBox()) ?? { x: 0, y: 0, width: 0, height: 0 };
  // Sweep the pointer across the drawing, over the room chips too.
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.7, { steps: 5 });
  await page.waitForTimeout(600);
  // The pose holds: still Plano, no scroll takeover, canvas alive.
  await expect(page.locator('[data-veta-status]')).toContainText(/plano/i);
  expect(await page.evaluate(() => window.scrollY), 'hovering never moves the document').toBe(0);
  await expect(page.locator('canvas[data-veta-canvas]')).toBeVisible();
  const group = page.locator('[data-veta-stages]');
  await expect(group.getByRole('button', { name: /plano/i })).toHaveAttribute('aria-pressed', 'true');
});

test('veta mobile first fold shows the title and a substantial living drawing', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Title beside a real drawing is a mobile first-fold composition');
  expect((await page.goto(ROUTE)).status()).toBe(200);
  expect(await page.evaluate(() => window.scrollY), 'first fold needs no scrolling').toBe(0);
  const vh = (await page.viewportSize()).height;
  // The promise stays in view with the drawing.
  const headline = page.getByRole('heading', { level: 1 }).first();
  await expect(headline).toBeVisible();
  const headBox = await headline.boundingBox();
  expect(headBox, 'headline is laid out').not.toBeNull();
  expect(headBox.y + headBox.height, 'headline shares the first viewport with the scene').toBeLessThan(vh);
  // Substantial picture area, not frame presence: most of the frame
  // height is really on screen, with a live picture layer inside it.
  const frame = page.locator('[data-veta-frame]');
  await expect(frame).toBeVisible();
  const box = await frame.boundingBox();
  expect(box, 'scene frame is laid out').not.toBeNull();
  const visibleH = Math.min(box.y + box.height, vh) - Math.max(box.y, 0);
  expect(visibleH, 'a meaningful slice of the drawing renders in the first viewport').toBeGreaterThanOrEqual(200);
  const hero = page.locator('[data-veta-hero]');
  if (await hero.getAttribute('data-veta-ready') === 'true') {
    const canvas = page.locator('canvas[data-veta-canvas]');
    await expect(canvas).toBeVisible();
    const bufW = await canvas.evaluate((node) => node.width);
    expect(bufW, 'the 3D layer paints into a real surface, not an empty backdrop').toBeGreaterThanOrEqual(200);
  } else {
    const poster = page.locator('[data-veta-poster] svg');
    await expect(poster).toBeVisible();
    const posterBox = await poster.boundingBox();
    const posterVisibleH = Math.min(posterBox.y + posterBox.height, vh) - Math.max(posterBox.y, 0);
    expect(posterVisibleH, 'the static plan draws a real picture in the first viewport').toBeGreaterThanOrEqual(200);
  }
  // Controls stay tappable: no compressed 32px chips on narrow screens.
  for (const group of ['[data-veta-stages]', '[data-veta-room-group]']) {
    const first = page.locator(`${group} [role="button"], ${group} button`).first();
    const height = (await first.boundingBox())?.height ?? 0;
    expect(height, `${group} keeps a touch-sized target`).toBeGreaterThanOrEqual(40);
  }
});
