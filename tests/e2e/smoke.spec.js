import { expect, test } from '@playwright/test';

test.describe('Kaptajn Kaper smoke', () => {
  test('loads game shell and mobile UI', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#game-container')).toBeVisible();
    await expect(page.locator('#mobile-ui')).toBeVisible();

    const canvas = page.locator('#game-container canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    await expect(page.getByRole('button', { name: 'Fortsæt' })).toBeVisible();
    await expect(page.locator('#mobile-deck button')).toHaveCount(3);
  });

  test('intro flow via mobile buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#game-container canvas')).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Fortsæt' }).click();
    await page.getByRole('button', { name: '1 — Lydeffekter' }).click();
    await page.getByRole('button', { name: 'Fortsæt' }).click();

    await page.locator('#mobile-name-input').fill('Test');
    await page.getByRole('button', { name: 'OK — start spil' }).click();

    await expect(page.locator('.mobile-dpad-grid')).toBeVisible({
      timeout: 10000,
    });
  });
});
