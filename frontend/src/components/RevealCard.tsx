import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RevealData } from '../types';

interface Props {
  revealData: RevealData;
  pointsEarned: number;
  isCorrect: boolean;
  onClose?: () => void;
}

export default function RevealCard({ revealData, pointsEarned, isCorrect, onClose }: Props) {
  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#12091E] border-t border-[rgba(255,220,160,0.15)] rounded-t-panel shadow-[0_-8px_48px_rgba(180,80,0,0.18)]"
      role="dialog"
      aria-label="Challenge result"
      aria-live="polite"
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-chalk/40 hover:text-chalk/80 hover:bg-chalk/5 rounded-full transition-colors z-50"
          aria-label="Dismiss results panel"
        >
          <X size={18} />
        </button>
      )}

      {/* Turmeric top strip */}
      <div className={`h-1 w-full ${isCorrect ? 'bg-forest' : 'bg-sindoor'}`} />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Result label */}
        <div className="text-center mb-6">
          <p className={`font-mono text-[11px] tracking-widest mb-2 ${isCorrect ? 'text-forest' : 'text-sindoor'}`}>
            {isCorrect ? '✓ CORRECT GUESS' : '✗ NOT QUITE'}
          </p>
          {/* State name — the big reveal */}
          <h2 className="font-fraunces italic text-chalk text-5xl mb-1">
            {revealData.stateName}
          </h2>
          {isCorrect && pointsEarned > 0 && (
            <p className="font-mono text-turmeric text-2xl">+{pointsEarned} pts</p>
          )}
        </div>

        {/* Cultural context */}
        <p className="font-cabinet text-chalk/70 text-sm leading-relaxed text-center max-w-lg mx-auto mb-6">
          {revealData.culturalFact}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="font-mono text-turmeric text-2xl">{revealData.accuracy}%</p>
            <p className="font-cabinet text-chalk/50 text-xs mt-1">got this right</p>
          </div>
          <div className="w-px h-10 bg-[rgba(255,220,160,0.15)]" />
          <div className="text-center">
            <p className="font-mono text-turmeric text-2xl">{revealData.guessCount}</p>
            <p className="font-cabinet text-chalk/50 text-xs mt-1">total guesses</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            to="/create"
            id="reveal-create-cta"
            className="inline-flex items-center gap-2 px-6 py-3 bg-turmeric text-ink font-cabinet text-sm font-semibold rounded-btn hover:bg-[#d49018] transition-colors"
          >
            Create your own challenge
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

