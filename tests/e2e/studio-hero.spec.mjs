import { test, expect } from './browser.mjs';
import { inventory } from './inventory.mjs';

const scope = inventory();

for (const width of [1920, 2560]) {
  test(`studio hero: Desarrollo fits its real reveal mask at ${width}px`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'Wide desktop geometry only');
    test.skip(!scope.selected.some((app) => app.name === 'wm-portfolio'), 'Portfolio unchanged');
    await page.setViewportSize({ width, height: 1440 });
    await page.goto('/');
    const word = page.locator('[data-wm-hero] h1 .wm-lines > span > span').filter({ hasText: /^Desarrollo$/ });
    await expect(word).toBeVisible();
    await word.evaluate(async (node) => {
      await document.fonts.ready;
      await Promise.all(node.getAnimations().map((animation) => animation.finished));
    });
    const geometry = await word.evaluate((node) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      const text = range.getBoundingClientRect();
      const mask = node.parentElement.getBoundingClientRect();
      return { word: node.textContent.trim(), text: { left: text.left, right: text.right, width: text.width },
        mask: { left: mask.left, right: mask.right, width: mask.width },
        overflow: getComputedStyle(node.parentElement).overflowX,
        animation: getComputedStyle(node).animationName };
    });
    expect(geometry.word).toBe('Desarrollo');
    expect(geometry.overflow, 'keep the actual reveal mask').toBe('hidden');
    expect(geometry.animation, 'keep the line reveal').toBe('wm-line-in');
    expect(geometry.text.width).toBeGreaterThan(0);
    expect(geometry.text.left, JSON.stringify(geometry)).toBeGreaterThanOrEqual(geometry.mask.left - 1);
    expect(geometry.text.right, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.mask.right + 1);
    await expect(page.locator('[data-wm-hero] a.wm-btn')).toHaveText('Solicitar cotización');
    await expect(page.locator('[data-wm-hero] a.wm-btn')).toHaveAttribute('href', '#demo');
    expect(await page.locator('[data-wm-hero] h1 + p').evaluate((node) => node.getBoundingClientRect().width)).toBeLessThanOrEqual(576);
  });
}
