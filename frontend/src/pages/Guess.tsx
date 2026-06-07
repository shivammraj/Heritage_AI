import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Clock, RefreshCw, ArrowRight, Users } from 'lucide-react';
import api from '../lib/api';
import { useGameStore } from '../store/useGameStore';
import { Challenge, RevealData, GuessResult } from '../types';
import ScoreFlip from '../components/ScoreFlip';
import ClueRow from '../components/ClueRow';
import RevealCard from '../components/RevealCard';
import ValidationBadge from '../components/ValidationBadge';
import MysteryImage from '../components/MysteryImage';

import confetti from 'canvas-confetti';

export default function Guess() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const {
    score, cluesUsed, revealedClues,
    hasGuessed, lastGuessCorrect, guessedStateId, pointsEarned,
    unlockClue, setGuessed, resetGame,
  } = useGameStore();

  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [shakingId, setShakingId]       = useState<string | null>(null);
  const [stampId, setStampId]           = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealClosed, setRevealClosed] = useState(false);

  React.useEffect(() => {
    resetGame();
    setRevealClosed(false);
  }, [id]);

  const { data: challenge, isLoading } = useQuery<Challenge>({
    queryKey: ['challenge', id],
    queryFn: async () => { const r = await api.get(`/challenge/${id}`); return r.data; },
    enabled: !!id,
  });

  const { data: revealData } = useQuery<RevealData>({
    queryKey: ['challenge-reveal', id],
    queryFn: async () => { const r = await api.get(`/challenge/${id}/reveal`); return r.data; },
    enabled: !!id,
    retry: false,
  });

  React.useEffect(() => {
    if (revealData && !hasGuessed) setGuessed(false, revealData.stateId, 0);
  }, [revealData, hasGuessed]);

  const guessMutation = useMutation<GuessResult, Error, { guessedState: string }>({
    mutationFn: async ({ guessedState }) => {
      const r = await api.post('/challenge/guess', { challengeId: id, guessedState, cluesUsed });
      return r.data;
    },
    onSuccess: (data, vars) => {
      setIsSubmitting(false);
      setGuessed(data.isCorrect, vars.guessedState, data.pointsEarned);
      if (data.isCorrect) {
        setStampId(vars.guessedState);
        if (confetti) confetti({ particleCount: 120, spread: 70, origin: { y: 0.55 } });
      } else {
        setWrongGuesses(p => [...p, vars.guessedState]);
        setShakingId(vars.guessedState);
        setTimeout(() => setShakingId(null), 520);
      }
      qc.invalidateQueries({ queryKey: ['challenge-reveal', id] });
    },
    onError: () => setIsSubmitting(false),
  });

  const handleGuess = (stateId: string) => {
    if (hasGuessed || isSubmitting) return;
    setIsSubmitting(true);
    guessMutation.mutate({ guessedState: stateId });
  };

  function formatTime(ms: number) {
    if (ms <= 0) return 'Time up';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m left`;
  }

  /* ── Loading State ── */
  if (isLoading || !challenge) {
    return (
      <div className="min-h-screen bg-raisin flex items-center justify-center grain-overlay">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin" style={{ color: '#E8A020' }} size={28} />
          <p className="font-cabinet text-chalk/45" style={{ fontSize: 14 }}>Loading challenge...</p>
        </div>
      </div>
    );
  }

  /* ── Artwork fallback gradient ── */
  const THEME_BG: Record<string, string> = {
    spirit: 'linear-gradient(135deg,#2D1B4E,#8B2A1F)',
    food: 'linear-gradient(135deg,#0F3D2A,#7A5A10)',
    festival: 'linear-gradient(135deg,#6B1A10,#1A0A2E)',
    nature: 'linear-gradient(135deg,#0A2D1E,#12091E)',
    architecture: 'linear-gradient(135deg,#12091E,#5A4010)',
  };
  const artBg = THEME_BG[challenge.theme] ?? THEME_BG.spirit;

  return (
    <div
      className="relative min-h-screen grain-overlay"
      style={{ background: '#0D0620', paddingTop: 88, paddingBottom: 120 }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* ─── LEFT — Artwork ─── */}
        <div className="lg:col-span-5 space-y-5">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 24 }}
            className="polaroid mx-auto"
            style={{ maxWidth: 360, transform: 'rotate(-0.6deg)' }}
          >
            <MysteryImage
              src={challenge.artworkURL}
              alt="Cultural mystery — state identity hidden"
              theme={challenge.theme}
              fallbackIcon="camera"
              className="w-full h-full"
            />
            <div style={{ padding: '14px 6px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="font-fraunces italic text-ink" style={{ fontSize: 14 }}>Where am I from?</span>
              <span className="font-mono text-ink/35 uppercase" style={{ fontSize: 9, letterSpacing: '0.1em' }}>
                {challenge.theme}
              </span>
            </div>
          </motion.div>

          {/* Meta row */}
          <div
            className="flex items-center justify-between font-mono text-chalk/45"
            style={{
              padding: '12px 16px', fontSize: 12,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,220,160,0.08)',
              borderRadius: 8,
            }}
          >
            <span className="flex items-center gap-2">
              <Clock size={12} style={{ color: '#E8A020' }} />
              {formatTime(challenge.timeRemaining)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={11} />
              {challenge.guessCount} players
            </span>
          </div>

          {challenge.validationPassed && (
            <div className="flex justify-center">
              <ValidationBadge size="md" />
            </div>
          )}
        </div>

        {/* ─── RIGHT — Game area ─── */}
        <div className="lg:col-span-7 space-y-7">

          {/* Header + score */}
          <div
            className="flex items-start justify-between"
            style={{ borderBottom: '1px solid rgba(255,220,160,0.1)', paddingBottom: 20 }}
          >
            <div>
              <span className="hero-label block mb-1">Challenge Arena</span>
              <h2 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(22px,3.5vw,32px)' }}>
                Which state is this?
              </h2>
            </div>
            <div className="text-right">
              <span className="font-mono text-chalk/35 uppercase block mb-1" style={{ fontSize: 9, letterSpacing: '0.18em' }}>
                Score
              </span>
              <ScoreFlip value={score} />
            </div>
          </div>

          {/* Clues */}
          <div className="space-y-3">
            <span className="hero-label block">Clues</span>
            {challenge.clues.map((text, idx) => (
              <ClueRow
                key={idx}
                index={idx}
                text={text}
                isRevealed={revealedClues[idx] || hasGuessed}
                onUnlock={() => unlockClue(idx)}
                canUnlock={!hasGuessed && idx > 0 && !!revealedClues[idx - 1]}
              />
            ))}
          </div>

          {/* State choice buttons */}
          {challenge.choices && challenge.choices.length > 0 && (
            <div className="space-y-2">
              <span className="hero-label block">Submit your answer</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {challenge.choices.map((choice) => {
                  const isCorrect  = hasGuessed && revealData?.stateId === choice.id;
                  const isWrong    = wrongGuesses.includes(choice.id) || (hasGuessed && guessedStateId === choice.id && !lastGuessCorrect);
                  const isShaking  = shakingId === choice.id;
                  const isStamped  = stampId === choice.id;

                  let bg    = 'rgba(255,255,255,0.035)';
                  let border = 'rgba(255,220,160,0.12)';
                  let color  = '#F7F3EE';

                  if (isCorrect) { bg = 'rgba(26,107,74,0.14)'; border = '#1A6B4A'; color = '#1A6B4A'; }
                  if (isWrong)   { bg = 'rgba(193,57,43,0.1)';  border = '#C1392B'; color = '#C1392B'; }

                  return (
                    <motion.button
                      key={choice.id}
                      onClick={() => handleGuess(choice.id)}
                      disabled={hasGuessed || isSubmitting}
                      className="relative text-left font-cabinet overflow-hidden"
                      style={{
                        height: 52, paddingLeft: 20, paddingRight: 12,
                        borderRadius: 0,
                        background: bg,
                        border: `1px solid ${border}`,
                        color,
                        fontSize: 14,
                        cursor: hasGuessed || isSubmitting ? 'default' : 'pointer',
                        transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      animate={
                        isShaking  ? { x: [0, -9, 9, -6, 6, -3, 3, 0] } :
                        isStamped  ? { scale: [1, 1.06, 1] } : {}
                      }
                      transition={{ duration: 0.42 }}
                      whileHover={!hasGuessed && !isSubmitting ? {
                        borderColor: 'rgba(232,160,32,0.35)',
                        backgroundColor: 'rgba(255,255,255,0.055)',
                        transition: { duration: 0.12 },
                      } : {}}
                    >
                      {/* Left indicator bar */}
                      <span
                        style={{
                          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                          background: isCorrect ? '#1A6B4A' : isWrong ? '#C1392B' : '#E8A020',
                          opacity: isCorrect || isWrong ? 1 : 0,
                          transition: 'opacity 0.18s',
                        }}
                      />
                      {choice.name}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No-choices fallback message */}
          {(!challenge.choices || challenge.choices.length === 0) && !hasGuessed && (
            <div
              className="text-center font-cabinet text-chalk/40"
              style={{ padding: 24, border: '1px dashed rgba(255,220,160,0.1)', borderRadius: 8, fontSize: 14 }}
            >
              Loading answer choices...
            </div>
          )}

          {/* Post-guess CTA */}
          {hasGuessed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex items-center justify-between"
              style={{
                padding: '14px 18px',
                background: 'rgba(232,160,32,0.04)',
                border: '1px solid rgba(232,160,32,0.15)',
                borderRadius: 8,
              }}
            >
              <span className="font-cabinet text-chalk/65" style={{ fontSize: 14 }}>
                Create your own challenge
              </span>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 font-cabinet font-semibold text-ink bg-turmeric hover:bg-[#d49018] transition-colors"
                style={{ height: 36, paddingInline: 16, borderRadius: 3, fontSize: 13 }}
              >
                Create <ArrowRight size={12} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Reveal card */}
      <AnimatePresence>
        {hasGuessed && revealData && !revealClosed && (
          <RevealCard
            revealData={revealData}
            pointsEarned={pointsEarned}
            isCorrect={lastGuessCorrect ?? false}
            onClose={() => setRevealClosed(true)}
          />
        )}
      </AnimatePresence>

      {/* Floating reveal trigger */}
      <AnimatePresence>
        {hasGuessed && revealData && revealClosed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => setRevealClosed(false)}
              className="flex items-center gap-2 px-5 py-3 bg-turmeric text-ink font-cabinet font-semibold rounded-full shadow-lg hover:bg-[#d49018] transition-all"
            >
              <span>View Result</span>
              <ArrowRight size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
