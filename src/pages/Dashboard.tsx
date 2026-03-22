import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { getLevel } from '../lib/xp';
import { gameLabels } from '../data/prompts';
import ProgressBar from '../components/ProgressBar';
import QuestItem from '../components/QuestItem';
import StreakFire from '../components/StreakFire';
import XPToast from '../components/XPToast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, toggleQuest, updateBossFight } = useGameState();
  const { game, xp } = state;
  const [xpToast, setXpToast] = useState({ amount: 0, visible: false });
  const [editingBoss, setEditingBoss] = useState(false);
  const [bossProgress, setBossProgress] = useState(game.bossFight.progress);

  const { level, xpIntoLevel, xpForNext } = getLevel(xp.total);

  if (!game.defined) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-6xl mb-6"
        >
          ⚔️
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-3 text-center"
        >
          Твоя Игра Ждёт
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-text-secondary text-sm text-center mb-6 max-w-xs leading-relaxed"
        >
          Пройди Протокол Перезагрузки, чтобы определить анти-видение, видение, миссию и ежедневные квесты. После этого здесь будет твой командный центр.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/protocol')}
          className="py-3.5 px-8 rounded-xl bg-accent-amber text-surface font-semibold text-sm border-none cursor-pointer"
        >
          Начать Протокол
        </motion.button>
      </div>
    );
  }

  const handleToggleQuest = (id: string) => {
    const { xpGained } = toggleQuest(id);
    if (xpGained > 0) {
      setXpToast({ amount: xpGained, visible: true });
      setTimeout(() => setXpToast(p => ({ ...p, visible: false })), 800);
    }
  };

  const completedQuests = game.quests.filter(q => q.completedToday).length;

  return (
    <div className="flex-1 px-4 pt-6 pb-24 overflow-y-auto">
      <XPToast amount={xpToast.amount} visible={xpToast.visible} />

      {/* Header: Level + XP + Streak */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-xl bg-accent-amber/15 flex items-center justify-center">
            <span className="text-accent-amber font-bold text-sm">LV{level}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-text-secondary font-medium">
                {xp.total} XP
              </span>
              <span className="text-xs text-text-muted">
                {xpForNext - xpIntoLevel} до след.
              </span>
            </div>
            <ProgressBar percent={(xpIntoLevel / xpForNext) * 100} color="bg-accent-amber" />
          </div>
        </div>
        <StreakFire streak={xp.currentStreak} />
      </motion.div>

      {/* STAKES */}
      <GameCard
        index={0}
        label={gameLabels.stakes}
        bgClass="bg-accent-red/5 border-accent-red/15"
        labelColor="text-accent-red"
      >
        <p className="text-text-primary text-sm">{game.stakes}</p>
      </GameCard>

      {/* ENDGAME */}
      <GameCard
        index={1}
        label={gameLabels.endgame}
        bgClass="bg-accent-emerald/5 border-accent-emerald/15"
        labelColor="text-accent-emerald"
      >
        <p className="text-text-primary text-sm">{game.endgame}</p>
      </GameCard>

      {/* MISSION */}
      <GameCard
        index={2}
        label={gameLabels.mission}
        bgClass="bg-accent-amber/5 border-accent-amber/15"
        labelColor="text-accent-amber"
      >
        <p className="text-text-primary text-sm">{game.mission}</p>
      </GameCard>

      {/* BOSS FIGHT */}
      <GameCard
        index={3}
        label={gameLabels.bossFight}
        bgClass="bg-accent-purple/5 border-accent-purple/15"
        labelColor="text-accent-purple"
      >
        <p className="text-text-primary text-sm font-medium mb-3">{game.bossFight.name}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={game.bossFight.progress} color="bg-accent-purple" height="h-2" />
          </div>
          <button
            onClick={() => { setEditingBoss(!editingBoss); setBossProgress(game.bossFight.progress); }}
            className="text-xs text-accent-purple bg-transparent border-none cursor-pointer"
          >
            {Math.round(game.bossFight.progress)}%
          </button>
        </div>
        <AnimatePresence>
          {editingBoss && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 mt-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={bossProgress}
                  onChange={e => setBossProgress(Number(e.target.value))}
                  className="flex-1 accent-purple-500"
                />
                <button
                  onClick={() => {
                    updateBossFight(game.bossFight.name, bossProgress);
                    setEditingBoss(false);
                  }}
                  className="text-xs bg-accent-purple/20 text-accent-purple px-3 py-1.5 rounded-lg border-none cursor-pointer font-medium"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GameCard>

      {/* QUESTS */}
      <GameCard
        index={4}
        label={{
          ...gameLabels.quests,
          subtitle: `${completedQuests}/${game.quests.length} выполнено`,
        }}
        bgClass="bg-accent-blue/5 border-accent-blue/15"
        labelColor="text-accent-blue"
      >
        {game.quests.length > 0 ? (
          <div className="space-y-2">
            {game.quests.map(quest => (
              <QuestItem
                key={quest.id}
                label={quest.label}
                completed={quest.completedToday}
                onToggle={() => handleToggleQuest(quest.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm">Квесты ещё не заданы.</p>
        )}
      </GameCard>

      {/* RULES */}
      {game.rules.length > 0 && (
        <GameCard
          index={5}
          label={gameLabels.rules}
          bgClass="bg-white/[0.02] border-white/5"
          labelColor="text-text-secondary"
        >
          <div className="space-y-2">
            {game.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-text-muted text-xs mt-0.5">•</span>
                <span className="text-text-primary text-sm">{rule}</span>
              </div>
            ))}
          </div>
        </GameCard>
      )}
    </div>
  );
}

function GameCard({
  children,
  index,
  label,
  bgClass,
  labelColor,
}: {
  children: React.ReactNode;
  index: number;
  label: { title: string; subtitle: string; icon: string };
  bgClass: string;
  labelColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06 }}
      className={`p-4 rounded-2xl border mb-4 ${bgClass}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{label.icon}</span>
        <div>
          <h3 className={`text-xs font-bold tracking-wider uppercase ${labelColor}`}>
            {label.title}
          </h3>
          <p className="text-text-muted text-[10px]">{label.subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}
