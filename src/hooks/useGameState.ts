import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type GameState, loadState, saveState, getDefaultState, resetState as clearStorage } from '../lib/storage';
import { getLevel, getTodayStr, isYesterday, calculateDayXP } from '../lib/xp';
import React from 'react';

interface GameContextValue {
  state: GameState;
  // Protocol morning
  setMorningAnswer: (id: string, value: string) => void;
  setMorningStep: (step: number) => void;
  setAntiVisionSentence: (v: string) => void;
  setVisionSentence: (v: string) => void;
  setYearGoal: (v: string) => void;
  completeMorning: () => void;
  // Protocol daytime
  setCheckpointAnswer: (checkpointId: string, questionIdx: string, answer: string) => void;
  completeCheckpoint: (checkpointId: string) => void;
  completeDaytime: () => void;
  // Protocol evening
  setEveningReflection: (id: string, value: string) => void;
  completeEvening: () => void;
  // Game
  setGame: (game: GameState['game']) => void;
  updateBossFight: (name: string, progress: number) => void;
  addQuest: (label: string) => void;
  removeQuest: (id: string) => void;
  toggleQuest: (id: string) => { xpGained: number };
  addRule: (rule: string) => void;
  removeRule: (idx: number) => void;
  // Journal
  addJournalEntry: (entry: Omit<GameState['journal'][0], 'id' | 'date'>) => void;
  // System
  startProtocol: () => void;
  resetAll: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGameState(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameState must be used within GameProvider');
  return ctx;
}

function checkDayReset(state: GameState): GameState {
  const today = getTodayStr();
  if (state.xp.lastCompletionDate && state.xp.lastCompletionDate !== today) {
    const streakBroken = !isYesterday(state.xp.lastCompletionDate);
    return {
      ...state,
      game: {
        ...state.game,
        quests: state.game.quests.map(q => ({ ...q, completedToday: false })),
      },
      xp: {
        ...state.xp,
        currentStreak: streakBroken ? 0 : state.xp.currentStreak,
      },
    };
  }
  return state;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => checkDayReset(loadState()));

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((fn: (prev: GameState) => GameState) => {
    setState(prev => fn(prev));
  }, []);

  const setMorningAnswer = useCallback((id: string, value: string) => {
    update(s => ({
      ...s,
      protocol: {
        ...s.protocol,
        morning: { ...s.protocol.morning, answers: { ...s.protocol.morning.answers, [id]: value } },
      },
    }));
  }, [update]);

  const setMorningStep = useCallback((step: number) => {
    update(s => ({
      ...s,
      protocol: {
        ...s.protocol,
        morning: { ...s.protocol.morning, currentStep: step },
      },
    }));
  }, [update]);

  const setAntiVisionSentence = useCallback((v: string) => {
    update(s => ({
      ...s,
      protocol: {
        ...s.protocol,
        morning: { ...s.protocol.morning, antiVisionSentence: v },
      },
    }));
  }, [update]);

  const setVisionSentence = useCallback((v: string) => {
    update(s => ({
      ...s,
      protocol: {
        ...s.protocol,
        morning: { ...s.protocol.morning, visionSentence: v },
      },
    }));
  }, [update]);

  const setYearGoal = useCallback((v: string) => {
    update(s => ({
      ...s,
      protocol: {
        ...s.protocol,
        morning: { ...s.protocol.morning, yearGoal: v },
      },
    }));
  }, [update]);

  const completeMorning = useCallback(() => {
    update(s => {
      const morning = s.protocol.morning;
      const entry = {
        id: `morning-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'morning' as const,
        title: 'Утренние Раскопки',
        content: {
          ...morning.answers,
          antiVisionSentence: morning.antiVisionSentence,
          visionSentence: morning.visionSentence,
          yearGoal: morning.yearGoal,
        },
      };
      return {
        ...s,
        protocol: {
          ...s.protocol,
          morning: { ...morning, completed: true },
        },
        journal: [...s.journal, entry],
      };
    });
  }, [update]);

  const setCheckpointAnswer = useCallback((checkpointId: string, questionIdx: string, answer: string) => {
    update(s => {
      const existing = s.protocol.daytime.checkpoints[checkpointId] || { completedAt: null, answers: {} };
      return {
        ...s,
        protocol: {
          ...s.protocol,
          daytime: {
            ...s.protocol.daytime,
            checkpoints: {
              ...s.protocol.daytime.checkpoints,
              [checkpointId]: {
                ...existing,
                answers: { ...existing.answers, [questionIdx]: answer },
              },
            },
          },
        },
      };
    });
  }, [update]);

  const completeCheckpoint = useCallback((checkpointId: string) => {
    update(s => {
      const existing = s.protocol.daytime.checkpoints[checkpointId] || { completedAt: null, answers: {} };
      return {
        ...s,
        protocol: {
          ...s.protocol,
          daytime: {
            ...s.protocol.daytime,
            checkpoints: {
              ...s.protocol.daytime.checkpoints,
              [checkpointId]: { ...existing, completedAt: new Date().toISOString() },
            },
          },
        },
      };
    });
  }, [update]);

  const completeDaytime = useCallback(() => {
    update(s => ({
      ...s,
      protocol: {
        ...s.protocol,
        daytime: { ...s.protocol.daytime, completed: true },
      },
    }));
  }, [update]);

  const setEveningReflection = useCallback((id: string, value: string) => {
    update(s => ({
      ...s,
      protocol: {
        ...s.protocol,
        evening: {
          ...s.protocol.evening,
          reflections: { ...s.protocol.evening.reflections, [id]: value },
        },
      },
    }));
  }, [update]);

  const completeEvening = useCallback(() => {
    update(s => {
      const entry = {
        id: `evening-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'evening' as const,
        title: 'Вечерний Синтез',
        content: s.protocol.evening.reflections,
      };
      return {
        ...s,
        protocol: {
          ...s.protocol,
          evening: { ...s.protocol.evening, completed: true },
        },
        journal: [...s.journal, entry],
      };
    });
  }, [update]);

