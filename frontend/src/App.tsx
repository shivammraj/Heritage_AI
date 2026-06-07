import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import NavBar from './components/NavBar';
import Landing from './pages/Landing';
import Create from './pages/Create';
import Guess from './pages/Guess';
import Explore from './pages/Explore';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Page wrapper with Framer entrance/exit
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/explore" element={<PageWrapper><Explore /></PageWrapper>} />
        <Route path="/leaderboard" element={<PageWrapper><Leaderboard /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/create" element={<PageWrapper><Create /></PageWrapper>} />
        <Route path="/guess/:id" element={<PageWrapper><Guess /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { authToken, setAuthToken, setUser, setAuthLoading } = useAppStore();

  useEffect(() => {
    if (!authToken) {
      setAuthLoading(true);
      const mockToken = 'mock_guest_explorer';
      setAuthToken(mockToken);
      setUser({
        uid: 'mock_guest_explorer',
        name: 'Guest Explorer',
        photoURL: '',
        challengesCreated: 0,
        totalGuesses: 0,
        correctGuesses: 0,
        score: 0,
        accuracy: 0,
        statesCreated: [],
        statesGuessedCorrectly: [],
        badges: ['Explorer Apprentice'],
      });
      setAuthLoading(false);
    }
  }, [authToken, setAuthToken, setUser, setAuthLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="relative min-h-screen bg-raisin text-chalk selection:bg-turmeric selection:text-ink">
          {/* Skip link */}
          <a href="#main-content" className="skip-link">Skip to content</a>

          {/* Global grain texture overlay */}
          <div
            className="fixed inset-0 pointer-events-none z-[99]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
              opacity: 0.35,
            }}
          />

          <NavBar />

          <main id="main-content">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
