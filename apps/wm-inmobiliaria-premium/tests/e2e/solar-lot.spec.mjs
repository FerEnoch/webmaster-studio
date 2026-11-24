import { expect, test } from "@playwright/test";

const HOME = "/demos/inmobiliaria-premium/";
const CASA = `${HOME}propiedades/casa-laguna-nordelta/`;
const LOTE = `${HOME}propiedades/lote-pilar-del-este/`;
// Keep the global sticky header and nav out of cropped component artifacts only.
const shotStyle = "body > header, .skip-link, [data-detail-nav] { visibility: hidden; }";

async function expectPlan(page, front, depth) {
  const lot = page.locator("[data-solar-scene]");
  const plan = lot.getByRole("img", { name: /Plano ilustrativo del lote/ });
  await expect(lot).toContainText(`${front} × ${depth} m`);
  await expect(plan).toBeVisible();
  await expect(plan).toHaveAccessibleDescription(/Norte arriba.*calle/i);
  await expect(plan.getByText(`${front} m`, { exact: true })).toBeVisible();
  await expect(plan.getByText(`${depth} m`, { exact: true })).toBeVisible();
  await expect(plan.getByText("Calle · frente", { exact: true })).toBeVisible();
  const bounds = plan.locator("[data-lot-boundary]");
  await expect(bounds).toBeVisible();
  const box = await bounds.boundingBox();
  expect(box.width / box.height).toBeCloseTo(front / depth, 2);
  const north = await plan.getByText("N", { exact: true }).boundingBox();
  const street = await plan.getByText("Calle · frente", { exact: true }).boundingBox();
  expect(north.y).toBeLessThan(box.y + box.height / 2);
  expect(street.y).toBeGreaterThan(box.y + box.height);
  await expect(lot).toContainText(/no es un relevamiento/i);
  await expect(lot.locator("canvas")).toHaveCount(0);
  return { lot, plan };
}

test.describe("plano inicial", () => {
  test.use({ javaScriptEnabled: false });

  test("Casa Laguna muestra medidas, frente y norte sin hidratación", async ({ page }, testInfo) => {
    await page.goto(CASA);
    const { lot, plan } = await expectPlan(page, 22, 41);
    await expect(plan.locator("[data-lot-sun]")).toBeVisible();
    await expect(plan.locator("[data-lot-shadow]")).toBeVisible();
    await expect(lot.getByText("Huella conceptual", { exact: true })).toBeVisible();
    await lot.screenshot({ path: testInfo.outputPath("plano-casa-laguna.png"), style: shotStyle });
  });

  test("el plano del lote sigue disponible en la portada en una columna angosta", async ({ page }) => {
    await page.setViewportSize({ width: 1040, height: 800 });
    await page.goto(HOME);
    const { plan } = await expectPlan(page, 30, 40);
    expect((await plan.boundingBox()).width).toBeGreaterThan(360);
  });
});

// Compare decoded pixels, not PNG encoding or metadata on the canvas element.
async function changedPixels(page, before, after) {
  return page.evaluate(async ([first, second]) => {
    async function pixels(png) {
      const image = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob());
      const context = new OffscreenCanvas(image.width, image.height).getContext("2d");
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height).data;
    }
    const [a, b] = await Promise.all([pixels(first), pixels(second)]);
    if (a.length !== b.length) throw new Error("Cambió el tamaño del lienzo");
    let changed = 0;
    for (let i = 0; i < a.length; i += 4) {
      if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 24) changed++;
    }
    return changed / (a.length / 4);
  }, [before.toString("base64"), after.toString("base64")]);
}

