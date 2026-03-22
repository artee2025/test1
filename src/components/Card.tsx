import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import ProgressBar from './ProgressBar';

interface CardProps {
  children: ReactNode;
  step: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  canAdvance?: boolean;
  nextLabel?: string;
}

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export default function Card({
  children,
  step,
  totalSteps,
  onNext,
  onBack,
  canAdvance = true,
  nextLabel = 'Continue',
}: CardProps) {
  const [direction, setDirection] = useState(1);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) {
      if (info.offset.x < 0 && onNext && canAdvance) {
        setDirection(1);
        onNext();
      } else if (info.offset.x > 0 && onBack) {
        setDirection(-1);
        onBack();
      }
    }
  };

  const handleNext = () => {
    if (onNext && canAdvance) {
      setDirection(1);
      onNext();
    }
  };

  const handleBack = () => {
    if (onBack) {
      setDirection(-1);
      onBack();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-surface z-40">
      <div className="px-4 pt-[env(safe-area-inset-top)] mt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted font-medium">
            {step + 1} / {totalSteps}
          </span>
          {onBack && (
            <button
              onClick={handleBack}
              className="text-xs text-text-secondary bg-transparent border-none cursor-pointer px-2 py-1"
            >
              Back
            </button>
          )}
        </div>
        <ProgressBar percent={((step + 1) / totalSteps) * 100} />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="flex-1 overflow-y-auto px-6 py-6 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <div className="px-6 pb-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {onNext && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            disabled={!canAdvance}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all border-none cursor-pointer ${
              canAdvance
                ? 'bg-accent-amber text-surface'
                : 'bg-surface-elevated text-text-muted cursor-not-allowed'
            }`}
          >
            {nextLabel}
          </motion.button>
        )}
      </div>
    </div>
  );
}
