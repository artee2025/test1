import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { interruptCheckpoints } from '../data/prompts';
import { getCheckpointStatus, requestNotificationPermission, scheduleInterruptNotifications } from '../lib/notifications';
import TextareaPrompt from '../components/TextareaPrompt';

export default function Daytime() {
  const { state, setCheckpointAnswer, completeCheckpoint, completeDaytime } = useGameState();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Refresh status every minute
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Request notifications on mount
  useEffect(() => {
    requestNotificationPermission().then(granted => {
      if (granted) scheduleInterruptNotifications();
    });
  }, []);

  const checkpoints = state.protocol.daytime.checkpoints;

  const allCompleted = interruptCheckpoints.every(
    cp => checkpoints[cp.id]?.completedAt
  );

  const handleSave = (cpId: string) => {
    completeCheckpoint(cpId);
    setExpandedId(null);
  };

  return (
    <div className="flex-1 px-4 pt-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-2">Протокол Прерываний</h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          Сломай автопилот. На каждой контрольной точке остановись и ответь честно.
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-surface-elevated" />

        <div className="space-y-2">
          {interruptCheckpoints.map((cp, i) => {
            const status = getCheckpointStatus(cp.time);
            const data = checkpoints[cp.id];
            const isCompleted = !!data?.completedAt;
            const isExpanded = expandedId === cp.id;
            const isAccessible = status !== 'future' || isCompleted;

            return (
              <motion.div
                key={cp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  onClick={() => isAccessible && setExpandedId(isExpanded ? null : cp.id)}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all bg-transparent border-none cursor-pointer ${
                    isExpanded ? 'bg-surface-card' : ''
                  } ${!isAccessible ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {/* Dot */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold z-10 ${
                      isCompleted
                        ? 'bg-accent-emerald/20 text-accent-emerald'
                        : status === 'current'
                        ? 'bg-accent-blue/20 text-accent-blue ring-2 ring-accent-blue/30'
                        : 'bg-surface-elevated text-text-muted'
                    }`}
                  >
                    {isCompleted ? '✓' : cp.label.split(' ')[0].split(':')[0]}
                  </div>

                  <div className="flex-1">
                    <p className="text-text-primary font-medium text-sm">{cp.label}</p>
                    <p className="text-text-muted text-xs mt-0.5">
                      {isCompleted
                        ? 'Пройдено'
                        : status === 'current'
                        ? 'Активно'
                        : status === 'past'
                        ? 'Пропущено'
                        : 'Впереди'}
                    </p>
                  </div>

                  {isAccessible && (
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-text-muted text-sm"
                    >
                      ▼
                    </motion.span>
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-14 pr-4 pb-4 space-y-4">
                        {cp.questions.map((q, qi) => (
                          <TextareaPrompt
                            key={qi}
                            prompt={q}
                            value={data?.answers?.[String(qi)] || ''}
                            onChange={val => setCheckpointAnswer(cp.id, String(qi), val)}
                            minRows={2}
                          />
                        ))}
                        {!isCompleted && (
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSave(cp.id)}
                            className="w-full py-3 rounded-xl bg-accent-blue text-white font-semibold text-sm border-none cursor-pointer"
                          >
                            Сохранить точку
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {allCompleted && !state.protocol.daytime.completed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }}
          onClick={completeDaytime}
          className="w-full mt-6 py-3.5 rounded-xl bg-accent-amber text-surface font-semibold text-sm border-none cursor-pointer"
        >
          Завершить Дневную Фазу
        </motion.button>
      )}
    </div>
  );
}
