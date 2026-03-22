import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import TextareaPrompt from '../components/TextareaPrompt';
import { useGameState } from '../hooks/useGameState';
import {
  morningQuestions,
  antiVisionPrompts,
  visionPrompts,
  compressionPrompts,
} from '../data/prompts';

interface StepDef {
  type: 'question' | 'antiVision' | 'vision' | 'compressAnti' | 'compressVision' | 'yearGoal' | 'complete';
  id: string;
  prompt: string;
}

export default function Morning() {
  const navigate = useNavigate();
  const {
    state,
    setMorningAnswer,
    setMorningStep,
    setAntiVisionSentence,
    setVisionSentence,
    setYearGoal,
    completeMorning,
  } = useGameState();

  const morning = state.protocol.morning;

  const steps = useMemo<StepDef[]>(() => {
    const s: StepDef[] = [];
    // 11 reflection questions
    for (const q of morningQuestions) {
      s.push({ type: 'question', id: q.id, prompt: q.prompt });
    }
    // Anti-vision (3 prompts)
    for (const av of antiVisionPrompts) {
      s.push({ type: 'antiVision', id: av.id, prompt: av.prompt });
    }
    // Vision (3 prompts)
    for (const v of visionPrompts) {
      s.push({ type: 'vision', id: v.id, prompt: v.prompt });
    }
    // Compression
    s.push({ type: 'compressAnti', id: 'compress-anti', prompt: compressionPrompts.antiVision });
    s.push({ type: 'compressVision', id: 'compress-vision', prompt: compressionPrompts.vision });
    // Year goal
    s.push({ type: 'yearGoal', id: 'year-goal', prompt: compressionPrompts.yearGoal });
    // Completion
    s.push({ type: 'complete', id: 'complete', prompt: '' });
    return s;
  }, []);

  const currentStep = morning.currentStep;
  const step = steps[currentStep];
  const totalSteps = steps.length;

  const getValue = (): string => {
    if (!step) return '';
    if (step.type === 'compressAnti') return morning.antiVisionSentence;
    if (step.type === 'compressVision') return morning.visionSentence;
    if (step.type === 'yearGoal') return morning.yearGoal;
    return morning.answers[step.id] || '';
  };

  const setValue = (val: string) => {
    if (step.type === 'compressAnti') setAntiVisionSentence(val);
    else if (step.type === 'compressVision') setVisionSentence(val);
    else if (step.type === 'yearGoal') setYearGoal(val);
    else setMorningAnswer(step.id, val);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setMorningStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setMorningStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeMorning();
    navigate('/protocol');
  };

  if (step.type === 'complete') {
    return (
      <Card
        step={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-6xl mb-6"
          >
            🌅
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-3"
          >
            Excavation Complete
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-text-secondary text-sm leading-relaxed mb-4 max-w-xs"
          >
            You've done the hard work. Your anti-vision and vision are defined.
            Now move to the Daytime Interrupt Protocol.
          </motion.p>
          {morning.antiVisionSentence && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full p-4 rounded-xl bg-accent-red/10 border border-accent-red/20 mb-3"
            >
              <p className="text-xs text-accent-red font-medium mb-1">YOUR ANTI-VISION</p>
              <p className="text-sm text-text-primary">{morning.antiVisionSentence}</p>
            </motion.div>
          )}
          {morning.visionSentence && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full p-4 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 mb-6"
            >
              <p className="text-xs text-accent-emerald font-medium mb-1">YOUR VISION</p>
              <p className="text-sm text-text-primary">{morning.visionSentence}</p>
            </motion.div>
          )}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleComplete}
            className="w-full py-3.5 rounded-xl font-semibold text-sm bg-accent-amber text-surface border-none cursor-pointer"
          >
            Complete & Continue
          </motion.button>
        </div>
      </Card>
    );
  }

  // Section headers
  const getSectionHeader = (): string | null => {
    if (currentStep === 0) return 'Part 1: Self-Reflection';
    if (currentStep === morningQuestions.length) return 'Part 2: Anti-Vision';
    if (currentStep === morningQuestions.length + antiVisionPrompts.length) return 'Part 3: Vision';
    if (currentStep === morningQuestions.length + antiVisionPrompts.length + visionPrompts.length) return 'Part 4: Compression';
    if (step.type === 'yearGoal') return 'Part 5: One-Year Lens';
    return null;
  };

  const sectionHeader = getSectionHeader();

  return (
    <Card
      step={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={currentStep > 0 ? handleBack : undefined}
      canAdvance={getValue().trim().length > 0}
    >
      {sectionHeader && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-accent-amber text-xs font-bold tracking-wider uppercase mb-4"
        >
          {sectionHeader}
        </motion.p>
      )}
      <TextareaPrompt
        prompt={step.prompt}
        value={getValue()}
        onChange={setValue}
        minRows={6}
      />
    </Card>
  );
}
