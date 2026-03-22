import { test, expect } from './fixtures';

function setGameState(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    localStorage.setItem('the-game-onboarding-done', '1');
    const state = {
      version: 1,
      protocol: {
        startedAt: new Date().toISOString(),
        morning: { completed: true, currentStep: 0, answers: {}, antiVisionSentence: 'T', visionSentence: 'T', yearGoal: 'T' },
        daytime: { completed: true, checkpoints: {} },
        evening: { completed: true, reflections: {} },
      },
      game: {
        stakes: 'S', endgame: 'E', mission: 'M',
        bossFight: { name: 'B', progress: 0, startedAt: '' },
        quests: [
          { id: 'q1', label: 'Тестовый квест', completedToday: false },
        ],
        rules: ['Тестовое правило'],
        defined: true,
      },
      xp: { total: 250, level: 1, currentStreak: 5, longestStreak: 10, lastCompletionDate: null, history: [{ date: '2026-03-21', xpEarned: 100, questsCompleted: 3 }] },
      journal: [{ id: 'j1', date: new Date().toISOString(), type: 'morning', title: 'T', content: {} }],
    };
    localStorage.setItem('the-game-state', JSON.stringify(state));
  });
}

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => localStorage.clear());
    await setGameState(page);
    await page.reload();
  });

  test('shows settings page', async ({ page }) => {
    await page.goto('/test1/#/settings');
    await expect(page.getByText('Настройки')).toBeVisible();
  });

  test('shows stats', async ({ page }) => {
    await page.goto('/test1/#/settings');
    await expect(page.getByText('Статистика')).toBeVisible();
    await expect(page.getByText('250')).toBeVisible(); // Total XP
    await expect(page.getByText('Всего XP')).toBeVisible();
    await expect(page.getByText('Уровень')).toBeVisible();
    await expect(page.getByText('Текущая серия')).toBeVisible();
    await expect(page.getByText('Лучшая серия')).toBeVisible();
    await expect(page.getByText('Записей в дневнике')).toBeVisible();
    await expect(page.getByText('Дней отслежено')).toBeVisible();
  });

  test('can add a new quest', async ({ page }) => {
    await page.goto('/test1/#/settings');
    await page.getByPlaceholder('Новый квест...').fill('Новый тест квест');
    await page.getByRole('button', { name: 'Добавить' }).first().click();

    await expect(page.getByText('Новый тест квест')).toBeVisible();
  });

  test('can remove a quest', async ({ page }) => {
    await page.goto('/test1/#/settings');
    await expect(page.getByText('Тестовый квест')).toBeVisible();

    // Click remove button next to quest
    const questRow = page.locator('div').filter({ hasText: /^Тестовый квест/ });
    await questRow.locator('button').click();

    await expect(page.getByText('Тестовый квест')).not.toBeVisible();
  });

  test('can add a new rule', async ({ page }) => {
    await page.goto('/test1/#/settings');
    await page.getByPlaceholder('Новое правило...').fill('Новое тест правило');
    // Second "Добавить" button (for rules)
    await page.getByRole('button', { name: 'Добавить' }).nth(1).click();

    await expect(page.getByText('Новое тест правило')).toBeVisible();
  });

  test('shows reset confirmation dialog', async ({ page }) => {
    await page.goto('/test1/#/settings');
    await page.getByRole('button', { name: 'Сбросить все данные' }).click();

    await expect(page.getByText('Сбросить всё?')).toBeVisible();
    await expect(page.getByText('безвозвратно удалены')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Отмена' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Удалить всё' })).toBeVisible();
  });

  test('cancel reset closes dialog', async ({ page }) => {
    await page.goto('/test1/#/settings');
    await page.getByRole('button', { name: 'Сбросить все данные' }).click();
    await page.getByRole('button', { name: 'Отмена' }).click();

    await expect(page.getByText('Сбросить всё?')).not.toBeVisible();
  });

  test('confirm reset clears all data', async ({ page }) => {
    await page.goto('/test1/#/settings');
    await page.getByRole('button', { name: 'Сбросить все данные' }).click();
    await page.getByRole('button', { name: 'Удалить всё' }).click();

    // Stats should reset
    await expect(page.getByText('250')).not.toBeVisible();
  });

  test('shows footer text', async ({ page }) => {
    await page.goto('/test1/#/settings');
    await expect(page.getByText('Протокол Перезагрузки Жизни')).toBeVisible();
    await expect(page.getByText('По методологии Дэна Коу')).toBeVisible();
  });
});
