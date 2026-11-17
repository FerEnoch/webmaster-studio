import { test as base, expect } from '@playwright/test';

export { expect };
export const test = base.extend({
  page: async ({ page, baseURL }, use, info) => {
    const errors = [], external = new Set();
    const origin = new URL(baseURL).origin;
    const localAsset = (request) => new URL(request.url()).origin === origin &&
      (['script', 'stylesheet'].includes(request.resourceType()) || /\.(?:js|css)(?:\?|$)/.test(request.url()));
    page.on('pageerror', (error) => errors.push(`Uncaught: ${error.stack ?? error.message}`));
    page.on('requestfailed', (request) => {
      if (localAsset(request)) errors.push(`Failed asset: ${request.url()} ${request.failure()?.errorText}`);
    });
    page.on('response', (response) => {
      if (!localAsset(response.request())) return;
      const type = response.headers()['content-type'] ?? '';
      if (!response.ok() || !/(?:javascript|text\/css)/.test(type)) {
        errors.push(`Bad asset: ${response.status()} ${type} ${response.url()}`);
      }
    });
    await page.route('**/*', async (route) => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === origin || !['http:', 'https:'].includes(url.protocol)) return route.continue();
      external.add(`${request.resourceType()} ${url.origin}`);
      // Offline media/font scope only; unexpected external app code or APIs are defects.
      if (!['image', 'media', 'font'].includes(request.resourceType()) &&
          !(url.hostname === 'fonts.googleapis.com' && request.resourceType() === 'stylesheet')) {
        errors.push(`Unexpected external dependency: ${request.resourceType()} ${request.url()}`);
      }
      await route.abort('blockedbyclient');
    });
    await use(page);
    await info.attach('browser-scope', {
      body: JSON.stringify({ errors, externalBlockedNonGating: [...external].sort() }, null, 2), contentType: 'application/json',
    });
    expect(errors, 'uncaught JS and local script/style failures (external media/fonts excluded)').toEqual([]);
  },
});

export async function hydrate(control) {
  await control.scrollIntoViewIfNeeded();
  const island = control.locator('xpath=ancestor::astro-island[1]');
  await expect(island).toHaveCount(1);
  await expect(island).not.toHaveAttribute('ssr');
}