test("la maqueta dibujada permite orbitar y conserva la cámara y el estado solar entre vistas", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(LOTE);
  const lot = page.locator("[data-solar-scene]");
  const viewport = lot.getByRole("img", { name: "Maqueta ilustrativa del lote en 3D" });
  const canvas = viewport.locator("canvas");
  const plan = lot.getByRole("img", { name: "Plano ilustrativo del lote" });
  const modelButton = lot.getByRole("button", { name: "Maqueta 3D" });
  const planButton = lot.getByRole("button", { name: "Plano 2D" });
  const reset = lot.getByRole("button", { name: "Restablecer cámara" });
  const hour = lot.getByRole("slider", { name: "Hora del sol" });
  const summer = lot.getByRole("button", { name: "Verano", exact: true });
  const winter = lot.getByRole("button", { name: "Invierno", exact: true });
  const footprint = lot.getByRole("checkbox", { name: "Mostrar huella conceptual" });
  const readout = lot.getByRole("status");

  await lot.scrollIntoViewIfNeeded();
  await expect(canvas).toBeVisible();
  await expect(viewport).toHaveAccessibleDescription(/norte.*calle/i);
  await expect(modelButton).toHaveAttribute("aria-pressed", "true");
  await expect(plan).toBeHidden();
  await expect(hour).toHaveAttribute("aria-valuetext", "15:30");
  await expect(readout).toHaveText("Sol hacia el noroeste");

  const capture = () => canvas.screenshot({ style: shotStyle });
  const initial = await capture();
  expect(await changedPixels(page, initial, await capture())).toBeLessThan(0.003);
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.57, { steps: 6 });
  await page.mouse.up();
  const orbited = await capture();
  expect(await changedPixels(page, initial, orbited)).toBeGreaterThan(0.02);
  await viewport.press("ArrowUp");
  const tilted = await capture();
  expect(await changedPixels(page, orbited, tilted)).toBeGreaterThan(0.01);
  await lot.getByRole("button", { name: "Acercar" }).press("Enter");
  const moved = await capture();
  expect(await changedPixels(page, tilted, moved)).toBeGreaterThan(0.02);

  await summer.click();
  const summerView = await capture();
  expect(await changedPixels(page, moved, summerView)).toBeGreaterThan(0.003);
  await hour.fill("10");
  await expect(readout).toHaveText("Sol hacia el noreste");
  const morning = await capture();
  expect(await changedPixels(page, summerView, morning)).toBeGreaterThan(0.005);
  await footprint.uncheck();
  const empty = await capture();
  expect(await changedPixels(page, morning, empty)).toBeGreaterThan(0.01);
  await hour.press("End");
  await expect(readout).toHaveText("Sin luz solar");
  const night = await capture();
  expect(await changedPixels(page, empty, night)).toBeGreaterThan(0.01);

  await planButton.click();
  await expect(plan).toBeVisible();
  await expect(planButton).toHaveAttribute("aria-pressed", "true");
  await expect(canvas).toBeHidden();
  await expect(hour).toHaveAttribute("aria-valuetext", "21:00");
  await expect(summer).toHaveAttribute("aria-pressed", "true");
  await expect(footprint).not.toBeChecked();
  for (const feature of ["sun", "shadow", "footprint"]) await expect(plan.locator(`[data-lot-${feature}]`)).toBeHidden();
  await winter.click();
  await hour.fill("15.5");
  await footprint.check();
  for (const feature of ["sun", "shadow", "footprint"]) await expect(plan.locator(`[data-lot-${feature}]`)).toBeVisible();
  await modelButton.click();
  await expect(canvas).toBeVisible();
  expect(await changedPixels(page, moved, await capture())).toBeLessThan(0.003);
  await reset.press("Enter");
  expect(await changedPixels(page, initial, await capture())).toBeLessThan(0.003);
  await reset.blur();
  await lot.screenshot({ path: testInfo.outputPath("maqueta-3d-lote.png"), style: shotStyle });
});

