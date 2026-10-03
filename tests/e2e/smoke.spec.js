import { expect, test } from '@playwright/test';

test.describe('Kaptajn Kaper smoke', () => {
  test('loads game shell and mobile UI', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#game-container')).toBeVisible();
    await expect(page.locator('#mobile-ui')).toBeAttached();
    await expect(page.locator('button[data-key=" "]').first()).toBeVisible();

    const canvas = page.locator('#game-container canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });
  });

  test('intro flow via mobile buttons', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-panel="intro"] button[data-key=" "]').click();
    await page.locator('[data-panel="sound"] button[data-key="1"]').click();
    await page.locator('[data-panel="title"] button[data-key=" "]').click();

    await page.locator('#mobile-name-input').fill('Test');
    await page.locator('[data-panel="name"] button[data-key="Enter"]').click();

    await expect(page.locator('.mobile-panel[data-panel="play-map"].active')).toBeVisible({
      timeout: 10000,
    });
  });
});
