import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { requestNotificationPermission } from '../lib/notifications';

export default function Settings() {
  const { state, resetAll, addQuest, removeQuest, addRule, removeRule } = useGameState();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newQuest, setNewQuest] = useState('');
  const [newRule, setNewRule] = useState('');
  const [notifStatus, setNotifStatus] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const handleNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifStatus(granted ? 'granted' : 'denied');
  };

  const handleAddQuest = () => {
    if (newQuest.trim()) {
      addQuest(newQuest.trim());
      setNewQuest('');
    }
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      addRule(newRule.trim());
      setNewRule('');
    }
  };

  return (
    <div className="flex-1 px-4 pt-6 pb-24 overflow-y-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        Настройки
      </motion.h1>

      {/* Notifications */}
      <Section title="Уведомления">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary text-sm">Напоминания о прерываниях</p>
            <p className="text-text-muted text-xs">
              Status: {notifStatus === 'granted' ? 'Включено' : notifStatus === 'denied' ? 'Заблокировано' : 'Не задано'}
            </p>
          </div>
          <button
            onClick={handleNotifications}
            className="text-xs bg-surface-elevated text-text-primary px-3 py-2 rounded-lg border-none cursor-pointer"
          >
            {notifStatus === 'granted' ? 'Включено ✓' : 'Включить'}
          </button>
        </div>
      </Section>

      {/* Edit Quests */}
      {state.game.defined && (
        <Section title="Редактировать Квесты">
          <div className="space-y-2 mb-3">
            {state.game.quests.map(q => (
              <div key={q.id} className="flex items-center justify-between p-2 rounded-lg bg-surface-card/50">
                <span className="text-text-primary text-sm">{q.label}</span>
                <button
                  onClick={() => removeQuest(q.id)}
                  className="text-text-muted hover:text-accent-red text-xs bg-transparent border-none cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newQuest}
              onChange={e => setNewQuest(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddQuest()}
              placeholder="Новый квест..."
              className="flex-1 bg-surface-card border border-white/5 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue/50"
            />
            <button
              onClick={handleAddQuest}
              className="px-3 py-2 bg-accent-blue/20 text-accent-blue rounded-lg text-sm font-medium border-none cursor-pointer"
            >
              Добавить
            </button>
          </div>
        </Section>
      )}

      {/* Edit Rules */}
      {state.game.defined && (
        <Section title="Редактировать Правила">
          <div className="space-y-2 mb-3">
            {state.game.rules.map((rule, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface-card/50">
                <span className="text-text-primary text-sm">{rule}</span>
                <button
                  onClick={() => removeRule(i)}
                  className="text-text-muted hover:text-accent-red text-xs bg-transparent border-none cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newRule}
              onChange={e => setNewRule(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddRule()}
              placeholder="Новое правило..."
              className="flex-1 bg-surface-card border border-white/5 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-white/10"
            />
            <button
              onClick={handleAddRule}
              className="px-3 py-2 bg-white/5 text-text-primary rounded-lg text-sm font-medium border-none cursor-pointer"
            >
              Добавить
            </button>
          </div>
        </Section>
      )}

      {/* Stats */}
      <Section title="Статистика">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Всего XP" value={String(state.xp.total)} />
          <StatCard label="Уровень" value={String(state.xp.level)} />
          <StatCard label="Текущая серия" value={`${state.xp.currentStreak}d`} />
          <StatCard label="Лучшая серия" value={`${state.xp.longestStreak}d`} />
          <StatCard label="Записей в дневнике" value={String(state.journal.length)} />
          <StatCard label="Дней отслежено" value={String(state.xp.history.length)} />
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Опасная зона">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full py-3 rounded-xl bg-accent-red/10 text-accent-red font-medium text-sm border border-accent-red/20 cursor-pointer"
        >
          Сбросить все данные
        </button>
      </Section>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface-card rounded-2xl p-6 w-full max-w-sm border border-white/10"
            >
              <h3 className="text-lg font-bold mb-2">Сбросить всё?</h3>
              <p className="text-text-secondary text-sm mb-6">
                Все ответы протокола, данные игры, записи дневника и XP будут безвозвратно удалены. Это нельзя отменить.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-surface-elevated text-text-primary font-medium text-sm border-none cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    resetAll();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-accent-red text-white font-medium text-sm border-none cursor-pointer"
                >
                  Удалить всё
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mt-8 mb-4">
        <p className="text-text-muted text-xs">
          The Game — Протокол Перезагрузки Жизни
        </p>
        <p className="text-text-muted text-[10px] mt-1">
          По методологии Дэна Коу
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-6"
    >
      <h2 className="text-xs font-bold text-text-muted tracking-wider uppercase mb-3">
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-surface-card border border-white/5 text-center">
      <p className="text-lg font-bold text-text-primary">{value}</p>
      <p className="text-text-muted text-xs">{label}</p>
    </div>
  );
}
