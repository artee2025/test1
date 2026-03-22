import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ONBOARDING_KEY = 'the-game-onboarding-done';

export function isOnboardingDone(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === '1';
}

function markOnboardingDone() {
  localStorage.setItem(ONBOARDING_KEY, '1');
}

interface Step {
  icon: string;
  title: string;
  description: string;
  highlight?: string;
}

const steps: Step[] = [
  {
    icon: '⚔️',
    title: 'Добро пожаловать в The Game',
    description:
      'Это не просто приложение — это система трансформации жизни. Ты определишь свою миссию, создашь ежедневные квесты и будешь прокачиваться каждый день.',
    highlight: 'Превращаем жизнь в игру',
  },
  {
    icon: '🌅',
    title: 'Утро — Раскопки',
    description:
      'Начни день с глубокой саморефлексии. Ответь на 11 провокационных вопросов, создай анти-видение (жизнь, которую отказываешься допустить) и видение (к чему стремишься).',
    highlight: '30-60 минут честности с собой',
  },
  {
    icon: '⚡',
    title: 'День — Прерывания',
    description:
      '6 контрольных точек в течение дня. В каждой — 3 вопроса, которые вырывают тебя из автопилота и возвращают к осознанности.',
    highlight: 'Ломаем бессознательные паттерны',
  },
  {
    icon: '🌙',
    title: 'Вечер — Синтез',
    description:
      'Подведи итоги дня, определи ставки, миссию, босс-файт и ежедневные квесты. Здесь рождается твоя игра.',
    highlight: 'Из инсайтов — в систему',
  },
  {
    icon: '🎮',
    title: 'Твоя Игра',
    description:
      'Выполняй квесты — получай XP. Поддерживай серию — повышай уровень. Записывай мысли в дневник. Каждый день — новая возможность прокачаться.',
    highlight: 'XP • Уровни • Серии • Дневник',
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const step = steps[current];
  const isLast = current === steps.length - 1;

  const next = () => {
    if (isLast) {
      markOnboardingDone();
      onComplete();
    } else {
      setDirection(1);
      setCurrent(c => c + 1);
    }
  };

  const prev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(c => c - 1);
    }
  };

  const skip = () => {
    markOnboardingDone();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <button
          onClick={skip}
          className="text-text-muted text-xs bg-transparent border-none cursor-pointer py-2 px-3"
        >
          Пропустить
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -200 : 200, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              className="text-7xl mb-8"
            >
              {step.icon}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold mb-4 text-text-primary"
            >
              {step.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-text-secondary text-sm leading-relaxed mb-6"
            >
              {step.description}
            </motion.p>

            {step.highlight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                className="px-4 py-2 rounded-full bg-accent-amber/10 border border-accent-amber/20"
              >
                <span className="text-accent-amber text-xs font-semibold">
                  {step.highlight}
                </span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? '#f59e0b' : 'rgba(255,255,255,0.15)',
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {current > 0 && (
            <motion.button
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={prev}
              className="py-3.5 px-6 rounded-xl bg-surface-elevated text-text-primary font-semibold text-sm border-none cursor-pointer"
            >
              Назад
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={next}
            className="flex-1 py-3.5 rounded-xl bg-accent-amber text-surface font-semibold text-sm border-none cursor-pointer"
          >
            {isLast ? 'Начать!' : 'Далее'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
