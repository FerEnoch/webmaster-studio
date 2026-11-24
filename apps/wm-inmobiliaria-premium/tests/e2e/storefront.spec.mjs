import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";

const BASE = "/demos/inmobiliaria-premium/";
const ORIGIN = `http://127.0.0.1:${process.env.PREMIUM_E2E_PORT ?? 3033}`;
const FAVORITES_KEY = "estudio-real-state:favorites:v1";
const listings = [
  ["casa-laguna-nordelta", "Casa Laguna"],
  ["departamento-palermo-soho", "Piso en Palermo Soho"],
  ["lote-pilar-del-este", "Lote en Pilar del Este"],
  ["casa-clasica-san-isidro", "Casa clásica en San Isidro"],
  ["loft-colegiales", "Loft doble altura"],
  ["casa-minimal-canning", "Casa Minimal"],
  ["lote-villa-la-angostura", "Terreno con vista al lago"],
  ["casa-de-campo-exaltacion", "Casa de campo en el bosque"],
];

test("brand and working five-step hero/search behavior", async ({ page }, testInfo) => {
  await page.goto(BASE);
  await expect(page).toHaveTitle(/Estudio Real State/);
  await expect(page.getByRole("link", { name: "Estudio Real State", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Recorré tu próxima casa antes de visitarla\./ })).toBeVisible();
  await expect(page.locator("[data-hero-frame]")).toHaveCount(5);
  await page.screenshot({ path: testInfo.outputPath("home-top-desktop.png"), fullPage: false, animations: "disabled" });

  await page.getByRole("button", { name: "Alquiler", exact: true }).click();
  await page.getByLabel("Tipo de propiedad").selectOption("Loft");
  const search = page.getByRole("link", { name: /Buscar/ });
  await expect(search).toHaveAttribute("href", `${BASE}propiedades/?op=Alquiler&type=Loft`);
  await search.click();
  await expect(page).toHaveURL(/propiedades\/\?op=Alquiler&type=Loft$/);
  await expect(page.getByTestId("property-card")).toHaveCount(1);

  await page.goto(BASE);
  const metrics = await page.locator("[data-hero]").evaluate((hero) => ({
    top: hero.getBoundingClientRect().top + window.scrollY,
    distance: hero.clientHeight - window.innerHeight,
  }));
  await page.evaluate(({ top, distance }) => window.scrollTo(0, top + distance * 0.5), metrics);
  await expect(page.locator("[data-hero-step]")).toContainText("03 — Recorrés");
  await expect(page.locator("[data-hero-step]")).toContainText("Cada ambiente, en primera persona");
  await page.screenshot({ path: testInfo.outputPath("hero-step3-desktop.png"), fullPage: false, animations: "disabled" });
  await page.evaluate(({ top, distance }) => window.scrollTo(0, top + distance), metrics);
  await expect(page.locator("[data-hero-step]")).toContainText("05 — Te quedás");
  await expect(page.locator("[data-hero-step]")).toContainText("Antes de visitarla");
  const all = page.getByRole("link", { name: /Ver todas las propiedades/ });
  await expect(all).toBeVisible();
  await expect(all).toBeInViewport({ ratio: 1 });
  await expect(page.locator("[data-hero-step]")).toBeInViewport({ ratio: 0.9 });
  await expect(page.getByRole("banner")).toBeInViewport({ ratio: 1 });
  await expect(all).toHaveAttribute("href", `${BASE}propiedades/`);
  await page.screenshot({ path: testInfo.outputPath("hero-step5-desktop.png"), fullPage: false, animations: "disabled" });
});

