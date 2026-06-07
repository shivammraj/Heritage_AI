import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  stateId: string;
  stateName: string;
  isCorrect?: boolean;
  isWrong?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function StateButton({ stateId, stateName, isCorrect, isWrong, isSelected, disabled, onClick }: Props) {
  const baseClass = `
    state-btn relative w-full text-left px-4 py-3.5
    font-cabinet text-sm font-medium lowercase
    border rounded-none transition-all duration-150
    focus-visible:outline-2 focus-visible:outline-turmeric focus-visible:outline-offset-2
  `;

  const stateClass = isCorrect
    ? 'bg-turmeric text-ink border-turmeric'
    : isWrong
    ? 'bg-sindoor/10 text-chalk border-sindoor text-sindoor'
    : isSelected
    ? 'bg-[rgba(232,160,32,0.1)] text-turmeric border-turmeric/40'
    : 'bg-[rgba(255,255,255,0.03)] text-chalk/80 border-[rgba(255,220,160,0.15)] hover:text-chalk hover:border-[rgba(255,220,160,0.35)]';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${stateClass}`}
      animate={
        isWrong
          ? { x: [0, -8, 8, -8, 8, 0] }
          : isCorrect
          ? { scale: [1, 1.05, 1] }
          : {}
      }
      transition={
        isWrong
          ? { duration: 0.4, ease: 'easeInOut' }
          : isCorrect
          ? { duration: 0.3 }
          : {}
      }
      id={`state-btn-${stateId}`}
      aria-pressed={isSelected || isCorrect}
      aria-label={`Guess ${stateName}`}
    >
      {/* Left border that grows on hover (via CSS ::before in index.css) */}
      <span className="relative z-10">{stateName}</span>

      {isCorrect && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink font-mono text-xs"
        >
          ✓
        </motion.span>
      )}
      {isWrong && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sindoor font-mono text-xs"
        >
          ✗
        </motion.span>
      )}
    </motion.button>
  );
}
