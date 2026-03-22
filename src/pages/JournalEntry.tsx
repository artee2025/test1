import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';

export default function JournalEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useGameState();

  const entry = state.journal.find(e => e.id === id);

  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 pb-24">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-text-muted text-sm mb-4">Entry not found</p>
          <button
            onClick={() => navigate('/journal')}
            className="text-accent-amber text-sm bg-transparent border-none cursor-pointer"
          >
            Back to Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 pt-6 pb-24 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate('/journal')}
          className="text-text-secondary text-sm bg-transparent border-none cursor-pointer mb-4 flex items-center gap-1"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold mb-1">{entry.title}</h1>
        <p className="text-text-muted text-xs mb-6">
          {new Date(entry.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        <div className="space-y-6">
          {Object.entries(entry.content).map(([key, value], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-surface-card border border-white/5"
            >
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium mb-2">
                {key.replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').trim()}
              </p>
              <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                {value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
