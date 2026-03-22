import { motion } from 'framer-motion';

interface StreakFireProps {
  streak: number;
}

export default function StreakFire({ streak }: StreakFireProps) {
  if (streak <= 0) return null;

  return (
    <motion.div
      animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      className="flex items-center gap-1.5 text-accent-amber"
    >
      <span className="text-lg">🔥</span>
      <span className="text-sm font-bold">{streak}д</span>
    </motion.div>
  );
}
