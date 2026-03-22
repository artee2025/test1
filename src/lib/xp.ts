export const XP_PER_QUEST = 25;
export const XP_ALL_QUESTS_BONUS = 50;
export const XP_STREAK_BONUS = 10;
export const XP_STREAK_CAP = 100;

export function calculateDayXP(
  questsCompleted: number,
  totalQuests: number,
  streak: number
): number {
  if (totalQuests === 0) return 0;
  let xp = questsCompleted * XP_PER_QUEST;
  if (questsCompleted === totalQuests && totalQuests > 0) {
    xp += XP_ALL_QUESTS_BONUS;
  }
  xp += Math.min(streak * XP_STREAK_BONUS, XP_STREAK_CAP);
  return xp;
}

export function getLevel(totalXP: number): {
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
} {
  const level = Math.max(1, Math.floor(Math.sqrt(totalXP / 100)));
  const xpForCurrentLevel = level * level * 100;
  const xpForNextLevel = (level + 1) * (level + 1) * 100;
  return {
    level,
    xpIntoLevel: totalXP - xpForCurrentLevel,
    xpForNext: xpForNextLevel - xpForCurrentLevel,
  };
}

export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10) === dateStr;
}
