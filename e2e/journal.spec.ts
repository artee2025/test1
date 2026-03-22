import { test, expect } from './fixtures';

function setGameWithJournal(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    localStorage.setItem('the-game-onboarding-done', '1');
    const state = {
      version: 1,
      protocol: {
        startedAt: new Date().toISOString(),
        morning: { completed: true, currentStep: 0, answers: {}, antiVisionSentence: 'Test', visionSentence: 'Test', yearGoal: 'Test' },
        daytime: { completed: true, checkpoints: {} },
        evening: { completed: true, reflections: {} },
      },
      game: {
        stakes: 'S', endgame: 'E', mission: 'M',
        bossFight: { name: 'B', progress: 0, startedAt: '' },
        quests: [], rules: [], defined: true,
      },
      xp: { total: 0, level: 1, currentStreak: 0, longestStreak: 0, lastCompletionDate: null, history: [] },
      journal: [
        { id: 'morning-1', date: '2026-03-22T08:00:00.000Z', type: 'morning', title: 'Утренние Раскопки', content: { q1: 'Ответ 1' } },
        { id: 'evening-1', date: '2026-03-22T21:00:00.000Z', type: 'evening', title: 'Вечерний Синтез', content: { e1: 'Рефлексия 1' } },
      ],
    };
    localStorage.setItem('the-game-state', JSON.stringify(state));
  });
}

test.describe('Journal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => localStorage.clear());
    await setGameWithJournal(page);
    await page.reload();
  });

  test('shows journal page with entries', async ({ page }) => {
    await page.goto('/test1/#/journal');
    await expect(page.getByText('Дневник')).toBeVisible();
    await expect(page.getByText('Утренние Раскопки')).toBeVisible();
    await expect(page.getByText('Вечерний Синтез')).toBeVisible();
  });

  test('filter tabs work', async ({ page }) => {
    await page.goto('/test1/#/journal');

    // Filter by morning
    await page.getByRole('button', { name: 'Утро', exact: true }).click();
    await expect(page.getByText('Утренние Раскопки')).toBeVisible();
    await expect(page.getByText('Вечерний Синтез')).not.toBeVisible();

    // Filter by evening
    await page.getByRole('button', { name: 'Вечер', exact: true }).click();
    await expect(page.getByText('Вечерний Синтез')).toBeVisible();
    await expect(page.getByText('Утренние Раскопки')).not.toBeVisible();

    // Show all
    await page.getByRole('button', { name: 'Все', exact: true }).click();
    await expect(page.getByText('Утренние Раскопки')).toBeVisible();
    await expect(page.getByText('Вечерний Синтез')).toBeVisible();
  });

  test('shows empty state when no entries match filter', async ({ page }) => {
    await page.goto('/test1/#/journal');
    await page.getByRole('button', { name: 'Ежедневно' }).click();
    await expect(page.getByText(/Записей типа .* пока нет/)).toBeVisible();
  });

  test('can open journal entry detail', async ({ page }) => {
    await page.goto('/test1/#/journal');
    await page.getByText('Утренние Раскопки').click();

    await expect(page.getByText('← Назад')).toBeVisible();
    await expect(page.getByText('Ответ 1')).toBeVisible();
  });

  test('can navigate back from entry', async ({ page }) => {
    await page.goto('/test1/#/journal');
    await page.getByText('Утренние Раскопки').click();
    await page.getByText('← Назад').click();

    await expect(page.getByText('Дневник')).toBeVisible();
  });

  test('entry not found page works', async ({ page }) => {
    await page.goto('/test1/#/journal/nonexistent-id');
    await expect(page.getByText('Запись не найдена')).toBeVisible();
    await expect(page.getByText('Вернуться в Дневник')).toBeVisible();
  });
});

test.describe('Journal - Empty State', () => {
  test('shows empty state when no entries', async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('the-game-onboarding-done', '1');
    });
    await page.reload();

    await page.goto('/test1/#/journal');
    await expect(page.getByText('Записей пока нет')).toBeVisible();
  });
});
