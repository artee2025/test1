import { test, expect } from './fixtures';

function skipOnboarding(page: import('@playwright/test').Page) {
  return page.evaluate(() => localStorage.setItem('the-game-onboarding-done', '1'));
}

test.describe('Dashboard - Empty State', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => localStorage.clear());
    await skipOnboarding(page);
    await page.reload();
  });

  test('shows empty state when game not defined', async ({ page }) => {
    await expect(page.getByText('Твоя Игра Ждёт')).toBeVisible();
    await expect(page.getByText('Начать Протокол')).toBeVisible();
  });

  test('Begin Protocol button navigates to protocol page', async ({ page }) => {
    await page.getByRole('button', { name: 'Начать Протокол' }).click();
    await expect(page.getByText('Протокол Перезагрузки')).toBeVisible();
  });
});

test.describe('Dashboard - Game Defined', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => {
      localStorage.setItem('the-game-onboarding-done', '1');
      const state = {
        version: 1,
        protocol: {
          startedAt: new Date().toISOString(),
          morning: { completed: true, currentStep: 0, answers: {}, antiVisionSentence: 'Тест анти', visionSentence: 'Тест видение', yearGoal: 'Тест цель' },
          daytime: { completed: true, checkpoints: {} },
          evening: { completed: true, reflections: {} },
        },
        game: {
          stakes: 'Тестовые ставки',
          endgame: 'Тестовый финал',
          mission: 'Тестовая миссия',
          bossFight: { name: 'Тестовый босс', progress: 30, startedAt: new Date().toISOString() },
          quests: [
            { id: 'q1', label: 'Квест 1', completedToday: false },
            { id: 'q2', label: 'Квест 2', completedToday: false },
          ],
          rules: ['Правило 1', 'Правило 2'],
          defined: true,
        },
        xp: { total: 100, level: 1, currentStreak: 3, longestStreak: 5, lastCompletionDate: null, history: [] },
        journal: [],
      };
      localStorage.setItem('the-game-state', JSON.stringify(state));
    });
    await page.reload();
  });

  test('displays game cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'СТАВКИ' })).toBeVisible();
    await expect(page.getByText('Тестовые ставки')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ФИНАЛ' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'МИССИЯ' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'БОСС-ФАЙТ' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ЕЖЕДНЕВНЫЕ КВЕСТЫ' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ПРАВИЛА' })).toBeVisible();
  });

  test('displays XP and level', async ({ page }) => {
    await expect(page.getByText('100 XP')).toBeVisible();
    await expect(page.getByText('LV1')).toBeVisible();
  });

  test('displays streak', async ({ page }) => {
    await expect(page.getByText('3д')).toBeVisible();
  });

  test('can toggle quest completion', async ({ page }) => {
    const quest1 = page.getByText('Квест 1');
    await expect(quest1).toBeVisible();

    // Click the toggle button (circle before quest text)
    const questRow = page.locator('div').filter({ hasText: /^Квест 1$/ }).first();
    await questRow.locator('button').first().click();

    // Quest should show as completed (line-through style)
    await expect(page.getByText('Квест 1')).toHaveClass(/line-through/);
  });

  test('shows quests completion count', async ({ page }) => {
    await expect(page.getByText('0/2 выполнено')).toBeVisible();
  });

  test('can update boss fight progress', async ({ page }) => {
    await page.getByText('30%').click();
    await expect(page.getByText('Сохранить')).toBeVisible();
  });
});
