import { test, expect } from './fixtures';

function setReadyForEvening(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    localStorage.setItem('the-game-onboarding-done', '1');
    const state = {
      version: 1,
      protocol: {
        startedAt: new Date().toISOString(),
        morning: { completed: true, currentStep: 0, answers: {}, antiVisionSentence: 'Тестовое анти-видение', visionSentence: 'Тестовое видение', yearGoal: 'Тестовая цель' },
        daytime: { completed: true, checkpoints: {} },
        evening: { completed: false, reflections: {} },
      },
      game: { stakes: '', endgame: '', mission: '', bossFight: { name: '', progress: 0, startedAt: '' }, quests: [], rules: [], defined: false },
      xp: { total: 0, level: 1, currentStreak: 0, longestStreak: 0, lastCompletionDate: null, history: [] },
      journal: [],
    };
    localStorage.setItem('the-game-state', JSON.stringify(state));
  });
}

async function fillCardAndAdvance(page: import('@playwright/test').Page, text: string) {
  const ta = page.locator('textarea');
  await expect(ta).toBeVisible({ timeout: 5000 });
  await ta.click();
  await ta.pressSequentially(text, { delay: 0 });
  await expect(page.getByRole('button', { name: 'Далее' })).toBeEnabled({ timeout: 5000 });
  await page.getByRole('button', { name: 'Далее' }).click();
}

test.describe('Evening Protocol', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test1/');
    await page.evaluate(() => localStorage.clear());
    await setReadyForEvening(page);
    await page.reload();
  });

  test('shows evening reflection phase', async ({ page }) => {
    await page.goto('/test1/#/protocol/evening');
    await expect(page.getByText('Вечерняя Рефлексия')).toBeVisible();
  });

  test('full evening walkthrough to game creation', async ({ page }) => {
    await page.goto('/test1/#/protocol/evening');

    // 4 reflection prompts
    for (let i = 0; i < 4; i++) {
      await expect(page.getByText('Вечерняя Рефлексия')).toBeVisible();
      await fillCardAndAdvance(page, `Рефлексия ${i + 1}`);
    }

    // Transition to game setup
    await expect(page.getByText('Пора Определить Твою Игру')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Определить Игру' }).click();

    // Game setup page
    await expect(page.getByText('Определи Свою Игру')).toBeVisible();

    // Stakes should be pre-filled from anti-vision
    const stakesField = page.locator('textarea').first();
    await expect(stakesField).toHaveValue('Тестовое анти-видение');

    // Fill boss fight
    await page.locator('textarea').nth(3).fill('Месячный проект');

    // Fill quests
    await page.locator('textarea').nth(4).fill('Читать 30 минут\nТренировка');

    // Fill rules
    await page.locator('textarea').nth(5).fill('Без соцсетей до обеда');

    // Launch
    await page.getByRole('button', { name: 'Запустить Игру' }).click();

    // Should show celebration screen
    await expect(page.getByText('Игра Начинается')).toBeVisible();
    await expect(page.getByText('Трансформация запущена')).toBeVisible();

    // Enter the game
    await page.getByRole('button', { name: 'Войти в Игру' }).click();

    // Should be on dashboard with game data
    await expect(page.getByRole('heading', { name: 'СТАВКИ' })).toBeVisible();
    await expect(page.getByText('Тестовое анти-видение')).toBeVisible();
  });

  test('launch button disabled without required fields', async ({ page }) => {
    await page.goto('/test1/#/protocol/evening');

    // Skip reflections
    for (let i = 0; i < 4; i++) {
      await fillCardAndAdvance(page, `R${i}`);
    }
    await expect(page.getByText('Пора Определить Твою Игру')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Определить Игру' }).click();

    // Clear stakes field
    await page.locator('textarea').first().fill('');

    const launchBtn = page.getByRole('button', { name: 'Запустить Игру' });
    await expect(launchBtn).toBeDisabled();
  });
});
