import { test, expect } from "@playwright/test";

const BASE = "/demos/inmobiliaria-premium/";
const CASA = `${BASE}propiedades/casa-laguna-nordelta/`;

test("detail sticky sections, gallery/lightbox and facts stay linked to plan", async ({ page }, testInfo) => {
  await page.goto(CASA);
  await expect(page.getByRole("heading", { name: "Casa Laguna", exact: true })).toBeVisible();
  await expect(page.locator("[data-detail-nav]")).toBeVisible();
  await expect(page.locator("[data-facts-price]")).toContainText("USD");
  await expect(page.locator("[data-facts-m2]")).toContainText("m²");
  await expect(page.locator("[data-facts-list]")).toContainText("Ambientes");

  // Sticky nav anchors move without reload.
  await page.locator('[data-detail-nav] a[href="#galeria"]').click();
  await expect(page.locator("[data-gallery]")).toBeInViewport();
  await page.locator('[data-detail-nav] a[href="#experiencia"]').click();
  await expect(page.locator("[data-room-tour]").first()).toBeInViewport();
  await page.locator('[data-detail-nav] a[href="#simuladores"]').click();
  await expect(page.locator("[data-simulator-valuacion]")).toBeInViewport();

  // Gallery navigation updates counter and plan-linked state.
  await page.goto(CASA);
  await expect(page.locator("[data-gallery-counter]")).toContainText("1 de 5");
  await page.locator("[data-gallery-next]").click();
  await expect(page.locator("[data-gallery-counter]")).toContainText("2 de 5");
  await page.locator("[data-gallery-prev]").click();
  await expect(page.locator("[data-gallery-counter]")).toContainText("1 de 5");

  // Lightbox opens, keyboard navigates, Esc closes.
  await page.locator("[data-gallery-open]").first().click();
  await expect(page.locator("[data-lightbox]")).toBeVisible();
  await expect(page.locator("[data-lightbox-image]")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("[data-lightbox]")).toContainText("2 de 5");
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-lightbox]")).toBeHidden();
  await page.screenshot({ path: testInfo.outputPath("detail-gallery-1440.png"), fullPage: false, animations: "disabled" });
});

test("mobile detail navigation lands on the tour and lot clear of the sticky links", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(CASA);
  const nav = page.getByRole("navigation", { name: "Secciones de la ficha" });

  for (const [label, anchor] of [["Recorrido", "experiencia"], ["Terreno", "terreno"]]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(`${CASA}#${anchor}`);
    const heading = page.locator(`#${anchor}`).getByRole("heading", { level: 2 }).first();
    await expect(heading).toBeInViewport();
    const [navBox, headingBox] = await Promise.all([nav.boundingBox(), heading.boundingBox()]);
    expect(headingBox.y).toBeGreaterThanOrEqual(navBox.y + navBox.height + 8);
    await page.screenshot({ path: testInfo.outputPath(`${anchor}-320.png`), animations: "disabled" });
  }
});

test("room tour follows a named photo route with synchronized chapters", async ({ page }) => {
  await page.clock.install();
  await page.goto(CASA);
  const tour = page.locator("[data-room-tour]").first();
  const viewer = tour.locator("[data-tour-viewport]");
  const route = tour.getByRole("list", { name: "Paradas del recorrido" });
  const guide = tour.getByRole("button", { name: "Modo guiado" });
  const photo = viewer.getByRole("img");
  const expectChapter = async (name, number, image) => {
    await expect(tour.locator("[data-tour-counter]")).toContainText(`${name} · ${number} de 5`);
    await expect(route.locator('[aria-current="step"]')).toHaveCount(1);
    await expect(route.getByRole("button", { name, exact: true })).toHaveAttribute("aria-current", "step");
    await expect(photo).toBeVisible();
    await expect.poll(() => photo.evaluate((img) => img.complete && img.naturalWidth > 0 && img.currentSrc)).toMatch(new RegExp(`/${image}-\\d+\\.webp$`));
  };

  await expect(tour).toBeVisible();
  await expect(viewer.getByRole("button", { name: "Siguiente: Living" })).toBeVisible();
  const [tourBox, viewerBox] = await Promise.all([tour.boundingBox(), viewer.boundingBox()]);
  expect(viewerBox.width).toBeCloseTo(tourBox.width, 0);
  await expect(route.getByRole("button")).toHaveText([/Llegada/, /Living/, /Cocina/, /Galería y pileta/, /Atardecer/]);
  await expect(route.locator("img")).toHaveCount(5);
  await expect(tour.getByRole("img", { name: /plano/i })).toHaveCount(0);
  await expectChapter("Llegada", 1, "hero-arrival");

  // The guide is opt-in; the labeled photo controls follow the same route.
  await expect(guide).toHaveAttribute("aria-pressed", "false");
  await page.clock.fastForward(5_000);
  await expectChapter("Llegada", 1, "hero-arrival");
  await viewer.getByRole("button", { name: "Siguiente: Living" }).click();
  await expectChapter("Living", 2, "laguna-living");
  await viewer.getByRole("button", { name: "Anterior: Llegada" }).click();
  await expectChapter("Llegada", 1, "hero-arrival");

  await route.getByRole("button", { name: "Cocina", exact: true }).click();
  await expectChapter("Cocina", 3, "laguna-kitchen");
  await viewer.press("ArrowRight");
  await expectChapter("Galería y pileta", 4, "laguna-pool");
  await viewer.press("ArrowLeft");
  await expectChapter("Cocina", 3, "laguna-kitchen");

  await guide.click();
  await expect(guide).toHaveAttribute("aria-pressed", "true");
  await page.clock.fastForward(5_000);
  await expectChapter("Galería y pileta", 4, "laguna-pool");
  await page.clock.fastForward(5_000);
  await expectChapter("Atardecer", 5, "hero-villa-pool");
  await expect(guide).toHaveAttribute("aria-pressed", "false");
  await viewer.getByRole("button", { name: "Volver a Llegada" }).click();
  await expectChapter("Llegada", 1, "hero-arrival");
});

