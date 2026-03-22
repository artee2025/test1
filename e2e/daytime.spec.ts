import { test, expect } from './fixtures';

function setMorningCompleted(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    localStorage.setItem('the-game-onboarding-done', '1');
    const state = {
      version: 1,
      protocol: {
        startedAt: new Date().toISOString(),
        morning: { completed: true, currentStep: 0, answers: {}, antiVisionSentence: 'Тест', visionSentence: 'Тест', yearGoal: 'Тест' },
        daytime: { completed: false, checkpoints: {} },
        evening: { completed: false, reflections: {} },
      },
      game: { stakes: '', endgame: '', mission: '', bossFight: { name: '', progress: 0, startedAt: '' }, quests: [], rules: [], defined: false },
      xp: { total: 0, level: 1, currentStreak: 0, longestStreak: 0, lastCompletionDate: null, history: [] },
      journal: [{ id: 'morning-1', date: new Date().toISOString(), type: 'morning', title: 'Утренние Раскопки', content: {} }],
    };
    localStorage.setItem('the-game-state', JSON.stringify(state));
  });
}

test.describe('Daytime Protocol', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => localStorage.clear());
    await setMorningCompleted(page);
    await page.reload();
  });

  test('daytime phase is unlocked after morning', async ({ page }) => {
    await page.goto('/test1/#/protocol');
    // The daytime phase should show its duration, not locked text
    await expect(page.getByText('День — Прерывания')).toBeVisible();
  });

  test('shows interrupt protocol page', async ({ page }) => {
    await page.goto('/test1/#/protocol/daytime');

    await expect(page.getByText('Протокол Прерываний')).toBeVisible();
    await expect(page.getByText('Сломай автопилот')).toBeVisible();
  });

  test('shows 6 checkpoints', async ({ page }) => {
    await page.goto('/test1/#/protocol/daytime');

    await expect(page.getByText('11:00')).toBeVisible();
    await expect(page.getByText('13:30')).toBeVisible();
    await expect(page.getByText('15:15')).toBeVisible();
    await expect(page.getByText('17:00')).toBeVisible();
    await expect(page.getByText('19:30')).toBeVisible();
    await expect(page.getByText('21:00')).toBeVisible();
  });

  test('checkpoints show status labels in Russian', async ({ page }) => {
    await page.goto('/test1/#/protocol/daytime');
    await expect(page.getByText('Протокол Прерываний')).toBeVisible();

    // At least one of these status labels should appear
    const statuses = ['Пройдено', 'Активно', 'Пропущено', 'Впереди'];
    let found = false;
    for (const s of statuses) {
      if ((await page.getByText(s, { exact: true }).count()) > 0) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});
