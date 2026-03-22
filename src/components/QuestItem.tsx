import { motion } from 'framer-motion';
import { useState } from 'react';

interface QuestItemProps {
  label: string;
  completed: boolean;
  onToggle: () => void;
  onRemove?: () => void;
}

export default function QuestItem({ label, completed, onToggle, onRemove }: QuestItemProps) {
  const [justCompleted, setJustCompleted] = useState(false);

  const handleToggle = () => {
    if (!completed) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
    onToggle();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{
        opacity: 1,
        x: 0,
        backgroundColor: justCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(26, 26, 36, 1)',
      }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
    >
      <motion.button
        whileTap={{ scale: 0.85 }}
        animate={justCompleted ? { scale: [1, 1.3, 1] } : {}}
        onClick={handleToggle}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-transparent cursor-pointer transition-colors ${
          completed
            ? 'border-accent-emerald bg-accent-emerald/20'
            : 'border-text-muted'
        }`}
      >
        {completed && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </motion.button>

      <span
        className={`flex-1 text-sm transition-all ${
          completed ? 'text-text-muted line-through' : 'text-text-primary'
        }`}
      >
        {label}
      </span>

      {onRemove && (
        <button
          onClick={onRemove}
          className="text-text-muted hover:text-accent-red text-xs bg-transparent border-none cursor-pointer px-1"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
}