test("all eight URL-backed listings plus filters, sort and map switch", async ({ page }, testInfo) => {
  await page.goto(`${BASE}propiedades`);
  await expect(page.getByRole("heading", { name: /8 propiedades/ })).toBeVisible();
  await expect(page.getByTestId("property-card")).toHaveCount(8);
  const hrefs = await page.locator("[data-property-link]").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(hrefs).toEqual(listings.map(([slug]) => `${BASE}propiedades/${slug}/`));

  for (const [slug, title] of listings) {
    const response = await page.goto(`${BASE}propiedades/${slug}/`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(page.locator("[data-detail-cover]")).toBeVisible();
    expect(await page.locator("[data-detail-cover]").evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  }

  await page.goto(`${BASE}propiedades?op=Alquiler&type=Casa`);
  await expect(page.getByTestId("property-card")).toHaveCount(1);
  await expect(page.getByTestId("property-card")).toHaveAttribute("data-property-slug", "casa-de-campo-exaltacion");
  await page.getByRole("button", { name: /Restablecer filtros/ }).click();
  await expect(page.getByTestId("property-card")).toHaveCount(8);
  await expect(page).not.toHaveURL(/op=|type=/);

  await page.getByLabel("Ordenar").selectOption("precio-desc");
  await expect(page).toHaveURL(/sort=precio-desc/);
  await expect(page.getByTestId("property-card").first()).toHaveAttribute("data-property-slug", "casa-laguna-nordelta");
  await page.getByLabel("Ordenar").selectOption("m2");
  await expect(page.getByTestId("property-card").first()).toHaveAttribute("data-property-slug", "lote-villa-la-angostura");
  await page.getByRole("textbox", { name: /Buscar barrio o ciudad/ }).fill("Palermo");
  await expect(page.getByTestId("property-card")).toHaveCount(1);
  await expect(page).toHaveURL(/q=Palermo/);
  await page.reload();
  await expect(page.getByTestId("property-card")).toHaveCount(1);
  await page.getByRole("button", { name: /Restablecer filtros/ }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Terreno", exact: true })).toBeInViewport({ ratio: 1 });
  await page.getByRole("button", { name: "Mapa", exact: true }).click();
  await expect(page).toHaveURL(/view=map/);
  await expect(page.getByRole("region", { name: /Mapa ilustrativo/ })).toBeVisible();
  await expect(page.locator("[data-catalog-list]")).toBeHidden();
  await page.getByRole("button", { name: "Lista", exact: true }).click();
  await expect(page.locator("[data-catalog-list]")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("catalog-mobile.png"), fullPage: false, animations: "disabled" });
});

test("favorites persist, remove and stay isolated to premium slugs", async ({ page }) => {
  await page.addInitScript(({ key }) => {
    if (sessionStorage.getItem("estudio-test:favorites-seeded")) return;
    localStorage.setItem("umbral:favs", JSON.stringify(["loft-colegiales"]));
    localStorage.setItem(key, JSON.stringify(["not-a-real-property"]));
    sessionStorage.setItem("estudio-test:favorites-seeded", "1");
  }, { key: FAVORITES_KEY });
  await page.goto(`${BASE}propiedades`);
  await expect(page.getByTestId("property-card")).toHaveCount(8);
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "[]"), FAVORITES_KEY)).toEqual([]);

  const favorite = page.locator('[data-favorite-slug="casa-laguna-nordelta"]');
  await favorite.click();
  await expect(favorite).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "[]"), FAVORITES_KEY)).toEqual(["casa-laguna-nordelta"]);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("umbral:favs") ?? "[]"))).toEqual(["loft-colegiales"]);

  await page.reload();
  await expect(page.locator('[data-favorite-slug="casa-laguna-nordelta"]')).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: /Favoritos/ }).first().click();
  await expect(page).toHaveURL(/favs=1/);
  await expect(page.getByTestId("property-card")).toHaveCount(1);
  await page.locator('[data-favorite-slug="casa-laguna-nordelta"]').click();
  await expect(page.getByTestId("property-card")).toHaveCount(0);
  await expect(page.getByText("Sin resultados", { exact: true })).toBeVisible();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "[]"), FAVORITES_KEY)).toEqual([]);
});

test("local images, mobile touch, keyboard and reduced-motion usability", async ({ browser }, testInfo) => {
  const reports = [];
  for (const profile of [
    { name: "desktop", viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
    { name: "mobile-touch", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  ]) {
    const context = await browser.newContext({
      viewport: profile.viewport,
      isMobile: profile.isMobile,
      hasTouch: profile.hasTouch,
      reducedMotion: "reduce",
      serviceWorkers: "block",
    });
    const page = await context.newPage();
    const blocked = [];
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (!["127.0.0.1", "localhost"].includes(url.hostname)) {
        blocked.push(route.request().url());
        await route.abort();
      } else {
        await route.continue();
      }
    });

    await page.goto(`${ORIGIN}${BASE}`);
    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("heading", { name: /Recorré tu próxima casa antes de visitarla\./ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Buscar/ })).toBeVisible();
    await expect.poll(() => page.locator("[data-hero-frame] img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
    expect(await page.locator("img").evaluateAll((images) => images.every((image) => new URL(image.currentSrc || image.src).hostname === "127.0.0.1"))).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`home-${profile.name}-reduced.png`), fullPage: false, animations: "disabled" });

    const fifth = page.getByRole("button", { name: "05 — Te quedás", exact: true });
    await fifth.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-hero-step]")).toContainText("05 — Te quedás");
    await page.getByRole("button", { name: "Alquiler", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Alquiler", exact: true })).toHaveAttribute("aria-pressed", "true");

    const homeResources = await page.evaluate(() => performance.getEntriesByType("resource").filter((entry) => entry.initiatorType === "img").map((entry) => ({
      name: entry.name,
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize,
      duration: entry.duration,
    })));
    await page.goto(`${ORIGIN}${BASE}propiedades`);
    const covers = page.locator("[data-cover-image]");
    await expect(covers).toHaveCount(8);
    for (let index = 0; index < 8; index += 1) {
      await covers.nth(index).scrollIntoViewIfNeeded();
    }
    await expect.poll(() => covers.evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath(`catalog-${profile.name}.png`), fullPage: false, animations: "disabled" });

    reports.push(await page.evaluate(({ name, blockedRequests, homeResources }) => ({
      profile: name,
      maxTouchPoints: navigator.maxTouchPoints,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      blockedRequests,
      homeResources,
      resources: performance.getEntriesByType("resource").filter((entry) => entry.initiatorType === "img").map((entry) => ({
        name: entry.name,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize,
        duration: entry.duration,
      })),
    }), { name: profile.name, blockedRequests: blocked, homeResources }));
    expect(blocked).toEqual([]);
    await context.close();
  }
  const evidence = JSON.stringify({ note: "Mobile is Chromium touch emulation, not a physical-device certification.", profiles: reports }, null, 2);
  const evidencePath = testInfo.outputPath("media-load-and-device-evidence.json");
  writeFileSync(evidencePath, evidence);
  await testInfo.attach("media-load-and-device-evidence.json", {
    path: evidencePath,
    contentType: "application/json",
  });
});
