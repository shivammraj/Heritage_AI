import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Award, Target, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import { LeaderboardEntry } from '../types';

const MOCK_GUESSERS: LeaderboardEntry[] = [
  { rank: 1, uid: 'g1', name: 'Vikram Singh',   photoURL: '', correctGuesses: 48, score: 14400, accuracy: 88 },
  { rank: 2, uid: 'g2', name: 'Meera Rao',      photoURL: '', correctGuesses: 42, score: 12600, accuracy: 92 },
  { rank: 3, uid: 'g3', name: 'Aditya Gupta',   photoURL: '', correctGuesses: 39, score: 11700, accuracy: 85 },
  { rank: 4, uid: 'g4', name: 'Priya Joshi',    photoURL: '', correctGuesses: 35, score: 10500, accuracy: 80 },
  { rank: 5, uid: 'g5', name: 'Siddharth Roy',  photoURL: '', correctGuesses: 31, score: 9300,  accuracy: 78 },
  { rank: 6, uid: 'g6', name: 'Neha Chandra',   photoURL: '', correctGuesses: 27, score: 8100,  accuracy: 74 },
  { rank: 7, uid: 'g7', name: 'Rahul Verma',    photoURL: '', correctGuesses: 23, score: 6900,  accuracy: 71 },
];

const MOCK_CREATORS: LeaderboardEntry[] = [
  { rank: 1, uid: 'c1', name: 'Aarav Sharma',    photoURL: '', challengesCreated: 14, score: 4200 },
  { rank: 2, uid: 'c2', name: 'Ananya Iyer',     photoURL: '', challengesCreated: 11, score: 3300 },
  { rank: 3, uid: 'c3', name: 'Rohan Mehta',     photoURL: '', challengesCreated: 9,  score: 2700 },
  { rank: 4, uid: 'c4', name: 'Pooja Nair',      photoURL: '', challengesCreated: 7,  score: 2100 },
  { rank: 5, uid: 'c5', name: 'Kabir Sen',       photoURL: '', challengesCreated: 6,  score: 1800 },
  { rank: 6, uid: 'c6', name: 'Divya Krishnan',  photoURL: '', challengesCreated: 5,  score: 1500 },
  { rank: 7, uid: 'c7', name: 'Arjun Patel',     photoURL: '', challengesCreated: 4,  score: 1200 },
];

const RANK_COLORS = ['#E8A020', '#94A3B8', '#CD7F32'];

function LeaderRow({ entry, index, type }: {
  entry: LeaderboardEntry;
  index: number;
  type: 'guesser' | 'creator';
}) {
  const isTop3 = index < 3;
  const rankColor = isTop3 ? RANK_COLORS[index] : 'rgba(232,160,32,0.28)';

  return (
    <motion.div
      className="flex items-center gap-4 dotted-warm"
      style={{ padding: '14px 10px' }}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay: index * 0.06 }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.018)', transition: { duration: 0.12 } }}
    >
      {/* Rank number */}
      <span
        className="font-mono flex-shrink-0 text-right leading-none"
        style={{
          fontSize: isTop3 ? 38 : 24,
          color: rankColor,
          minWidth: isTop3 ? 56 : 36,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Avatar — 6px radius square */}
      <div
        className="flex-shrink-0 flex items-center justify-center font-fraunces font-bold"
        style={{
          width: 36, height: 36, borderRadius: 6, fontSize: 15,
          background: 'rgba(232,160,32,0.07)',
          border: '1px solid rgba(232,160,32,0.18)',
          color: '#E8A020',
        }}
      >
        {entry.name.slice(0, 1)}
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <span className="font-cabinet font-bold text-chalk block truncate" style={{ fontSize: 14 }}>
          {entry.name}
        </span>
        <span className="font-mono text-chalk/38" style={{ fontSize: 11 }}>
          {type === 'guesser'
            ? `${entry.correctGuesses ?? 0} correct · ${entry.accuracy ?? 0}% accuracy`
            : `${entry.challengesCreated ?? 0} challenges created`}
        </span>
      </div>

      {/* Score */}
      <div className="text-right flex-shrink-0">
        <span className="font-mono font-medium block" style={{ fontSize: 15, color: '#E8A020' }}>
          {(entry.score ?? 0).toLocaleString()}
        </span>
        <span className="font-mono text-chalk/25 uppercase tracking-wider" style={{ fontSize: 9 }}>pts</span>
      </div>
    </motion.div>
  );
}

