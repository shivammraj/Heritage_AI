import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Camera } from 'lucide-react';
import api from '../lib/api';
import { Challenge } from '../types';
import ChallengeCard from '../components/ChallengeCard';
import { MOCK_HERITAGE_CHALLENGES } from '../data/mockChallenges';

const THEME_GRADIENTS: Record<string, string> = {
  spirit:       'linear-gradient(135deg,#1A0A2E 0%,#C1392B 60%,#E8A020 100%)',
  food:         'linear-gradient(135deg,#1A6B4A 0%,#E8A020 100%)',
  festival:     'linear-gradient(135deg,#C1392B 0%,#1A0A2E 100%)',
  nature:       'linear-gradient(135deg,#1A6B4A 0%,#12091E 100%)',
  architecture: 'linear-gradient(135deg,#12091E 0%,#E8A020 80%)',
};

const STATS = [
  { value: '28',  label: 'States',      sub: 'Rich AI identities',       rotate: '-1.2deg', color: '#C1392B' },
  { value: '10K', label: 'Challenges',  sub: 'Created by community',     rotate:  '0.8deg', color: '#E8A020' },
  { value: '50K', label: 'Guesses',     sub: 'Cultural codebreakers',    rotate: '-0.5deg', color: '#1A6B4A' },
  { value: '98%', label: 'Name-free',   sub: 'Validation engine pass',   rotate:  '1.3deg', color: '#12091E' },
];

const STEPS = [
  { num: '01', title: 'Pick your state. We keep it secret.', body: 'Select any of 28 Indian states. Your choice is AES-encrypted server-side — never in the URL, never in the API response until reveal time.' },
  { num: '02', title: 'AI generates the image. Name never appears.', body: 'Gemini builds a rich Imagen 3 prompt. Our Validation Engine scans every token against state name, capital, demonym, language, and aliases. It regenerates if any slip through — up to 3 times.' },
  { num: '03', title: 'Share the challenge. Let India guess.', body: 'A 1200×630 share card with artwork, QR code and caption — zero identity markers. Post it anywhere. The card is the social post.' },
];

const POLAROID_STACK = [
  { bg: 'linear-gradient(135deg,#1A0A2E,#C1392B)', label: 'Festival · #028', rotate: 8,   hoverRotate: 14,  z: 1, offsetY: 20 },
  { bg: 'linear-gradient(135deg,#1A6B4A,#E8A020)', label: 'Cuisine · #014',  rotate: -6,  hoverRotate: -12, z: 2, offsetY: 10 },
  { bg: 'linear-gradient(135deg,#12091E,#E8A020)', label: 'Spirit · #041',   rotate: 3,   hoverRotate: 8,   z: 3, offsetY: 0  },
  { bg: 'linear-gradient(135deg,#0A2D1E,#12091E)', label: 'Nature · #056',   rotate: -10, hoverRotate: -16, z: 4, offsetY: 30 },
  { bg: 'linear-gradient(135deg,#12091E,#5A4010)', label: 'Architecture · #072', rotate: 12, hoverRotate: 18, z: 5, offsetY: -10 },
];

const HERITAGE_PHOTOS = [
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80', // Rajasthan / Amer Fort
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80', // Kerala / Boat race
  'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80', // Jharkhand / Sarhul
  'https://images.unsplash.com/photo-1569949380643-6e7a6ec99e45?auto=format&fit=crop&w=600&q=80', // MP / Khajuraho
  'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=600&q=80', // Tamil Nadu / Bharatanatyam
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80', // Gujarat / Stepwell
  'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=600&q=80', // Punjab / Bhangra
];

