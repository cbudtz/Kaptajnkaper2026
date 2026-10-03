import { expect, test } from '@playwright/test';

test.describe('Mobile play flow', () => {
  test('map deck fills bottom and name step does not trap zoom', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#game-container canvas')).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Fortsæt' }).click();
    await page.getByRole('button', { name: '1 — Lydeffekter' }).click();
    await page.getByRole('button', { name: 'Fortsæt' }).click();

    const input = page.locator('#mobile-name-input');
    await expect(input).toBeVisible();
    await input.fill('Ole');
    await page.getByRole('button', { name: 'OK — start spil' }).click();
    await expect(input).toBeHidden({ timeout: 5000 });

    const deck = page.locator('#mobile-deck');
    const dpad = page.locator('.mobile-dpad-grid');
    await expect(dpad).toBeVisible();
    await expect(dpad.locator('button')).toHaveCount(8);

    const deckBox = await deck.boundingBox();
    const uiBox = await page.locator('#mobile-ui').boundingBox();
    expect(deckBox?.height ?? 0).toBeGreaterThan(120);
    expect(uiBox?.height ?? 0).toBeGreaterThan(200);

    await page.getByRole('button', { name: '↑' }).click();
    await page.getByRole('button', { name: '↑' }).click();
    await expect(page.locator('#game-container canvas')).toBeVisible();
  });
});
