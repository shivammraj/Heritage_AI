import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';

interface Props {
  index: number;
  text: string;
  isRevealed: boolean;
  onUnlock: () => void;
  canUnlock: boolean;
}

const CLUE_TYPES = ['Sensory', 'Cultural', 'Geographic'];

export default function ClueRow({ index, text, isRevealed, onUnlock, canUnlock }: Props) {
  return (
    <div
      className={`relative rounded-card border transition-all duration-300 ${
        isRevealed
          ? 'border-[rgba(232,160,32,0.3)] bg-[rgba(232,160,32,0.05)]'
          : 'border-[rgba(255,220,160,0.1)] bg-[rgba(255,255,255,0.02)]'
      }`}
    >
      {/* Label row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="font-mono text-[11px] text-chalk/40 tracking-widest">
          CLUE {index + 1} · {CLUE_TYPES[index].toUpperCase()}
        </span>
        {isRevealed && (
          <span className="font-mono text-[10px] text-forest/70">REVEALED</span>
        )}
      </div>

      {/* Clue text */}
      <div className="px-4 pb-4 relative overflow-hidden min-h-[48px]">
        {isRevealed ? (
          <motion.p
            initial={{ filter: 'blur(8px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="font-fraunces italic text-chalk text-base leading-relaxed border-l-[3px] border-turmeric pl-3"
          >
            {text}
          </motion.p>
        ) : (
          <div className="relative">
            <p
              className="font-fraunces italic text-chalk text-base leading-relaxed pl-3 select-none"
              style={{ filter: 'blur(8px)', userSelect: 'none' }}
              aria-hidden="true"
            >
              {text || 'A hidden clue about this mystery state...'}
            </p>
            {/* Unlock overlay */}
            {canUnlock && (
              <button
                onClick={onUnlock}
                className="absolute inset-0 flex items-center justify-center gap-2 group"
                aria-label={`Unlock clue ${index + 1} — costs 100 points`}
              >
                <span className="flex items-center gap-2 px-4 py-2 bg-[#1A0A2E]/90 border border-[rgba(255,220,160,0.2)] rounded-btn font-cabinet text-sm text-chalk/80 group-hover:text-turmeric group-hover:border-turmeric/40 transition-all">
                  <Lock size={13} />
                  Unlock — costs 100 pts
                </span>
              </button>
            )}
            {!canUnlock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-2 px-3 py-1.5 bg-[#1A0A2E]/70 rounded-btn font-mono text-[11px] text-chalk/30">
                  <Lock size={11} />
                  Guess first or wait for reveal
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
