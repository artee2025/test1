import { test, expect } from './fixtures';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('the-game-onboarding-done', '1');
    });
    await page.reload();
  });

  test('bottom nav shows all tabs in Russian', async ({ page }) => {
    await expect(page.getByText('Игра', { exact: true })).toBeVisible();
    await expect(page.getByText('Протокол', { exact: true })).toBeVisible();
    await expect(page.getByText('Дневник', { exact: true })).toBeVisible();
    await expect(page.getByText('Настройки', { exact: true })).toBeVisible();
  });

  test('can navigate between all tabs', async ({ page }) => {
    // Protocol
    await page.getByText('Протокол', { exact: true }).click();
    await expect(page.getByText('Протокол Перезагрузки')).toBeVisible();

    // Journal
    await page.getByText('Дневник', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Дневник' })).toBeVisible();

    // Settings
    await page.getByText('Настройки', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Настройки' })).toBeVisible();

    // Back to Game
    await page.getByText('Игра', { exact: true }).click();
    await expect(page.getByText('Твоя Игра Ждёт')).toBeVisible();
  });

  test('bottom nav hidden during morning protocol', async ({ page }) => {
    await page.getByRole('button', { name: 'Начать Протокол' }).click();
    await page.getByText('Утро — Раскопки').click();

    // Bottom nav should not be visible
    await expect(page.locator('nav')).not.toBeVisible();
  });
});
