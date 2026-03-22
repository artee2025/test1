import { test, expect } from './fixtures';

test.describe('Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows onboarding on first visit', async ({ page }) => {
    await expect(page.getByText('Добро пожаловать в The Game')).toBeVisible();
    await expect(page.getByText('Превращаем жизнь в игру')).toBeVisible();
  });

  test('navigates through all 5 steps', async ({ page }) => {
    const titles = [
      'Добро пожаловать в The Game',
      'Утро — Раскопки',
      'День — Прерывания',
      'Вечер — Синтез',
      'Твоя Игра',
    ];

    for (let i = 0; i < titles.length; i++) {
      await expect(page.getByText(titles[i])).toBeVisible();
      if (i < titles.length - 1) {
        await page.getByRole('button', { name: 'Далее' }).click();
      }
    }

    // Last step shows "Начать!" button
    await expect(page.getByRole('button', { name: 'Начать!' })).toBeVisible();
  });

  test('can go back during onboarding', async ({ page }) => {
    await page.getByRole('button', { name: 'Далее' }).click();
    await expect(page.getByText('Утро — Раскопки')).toBeVisible();

    await page.getByRole('button', { name: 'Назад' }).click();
    await expect(page.getByText('Добро пожаловать в The Game')).toBeVisible();
  });

  test('skip button bypasses onboarding', async ({ page }) => {
    await page.getByText('Пропустить').click();
    // Should see dashboard
    await expect(page.getByText('Твоя Игра Ждёт')).toBeVisible();
  });

  test('completing onboarding shows dashboard', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Далее' }).click();
    }
    await page.getByRole('button', { name: 'Начать!' }).click();
    await expect(page.getByText('Твоя Игра Ждёт')).toBeVisible();
  });

  test('onboarding not shown on second visit', async ({ page }) => {
    await page.getByText('Пропустить').click();
    await expect(page.getByText('Твоя Игра Ждёт')).toBeVisible();

    await page.reload();
    // Should go straight to dashboard
    await expect(page.getByText('Твоя Игра Ждёт')).toBeVisible();
    await expect(page.getByText('Добро пожаловать в The Game')).not.toBeVisible();
  });
});
