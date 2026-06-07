import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus, Compass, Trophy, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/explore',     label: 'Explore',      icon: Compass },
  { href: '/leaderboard', label: 'Leaderboard',   icon: Trophy  },
  { href: '/profile',     label: 'Profile',       icon: User    },
];

export default function NavBar() {
  const location = useLocation();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(26,10,46,0.96)'
          : 'linear-gradient(180deg, rgba(26,10,46,0.9) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,220,160,0.1)' : 'none',
      }}
    >
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between"
        style={{ height: 64 }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3.5 group flex-shrink-0"
          aria-label="Heritage AI home"
        >
          <Logo size={46} />
          <div className="leading-none">
            <span className="font-fraunces text-chalk font-semibold block" style={{ fontSize: 24, lineHeight: 1.15 }}>
              Heritage AI
            </span>
            <span
              className="font-mono text-turmeric block"
              style={{ fontSize: 11.5, letterSpacing: '0.22em', opacity: 0.85, lineHeight: 1.3, marginTop: 2 }}
            >
              28 STATES · NO NAMES
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className="flex items-center gap-2 font-cabinet font-medium transition-all"
                style={{
                  padding: '8px 14px',
                  borderRadius: 4,
                  fontSize: 14,
                  color: active ? '#E8A020' : 'rgba(247,243,238,0.65)',
                  background: active ? 'rgba(232,160,32,0.1)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = '#F7F3EE';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(247,243,238,0.65)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}

          <Link
            to="/create"
            id="nav-create-btn"
            className="flex items-center gap-2 font-cabinet font-semibold ml-3"
            style={{
              padding: '9px 18px',
              borderRadius: 4,
              fontSize: 14,
              background: '#E8A020',
              color: '#12091E',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#d49018')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#E8A020')}
          >
            <Plus size={14} />
            Create
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-chalk/80 hover:text-chalk transition-colors"
          style={{ padding: 8 }}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'rgba(18,9,30,0.98)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255,220,160,0.1)',
            }}
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className="flex items-center gap-3 font-cabinet font-medium transition-colors"
                  style={{
                    padding: '12px 14px',
                    borderRadius: 4,
                    fontSize: 15,
                    color: location.pathname === href ? '#E8A020' : 'rgba(247,243,238,0.7)',
                    background: location.pathname === href ? 'rgba(232,160,32,0.08)' : 'transparent',
                  }}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              <Link
                to="/create"
                className="mt-2 flex items-center justify-center gap-2 font-cabinet font-semibold"
                style={{
                  padding: '13px 18px',
                  borderRadius: 4,
                  fontSize: 15,
                  background: '#E8A020',
                  color: '#12091E',
                }}
              >
                <Plus size={15} />
                Create Challenge
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