export default function Leaderboard() {
  const [range, setRange] = useState<'today' | 'week' | 'all'>('all');

  const { data: guessersData, isLoading: gL } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard-guessers', range],
    queryFn: async () => { const r = await api.get('/challenges/leaderboard?type=guessers&limit=10'); return r.data; },
  });

  const { data: creatorsData, isLoading: cL } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard-creators', range],
    queryFn: async () => { const r = await api.get('/challenges/leaderboard?type=creators&limit=10'); return r.data; },
  });

  const guessers = guessersData && guessersData.length > 0 ? guessersData : MOCK_GUESSERS;
  const creators = creatorsData && creatorsData.length > 0 ? creatorsData : MOCK_CREATORS;

  return (
    <div className="relative min-h-screen bg-raisin grain-overlay" style={{ paddingTop: 88, paddingBottom: 80 }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">

        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-5"
          style={{ borderBottom: '1px solid rgba(255,220,160,0.1)', paddingBottom: 28 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2" style={{ color: '#E8A020' }}>
              <Trophy size={15} />
              <span className="hero-label">Hall of Lore</span>
            </div>
            <h1 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(30px,4vw,50px)' }}>
              Heritage Standings
            </h1>
            <p className="font-cabinet text-chalk/45 mt-2" style={{ fontSize: 15 }}>
              Top prompt architects and cultural codebreakers.
            </p>
          </div>

          {/* Time range */}
          <div
            className="flex gap-1 flex-shrink-0"
            style={{ background: 'rgba(18,9,30,0.7)', border: '1px solid rgba(255,220,160,0.07)', borderRadius: 4, padding: 3 }}
          >
            {(['today', 'week', 'all'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="font-cabinet font-semibold capitalize"
                style={{
                  height: 32, paddingInline: 14, borderRadius: 3, fontSize: 13,
                  background: range === r ? 'rgba(232,160,32,0.12)' : 'transparent',
                  color: range === r ? '#E8A020' : 'rgba(247,243,238,0.46)',
                  cursor: 'pointer', border: 'none',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {r === 'week' ? 'This Week' : r === 'all' ? 'All Time' : 'Today'}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column boards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Guessers */}
          <div>
            <div
              className="flex items-center gap-3 mb-1"
              style={{ borderBottom: '1px solid rgba(255,220,160,0.07)', paddingBottom: 14 }}
            >
              <Award size={17} style={{ color: '#E8A020' }} />
              <h2 className="font-fraunces font-bold text-chalk flex-grow" style={{ fontSize: 22 }}>
                Top Guessers
              </h2>
              <span className="font-mono text-chalk/28 uppercase tracking-wider" style={{ fontSize: 9 }}>
                Correct guesses
              </span>
            </div>
            {gL
              ? <div className="flex justify-center" style={{ paddingBlock: 48 }}><RefreshCw className="animate-spin text-turmeric" size={20} /></div>
              : guessers.map((e, i) => <LeaderRow key={e.uid} entry={e} index={i} type="guesser" />)
            }
          </div>

          {/* Creators */}
          <div>
            <div
              className="flex items-center gap-3 mb-1"
              style={{ borderBottom: '1px solid rgba(255,220,160,0.07)', paddingBottom: 14 }}
            >
              <Target size={17} style={{ color: '#E8A020' }} />
              <h2 className="font-fraunces font-bold text-chalk flex-grow" style={{ fontSize: 22 }}>
                Top Architects
              </h2>
              <span className="font-mono text-chalk/28 uppercase tracking-wider" style={{ fontSize: 9 }}>
                Challenges created
              </span>
            </div>
            {cL
              ? <div className="flex justify-center" style={{ paddingBlock: 48 }}><RefreshCw className="animate-spin text-turmeric" size={20} /></div>
              : creators.map((e, i) => <LeaderRow key={e.uid} entry={e} index={i} type="creator" />)
            }
          </div>

        </div>
      </div>
    </div>
  );
}
