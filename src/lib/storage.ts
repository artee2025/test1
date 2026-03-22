const STORAGE_KEY = 'the-game-state';
const VERSION = 1;

export interface Quest {
  id: string;
  label: string;
  completedToday: boolean;
}

export interface GameState {
  version: number;

  protocol: {
    startedAt: string | null;
    morning: {
      completed: boolean;
      currentStep: number;
      answers: Record<string, string>;
      antiVisionSentence: string;
      visionSentence: string;
      yearGoal: string;
    };
    daytime: {
      completed: boolean;
      checkpoints: Record<string, {
        completedAt: string | null;
        answers: Record<string, string>;
      }>;
    };
    evening: {
      completed: boolean;
      reflections: Record<string, string>;
    };
  };

  game: {
    stakes: string;
    endgame: string;
    mission: string;
    bossFight: { name: string; progress: number; startedAt: string };
    quests: Quest[];
    rules: string[];
    defined: boolean;
  };

  xp: {
    total: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastCompletionDate: string | null;
    history: { date: string; xpEarned: number; questsCompleted: number }[];
  };

  journal: {
    id: string;
    date: string;
    type: 'morning' | 'daytime' | 'evening' | 'daily';
    title: string;
    content: Record<string, string>;
  }[];
}

export function getDefaultState(): GameState {
  return {
    version: VERSION,
    protocol: {
      startedAt: null,
      morning: {
        completed: false,
        currentStep: 0,
        answers: {},
        antiVisionSentence: '',
        visionSentence: '',
        yearGoal: '',
      },
      daytime: {
        completed: false,
        checkpoints: {},
      },
      evening: {
        completed: false,
        reflections: {},
      },
    },
    game: {
      stakes: '',
      endgame: '',
      mission: '',
      bossFight: { name: '', progress: 0, startedAt: '' },
      quests: [],
      rules: [],
      defined: false,
    },
    xp: {
      total: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
      history: [],
    },
    journal: [],
  };
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.version !== VERSION) return getDefaultState();
    return parsed;
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