  const setGame = useCallback((game: GameState['game']) => {
    update(s => ({ ...s, game: { ...game, defined: true } }));
  }, [update]);

  const updateBossFight = useCallback((name: string, progress: number) => {
    update(s => ({
      ...s,
      game: {
        ...s.game,
        bossFight: { ...s.game.bossFight, name, progress: Math.min(100, Math.max(0, progress)) },
      },
    }));
  }, [update]);

  const addQuest = useCallback((label: string) => {
    update(s => ({
      ...s,
      game: {
        ...s.game,
        quests: [...s.game.quests, { id: `q-${Date.now()}`, label, completedToday: false }],
      },
    }));
  }, [update]);

  const removeQuest = useCallback((id: string) => {
    update(s => ({
      ...s,
      game: {
        ...s.game,
        quests: s.game.quests.filter(q => q.id !== id),
      },
    }));
  }, [update]);

  const toggleQuest = useCallback((id: string): { xpGained: number } => {
    let xpGained = 0;
    update(s => {
      const quests = s.game.quests.map(q =>
        q.id === id ? { ...q, completedToday: !q.completedToday } : q
      );
      const completed = quests.filter(q => q.completedToday).length;
      const today = getTodayStr();
      const wasAlreadyCompleted = s.game.quests.find(q => q.id === id)?.completedToday;

      if (wasAlreadyCompleted) {
        return { ...s, game: { ...s.game, quests } };
      }

      const dayXP = calculateDayXP(completed, quests.length, s.xp.currentStreak);
      const prevCompleted = s.game.quests.filter(q => q.completedToday).length;
      const prevDayXP = calculateDayXP(prevCompleted, quests.length, s.xp.currentStreak);
      xpGained = dayXP - prevDayXP;

      const newTotal = s.xp.total + xpGained;
      const { level } = getLevel(newTotal);

      const allDone = completed === quests.length && quests.length > 0;
      const newStreak = allDone && s.xp.lastCompletionDate !== today
        ? s.xp.currentStreak + 1
        : s.xp.currentStreak;

      return {
        ...s,
        game: { ...s.game, quests },
        xp: {
          ...s.xp,
          total: newTotal,
          level,
          currentStreak: newStreak,
          longestStreak: Math.max(s.xp.longestStreak, newStreak),
          lastCompletionDate: allDone ? today : s.xp.lastCompletionDate,
          history: allDone && s.xp.lastCompletionDate !== today
            ? [...s.xp.history, { date: today, xpEarned: dayXP, questsCompleted: completed }]
            : s.xp.history,
        },
      };
    });
    return { xpGained };
  }, [update]);

  const addRule = useCallback((rule: string) => {
    update(s => ({
      ...s,
      game: { ...s.game, rules: [...s.game.rules, rule] },
    }));
  }, [update]);

  const removeRule = useCallback((idx: number) => {
    update(s => ({
      ...s,
      game: { ...s.game, rules: s.game.rules.filter((_, i) => i !== idx) },
    }));
  }, [update]);

  const addJournalEntry = useCallback((entry: Omit<GameState['journal'][0], 'id' | 'date'>) => {
    update(s => ({
      ...s,
      journal: [
        ...s.journal,
        { ...entry, id: `${entry.type}-${Date.now()}`, date: new Date().toISOString() },
      ],
    }));
  }, [update]);

  const startProtocol = useCallback(() => {
    update(s => ({
      ...s,
      protocol: { ...s.protocol, startedAt: new Date().toISOString() },
    }));
  }, [update]);

  const resetAll = useCallback(() => {
    clearStorage();
    setState(getDefaultState());
  }, []);

  const value: GameContextValue = {
    state,
    setMorningAnswer, setMorningStep, setAntiVisionSentence, setVisionSentence,
    setYearGoal, completeMorning,
    setCheckpointAnswer, completeCheckpoint, completeDaytime,
    setEveningReflection, completeEvening,
    setGame, updateBossFight, addQuest, removeQuest, toggleQuest, addRule, removeRule,
    addJournalEntry,
    startProtocol, resetAll,
  };

  return React.createElement(GameContext.Provider, { value }, children);
}
