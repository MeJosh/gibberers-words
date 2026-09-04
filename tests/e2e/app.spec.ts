import { expect, test } from '@playwright/test';

test('shows all five words and draws a different card', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Your five words' })).toBeVisible();
  await expect(page.locator('.word-row')).toHaveCount(5);

  const originalCard = await page.locator('.card-number').textContent();
  await page.getByRole('button', { name: 'Draw another card' }).click();
  await expect(page.locator('.card-number')).not.toHaveText(originalCard ?? '');
});

test('switches between generations', async ({ page }) => {
  await page.goto('/');

  const originalCard = await page.locator('.card-number').textContent();
  await page.locator('.generation-button[data-generation="5"]').click();
  await expect(page.getByText('Generation 5', { exact: true })).toBeVisible();
  await expect(page.locator('.word-row')).toHaveCount(5);

  await page.locator('.generation-button[data-generation="1"]').click();
  await expect(page.locator('.card-number')).toHaveText(originalCard ?? '');
});

test('does not overflow a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
});
