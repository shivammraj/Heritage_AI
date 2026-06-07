import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Target, Clock, Zap, Lightbulb, BookOpen, Award } from 'lucide-react';
import { Challenge } from '../types';
import ValidationBadge from './ValidationBadge';
import MysteryImage from './MysteryImage';

interface Props {
  challenge: Challenge;
  showStateName?: boolean;
  layout?: 'vertical' | 'horizontal' | 'responsive';
}

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return 'Revealed';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 24) return `${Math.floor(h / 24)}d left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

const THEME_LABEL: Record<string, string> = {
  spirit:       'Culture & Spirit',
  food:         'Food & Cuisine',
  festival:     'Festival & Ritual',
  nature:       'Nature & Wildlife',
  architecture: 'Monuments & History',
};

const DIFFICULTY_STYLE = {
  Easy: {
    bg: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    text: '#10B981',
  },
  Medium: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    text: '#F59E0B',
  },
  Hard: {
    bg: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    text: '#EF4444',
  },
};

export default function ChallengeCard({
  challenge,
  showStateName = false,
  layout = 'responsive',
}: Props) {
  const accuracy = challenge.guessCount > 0
    ? Math.round((challenge.correctCount / challenge.guessCount) * 100)
    : null;

  const displayStateName = challenge.stateName || 'Secret State';
  const displayTitle = challenge.title || 'Which state is this?';
  const displayHint = challenge.hint || (challenge.clues && challenge.clues[0]) || 'Explore the clues to guess the state.';
  const displayFact = challenge.funFact || 'India features a diverse set of traditions, architectures, and cultural styles.';
  const displayDifficulty = challenge.difficulty || 'Medium';
  const displayPoints = challenge.points || 40;
  const displayCategory = challenge.category || THEME_LABEL[challenge.theme] || challenge.theme;

  const diffStyle = DIFFICULTY_STYLE[displayDifficulty] || DIFFICULTY_STYLE.Medium;

  // Decide flex layout direction classes
  const cardLayoutClasses =
    layout === 'vertical'
      ? 'flex-col'
      : 'flex-col md:flex-row';

  const imageLayoutClasses =
    layout === 'vertical'
      ? 'w-full aspect-[4/3]'
      : 'w-full aspect-[16/10] md:aspect-auto md:w-[38%] md:min-h-[250px]';

  return (
    <motion.div
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 20 } }}
      style={{ height: '100%' }}
    >
      <Link
        to={`/guess/${challenge.id}`}
        id={`challenge-card-${challenge.id}`}
        className={`group flex ${cardLayoutClasses} h-full overflow-hidden`}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 220, 160, 0.12)',
          borderRadius: 14,
          transition: 'border-color 0.25s, box-shadow 0.25s',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(232, 160, 32, 0.35)';
          e.currentTarget.style.boxShadow = '0 12px 36px rgba(232, 160, 32, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 220, 160, 0.12)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        aria-label={`Challenge: ${displayTitle}. Reward: ${displayPoints} points`}
      >
        {/* Artwork Container */}
        <div className={`relative overflow-hidden flex-shrink-0 bg-ink ${imageLayoutClasses}`}>
          <MysteryImage
            src={challenge.artworkURL}
            alt="AI cultural mystery artwork"
            theme={challenge.theme}
            fallbackIcon="question"
            className="w-full h-full"
          />

          {/* Theme overlay chip */}
          <div className="absolute top-3 left-3 z-20">
            <span
              className="font-mono uppercase tracking-wider text-chalk/90"
              style={{
                fontSize: 9,
                background: 'rgba(18, 9, 30, 0.85)',
                padding: '3px 8px',
                borderRadius: 4,
                border: '1px solid rgba(255, 220, 160, 0.15)',
                display: 'block',
                lineHeight: 1.4,
              }}
            >
              {displayCategory}
            </span>
          </div>

          {/* Daily Badge */}
          {challenge.isDaily && (
            <div className="absolute top-3 right-3 z-20">
              <span
                className="font-mono font-bold flex items-center gap-1 text-[#12091E] bg-turmeric"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.08em',
                  padding: '3px 7px',
                  borderRadius: 4,
                }}
              >
                <Zap size={9} />DAILY
              </span>
            </div>
          )}

          {/* Revealed overlay */}
          {(challenge.isRevealed || showStateName) && (
            <div
              className="absolute inset-0 flex items-center justify-center p-4 z-20"
              style={{ background: 'rgba(18, 9, 30, 0.65)', backdropFilter: 'blur(3px)' }}
            >
              <div
                className="font-fraunces italic text-turmeric bg-[#12091E]/95 border border-turmeric/30 px-4 py-2 rounded shadow-xl"
                style={{ fontSize: 18, letterSpacing: '0.05em' }}
              >
                {displayStateName}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-grow p-5 md:p-6 justify-between space-y-4">
          <div>
            {/* Header info: State/Mystery and Difficulty/Points */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span
                className="font-mono font-bold text-turmeric/80 tracking-wider text-xs"
              >
                {challenge.isRevealed || showStateName ? `STATE: ${displayStateName}` : 'STATE: MYSTERY'}
              </span>

              <div className="flex items-center gap-2">
                {/* Difficulty */}
                <span
                  className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: diffStyle.bg,
                    border: diffStyle.border,
                    color: diffStyle.text,
                  }}
                >
                  {displayDifficulty}
                </span>

                {/* Points */}
                <span
                  className="font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(232, 160, 32, 0.08)',
                    border: '1px solid rgba(232, 160, 32, 0.25)',
                    color: '#E8A020',
                  }}
                >
                  <Award size={9} />+{displayPoints} XP
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-fraunces font-bold text-chalk text-lg md:text-xl leading-tight group-hover:text-turmeric transition-colors mb-2">
              {displayTitle}
            </h3>

            {/* Clue/Hint section */}
            <div
              className="p-3 rounded-lg mb-3 flex gap-2.5 items-start"
              style={{
                background: 'rgba(255, 220, 160, 0.03)',
                border: '1px dashed rgba(255, 220, 160, 0.15)',
              }}
            >
              <Lightbulb className="text-turmeric flex-shrink-0 mt-0.5" size={14} />
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-turmeric/70 uppercase tracking-widest block">Hint</span>
                <p className="font-cabinet italic text-chalk/80 text-xs leading-relaxed">
                  "{displayHint}"
                </p>
              </div>
            </div>

            {/* Fun Fact section */}
            <div className="flex gap-2.5 items-start mb-2 px-1">
              <BookOpen className="text-chalk/40 flex-shrink-0 mt-0.5" size={13} />
              <div className="space-y-0.5">
                <span className="font-mono text-[9px] text-chalk/40 uppercase tracking-widest block">Did You Know?</span>
                <p className="font-cabinet text-chalk/50 text-xs leading-relaxed">
                  {displayFact}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Progress and accuracy */}
            <div className="flex items-center justify-between text-[11px] font-mono text-chalk/40">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Users size={11} />{challenge.guessCount} Guesses</span>
                {accuracy !== null && (
                  <span className="flex items-center gap-1"><Target size={11} />{accuracy}% Acc</span>
                )}
              </div>
              <span className="flex items-center gap-1"><Clock size={11} />{formatTimeLeft(challenge.timeRemaining)}</span>
            </div>

            {/* Mini Progress Bar */}
            {accuracy !== null && (
              <div className="w-full h-1 bg-ink rounded-full overflow-hidden">
                <div
                  className="h-full bg-turmeric/60"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            )}

            {/* Bottom CTA / Button */}
            <div
              className="pt-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(255, 220, 160, 0.08)' }}
            >
              <span className="font-cabinet font-semibold text-xs text-chalk/50">
                {challenge.isRevealed ? 'Solution revealed' : 'Active challenge'}
              </span>

              <span className="font-cabinet font-bold text-xs text-turmeric group-hover:text-chalk transition-colors flex items-center gap-1 bg-[#12091E] border border-turmeric/20 px-3 py-1.5 rounded-md group-hover:bg-turmeric group-hover:text-[#12091E]">
                Start Challenge
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