test("room tour on touch keeps manual navigation with reduced motion", async ({ browser }, testInfo) => {
  const motion = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce", serviceWorkers: "block" });
  try {
    const page = await motion.newPage();
    await page.goto(CASA);
    const tour = page.locator("[data-room-tour]").first();
    const viewer = tour.locator("[data-tour-viewport]");
    const route = tour.getByRole("list", { name: "Paradas del recorrido" });
    const guide = tour.getByRole("button", { name: "Modo guiado" });
    await expect(guide).toBeDisabled();
    await expect(guide).toHaveAttribute("aria-pressed", "false");

    await viewer.getByRole("button", { name: "Siguiente: Living" }).tap();
    await expect(tour.locator("[data-tour-counter]")).toContainText("Living · 2 de 5");
    await expect(route.getByRole("button", { name: "Living", exact: true })).toHaveAttribute("aria-current", "step");
    await route.getByRole("button", { name: "Cocina", exact: true }).tap();
    await expect(viewer.getByRole("img", { name: "Cocina abierta con isla y luz natural" })).toBeVisible();
    await viewer.getByRole("button", { name: "Siguiente: Galería y pileta" }).tap();
    const active = route.getByRole("button", { name: "Galería y pileta", exact: true });
    await expect(active).toHaveAttribute("aria-current", "step");
    expect(await active.evaluate((button) => {
      const card = button.getBoundingClientRect();
      const rail = button.closest("ol").getBoundingClientRect();
      return card.left >= rail.left - 1 && card.right <= rail.right + 1;
    })).toBe(true);
    expect(await tour.evaluate((node) => node.scrollWidth)).toBeLessThanOrEqual(390);
    await viewer.scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("tour-reduced-motion-390.png"), fullPage: false, animations: "disabled" });
  } finally {
    await motion.close();
  }
});

test("valuation, credit and visit are local simulations with no network or storage", async ({ page }) => {
  const requests = [];
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") requests.push(route.request().url());
    await route.continue();
  });
  await page.goto(CASA);
  const beforeStorage = await page.evaluate(() => ({ ...localStorage }));

  await expect(page.locator("[data-simulator-valuacion]")).toBeVisible();
  await page.locator("[data-valuacion-m2]").fill("350");
  await expect(page.locator("[data-valuacion-resultado]")).toContainText("350 m²");
  await expect(page.locator("[data-valuacion-resultado]")).toContainText("USD");

  await page.locator("[data-credito-entrada]").fill("40");
  await page.locator("[data-credito-tasa]").fill("9");
  await page.locator("[data-credito-anos]").fill("15");
  await expect(page.locator("[data-credito-resultado]")).toContainText("Cuota sintética");

  await page.locator("[data-visita-dia]").selectOption("Domingo");
  await page.locator("[data-visita-turno]").selectOption("15:30");
  await page.locator("[data-visita-confirmar]").click();
  await expect(page.locator("[data-visita-resultado]")).toContainText("Domingo");
  await expect(page.locator("[data-visita-resultado]")).toContainText("15:30");
  await expect(page.locator("[data-visita-resultado]")).toContainText("No agendamos nada real");

  expect(requests).toEqual([]);
  const afterStorage = await page.evaluate(() => ({ ...localStorage }));
  const leaked = Object.entries(afterStorage).filter(([key]) => !(key in beforeStorage) && !key.startsWith("estudio-real-state:favorites"));
  expect(leaked).toEqual([]);
  const formKeys = Object.keys(afterStorage).filter((key) => /m2|entrada|tasa|visita|simul/i.test(key));
  expect(formKeys).toEqual([]);
});
