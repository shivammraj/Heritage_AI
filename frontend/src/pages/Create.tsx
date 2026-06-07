import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, Sparkles, RefreshCw, Copy, Share2, AlertCircle, Download } from 'lucide-react';
import api from '../lib/api';
import { INDIAN_STATES, THEME_LABELS, THEME_DESCRIPTIONS } from '../data/states';
import { Theme, CreateChallengeResponse } from '../types';
import ValidationBadge from '../components/ValidationBadge';
import MysteryImage from '../components/MysteryImage';

type Phase = 'idle' | 'prompting' | 'validating' | 'painting' | 'success' | 'error';

const THEMES: { id: Theme; label: string; desc: string }[] = [
  { id: 'spirit',       label: 'Spirit & Culture',     desc: 'Traditions, identity, folk arts' },
  { id: 'food',         label: 'Food & Cuisine',       desc: 'Dishes, ingredients, cooking styles' },
  { id: 'festival',     label: 'Festival & Ritual',    desc: 'Celebrations, ceremonies, seasons' },
  { id: 'nature',       label: 'Nature & Landscape',   desc: 'Geography, flora, fauna, terrain' },
  { id: 'architecture', label: 'Architecture & Craft', desc: 'Structures, crafts, built heritage' },
];

const FORBIDDEN_TERMS = ['State name', 'Capital city', 'Demonym', 'Language', 'Regional aliases'];

