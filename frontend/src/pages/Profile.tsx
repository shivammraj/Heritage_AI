import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Camera, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import { useAppStore } from '../store/useAppStore';
import { UserProfile, Challenge } from '../types';
import IndiaSVGMap from '../components/IndiaSVGMap';
import ChallengeCard from '../components/ChallengeCard';

const MOCK_PROFILE: UserProfile = {
  uid: 'mock-user',
  name: 'Heritage Explorer',
  photoURL: '',
  challengesCreated: 3,
  totalGuesses: 10,
  correctGuesses: 8,
  score: 2400,
  accuracy: 80,
  statesCreated: ['karnataka', 'rajasthan'],
  statesGuessedCorrectly: ['kerala', 'tamil_nadu', 'goa', 'gujarat', 'bihar', 'punjab'],
  statesGuessedIncorrectly: ['haryana', 'maharashtra'],
  badges: ['Pioneer Architect', 'Cultural Detective', 'Coast Walker'],
};

const STAT_ITEMS = (p: UserProfile) => [
  { label: 'Challenges Created', value: p.challengesCreated, color: '#E8A020' },
  { label: 'Correct Guesses',    value: p.correctGuesses,    color: '#1A6B4A' },
  { label: 'Total Score',        value: (p.score ?? 0).toLocaleString(), color: '#E8A020' },
  { label: 'Accuracy',           value: `${p.accuracy}%`,   color: '#1A6B4A' },
];

export default function Profile() {
  const { user, authToken } = useAppStore();
  const base = user ?? MOCK_PROFILE;

  const { data: realProfile } = useQuery<UserProfile>({
    queryKey: ['user-profile', authToken],
    queryFn: async () => { const r = await api.get('/challenges/profile'); return r.data; },
    enabled: !!authToken && !authToken.startsWith('mock_'),
  });

  const profile = realProfile ?? base;

  const { data: userChallenges, isLoading: loadingChallenges } = useQuery<Challenge[]>({
    queryKey: ['user-challenges', profile.uid],
    queryFn: async () => {
      const r = await api.get('/challenges/feed');
      return r.data.filter((c: Challenge) => c.creatorId === profile.uid);
    },
    placeholderData: [],
  });

  const wrong: string[] = (profile as any).statesGuessedIncorrectly ?? [];

  return (
    <div
      className="relative min-h-screen bg-raisin grain-overlay"
      style={{ paddingTop: 88, paddingBottom: 80 }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 space-y-12">

        {/* ─── Profile header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-7"
          style={{ borderBottom: '1px solid rgba(255,220,160,0.1)', paddingBottom: 32 }}
        >
          {/* Avatar — 6px square */}
          <div
            className="flex-shrink-0 flex items-center justify-center font-fraunces font-bold"
            style={{
              width: 88, height: 88, borderRadius: 6, fontSize: 38,
              background: 'rgba(232,160,32,0.07)',
              border: '2px solid rgba(232,160,32,0.3)',
              color: '#E8A020',
            }}
          >
            {profile.name.slice(0, 1)}
          </div>

          <div className="flex-grow space-y-3">
            <span className="hero-label block">Your Profile</span>
            <h1 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(26px,4vw,40px)' }}>
              {profile.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, i) => (
                <span
                  key={i}
                  className="font-mono"
                  style={{
                    fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: '#E8A020', background: 'rgba(232,160,32,0.07)',
                    border: '1px solid rgba(232,160,32,0.18)',
                    padding: '4px 10px', borderRadius: 3,
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Stats grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STAT_ITEMS(profile).map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: i * 0.07 }}
              style={{
                padding: '20px 18px',
                background: 'rgba(255,255,255,0.028)',
                border: '1px solid rgba(255,220,160,0.08)',
                borderRadius: 12,
              }}
            >
              <span
                className="font-fraunces italic font-bold block leading-none mb-2"
                style={{ fontSize: 'clamp(24px,5vw,44px)', color: s.color }}
              >
                {s.value}
              </span>
              <span
                className="font-cabinet uppercase tracking-wider text-chalk/40"
                style={{ fontSize: 11 }}
              >
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ─── India map section ─── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          style={{
            padding: 28,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,220,160,0.07)',
            borderRadius: 12,
          }}
        >
          {/* Legend */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2" style={{ color: '#E8A020' }}>
                <MapPin size={14} />
                <span className="hero-label">State Conquest</span>
              </div>
              <h2 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(20px,3vw,26px)' }}>
                Your India
              </h2>
              <p className="font-cabinet text-chalk/45 mt-2 leading-relaxed" style={{ fontSize: 14 }}>
                Every state you've created or guessed — painted on the map.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { color: '#E8A020', label: 'Created riddles', count: profile.statesCreated.length },
                { color: '#1A6B4A', label: 'Solved correctly',  count: profile.statesGuessedCorrectly.length },
                { color: 'rgba(193,57,43,0.55)', label: 'Solved incorrectly',  count: wrong.length },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div style={{ width: 14, height: 14, background: item.color, borderRadius: 3, flexShrink: 0 }} />
                  <div>
                    <span className="font-cabinet font-semibold text-chalk block" style={{ fontSize: 13 }}>{item.label}</span>
                    <span className="font-mono text-chalk/38" style={{ fontSize: 11 }}>{item.count} states</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-8">
            <IndiaSVGMap
              createdStates={profile.statesCreated}
              correctStates={profile.statesGuessedCorrectly}
              incorrectStates={wrong}
            />
          </div>
        </div>

        {/* ─── Challenge gallery ─── */}
        <div className="space-y-5">
          <div
            className="flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,220,160,0.07)', paddingBottom: 16 }}
          >
            <div>
              <span className="hero-label block mb-1">Your creations</span>
              <h2 className="font-fraunces font-bold text-chalk" style={{ fontSize: 24 }}>
                Challenge Gallery
              </h2>
            </div>
            <span className="font-mono text-chalk/35" style={{ fontSize: 11 }}>
              {userChallenges?.length ?? 0} riddles
            </span>
          </div>

          {loadingChallenges ? (
            <div className="flex justify-center" style={{ paddingBlock: 60 }}>
              <RefreshCw className="animate-spin text-turmeric" size={22} />
            </div>
          ) : userChallenges && userChallenges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {userChallenges.map(c => (
                <ChallengeCard key={c.id} challenge={c} showStateName />
              ))}
            </div>
          ) : (
            <div
              className="text-center"
              style={{ paddingBlock: 72, border: '1px dashed rgba(255,220,160,0.09)', borderRadius: 12 }}
            >
              <Camera style={{ color: 'rgba(247,243,238,0.08)', margin: '0 auto 16px' }} size={40} />
              <h3 className="font-fraunces font-bold text-chalk mb-2" style={{ fontSize: 18 }}>No challenges yet</h3>
              <p className="font-cabinet text-chalk/35" style={{ fontSize: 14 }}>
                Create your first cultural mystery to see it here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
