import { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider } from './hooks/useGameState';
import BottomNav from './components/BottomNav';
import Onboarding, { isOnboardingDone } from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import Protocol from './pages/Protocol';
import Morning from './pages/Morning';
import Daytime from './pages/Daytime';
import Evening from './pages/Evening';
import Journal from './pages/Journal';
import JournalEntry from './pages/JournalEntry';
import Settings from './pages/Settings';

function AnimatedRoutes() {
  const location = useLocation();

  // Don't show bottom nav during protocol card flows
  const hideNav = location.pathname.includes('/protocol/morning') ||
                  location.pathname.includes('/protocol/evening');

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/protocol" element={<Protocol />} />
            <Route path="/protocol/morning" element={<Morning />} />
            <Route path="/protocol/daytime" element={<Daytime />} />
            <Route path="/protocol/evening" element={<Evening />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:id" element={<JournalEntry />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {!hideNav && <BottomNav />}
    </>
  );
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(!isOnboardingDone());

  return (
    <HashRouter>
      <GameProvider>
        {showOnboarding ? (
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        ) : (
          <AnimatedRoutes />
        )}
      </GameProvider>
    </HashRouter>
  );
}
