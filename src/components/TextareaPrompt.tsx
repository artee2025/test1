import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface TextareaPromptProps {
  prompt: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export default function TextareaPrompt({
  prompt,
  value,
  onChange,
  placeholder = 'Пиши свободно...',
  minRows = 4,
}: TextareaPromptProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col"
    >
      <p className="text-text-primary text-lg font-semibold leading-relaxed mb-4 whitespace-pre-line">
        {prompt}
      </p>
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        className="w-full bg-surface-card border border-white/5 rounded-xl px-4 py-3 text-text-primary text-sm leading-relaxed resize-none focus:outline-none focus:border-accent-amber/50 transition-colors placeholder:text-text-muted"
      />
    </motion.div>
  );
}
