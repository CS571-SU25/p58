import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Calendar from './components/Calendar'
import Stats from './components/Stats'
// import LogBet from './components/LogBet'
import PendingBets from './components/PendingBets'
import Settings, { applySavedPreferences } from './components/Settings'
import Home from './components/Home' // ✅ new import
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import LogBetModal from './components/LogBetModal';

function App() {
  const [showLogModal, setShowLogModal] = useState(false);
  const [pendingBets, setPendingBets] = useState(() => {
    const stored = localStorage.getItem('pendingBets');
    return stored ? JSON.parse(stored) : [];
  });
  const [settledBets, setSettledBets] = useState(() => {
    const stored = localStorage.getItem('settledBets');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    applySavedPreferences();
  }, []);

  useEffect(() => {
    localStorage.setItem('pendingBets', JSON.stringify(pendingBets));
  }, [pendingBets]);

  useEffect(() => {
    localStorage.setItem('settledBets', JSON.stringify(settledBets));
  }, [settledBets]);

  return (
    <HashRouter>
      <>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                pendingBets={pendingBets}
                setPendingBets={setPendingBets}
                setShowLogModal={setShowLogModal}
              />
            }
          />
          <Route path="/calendar" element={<Calendar settledBets={settledBets} />} />
          <Route path="/stats" element={<Stats />} />
          {/* <Route path="/logbet" element={<LogBet />} /> */}
          <Route path="/pendingbets" element={<PendingBets pendingBets={pendingBets} setPendingBets={setPendingBets} setSettledBets={setSettledBets} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <div className="bottom-navigation">
          <Link to="/" className="nav-button" style={{ color: 'var(--background-color)' }}>Home</Link>
          <Link to="/calendar" className="nav-button" style={{ color: 'var(--background-color)' }}>Calendar</Link>
          <button className="nav-button" style={{ color: 'var(--background-color)' }} onClick={() => setShowLogModal(true)}>
            +
          </button>
          <Link to="/stats" className="nav-button" style={{ color: 'var(--background-color)' }}>Stats</Link>
          <Link to="/settings" className="nav-button" style={{ color: 'var(--background-color)' }}>Settings</Link>
        </div>
        {showLogModal && (
          <LogBetModal onClose={() => setShowLogModal(false)} setPendingBets={setPendingBets} />
        )}
      </>
    </HashRouter>
  );
}

export default App