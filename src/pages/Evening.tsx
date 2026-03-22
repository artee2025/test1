import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import TextareaPrompt from '../components/TextareaPrompt';
import { useGameState } from '../hooks/useGameState';
import { eveningPrompts, gameLabels } from '../data/prompts';

type Phase = 'reflection' | 'game-setup' | 'complete';

export default function Evening() {
  const navigate = useNavigate();
  const { state, setEveningReflection, completeEvening, setGame } = useGameState();
  const [phase, setPhase] = useState<Phase>('reflection');
  const [reflectionStep, setReflectionStep] = useState(0);

  // Game definition state
  const morning = state.protocol.morning;
  const [stakes, setStakes] = useState(morning.antiVisionSentence || '');
  const [endgame, setEndgame] = useState(morning.visionSentence || '');
  const [mission, setMission] = useState(morning.yearGoal || '');
  const [bossFight, setBossFight] = useState('');
  const [questsText, setQuestsText] = useState('');
  const [rulesText, setRulesText] = useState('');

  const reflections = state.protocol.evening.reflections;

  if (phase === 'reflection') {
    const prompt = eveningPrompts[reflectionStep];
    const totalSteps = eveningPrompts.length + 1; // +1 for transition card

    if (reflectionStep === eveningPrompts.length) {
      return (
        <Card
          step={reflectionStep}
          totalSteps={totalSteps}
          onBack={() => setReflectionStep(r => r - 1)}
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="text-5xl mb-4"
            >
              🎮
            </motion.div>
            <h2 className="text-xl font-bold mb-3">Пора Определить Твою Игру</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xs">
              Преврати свои инсайты в структурированную систему. Преврати жизнь в игру со ставками, миссиями, квестами и правилами.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setPhase('game-setup')}
              className="w-full py-3.5 rounded-xl bg-accent-purple text-white font-semibold text-sm border-none cursor-pointer"
            >
              Определить Игру
            </motion.button>
          </div>
        </Card>
      );
    }

    return (
      <Card
        step={reflectionStep}
        totalSteps={totalSteps}
        onNext={() => setReflectionStep(r => r + 1)}
        onBack={reflectionStep > 0 ? () => setReflectionStep(r => r - 1) : undefined}
        canAdvance={(reflections[prompt.id] || '').trim().length > 0}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-accent-purple text-xs font-bold tracking-wider uppercase mb-4"
        >
          Вечерняя Рефлексия
        </motion.p>
        <TextareaPrompt
          prompt={prompt.prompt}
          value={reflections[prompt.id] || ''}
          onChange={val => setEveningReflection(prompt.id, val)}
          minRows={6}
        />
      </Card>
    );
  }

  if (phase === 'game-setup') {
    return (
      <div className="flex-1 px-4 pt-6 pb-24 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-2">Определи Свою Игру</h1>
          <p className="text-text-secondary text-sm mb-6">
            Они станут твоим ежедневным щитом от отвлечений.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Stakes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label className="flex items-center gap-2 text-accent-red text-xs font-bold tracking-wider uppercase mb-2">
              {gameLabels.stakes.icon} {gameLabels.stakes.title}
            </label>
            <p className="text-text-muted text-xs mb-2">{gameLabels.stakes.subtitle}</p>
            <textarea
              value={stakes}
              onChange={e => setStakes(e.target.value)}
              className="w-full bg-surface-card border border-accent-red/20 rounded-xl px-4 py-3 text-text-primary text-sm resize-none focus:outline-none focus:border-accent-red/50 min-h-[60px]"
              rows={2}
            />
          </motion.div>

          {/* Endgame */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="flex items-center gap-2 text-accent-emerald text-xs font-bold tracking-wider uppercase mb-2">
              {gameLabels.endgame.icon} {gameLabels.endgame.title}
            </label>
            <p className="text-text-muted text-xs mb-2">{gameLabels.endgame.subtitle}</p>
            <textarea
              value={endgame}
              onChange={e => setEndgame(e.target.value)}
              className="w-full bg-surface-card border border-accent-emerald/20 rounded-xl px-4 py-3 text-text-primary text-sm resize-none focus:outline-none focus:border-accent-emerald/50 min-h-[60px]"
              rows={2}
            />
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="flex items-center gap-2 text-accent-amber text-xs font-bold tracking-wider uppercase mb-2">
              {gameLabels.mission.icon} {gameLabels.mission.title}
            </label>
            <p className="text-text-muted text-xs mb-2">{gameLabels.mission.subtitle}</p>
            <textarea
              value={mission}
              onChange={e => setMission(e.target.value)}
              className="w-full bg-surface-card border border-accent-amber/20 rounded-xl px-4 py-3 text-text-primary text-sm resize-none focus:outline-none focus:border-accent-amber/50 min-h-[60px]"
              rows={2}
            />
          </motion.div>

          {/* Boss Fight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="flex items-center gap-2 text-accent-purple text-xs font-bold tracking-wider uppercase mb-2">
              {gameLabels.bossFight.icon} {gameLabels.bossFight.title}
            </label>
            <p className="text-text-muted text-xs mb-2">{gameLabels.bossFight.subtitle}</p>
            <textarea
              value={bossFight}
              onChange={e => setBossFight(e.target.value)}
              placeholder="Твой проект на месяц..."
              className="w-full bg-surface-card border border-accent-purple/20 rounded-xl px-4 py-3 text-text-primary text-sm resize-none focus:outline-none focus:border-accent-purple/50 min-h-[60px] placeholder:text-text-muted"
              rows={2}
            />
          </motion.div>

          {/* Daily Quests */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="flex items-center gap-2 text-accent-blue text-xs font-bold tracking-wider uppercase mb-2">
              {gameLabels.quests.icon} {gameLabels.quests.title}
            </label>
            <p className="text-text-muted text-xs mb-2">По одному на строку. Это твои ежедневные рычаги.</p>
            <textarea
              value={questsText}
              onChange={e => setQuestsText(e.target.value)}
              placeholder={"Читать 30 минут\nТренировка\nРабота над проектом 2 часа\nМедитация"}
              className="w-full bg-surface-card border border-accent-blue/20 rounded-xl px-4 py-3 text-text-primary text-sm resize-none focus:outline-none focus:border-accent-blue/50 min-h-[100px] placeholder:text-text-muted"
              rows={4}
            />
          </motion.div>

          {/* Rules */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="flex items-center gap-2 text-text-secondary text-xs font-bold tracking-wider uppercase mb-2">
              {gameLabels.rules.icon} {gameLabels.rules.title}
            </label>
            <p className="text-text-muted text-xs mb-2">По одному на строку. Ограничения, рождающие креативность.</p>
            <textarea
              value={rulesText}
              onChange={e => setRulesText(e.target.value)}
              placeholder={"Никаких соцсетей до обеда\nБез алкоголя в будни\nСон до 23:00"}
              className="w-full bg-surface-card border border-white/5 rounded-xl px-4 py-3 text-text-primary text-sm resize-none focus:outline-none focus:border-white/10 min-h-[100px] placeholder:text-text-muted"
              rows={4}
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const quests = questsText
                .split('\n')
                .map(l => l.trim())
                .filter(Boolean)
                .map((label, i) => ({
                  id: `quest-${Date.now()}-${i}`,
                  label,
                  completedToday: false,
                }));

              const rules = rulesText
                .split('\n')
                .map(l => l.trim())
                .filter(Boolean);

              setGame({
                stakes,
                endgame,
                mission,
                bossFight: { name: bossFight, progress: 0, startedAt: new Date().toISOString() },
                quests,
                rules,
                defined: true,
              });
              completeEvening();
              setPhase('complete');
            }}
            disabled={!stakes.trim() || !endgame.trim() || !mission.trim()}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm border-none cursor-pointer mb-4 ${
              stakes.trim() && endgame.trim() && mission.trim()
                ? 'bg-accent-amber text-surface'
                : 'bg-surface-elevated text-text-muted cursor-not-allowed'
            }`}
          >
            Запустить Игру
          </motion.button>
        </div>
      </div>
    );
  }

  // Complete phase
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-surface z-40 px-6">
      <Confetti />
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="text-7xl mb-6"
      >
        ⚔️
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mb-3 text-center"
      >
        Игра Начинается
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-text-secondary text-sm text-center mb-8 max-w-xs leading-relaxed"
      >
        Трансформация запущена. Каждый день — новый уровень. Выполняй квесты, соблюдай правила, победи босса.
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/')}
        className="w-full max-w-xs py-3.5 rounded-xl bg-accent-amber text-surface font-semibold text-sm border-none cursor-pointer"
      >
        Войти в Игру
      </motion.button>
    </div>
  );
}

function Confetti() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: (Math.random() - 0.5) * 400 - 100,
    color: ['#ef4444', '#10b981', '#f59e0b', '#a855f7', '#3b82f6'][i % 5],
    size: 4 + Math.random() * 6,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: '50%', y: '50%', scale: 0, opacity: 1 }}
          animate={{
            x: `calc(50% + ${p.x}px)`,
            y: `calc(50% + ${p.y}px)`,
            scale: [0, 1.5, 1],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
