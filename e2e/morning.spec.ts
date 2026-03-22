import { test, expect } from './fixtures';

function skipOnboarding(page: import('@playwright/test').Page) {
  return page.evaluate(() => localStorage.setItem('the-game-onboarding-done', '1'));
}

test.describe('Morning Protocol', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => localStorage.clear());
    await skipOnboarding(page);
    await page.reload();
    // Navigate to morning
    await page.getByRole('button', { name: 'Начать Протокол' }).click();
    await page.getByText('Утро — Раскопки').click();
  });

  test('shows first question with section header', async ({ page }) => {
    await expect(page.getByText('Часть 1: Саморефлексия')).toBeVisible();
    await expect(page.getByText(/Чем бы ты занимался/)).toBeVisible();
    await expect(page.getByText('1 / 21')).toBeVisible();
  });

  test('cannot advance without typing answer', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: 'Далее' });
    await expect(nextBtn).toBeDisabled();
  });

  test('can type answer and advance', async ({ page }) => {
    await page.locator('textarea').fill('Мой ответ на первый вопрос');
    const nextBtn = page.getByRole('button', { name: 'Далее' });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Should now be on step 2
    await expect(page.getByText('2 / 21')).toBeVisible();
  });

  test('can go back and preserve answer', async ({ page }) => {
    await page.locator('textarea').fill('Мой ответ');
    await page.getByRole('button', { name: 'Далее' }).click();
    await page.getByRole('button', { name: 'Назад' }).click();

    await expect(page.locator('textarea')).toHaveValue('Мой ответ');
  });

  test('full morning protocol walkthrough', async ({ page }) => {
    test.setTimeout(90000);

    async function fillAndAdvance(text: string) {
      const ta = page.locator('textarea');
      await expect(ta).toBeVisible({ timeout: 5000 });
      await ta.click();
      await ta.pressSequentially(text, { delay: 0 });
      await expect(page.getByRole('button', { name: 'Далее' })).toBeEnabled({ timeout: 5000 });
      await page.getByRole('button', { name: 'Далее' }).click();
    }

    // Go through all 11 questions
    for (let i = 0; i < 11; i++) {
      await fillAndAdvance(`Ответ ${i + 1}`);
    }

    // Part 2: Anti-Vision (3 prompts)
    await expect(page.getByText('Часть 2: Анти-Видение')).toBeVisible();
    for (let i = 0; i < 3; i++) {
      await fillAndAdvance(`Анти-видение ${i + 1}`);
    }

    // Part 3: Vision (3 prompts)
    await expect(page.getByText('Часть 3: Видение')).toBeVisible();
    for (let i = 0; i < 3; i++) {
      await fillAndAdvance(`Видение ${i + 1}`);
    }

    // Part 4: Compression (2 prompts)
    await expect(page.getByText('Часть 4: Сжатие')).toBeVisible();
    await fillAndAdvance('Моё анти-видение в одном предложении');
    await fillAndAdvance('Моё видение в одном предложении');

    // Part 5: Year Goal
    await expect(page.getByText('Часть 5: Годовой Фокус')).toBeVisible();
    await fillAndAdvance('Моя цель на год');

    // Completion screen
    await expect(page.getByText('Раскопки Завершены')).toBeVisible();
    await expect(page.getByText('ТВОЁ АНТИ-ВИДЕНИЕ')).toBeVisible();
    await expect(page.getByText('ТВОЁ ВИДЕНИЕ')).toBeVisible();
    await expect(page.getByText('Моё анти-видение в одном предложении')).toBeVisible();
    await expect(page.getByText('Моё видение в одном предложении')).toBeVisible();

    // Complete morning
    await page.getByRole('button', { name: 'Завершить и Продолжить' }).click();

    // Should be back on protocol page
    await expect(page.getByText('Протокол Перезагрузки')).toBeVisible();
  });
});
