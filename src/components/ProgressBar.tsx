import { motion } from 'framer-motion';

interface ProgressBarProps {
  percent: number;
  color?: string;
  height?: string;
}

export default function ProgressBar({
  percent,
  color = 'bg-accent-emerald',
  height = 'h-1',
}: ProgressBarProps) {
  return (
    <div className={`w-full ${height} bg-surface-elevated rounded-full overflow-hidden`}>
      <motion.div
        className={`${height} ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />
    </div>
  );
}
