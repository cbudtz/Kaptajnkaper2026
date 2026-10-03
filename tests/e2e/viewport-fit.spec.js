import { expect, test } from '@playwright/test';
import { REFERENCE_VIEWPORT } from '../../src/input/mobileLayout.js';

test.describe('Viewport fit', () => {
  test.use({ viewport: REFERENCE_VIEWPORT });

  test('390×844: game + deck fill viewport on map screen', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#game-container canvas')).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Fortsæt' }).click();
    await page.getByRole('button', { name: '1 — Lydeffekter' }).click();
    await page.getByRole('button', { name: 'Fortsæt' }).click();
    await page.locator('#mobile-name-input').fill('Kaper');
    await page.getByRole('button', { name: 'OK — start spil' }).click();
    await expect(page.locator('.mobile-dpad-grid')).toBeVisible();

    const metrics = await page.evaluate(() => {
      const shell = document.getElementById('app-shell');
      const game = document.getElementById('game-container');
      const ui = document.getElementById('mobile-ui');
      const canvas = document.querySelector('#game-container canvas');
      const vv = window.visualViewport;
      return {
        vvH: Math.round(vv?.height ?? window.innerHeight),
        shellH: Math.round(shell?.getBoundingClientRect().height ?? 0),
        gameH: Math.round(game?.getBoundingClientRect().height ?? 0),
        uiH: Math.round(ui?.getBoundingClientRect().height ?? 0),
        canvasW: Math.round(canvas?.getBoundingClientRect().width ?? 0),
        canvasH: Math.round(canvas?.getBoundingClientRect().height ?? 0),
      };
    });

    expect(metrics.shellH).toBeGreaterThanOrEqual(metrics.vvH - 2);
    expect(metrics.shellH).toBeLessThanOrEqual(metrics.vvH + 2);
    expect(metrics.gameH + metrics.uiH).toBeGreaterThanOrEqual(metrics.shellH - 4);
    expect(metrics.canvasW).toBeGreaterThanOrEqual(REFERENCE_VIEWPORT.width - 8);
    expect(metrics.uiH).toBeGreaterThan(200);

    const bottomInside = await page.evaluate(() => {
      const vv = window.visualViewport;
      const vvBottom = (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight);
      const buttons = [...document.querySelectorAll('#mobile-deck button')];
      const maxBottom = Math.max(...buttons.map((b) => b.getBoundingClientRect().bottom));
      const caption = document.getElementById('mobile-caption');
      const ui = document.getElementById('mobile-ui');
      return {
        maxBottom: Math.round(maxBottom),
        vvBottom: Math.round(vvBottom),
        captionHidden:
          ui?.classList.contains('compact-deck')
          || caption?.hidden
          || getComputedStyle(caption ?? document.body).display === 'none',
      };
    });

    expect(bottomInside.captionHidden).toBe(true);
    expect(bottomInside.maxBottom).toBeLessThanOrEqual(bottomInside.vvBottom + 1);
  });
});
