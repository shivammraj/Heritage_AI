import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Compass, RefreshCw, Zap } from 'lucide-react';
import api from '../lib/api';
import { Challenge, Theme } from '../types';
import ChallengeCard from '../components/ChallengeCard';
import MysteryImage from '../components/MysteryImage';
import { MOCK_HERITAGE_CHALLENGES } from '../data/mockChallenges';

const THEME_TABS: { value: Theme | 'all'; label: string }[] = [
  { value: 'all',          label: 'All' },
  { value: 'spirit',       label: 'Spirit' },
  { value: 'food',         label: 'Food' },
  { value: 'festival',     label: 'Festivals' },
  { value: 'nature',       label: 'Nature' },
  { value: 'architecture', label: 'Architecture' },
];

const SORT_OPTIONS = [
  { value: 'newest',  label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'hardest', label: 'Hardest' },
] as const;

export default function Explore() {
  const [selectedTheme, setSelectedTheme] = useState<Theme | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'hardest'>('newest');

  const { data: feedData, isLoading } = useQuery<Challenge[]>({
    queryKey: ['explore-feed', selectedTheme],
    queryFn: async () => {
      const url = selectedTheme === 'all' ? '/challenges/feed' : `/challenges/feed?theme=${selectedTheme}`;
      const r = await api.get(url);
      return r.data;
    },
    placeholderData: [],
  });

  const { data: daily } = useQuery<Challenge>({
    queryKey: ['daily-challenge'],
    queryFn: async () => { const r = await api.get('/challenges/daily'); return r.data; },
    retry: false,
  });

  const dailyChallenge = daily || MOCK_HERITAGE_CHALLENGES.find(c => c.isDaily) || MOCK_HERITAGE_CHALLENGES[0];

  const raw = feedData && feedData.length > 0 ? feedData : MOCK_HERITAGE_CHALLENGES;
  const sorted = [...raw].sort((a, b) => {
    if (sortBy === 'popular') return b.guessCount - a.guessCount;
    if (sortBy === 'hardest') {
      const aA = a.guessCount > 0 ? a.correctCount / a.guessCount : 1;
      const bA = b.guessCount > 0 ? b.correctCount / b.guessCount : 1;
      return aA - bA;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="relative min-h-screen bg-raisin grain-overlay" style={{ paddingTop: 88, paddingBottom: 80 }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">

        {/* Header */}
        <div style={{ borderBottom: '1px solid rgba(255,220,160,0.1)', paddingBottom: 28 }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: '#E8A020' }}>
            <Compass size={15} />
            <span className="hero-label">Discovery Hub</span>
          </div>
          <h1 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(32px,5vw,52px)' }}>
            Explore Challenges
          </h1>
          <p className="font-cabinet text-chalk/45 mt-2" style={{ fontSize: 15 }}>
            Community-created cultural enigmas from across India.
          </p>
        </div>

        {/* Daily Challenge Banner */}
        {dailyChallenge && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden flex flex-col sm:flex-row gap-6 sm:items-center"
            style={{
              background: 'rgba(232,160,32,0.03)',
              border: '1.5px solid rgba(232,160,32,0.3)',
              borderRadius: 12,
              padding: 24,
              paddingTop: 28,
            }}
          >
            {/* Badge */}
            <div
              className="absolute top-0 right-0 flex items-center gap-1.5 font-mono font-bold"
              style={{
                fontSize: 9, letterSpacing: '0.14em', color: '#12091E',
                background: '#E8A020', padding: '5px 12px', borderBottomLeftRadius: 8,
              }}
            >
              <Zap size={10} />TODAY'S CHALLENGE
            </div>

            <div className="polaroid flex-shrink-0" style={{ width: 130 }}>
              <MysteryImage
                src={dailyChallenge.artworkURL}
                alt="Daily"
                theme={dailyChallenge.theme}
                fallbackIcon="question"
                className="w-full h-full"
              />
              <div style={{ height: 24 }} />
            </div>

            {/* Content */}
            <div className="flex-grow space-y-3">
              <span className="hero-label block">{dailyChallenge.theme.toUpperCase()} · Global Leaderboard</span>
              <h3 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(20px,3vw,28px)' }}>
                Solve today's mystery state: {dailyChallenge.title || 'Identify the state'}
              </h3>
              <p className="font-cabinet text-chalk/50" style={{ fontSize: 14 }}>
                Everyone plays the same state today. Compete globally for top score.
              </p>
              <div className="flex flex-wrap items-center gap-4 font-mono text-chalk/40" style={{ fontSize: 11 }}>
                <span>{dailyChallenge.guessCount} guesses</span>
                <span className="w-1 h-1 rounded-full bg-chalk/20 hidden sm:block" />
                <span>{dailyChallenge.guessCount > 0 ? `${Math.round((dailyChallenge.correctCount/dailyChallenge.guessCount)*100)}% accuracy` : 'Unsolved yet'}</span>
              </div>
              <Link
                to={`/guess/${dailyChallenge.id}`}
                className="inline-flex items-center gap-2 font-cabinet font-semibold text-ink bg-turmeric hover:bg-[#d49018] transition-colors"
                style={{ height: 42, paddingInline: 22, borderRadius: 4, fontSize: 14 }}
              >
                Guess daily riddle
              </Link>
            </div>
          </motion.div>
        )}

        {/* Filter & Sort bar */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between"
          style={{
            background: 'rgba(18,9,30,0.7)', border: '1px solid rgba(255,220,160,0.07)',
            borderRadius: 8, padding: '12px 16px',
          }}
        >
          {/* Theme tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0.5 sm:pb-0">
            {THEME_TABS.map(t => (
              <button
                key={t.value}
                onClick={() => setSelectedTheme(t.value)}
                className="font-cabinet font-medium flex-shrink-0 transition-all"
                style={{
                  height: 32, paddingInline: 14, borderRadius: 4, fontSize: 13,
                  background: selectedTheme === t.value ? '#E8A020' : 'transparent',
                  color: selectedTheme === t.value ? '#12091E' : 'rgba(247,243,238,0.5)',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 flex-shrink-0" style={{ background: 'rgba(18,9,30,0.8)', border: '1px solid rgba(255,220,160,0.06)', borderRadius: 4, padding: 3 }}>
            {SORT_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => setSortBy(o.value)}
                className="font-cabinet font-semibold transition-all"
                style={{
                  height: 26, paddingInline: 12, borderRadius: 3, fontSize: 12,
                  background: sortBy === o.value ? 'rgba(232,160,32,0.12)' : 'transparent',
                  color: sortBy === o.value ? '#E8A020' : 'rgba(247,243,238,0.42)',
                  cursor: 'pointer', border: 'none',
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4" style={{ paddingBlock: 80 }}>
            <RefreshCw className="animate-spin text-turmeric" size={26} />
            <p className="font-cabinet text-chalk/40" style={{ fontSize: 14 }}>Loading challenges...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center" style={{ paddingBlock: 80, border: '1px dashed rgba(255,220,160,0.1)', borderRadius: 12 }}>
            <Compass style={{ color: 'rgba(247,243,238,0.08)', margin: '0 auto 16px' }} size={44} />
            <h3 className="font-fraunces font-bold text-chalk mb-2" style={{ fontSize: 20 }}>No challenges yet</h3>
            <p className="font-cabinet text-chalk/35" style={{ fontSize: 14 }}>Be the first to create a challenge!</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
          >
            {sorted.map(c => (
              <motion.div
                key={c.id}
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.38 } } }}
              >
                <ChallengeCard challenge={c} />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