export default function Landing() {
  const stepsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-60px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' });

  const [polaroidImages, setPolaroidImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
  ]);

  const handlePolaroidClick = (index: number) => {
    const remaining = HERITAGE_PHOTOS.filter(img => !polaroidImages.includes(img));
    if (remaining.length === 0) return;
    const nextImg = remaining[Math.floor(Math.random() * remaining.length)];
    const newImgs = [...polaroidImages];
    newImgs[index] = nextImg;
    setPolaroidImages(newImgs);
  };

  const { data: feedData } = useQuery<Challenge[]>({
    queryKey: ['challenges-feed'],
    queryFn: async () => { const r = await api.get('/challenges/feed'); return r.data; },
    placeholderData: [],
  });
  const challenges = feedData && feedData.length > 0 ? feedData : MOCK_HERITAGE_CHALLENGES;

  return (
    <div className="relative min-h-screen bg-raisin overflow-x-clip grain-overlay">

      {/* ━━━ HERO ━━━ */}
      <section
        className="relative max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
        style={{ paddingTop: 'calc(var(--nav-h) + 48px)', paddingBottom: 80, minHeight: '90vh' }}
      >
        {/* Left 55% */}
        <div className="md:col-span-7 space-y-8 md:space-y-10 z-10">
          <motion.span
            className="hero-label block text-turmeric/90"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            AI · Culture · Mystery
          </motion.span>

          <motion.div
            className="flex gap-5 items-start"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <span className="turmeric-line mt-1.5" />
            <h1
              className="font-fraunces font-bold text-chalk leading-[1.12]"
              style={{ fontSize: 'clamp(50px, 7.5vw, 90px)', letterSpacing: '-0.01em' }}
            >
              One image.<br />
              <em className="text-turmeric not-italic">No name.</em><br />
              Which state?
            </h1>
          </motion.div>

          <motion.p
            className="font-cabinet text-chalk/75 max-w-lg leading-relaxed"
            style={{ fontSize: 'clamp(16px, 2.0vw, 20px)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
          >
            Generate an AI artwork of your state's soul — without ever naming it.
            Share it. Challenge India to guess.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 pt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link
              to="/create"
              id="hero-create-btn"
              className="inline-flex items-center gap-2 font-cabinet font-semibold text-ink bg-turmeric hover:bg-[#d49018] transition-colors"
              style={{ height: 50, paddingInline: 28, borderRadius: 4, fontSize: 15 }}
            >
              <Camera size={16} />
              Create a challenge
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 font-cabinet font-semibold text-chalk/75 hover:text-chalk transition-colors"
              style={{
                height: 50, paddingInline: 22, borderRadius: 4, fontSize: 15,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,220,160,0.15)',
              }}
            >
              Explore feed <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Tagline pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          >
            <span
              className="font-mono text-turmeric/80 inline-block"
              style={{ fontSize: 10, letterSpacing: '0.18em', borderBottom: '1px dashed rgba(232,160,32,0.3)', paddingBottom: 2 }}
            >
              "28 states. No names. All soul."
            </span>
          </motion.div>
        </div>

        {/* Right 45% — polaroid stack */}
        <div className="md:col-span-5 relative flex items-center justify-center" style={{ height: 420 }}>
          {POLAROID_STACK.map((card, i) => (
            <motion.div
              key={i}
              className="absolute polaroid select-none"
              onClick={() => handlePolaroidClick(i)}
              style={{
                width: 230,
                zIndex: card.z,
                rotate: card.rotate,
                translateY: card.offsetY,
                cursor: 'pointer',
              }}
              whileHover={{
                rotate: card.hoverRotate,
                y: -28,
                zIndex: 20,
                scale: 1.05,
                transition: { type: 'spring', stiffness: 280, damping: 18 },
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div style={{ aspectRatio: '1/1', background: card.bg, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={polaroidImages[i]}
                  alt="Heritage Polaroid"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Big Question Mark Overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-raisin/20 group-hover:bg-transparent transition-colors duration-300"
                >
                  <span 
                    className="font-fraunces text-chalk/25 text-7xl italic select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] transition-all duration-300 group-hover:scale-110 group-hover:text-turmeric"
                  >
                    ?
                  </span>
                </div>
              </div>
              <div style={{ paddingTop: 12, paddingBottom: 2, paddingInline: 4 }}>
                <span className="font-mono text-ink/35" style={{ fontSize: 10, letterSpacing: '0.12em' }}>
                  {card.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ━━━ LIVE CHALLENGES STRIP ━━━ */}
      <section style={{ background: 'rgba(18,9,30,0.65)', borderTop: '1px solid rgba(255,220,160,0.07)', borderBottom: '1px solid rgba(255,220,160,0.07)', paddingBlock: 56 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-7">
            <div>
              <span className="hero-label block mb-2">Live Challenges</span>
              <h2 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(22px,4vw,30px)' }}>
                Active right now
              </h2>
            </div>
            <Link to="/explore" className="flex items-center gap-1.5 font-cabinet font-semibold text-turmeric hover:underline" style={{ fontSize: 14 }}>
              See all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="scroll-strip">
            {challenges.slice(0, 6).map((c) => (
              <div key={c.id} style={{ minWidth: 265, width: 265, flexShrink: 0 }}>
                <ChallengeCard challenge={c} layout="vertical" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section ref={stepsRef} className="max-w-6xl mx-auto px-4 sm:px-6" style={{ paddingBlock: 96 }}>
        <div className="mb-14">
          <span className="hero-label block mb-3">The Core Loop</span>
          <h2 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '-0.01em' }}>
            How it works
          </h2>
        </div>

        <div>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className="flex gap-8 md:gap-14 items-start py-10"
              style={{ borderBottom: '1px solid rgba(255,220,160,0.07)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={stepsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.13 }}
            >
              <span className="editorial-number flex-shrink-0 hidden sm:block" style={{ minWidth: '4rem', textAlign: 'right' }}>
                {step.num}
              </span>
              <span className="editorial-number flex-shrink-0 sm:hidden" style={{ fontSize: '2.5rem' }}>
                {step.num}
              </span>
              <div style={{ paddingTop: 6 }}>
                <h3 className="font-fraunces font-bold text-chalk mb-3" style={{ fontSize: 'clamp(18px,2.5vw,22px)', lineHeight: 1.3 }}>
                  {step.title}
                </h3>
                <p className="font-cabinet text-chalk/55 leading-relaxed" style={{ fontSize: 'clamp(14px,1.5vw,16px)', maxWidth: 640 }}>
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ━━━ STATS — Cork-board ━━━ */}
      <section
        ref={statsRef}
        style={{ background: 'rgba(18,9,30,0.45)', borderTop: '1px solid rgba(255,220,160,0.05)', paddingBlock: 88 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-14">
            <span className="hero-label block mb-3">By the numbers</span>
            <h2 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
              Heritage in scale
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="polaroid bg-chalk border border-stone/40 text-ink"
                style={{ padding: 20, transform: `rotate(${stat.rotate})` }}
                initial={{ opacity: 0, y: 28 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, type: 'spring', stiffness: 140, damping: 18 }}
                whileHover={{ rotate: 0, scale: 1.04, zIndex: 10, transition: { type: 'spring', stiffness: 280, damping: 20 } }}
              >
                <span className="stat-number block mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="font-cabinet font-bold text-ink block" style={{ fontSize: 14 }}>{stat.label}</span>
                <p className="font-fraunces italic text-ink/55 mt-1 leading-snug" style={{ fontSize: 11 }}>{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ BOTTOM CTA ━━━ */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 text-center" style={{ paddingBlock: 100 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span className="hero-label block mb-5">Ready?</span>
          <h2
            className="font-fraunces font-bold text-chalk mb-5 leading-tight text-balance"
            style={{ fontSize: 'clamp(34px,5vw,58px)', letterSpacing: '-0.01em' }}
          >
            28 states.<br />
            <em className="text-turmeric not-italic">No names.</em><br />
            All soul.
          </h2>
          <p className="font-cabinet text-chalk/50 mb-9 leading-relaxed" style={{ fontSize: 16 }}>
            Join the cultural guessing game that turns prompt restrictions into art.
          </p>
          <Link
            to="/create"
            id="footer-create-btn"
            className="inline-flex items-center gap-2 font-cabinet font-semibold text-ink bg-turmeric hover:bg-[#d49018] transition-colors"
            style={{ height: 52, paddingInline: 36, borderRadius: 4, fontSize: 15 }}
          >
            <Camera size={16} />
            Create a challenge
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
