import React, { useCallback, useEffect, useState } from 'react';
import { fetchRecentPolls } from './api.js';
import CreatePoll from './components/CreatePoll.jsx';
import PollView from './components/PollView.jsx';
import RecentPolls from './components/RecentPolls.jsx';

function parsePollIdFromPath(pathname) {
  const match = pathname.match(/^\/poll\/([A-Za-z0-9_-]+)\/?$/);
  return match ? match[1] : null;
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Ignore storage access errors
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [pollId, setPollId] = useState(() => parsePollIdFromPath(window.location.pathname));
  const [justCreatedId, setJustCreatedId] = useState(null);
  const [recentPolls, setRecentPolls] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      try {
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Ignore storage access errors
      }
      return next;
    });
  };

  const loadRecent = useCallback(() => {
    fetchRecentPolls()
      .then(setRecentPolls)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setPollId(parsePollIdFromPath(window.location.pathname));
      setJustCreatedId(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!pollId) {
      loadRecent();
    }
  }, [pollId, loadRecent]);

  const navigateHome = () => {
    window.history.pushState({}, '', '/');
    setPollId(null);
    setJustCreatedId(null);
  };

  const navigateToPoll = (id, created = false) => {
    window.history.pushState({}, '', `/poll/${id}`);
    setPollId(id);
    setJustCreatedId(created ? id : null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button type="button" className="brand" onClick={navigateHome}>
            <span className="brand-icon" aria-hidden="true">
              📊
            </span>
            <span>Poll Walker</span>
          </button>

          <div className="topbar-actions">
            {pollId && (
              <button type="button" className="btn btn-secondary" onClick={navigateHome}>
                + New Poll
              </button>
            )}
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="main-container">
        {pollId ? (
          <PollView
            pollId={pollId}
            justCreated={justCreatedId === pollId}
            onCreateNew={navigateHome}
          />
        ) : (
          <>
            <div className="hero">
              <h1>Create a poll in seconds</h1>
              <p>Share a link with anyone and watch votes roll in live.</p>
            </div>
            <CreatePoll onCreated={(poll) => navigateToPoll(poll.id, true)} />
            <RecentPolls polls={recentPolls} onSelectPoll={(id) => navigateToPoll(id, false)} />
          </>
        )}
      </main>

      <footer className="footer">Poll Walker — Fast, shareable live polls saved with SQLite.</footer>
    </div>
  );
}
