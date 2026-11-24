import { test, expect, hydrate } from './browser.mjs';
import { inventory } from './inventory.mjs';

const { selected } = inventory();

for (const [id, name] of [
  ['inmobiliaria', 'Inmobiliaria'],
  ['inmobiliaria-premium', 'Estudio Real State'],
]) {
  test(`real-estate family links to ${name} and back to the studio`, async ({ page }) => {
    test.skip(!selected.some((app) => ['wm-portfolio', `wm-${id}`].includes(app.name)), 'Portfolio and demo unchanged');
    expect((await page.goto('/demos/?rubro=inmobiliaria')).status()).toBe(200);
    const family = page.getByRole('button', { name: 'Inmobiliaria', exact: true });
    await hydrate(family);
    await expect(family).toHaveAttribute('aria-pressed', 'true');

    const cards = page.locator('[data-wm-rubro-card]').filter({ visible: true });
    await expect(cards).toHaveCount(2);
    const standard = page.locator('[data-wm-rubro-card="inmobiliaria"]');
    const premium = page.locator('[data-wm-rubro-card="inmobiliaria-premium"]');
    await expect(standard.getByText('Inmobiliaria', { exact: true }).first()).toBeVisible();
    await expect(premium.getByText('Estudio Real State', { exact: true })).toBeVisible();
    await expect(premium.getByRole('img')).toHaveAttribute('src', /30781823/);
    await expect(standard.getByRole('img')).not.toHaveAttribute('src', /30781823/);

    const card = id === 'inmobiliaria' ? standard : premium;
    const link = card.getByRole('link', { name: 'Explorar solución', exact: true });
    await expect(link).toHaveAttribute('href', `/demos/${id}/`);
    await expect(link).toHaveAttribute('data-astro-reload', '');
    const [landing] = await Promise.all([
      page.waitForResponse((response) => response.request().isNavigationRequest() && new URL(response.url()).pathname === `/demos/${id}/`),
      link.click(),
    ]);
    expect(landing.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(`/demos/${id}/$`));
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    if (id === 'inmobiliaria-premium') await expect(page).toHaveTitle(/Estudio Real State/);

    const back = page.getByRole('link', { name: 'Ir a Webmaster Studio' });
    await expect(back).toHaveAttribute('href', '/');
    await expect(back).toHaveAttribute('data-astro-reload', '');
    const [studio] = await Promise.all([
      page.waitForResponse((response) => response.request().isNavigationRequest() && new URL(response.url()).pathname === '/'),
      back.click(),
    ]);
    expect(studio.status()).toBe(200);
    await expect(page).toHaveURL(new URL('/', page.url()).href);
  });
}
