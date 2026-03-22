import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';

const typeColors: Record<string, string> = {
  morning: 'bg-accent-amber/15 text-accent-amber',
  daytime: 'bg-accent-blue/15 text-accent-blue',
  evening: 'bg-accent-purple/15 text-accent-purple',
  daily: 'bg-accent-emerald/15 text-accent-emerald',
};

const typeLabels: Record<string, string> = {
  morning: 'Утро',
  daytime: 'День',
  evening: 'Вечер',
  daily: 'Ежедневно',
};

export default function Journal() {
  const { state } = useGameState();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');

  const entries = [...state.journal]
    .reverse()
    .filter(e => filter === 'all' || e.type === filter);

  const filters = ['all', 'morning', 'daytime', 'evening', 'daily'];

  return (
    <div className="flex-1 px-4 pt-6 pb-24">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-4"
      >
        Дневник
      </motion.h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border-none cursor-pointer transition-all ${
              filter === f
                ? 'bg-accent-amber/15 text-accent-amber'
                : 'bg-surface-card text-text-muted'
            }`}
          >
            {f === 'all' ? 'Все' : typeLabels[f]}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <p className="text-4xl mb-3">📖</p>
          <p className="text-text-muted text-sm">
            {filter === 'all'
              ? 'Записей пока нет. Пройди протокол, чтобы начать.'
              : `Записей типа ${typeLabels[filter]} пока нет.`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => {
            const preview = Object.values(entry.content)[0] || '';
            return (
              <motion.button
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/journal/${entry.id}`)}
                className="w-full text-left p-4 rounded-xl bg-surface-card border border-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[entry.type]}`}
                  >
                    {typeLabels[entry.type]}
                  </span>
                  <span className="text-text-muted text-xs">
                    {new Date(entry.date).toLocaleDateString('ru-RU', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-text-primary text-sm font-medium mb-1">{entry.title}</p>
                {preview && (
                  <p className="text-text-muted text-xs line-clamp-2">{preview}</p>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
