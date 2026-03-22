import { motion, AnimatePresence } from 'framer-motion';

interface XPToastProps {
  amount: number;
  visible: boolean;
}

export default function XPToast({ amount, visible }: XPToastProps) {
  return (
    <AnimatePresence>
      {visible && amount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed bottom-24 right-6 z-50 text-accent-amber font-bold text-lg pointer-events-none drop-shadow-lg"
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