export default function Create() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('spirit');
  const [phase, setPhase]               = useState<Phase>('idle');
  const [result, setResult]             = useState<CreateChallengeResponse | null>(null);
  const [errorMsg, setErrorMsg]         = useState('');
  const [typeText, setTypeText]         = useState('');
  const [copiedText, setCopiedText]     = useState(false);
  const [copiedLink, setCopiedLink]     = useState(false);
  const [termIndex, setTermIndex]       = useState(0);
  const [paintProgress, setPaintProgress] = useState(0);

  const isGenerating = phase === 'prompting' || phase === 'validating' || phase === 'painting';

  const startGeneration = async () => {
    if (!selectedState || isGenerating) return;
    setPhase('prompting');
    setResult(null);
    setErrorMsg('');
    setTypeText('');
    setTermIndex(0);

    const stateObj = INDIAN_STATES.find(s => s.id === selectedState);
    const target = `Writing name-free ${THEMES.find(t => t.id === selectedTheme)?.label} prompt...\n\nForbidden terms: "${stateObj?.name}", "${stateObj?.capital}", "${stateObj?.demonym}", "${stateObj?.language}" and all regional aliases.\n\nDescribing: specific textures, palettes, human poses, atmospheric light, cultural objects — zero identity markers.`;

    let idx = 0;
    const iv = setInterval(() => {
      idx += 5;
      if (idx >= target.length) { clearInterval(iv); idx = target.length; proceedToValidation(); }
      setTypeText(target.slice(0, idx));
    }, 22);
  };

  const proceedToValidation = async () => {
    setPhase('validating');
    // Animate term checks
    let ti = 0;
    const iv = setInterval(() => {
      ti++;
      setTermIndex(ti);
      if (ti >= FORBIDDEN_TERMS.length) clearInterval(iv);
    }, 350);

    try {
      const res = await api.post<CreateChallengeResponse>('/challenge/create', {
        stateId: selectedState,
        theme: selectedTheme,
      });
      setTimeout(() => {
        clearInterval(iv);
        if (res.data.validationPassed) {
          setResult(res.data);
          setPhase('painting');
          setPaintProgress(0);
          
          let paintVal = 0;
          const paintIv = setInterval(() => {
            paintVal += 4;
            if (paintVal >= 100) {
              paintVal = 100;
              clearInterval(paintIv);
            }
            setPaintProgress(paintVal);
          }, 120);

          setTimeout(() => {
            clearInterval(paintIv);
            setPhase('success');
          }, 3200);
        } else {
          setPhase('error');
          setErrorMsg('Forbidden state name detected in prompt. Regenerating...');
        }
      }, 1800);
    } catch (err: any) {
      clearInterval(iv);
      setPhase('error');
      setErrorMsg(err.response?.data?.error || 'API connection failed. Check backend/.env credentials.');
    }
  };

  const copyText = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const copyLink = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${window.location.origin}/guess/${result.challengeId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="relative min-h-screen grain-overlay"
      style={{ background: '#0D0620', paddingTop: 88, paddingBottom: 80 }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <span className="hero-label block mb-2">Challenge Studio</span>
          <h1 className="font-fraunces font-bold text-chalk" style={{ fontSize: 'clamp(28px,4vw,40px)' }}>
            Create a challenge
          </h1>
          <p className="font-cabinet text-chalk/45 mt-2" style={{ fontSize: 14 }}>
            Choose a state and lens. The AI hides the identity completely.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left config panel ── */}
          <div
            className="lg:col-span-5 p-6 space-y-6"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 220, 160, 0.08)',
              borderRadius: 16,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
            }}
          >

            {/* State selector */}
            <div>
              <label className="hero-label block mb-3 text-turmeric/90">Select Secret State</label>
              <div
                className="overflow-y-auto"
                style={{
                  maxHeight: 280,
                  background: 'rgba(18, 9, 30, 0.85)',
                  border: '1px solid rgba(255, 220, 160, 0.08)',
                  borderRadius: 8,
                }}
              >
                {INDIAN_STATES.map((state) => {
                  const sel = selectedState === state.id;
                  return (
                    <motion.button
                      key={state.id}
                      type="button"
                      onClick={() => setSelectedState(state.id)}
                      disabled={isGenerating}
                      className={`state-btn w-full text-left font-cabinet flex items-center justify-between ${sel ? 'selected' : ''}`}
                      whileHover={isGenerating ? {} : { x: 4, backgroundColor: 'rgba(232, 160, 32, 0.05)' }}
                      whileTap={isGenerating ? {} : { scale: 0.98 }}
                      style={{
                        padding: '11px 18px',
                        fontSize: 14,
                        color: sel ? '#E8A020' : 'rgba(247, 243, 238, 0.6)',
                        background: sel ? 'rgba(232, 160, 32, 0.04)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255, 220, 160, 0.04)',
                        width: '100%',
                        cursor: isGenerating ? 'default' : 'pointer',
                        opacity: isGenerating ? 0.5 : 1,
                        transition: 'color 0.2s',
                      }}
                    >
                      <span>{state.name}</span>
                      {sel && (
                        <motion.span
                          layoutId="activeStateIndicator"
                          className="w-1.5 h-1.5 rounded-full bg-turmeric"
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Theme selector */}
            <div>
              <label className="hero-label block mb-3 text-turmeric/90">Select a Theme</label>
              <div
                style={{
                  background: 'rgba(18, 9, 30, 0.85)',
                  border: '1px solid rgba(255, 220, 160, 0.08)',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                {THEMES.map((theme) => {
                  const sel = selectedTheme === theme.id;
                  return (
                    <motion.button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      disabled={isGenerating}
                      className="w-full text-left flex items-center gap-3"
                      whileHover={isGenerating ? {} : { x: 3, backgroundColor: 'rgba(232, 160, 32, 0.04)' }}
                      whileTap={isGenerating ? {} : { scale: 0.99 }}
                      style={{
                        padding: '14px 18px',
                        border: 'none',
                        borderBottom: '1px solid rgba(255, 220, 160, 0.04)',
                        background: sel ? 'rgba(232, 160, 32, 0.04)' : 'transparent',
                        cursor: isGenerating ? 'default' : 'pointer',
                        opacity: isGenerating ? 0.5 : 1,
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: sel ? '#E8A020' : 'rgba(247, 243, 238, 0.2)',
                          transition: 'background 0.25s',
                        }}
                      />
                      <div className="flex-grow">
                        <span
                          className="font-fraunces italic block leading-snug"
                          style={{ fontSize: 17, color: sel ? '#E8A020' : '#F7F3EE' }}
                        >
                          {theme.label}
                        </span>
                        <span className="font-cabinet text-chalk/40 block" style={{ fontSize: 11, marginTop: 1 }}>
                          {theme.desc}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Generate button */}
            <motion.button
              type="button"
              onClick={startGeneration}
              disabled={!selectedState || isGenerating}
              id="create-generate-btn"
              className="w-full flex items-center justify-center gap-2 font-cabinet font-semibold transition-all relative overflow-hidden"
              whileHover={!selectedState || isGenerating ? {} : { scale: 1.02 }}
              whileTap={!selectedState || isGenerating ? {} : { scale: 0.98 }}
              style={{
                height: 54,
                borderRadius: 8,
                fontSize: 15,
                background: selectedState && !isGenerating
                  ? 'linear-gradient(135deg, #E8A020 0%, #D48810 100%)'
                  : 'rgba(255, 255, 255, 0.03)',
                color: selectedState && !isGenerating ? '#12091E' : 'rgba(247, 243, 238, 0.25)',
                border: selectedState && !isGenerating ? 'none' : '1px solid rgba(255, 220, 160, 0.08)',
                cursor: !selectedState || isGenerating ? 'not-allowed' : 'pointer',
                boxShadow: selectedState && !isGenerating ? '0 6px 20px rgba(232, 160, 32, 0.22)' : 'none',
              }}
            >
              {isGenerating
                ? <><RefreshCw size={16} className="animate-spin" /> Generating...</>
                : <><Sparkles size={16} /> Create challenge</>
              }
            </motion.button>
          </div>

          {/* ── Right cinema panel ── */}
          <div
            className="lg:col-span-7 flex flex-col overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.015)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 220, 160, 0.08)',
              borderRadius: 16,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
              minHeight: 520,
            }}
          >
            <AnimatePresence mode="wait">

              {/* IDLE */}
              {phase === 'idle' && (
                <motion.div key="idle" className="flex-grow flex flex-col items-center justify-center text-center gap-5 p-10"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                >
                  <div style={{ width: 72, height: 72, border: '1px solid rgba(232,160,32,0.2)', borderRadius: '50%', background: 'rgba(232,160,32,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={30} className="text-turmeric" style={{ opacity: 0.7 }} />
                  </div>
                  <div>
                    <h3 className="font-fraunces font-bold text-chalk mb-2" style={{ fontSize: 20 }}>
                      Awaiting your selection
                    </h3>
                    <p className="font-cabinet text-chalk/40 leading-relaxed" style={{ fontSize: 14, maxWidth: 280 }}>
                      Choose a state and theme on the left, then hit Create.
                    </p>
                  </div>
                  <span className="font-mono text-chalk/20 uppercase tracking-widest" style={{ fontSize: 10 }}>
                    Gemini 2.0 Flash · Imagen 3 · Validation Engine
                  </span>
                </motion.div>
              )}

              {/* PROMPTING */}
              {phase === 'prompting' && (
                <motion.div key="prompting" className="flex-grow flex flex-col gap-5 p-7"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <span className="hero-label">Phase 1 · Prompt Architecture</span>
                  <div
                    className="font-mono leading-relaxed relative"
                    style={{
                      padding: 18, fontSize: 12, color: 'rgba(247,243,238,0.7)',
                      background: 'rgba(18,9,30,0.8)', border: '1px solid rgba(255,220,160,0.06)',
                      borderRadius: 8, minHeight: 160, whiteSpace: 'pre-line', wordBreak: 'break-word',
                    }}
                  >
                    {typeText}
                    <span style={{ display: 'inline-block', width: 8, height: 14, background: '#E8A020', verticalAlign: 'middle', marginLeft: 3, animation: 'blink 1s step-end infinite' }} />
                  </div>
                  <div className="flex items-center gap-2 font-cabinet text-chalk/40" style={{ fontSize: 13 }}>
                    <RefreshCw size={12} className="animate-spin text-turmeric" />
                    Gemini 2.0 building prompt without forbidden terms...
                  </div>
                </motion.div>
              )}

              {/* VALIDATING */}
              {phase === 'validating' && (
                <motion.div key="validating" className="flex-grow flex flex-col justify-center items-center gap-6 p-8"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <span className="hero-label text-turmeric/85">Phase 2 · Forbidden Terms Check</span>
                  <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        border: '3px solid rgba(232,160,32,0.1)',
                        borderTopColor: '#E8A020',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                    <span className="font-mono text-xs text-turmeric font-bold">
                      {Math.min(100, Math.round((termIndex / FORBIDDEN_TERMS.length) * 100))}%
                    </span>
                  </div>

                  <div className="text-center">
                    <h3 className="font-fraunces font-bold text-chalk" style={{ fontSize: 18 }}>
                      Running Validation Engine
                    </h3>
                    <p className="font-cabinet text-chalk/40 text-xs mt-1">Scanning prompt tokens against identity markers</p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-xs h-1.5 bg-ink rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-turmeric"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round((termIndex / FORBIDDEN_TERMS.length) * 100))}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  <div className="w-full" style={{ maxWidth: 300 }}>
                    {FORBIDDEN_TERMS.map((term, i) => (
                      <motion.div
                        key={term}
                        className="flex items-center justify-between font-mono"
                        style={{
                          padding: '9px 14px', marginBottom: 4, fontSize: 11,
                          background: 'rgba(18,9,30,0.6)',
                          border: '1px solid rgba(255,220,160,0.07)',
                          borderRadius: 4,
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                      >
                        <span style={{ color: 'rgba(247,243,238,0.45)' }}>{term}</span>
                        {i < termIndex
                          ? <Check size={12} style={{ color: '#10B981' }} />
                          : <span style={{ color: '#E8A020', animation: 'blink 1s infinite' }}>···</span>
                        }
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PAINTING */}
              {phase === 'painting' && (
                <motion.div key="painting" className="flex-grow flex flex-col gap-6 p-7 justify-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="hero-label text-turmeric/85">Phase 3 · Canvas Creation</span>
                    <ValidationBadge size="sm" />
                  </div>

                  {/* Shimmer polaroid */}
                  <div className="polaroid mx-auto" style={{ width: 210 }}>
                    <div
                      style={{
                        aspectRatio: '1/1', background: '#12091E',
                        overflow: 'hidden', position: 'relative',
                        borderRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(90deg, transparent 0%, rgba(232,160,32,0.07) 50%, transparent 100%)',
                          animation: 'shimmer 2s ease-in-out infinite',
                        }}
                      />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                        <Camera size={40} className="text-chalk/10 animate-pulse" />
                        <span className="font-mono text-xs text-turmeric font-bold">{paintProgress}% Painted</span>
                      </div>
                    </div>
                    <div style={{ height: 28 }} />
                  </div>

                  <div className="text-center space-y-3">
                    <div>
                      <p className="font-fraunces font-semibold text-chalk" style={{ fontSize: 16 }}>
                        Imagen 3 is painting...
                      </p>
                      <p className="font-cabinet text-chalk/40 mt-1 text-xs">
                        Rendering cultural essence without any identity markers.
                      </p>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full max-w-xs mx-auto h-1.5 bg-ink rounded-full overflow-hidden">
                      <div
                        className="h-full bg-turmeric transition-all duration-150"
                        style={{ width: `${paintProgress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SUCCESS */}
              {phase === 'success' && result && (
                <motion.div key="success" className="flex-grow flex flex-col justify-between gap-5 p-7"
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-forest" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                        ✓ Challenge Activated
                      </span>
                      <ValidationBadge size="sm" />
                    </div>

                    <div className="polaroid mx-auto" style={{ width: 200, transform: 'rotate(-0.5deg)' }}>
                      <MysteryImage
                        src={result.artworkURL}
                        alt="Cultural enigma — state identity hidden"
                        theme={selectedTheme}
                        fallbackIcon="camera"
                        className="w-full h-full"
                      />
                      <div className="text-center" style={{ paddingTop: 10, paddingBottom: 4 }}>
                        <span className="font-fraunces italic text-ink/50" style={{ fontSize: 11 }}>
                          Which state is this?
                        </span>
                      </div>
                    </div>

                    {/* Clues preview */}
                    <div
                      style={{
                        padding: 16, background: 'rgba(18,9,30,0.65)',
                        border: '1px solid rgba(255,220,160,0.07)', borderRadius: 8,
                      }}
                    >
                      <span className="hero-label block mb-3" style={{ borderBottom: '1px solid rgba(255,220,160,0.07)', paddingBottom: 8 }}>
                        Clues preview
                      </span>
                      <ul className="space-y-2">
                        {result.clues.map((c, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="font-mono text-turmeric/55 flex-shrink-0" style={{ fontSize: 10, marginTop: 3 }}>
                              {i + 1}.
                            </span>
                            <span className="font-cabinet text-chalk/55 leading-snug" style={{ fontSize: 12 }}>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Share row */}
                  <div className="space-y-3 pt-3" style={{ borderTop: '1px solid rgba(255,220,160,0.07)' }}>
                    {/* Share text preview */}
                    <div
                      className="flex items-center gap-2"
                      style={{
                        background: 'rgba(18,9,30,0.55)', border: '1px solid rgba(255,220,160,0.08)',
                        borderRadius: 4, padding: '10px 12px',
                      }}
                    >
                      <span className="font-cabinet text-chalk/55 italic flex-grow truncate" style={{ fontSize: 12 }}>
                        {result.shareText}
                      </span>
                      <button onClick={copyText} style={{ flexShrink: 0, color: copiedText ? '#1A6B4A' : '#E8A020', padding: 4 }}>
                        {copiedText ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={copyLink}
                        className="flex-grow flex items-center justify-center gap-2 font-cabinet font-semibold transition-colors"
                        style={{
                          height: 42, borderRadius: 4, fontSize: 13,
                          color: '#E8A020', background: 'rgba(232,160,32,0.06)',
                          border: '1px solid rgba(232,160,32,0.25)',
                        }}
                      >
                        {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                        Copy link
                      </button>
                      <a
                        href={result.shareCardURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                        style={{ width: 42, height: 42, borderRadius: 4, border: '1px solid rgba(255,220,160,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(247,243,238,0.6)' }}
                        title="Download share card"
                      >
                        <Download size={13} />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(result.shareText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                        style={{ width: 42, height: 42, borderRadius: 4, border: '1px solid rgba(255,220,160,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(247,243,238,0.6)' }}
                        title="Share on Twitter/X"
                      >
                        <Share2 size={13} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ERROR */}
              {phase === 'error' && (
                <motion.div key="error" className="flex-grow flex flex-col items-center justify-center gap-5 text-center p-10"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div style={{ width: 56, height: 56, border: '1px solid rgba(193,57,43,0.25)', borderRadius: '50%', background: 'rgba(193,57,43,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C1392B' }}>
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-fraunces font-bold text-chalk mb-2" style={{ fontSize: 18 }}>
                      Generation interrupted
                    </h3>
                    <p className="font-cabinet text-chalk/45 leading-relaxed" style={{ fontSize: 13, maxWidth: 290 }}>
                      {errorMsg}
                    </p>
                  </div>
                  <button
                    onClick={() => setPhase('idle')}
                    className="font-cabinet font-semibold text-chalk/65 hover:text-chalk transition-colors"
                    style={{ height: 40, paddingInline: 24, border: '1px solid rgba(255,220,160,0.12)', borderRadius: 4, fontSize: 13 }}
                  >
                    Try again
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CSS keyframes inline */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
      `}</style>
    </div>
  );
}