test.describe("plano interactivo", () => {
  test.use({ viewport: { width: 320, height: 720 }, isMobile: true, hasTouch: true });

  test("la portada carga la maqueta al acercarse, permite desplazar la página y vuelve al plano si pierde WebGL2", async ({ page }, testInfo) => {
    const chunks = [];
    page.on("request", (request) => {
      if (/\/SolarLotViewer3D[.-]/.test(request.url())) chunks.push(request.url());
    });
    await page.goto(HOME);
    const lot = page.locator("[data-solar-scene]");
    const plan = lot.getByRole("img", { name: "Plano ilustrativo del lote" });
    const canvas = lot.getByRole("img", { name: "Maqueta ilustrativa del lote en 3D" }).locator("canvas");
    await expect(plan).toBeVisible();
    await expect(lot.locator("canvas")).toHaveCount(0);
    expect(chunks).toHaveLength(0);
    await lot.scrollIntoViewIfNeeded();
    await expect(canvas).toBeVisible();
    expect(chunks).toHaveLength(1);
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    const scrollY = await page.evaluate(() => window.scrollY);
    const touch = await page.context().newCDPSession(page);
    const x = Math.round(box.x + box.width / 2);
    const y = Math.round(box.y + box.height * 0.76);
    await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let offset = 18; offset <= 126; offset += 18) {
      await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - offset }] });
    }
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await touch.detach();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollY + 60);
    await lot.screenshot({ path: testInfo.outputPath("maqueta-3d-portada-320.png"), style: shotStyle });

    const summer = lot.getByRole("button", { name: "Verano", exact: true });
    const hour = lot.getByRole("slider", { name: "Hora del sol" });
    await summer.tap();
    await hour.fill("10");
    expect(await canvas.evaluate((element) => {
      const extension = element.getContext("webgl2")?.getExtension("WEBGL_lose_context");
      if (!extension) return false;
      extension.loseContext();
      return true;
    })).toBe(true);
    await expect(lot.locator("canvas")).toHaveCount(0);
    await expect(plan).toBeVisible();
    await expect(plan).toHaveAccessibleDescription(/Norte arriba.*calle.*Sol hacia el noreste/);
    await expect(plan.locator("[data-lot-shadow]")).toBeVisible();
    await expect(hour).toHaveAttribute("aria-valuetext", "10:00");
    await expect(summer).toHaveAttribute("aria-pressed", "true");
    await expect(lot.getByRole("button", { name: "Maqueta 3D" })).toBeDisabled();
    await expect(lot.getByRole("button", { name: "Plano 2D" })).toHaveAttribute("aria-pressed", "true");
  });

  test("hora, estación y huella actualizan el plano angosto sin canvas", async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null;
    });
    await page.goto(LOTE);
    const { lot, plan } = await expectPlan(page, 30, 40);
    await plan.scrollIntoViewIfNeeded();
    await expect(lot.getByText("No pudimos abrir la maqueta 3D. Podés seguir con el plano.")).toBeVisible();
    const planBox = await plan.boundingBox();
    expect(planBox.x).toBeGreaterThanOrEqual(0);
    expect(planBox.x + planBox.width).toBeLessThanOrEqual(320);
    expect(planBox.width).toBeGreaterThan(240);

    const hour = lot.getByRole("slider", { name: "Hora del sol" });
    const summer = lot.getByRole("button", { name: "Verano", exact: true });
    const footprintControl = lot.getByRole("checkbox", { name: "Mostrar huella conceptual" });
    const readout = lot.getByRole("status");
    const sun = plan.locator("[data-lot-sun]");
    const shadow = plan.locator("[data-lot-shadow]");
    const footprint = plan.locator("[data-lot-footprint]");

    await expect(hour).toHaveAttribute("aria-valuetext", "15:30");
    await expect(lot.getByRole("button", { name: "Invierno", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(sun).toBeVisible();
    await expect(shadow).toBeVisible();
    const winterSun = await sun.getAttribute("transform");
    const winterShadow = await shadow.getAttribute("points");
    await summer.tap();
    await expect(summer).toHaveAttribute("aria-pressed", "true");
    await expect(hour).toHaveAttribute("aria-valuetext", "15:30");
    await expect(sun).not.toHaveAttribute("transform", winterSun);
    await expect(shadow).not.toHaveAttribute("points", winterShadow);

    const afternoonSun = await sun.getAttribute("transform");
    const afternoonShadow = await shadow.getAttribute("points");
    await hour.fill("10");
    await expect(hour).toHaveAttribute("aria-valuetext", "10:00");
    await expect(readout).toHaveText("Sol hacia el noreste");
    await expect(sun).not.toHaveAttribute("transform", afternoonSun);
    await expect(shadow).not.toHaveAttribute("points", afternoonShadow);
    const morningShadow = await shadow.getAttribute("points");

    await footprintControl.uncheck();
    await expect(footprint).toBeHidden();
    await expect(shadow).toBeHidden();
    await expect(sun).toBeVisible();
    await footprintControl.check();
    await expect(footprint).toBeVisible();
    await expect(shadow).toHaveAttribute("points", morningShadow);

    await hour.press("End");
    await expect(hour).toHaveAttribute("aria-valuetext", "21:00");
    await expect(readout).toHaveText("Sin luz solar");
    await expect(sun).toBeHidden();
    await expect(shadow).toBeHidden();
    await expect(footprint).toBeVisible();
    expect((await plan.boundingBox()).height).toBeCloseTo(planBox.height);
    await expect(lot.locator("canvas")).toHaveCount(0);

    await hour.fill("10");
    await expect(shadow).toBeVisible();
    await hour.blur();
    await lot.screenshot({ path: testInfo.outputPath("plano-lote-320.png"), style: shotStyle });
  });
});
