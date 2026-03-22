import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';

const phases = [
  {
    id: 'morning',
    title: 'Утро — Раскопки',
    subtitle: 'Глубокая саморефлексия. Раскрой своё анти-видение и видение.',
    duration: '30-60 мин',
    icon: '🌅',
    color: 'border-accent-amber/30 bg-accent-amber/5',
    path: '/protocol/morning',
  },
  {
    id: 'daytime',
    title: 'День — Прерывания',
    subtitle: 'Сломай автопилот с помощью 6 контрольных точек осознанности.',
    duration: 'В течение дня',
    icon: '⚡',
    color: 'border-accent-blue/30 bg-accent-blue/5',
    path: '/protocol/daytime',
  },
  {
    id: 'evening',
    title: 'Вечер — Синтез',
    subtitle: 'Интегрируй инсайты. Определи свою Игру.',
    duration: '20-30 мин',
    icon: '🌙',
    color: 'border-accent-purple/30 bg-accent-purple/5',
    path: '/protocol/evening',
  },
];

export default function Protocol() {
  const navigate = useNavigate();
  const { state, startProtocol } = useGameState();
  const { protocol } = state;

  const getPhaseStatus = (id: string) => {
    if (id === 'morning') return protocol.morning.completed ? 'completed' : protocol.morning.currentStep > 0 ? 'in-progress' : 'locked';
    if (id === 'daytime') return protocol.daytime.completed ? 'completed' : protocol.morning.completed ? 'unlocked' : 'locked';
    if (id === 'evening') return protocol.evening.completed ? 'completed' : protocol.morning.completed ? 'unlocked' : 'locked';
    return 'locked';
  };

  const handleStart = (path: string, id: string) => {
    if (!protocol.startedAt) startProtocol();
    const status = getPhaseStatus(id);
    if (status === 'locked') return;
    navigate(path);
  };

  return (
    <div className="flex-1 px-4 pt-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold mb-2">Протокол Перезагрузки</h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Комплексный протокол для исследования идентичности, прерывания бессознательных паттернов и определения игры, в которую ты хочешь играть.
        </p>
      </motion.div>

      <div className="space-y-4">
        {phases.map((phase, i) => {
          const status = getPhaseStatus(phase.id);
          const isLocked = status === 'locked';
          const isCompleted = status === 'completed';

          return (
            <motion.button
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={isLocked ? {} : { scale: 0.98 }}
              onClick={() => handleStart(phase.path, phase.id)}
              className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                isLocked
                  ? 'border-white/5 bg-surface-card/50 opacity-50 cursor-not-allowed'
                  : phase.color
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{phase.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-primary text-base">
                      {phase.title}
                    </h3>
                    {isCompleted && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-accent-emerald text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed mb-2">
                    {phase.subtitle}
                  </p>
                  <span className="text-text-muted text-xs">
                    {isLocked ? '🔒 Сначала пройди утро' : phase.duration}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {protocol.morning.completed && protocol.evening.completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-4 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 text-center"
        >
          <p className="text-accent-emerald text-sm font-medium">
            Протокол завершён! Твоя Игра определена.
          </p>
        </motion.div>
      )}
    </div>
  );
}
