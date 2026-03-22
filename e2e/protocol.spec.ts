import { test, expect } from './fixtures';

function skipOnboarding(page: import('@playwright/test').Page) {
  return page.evaluate(() => localStorage.setItem('the-game-onboarding-done', '1'));
}

test.describe('Protocol Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => localStorage.clear());
    await skipOnboarding(page);
    await page.reload();
  });

  test('shows protocol overview', async ({ page }) => {
    await page.getByRole('button', { name: 'Начать Протокол' }).click();

    await expect(page.getByText('Протокол Перезагрузки')).toBeVisible();
    await expect(page.getByText('Утро — Раскопки')).toBeVisible();
    await expect(page.getByText('День — Прерывания')).toBeVisible();
    await expect(page.getByText('Вечер — Синтез')).toBeVisible();
  });

  test('morning phase is accessible, others locked', async ({ page }) => {
    await page.getByRole('button', { name: 'Начать Протокол' }).click();

    // Daytime and Evening should show locked
    await expect(page.getByText('🔒 Сначала пройди утро').first()).toBeVisible();
  });

  test('can navigate to morning phase', async ({ page }) => {
    await page.getByRole('button', { name: 'Начать Протокол' }).click();

    // Click the morning phase
    await page.getByText('Утро — Раскопки').click();

    // Should see first question
    await expect(page.getByText('Часть 1: Саморефлексия')).toBeVisible();
  });
});
